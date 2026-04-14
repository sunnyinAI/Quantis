const express = require('express');
const { pool } = require('../db/pool');
const { auth } = require('../middleware/auth');
const { chatStream } = require('../services/claudeService');

const router = express.Router();

router.post('/chat', auth, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message required' });

  const [historyResult, pantryResult, finResult] = await Promise.all([
    pool.query(
      'SELECT role, content FROM chat_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [req.user.id]
    ),
    pool.query(
      'SELECT name, quantity, unit, expiry_date FROM pantry_items WHERE user_id = $1 LIMIT 20',
      [req.user.id]
    ),
    pool.query(
      `SELECT SUM(amount)::numeric as spent FROM transactions
       WHERE user_id = $1 AND type='expense' AND TO_CHAR(date, 'YYYY-MM') = $2`,
      [req.user.id, new Date().toISOString().slice(0, 7)]
    ),
  ]);

  const history = historyResult.rows.reverse();
  const pantryItems = pantryResult.rows;
  const spentThisMonth = parseFloat(finResult.rows[0]?.spent || 0);

  const rawContext = [
    `User: ${req.user.name}, Family size: ${req.user.family_size}, Dietary: ${req.user.dietary_pref}`,
    `Monthly budget: ₹${req.user.monthly_budget}, Spent this month: ₹${spentThisMonth}`,
    pantryItems.length > 0
      ? `Pantry: ${pantryItems.map(i => `${i.name}(${i.quantity}${i.unit})`).join(', ')}`
      : 'Pantry: empty',
  ].join('\n');

  const context = { rawContext, pantryItems, spentThisMonth, monthlyBudget: req.user.monthly_budget, user: req.user };

  await pool.query(
    'INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)',
    [req.user.id, 'user', message]
  );

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const messages = [...history, { role: 'user', content: message }];

  try {
    const fullResponse = await chatStream(messages, context, res);
    if (fullResponse) {
      await pool.query(
        'INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)',
        [req.user.id, 'assistant', fullResponse]
      );
    }
  } catch (err) {
    console.error('Chat error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Failed to get response' })}\n\n`);
    res.write('data: [DONE]\n\n');
  }

  res.end();
});

router.get('/history', auth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM chat_history WHERE user_id = $1 ORDER BY created_at ASC LIMIT 100',
    [req.user.id]
  );
  res.json(rows);
});

router.delete('/history', auth, async (req, res) => {
  await pool.query('DELETE FROM chat_history WHERE user_id = $1', [req.user.id]);
  res.json({ message: 'History cleared' });
});

module.exports = router;
