const express = require('express');
const { pool } = require('../db/pool');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/transactions', auth, async (req, res) => {
  const { month } = req.query;
  let query = 'SELECT * FROM transactions WHERE user_id = $1';
  const params = [req.user.id];
  if (month) {
    query += ` AND TO_CHAR(date, 'YYYY-MM') = $2`;
    params.push(month);
  }
  query += ' ORDER BY date DESC, created_at DESC';
  const { rows } = await pool.query(query, params);
  res.json(rows);
});

router.post('/transactions', auth, async (req, res) => {
  const { amount, type, category, description, date, payment_method } = req.body;
  if (!amount || !date) return res.status(400).json({ message: 'Amount and date required' });
  const { rows } = await pool.query(
    `INSERT INTO transactions (user_id, amount, type, category, description, date, payment_method)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.user.id, amount, type || 'expense', category || 'grocery',
     description || null, date, payment_method || 'upi']
  );
  res.status(201).json(rows[0]);
});

router.delete('/transactions/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ message: 'Transaction deleted' });
});

router.get('/bills', auth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM bills WHERE user_id = $1 ORDER BY due_date ASC', [req.user.id]);
  res.json(rows);
});

router.post('/bills', auth, async (req, res) => {
  const { name, amount, due_date, is_recurring, recurrence, category } = req.body;
  if (!name || !amount || !due_date) return res.status(400).json({ message: 'Name, amount, due_date required' });
  const { rows } = await pool.query(
    `INSERT INTO bills (user_id, name, amount, due_date, is_recurring, recurrence, category)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.user.id, name, amount, due_date, 1, recurrence || 'monthly', category || 'utility']
  );
  res.status(201).json(rows[0]);
});

router.patch('/bills/:id/pay', auth, async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE bills SET is_paid = 1 WHERE id = $1 AND user_id = $2 RETURNING *',
    [req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Bill not found' });
  res.json(rows[0]);
});

router.delete('/bills/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM bills WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ message: 'Bill deleted' });
});

router.get('/subscriptions', auth, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY renewal_date ASC NULLS LAST', [req.user.id]);
  res.json(rows);
});

router.post('/subscriptions', auth, async (req, res) => {
  const { name, amount, billing_cycle, renewal_date, category } = req.body;
  if (!name || !amount) return res.status(400).json({ message: 'Name and amount required' });
  const { rows } = await pool.query(
    `INSERT INTO subscriptions (user_id, name, amount, billing_cycle, renewal_date, category)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [req.user.id, name, amount, billing_cycle || 'monthly', renewal_date || null, category || 'streaming']
  );
  res.status(201).json(rows[0]);
});

router.patch('/subscriptions/:id/toggle', auth, async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE subscriptions SET is_active = CASE WHEN is_active=1 THEN 0 ELSE 1 END
     WHERE id = $1 AND user_id = $2 RETURNING *`,
    [req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Subscription not found' });
  res.json(rows[0]);
});

router.delete('/subscriptions/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM subscriptions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ message: 'Subscription deleted' });
});

router.get('/summary', auth, async (req, res) => {
  const { month } = req.query;
  const currentMonth = month || new Date().toISOString().slice(0, 7);

  const [expenses, income, upcoming, activeSubs] = await Promise.all([
    pool.query(
      `SELECT category, SUM(amount)::numeric as total FROM transactions
       WHERE user_id = $1 AND type='expense' AND TO_CHAR(date, 'YYYY-MM') = $2
       GROUP BY category`,
      [req.user.id, currentMonth]
    ),
    pool.query(
      `SELECT SUM(amount)::numeric as total FROM transactions
       WHERE user_id = $1 AND type='income' AND TO_CHAR(date, 'YYYY-MM') = $2`,
      [req.user.id, currentMonth]
    ),
    pool.query(
      `SELECT * FROM bills WHERE user_id = $1 AND is_paid = 0
       AND due_date >= CURRENT_DATE AND due_date <= CURRENT_DATE + INTERVAL '30 days'
       ORDER BY due_date ASC LIMIT 5`,
      [req.user.id]
    ),
    pool.query(
      `SELECT SUM(amount)::numeric as monthly_total FROM subscriptions
       WHERE user_id = $1 AND is_active = 1`,
      [req.user.id]
    ),
  ]);

  const totalExpense = expenses.rows.reduce((s, r) => s + parseFloat(r.total || 0), 0);
  const budget = parseFloat(req.user.monthly_budget) || 10000;

  res.json({
    month: currentMonth,
    budget,
    total_expense: totalExpense,
    total_income: parseFloat(income.rows[0]?.total || 0),
    budget_used_pct: Math.round((totalExpense / budget) * 100),
    by_category: expenses.rows,
    upcoming_bills: upcoming.rows,
    subscriptions_monthly: parseFloat(activeSubs.rows[0]?.monthly_total || 0),
  });
});

module.exports = router;
