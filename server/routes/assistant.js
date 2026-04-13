const express = require('express');
const { getDb } = require('../db/database');
const { auth } = require('../middleware/auth');
const { chatStream } = require('../services/claudeService');

const router = express.Router();

router.post('/chat', auth, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message required' });

  const db = getDb();

  // Get chat history (last 10 messages)
  const history = db.prepare(
    'SELECT role, content FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 10'
  ).all(req.user.id).reverse();

  // Build context from pantry and finance
  const pantryItems = db.prepare(
    'SELECT name, quantity, unit, expiry_date FROM pantry_items WHERE user_id = ? LIMIT 20'
  ).all(req.user.id);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const finSummary = db.prepare(
    `SELECT SUM(amount) as spent FROM transactions WHERE user_id = ? AND type='expense' AND strftime('%Y-%m', date) = ?`
  ).get(req.user.id, currentMonth);

  const rawContext = [
    `User: ${req.user.name}, Family size: ${req.user.family_size}, Dietary: ${req.user.dietary_pref}`,
    `Monthly budget: ₹${req.user.monthly_budget}, Spent this month: ₹${finSummary?.spent || 0}`,
    pantryItems.length > 0
      ? `Pantry items: ${pantryItems.map(i => `${i.name}(${i.quantity}${i.unit})`).join(', ')}`
      : 'Pantry: empty'
  ].join('\n');

  const context = {
    rawContext,
    pantryItems,
    spentThisMonth: finSummary?.spent || 0,
    monthlyBudget: req.user.monthly_budget,
    user: req.user,
  };

  // Save user message
  db.prepare('INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)')
    .run(req.user.id, 'user', message);

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const messages = [...history, { role: 'user', content: message }];

  try {
    const fullResponse = await chatStream(messages, context, res);

    // Save assistant response
    if (fullResponse) {
      db.prepare('INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)')
        .run(req.user.id, 'assistant', fullResponse);
    }
  } catch (err) {
    console.error('Chat error:', err);
    res.write(`data: ${JSON.stringify({ error: 'Failed to get response' })}\n\n`);
    res.write('data: [DONE]\n\n');
  }

  res.end();
});

router.get('/history', auth, (req, res) => {
  const db = getDb();
  const history = db.prepare(
    'SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at ASC LIMIT 100'
  ).all(req.user.id);
  res.json(history);
});

router.delete('/history', auth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM chat_history WHERE user_id = ?').run(req.user.id);
  res.json({ message: 'History cleared' });
});

module.exports = router;
