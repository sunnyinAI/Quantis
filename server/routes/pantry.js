const express = require('express');
const { getDb } = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/items', auth, (req, res) => {
  const db = getDb();
  const items = db.prepare(
    'SELECT * FROM pantry_items WHERE user_id = ? ORDER BY expiry_date ASC NULLS LAST, name'
  ).all(req.user.id);
  res.json(items);
});

router.get('/expiring', auth, (req, res) => {
  const days = req.query.days || 7;
  const db = getDb();
  const items = db.prepare(
    `SELECT * FROM pantry_items
     WHERE user_id = ? AND expiry_date IS NOT NULL
     AND expiry_date <= date('now', '+${parseInt(days)} days')
     ORDER BY expiry_date ASC`
  ).all(req.user.id);
  res.json(items);
});

router.post('/items', auth, (req, res) => {
  const { name, quantity, unit, category, storage_zone, expiry_date, purchase_date, purchase_price } = req.body;
  if (!name) return res.status(400).json({ message: 'Item name required' });
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO pantry_items (user_id, name, quantity, unit, category, storage_zone, expiry_date, purchase_date, purchase_price)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, name, quantity || 1, unit || 'piece', category || 'household',
    storage_zone || 'shelf', expiry_date || null, purchase_date || null, purchase_price || null);
  const item = db.prepare('SELECT * FROM pantry_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(item);
});

router.put('/items/:id', auth, (req, res) => {
  const { name, quantity, unit, category, storage_zone, expiry_date, purchase_date, purchase_price } = req.body;
  const db = getDb();
  const item = db.prepare('SELECT * FROM pantry_items WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  db.prepare(
    `UPDATE pantry_items SET
     name=COALESCE(?,name), quantity=COALESCE(?,quantity), unit=COALESCE(?,unit),
     category=COALESCE(?,category), storage_zone=COALESCE(?,storage_zone),
     expiry_date=?, purchase_date=?, purchase_price=COALESCE(?,purchase_price)
     WHERE id=?`
  ).run(name, quantity, unit, category, storage_zone, expiry_date, purchase_date, purchase_price, req.params.id);
  const updated = db.prepare('SELECT * FROM pantry_items WHERE id = ?').get(req.params.id);
  res.json(updated);
});

router.delete('/items/:id', auth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM pantry_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
