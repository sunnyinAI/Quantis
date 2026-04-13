const express = require('express');
const { getDb } = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Transactions
router.get('/transactions', auth, (req, res) => {
  const { month } = req.query; // format: YYYY-MM
  const db = getDb();
  let query = 'SELECT * FROM transactions WHERE user_id = ?';
  const params = [req.user.id];
  if (month) {
    query += ` AND strftime('%Y-%m', date) = ?`;
    params.push(month);
  }
  query += ' ORDER BY date DESC, created_at DESC';
  const transactions = db.prepare(query).all(...params);
  res.json(transactions);
});

router.post('/transactions', auth, (req, res) => {
  const { amount, type, category, description, date, payment_method } = req.body;
  if (!amount || !date) return res.status(400).json({ message: 'Amount and date required' });
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO transactions (user_id, amount, type, category, description, date, payment_method)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, amount, type || 'expense', category || 'grocery',
    description || null, date, payment_method || 'upi');
  const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(tx);
});

router.delete('/transactions/:id', auth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Transaction deleted' });
});

// Bills
router.get('/bills', auth, (req, res) => {
  const db = getDb();
  const bills = db.prepare(
    'SELECT * FROM bills WHERE user_id = ? ORDER BY due_date ASC'
  ).all(req.user.id);
  res.json(bills);
});

router.post('/bills', auth, (req, res) => {
  const { name, amount, due_date, is_recurring, recurrence, category } = req.body;
  if (!name || !amount || !due_date) return res.status(400).json({ message: 'Name, amount, due_date required' });
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO bills (user_id, name, amount, due_date, is_recurring, recurrence, category)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, name, amount, due_date, is_recurring ? 1 : 1,
    recurrence || 'monthly', category || 'utility');
  const bill = db.prepare('SELECT * FROM bills WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(bill);
});

router.patch('/bills/:id/pay', auth, (req, res) => {
  const db = getDb();
  const bill = db.prepare('SELECT * FROM bills WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!bill) return res.status(404).json({ message: 'Bill not found' });
  db.prepare('UPDATE bills SET is_paid = 1 WHERE id = ?').run(req.params.id);
  res.json({ ...bill, is_paid: 1 });
});

router.delete('/bills/:id', auth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM bills WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Bill deleted' });
});

// Subscriptions
router.get('/subscriptions', auth, (req, res) => {
  const db = getDb();
  const subs = db.prepare(
    'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY renewal_date ASC'
  ).all(req.user.id);
  res.json(subs);
});

router.post('/subscriptions', auth, (req, res) => {
  const { name, amount, billing_cycle, renewal_date, category } = req.body;
  if (!name || !amount) return res.status(400).json({ message: 'Name and amount required' });
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO subscriptions (user_id, name, amount, billing_cycle, renewal_date, category)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, name, amount, billing_cycle || 'monthly', renewal_date || null, category || 'streaming');
  const sub = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(sub);
});

router.patch('/subscriptions/:id/toggle', auth, (req, res) => {
  const db = getDb();
  const sub = db.prepare('SELECT * FROM subscriptions WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!sub) return res.status(404).json({ message: 'Subscription not found' });
  db.prepare('UPDATE subscriptions SET is_active = ? WHERE id = ?').run(sub.is_active ? 0 : 1, req.params.id);
  res.json({ ...sub, is_active: sub.is_active ? 0 : 1 });
});

router.delete('/subscriptions/:id', auth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM subscriptions WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Subscription deleted' });
});

// Summary
router.get('/summary', auth, (req, res) => {
  const { month } = req.query;
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  const db = getDb();

  const expenses = db.prepare(
    `SELECT category, SUM(amount) as total FROM transactions
     WHERE user_id = ? AND type='expense' AND strftime('%Y-%m', date) = ?
     GROUP BY category`
  ).all(req.user.id, currentMonth);

  const income = db.prepare(
    `SELECT SUM(amount) as total FROM transactions
     WHERE user_id = ? AND type='income' AND strftime('%Y-%m', date) = ?`
  ).get(req.user.id, currentMonth);

  const totalExpense = expenses.reduce((s, r) => s + r.total, 0);
  const upcomingBills = db.prepare(
    `SELECT * FROM bills WHERE user_id = ? AND is_paid = 0
     AND due_date >= date('now') AND due_date <= date('now', '+30 days')
     ORDER BY due_date ASC LIMIT 5`
  ).all(req.user.id);

  const activeSubs = db.prepare(
    `SELECT SUM(amount) as monthly_total FROM subscriptions WHERE user_id = ? AND is_active = 1`
  ).get(req.user.id);

  res.json({
    month: currentMonth,
    budget: req.user.monthly_budget,
    total_expense: totalExpense,
    total_income: income?.total || 0,
    budget_used_pct: Math.round((totalExpense / req.user.monthly_budget) * 100),
    by_category: expenses,
    upcoming_bills: upcomingBills,
    subscriptions_monthly: activeSubs?.monthly_total || 0
  });
});

module.exports = router;
