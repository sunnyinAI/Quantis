const express = require('express');
const { pool } = require('../db/pool');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/items', auth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM pantry_items WHERE user_id = $1 ORDER BY expiry_date ASC NULLS LAST, name',
    [req.user.id]
  );
  res.json(rows);
});

router.get('/expiring', auth, async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const { rows } = await pool.query(
    `SELECT * FROM pantry_items
     WHERE user_id = $1 AND expiry_date IS NOT NULL
     AND expiry_date <= CURRENT_DATE + INTERVAL '${days} days'
     ORDER BY expiry_date ASC`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/items', auth, async (req, res) => {
  const { name, quantity, unit, category, storage_zone, expiry_date, purchase_date, purchase_price } = req.body;
  if (!name) return res.status(400).json({ message: 'Item name required' });
  const { rows } = await pool.query(
    `INSERT INTO pantry_items
     (user_id, name, quantity, unit, category, storage_zone, expiry_date, purchase_date, purchase_price)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.user.id, name, quantity || 1, unit || 'piece', category || 'household',
     storage_zone || 'shelf', expiry_date || null, purchase_date || null, purchase_price || null]
  );
  res.status(201).json(rows[0]);
});

router.put('/items/:id', auth, async (req, res) => {
  const { name, quantity, unit, category, storage_zone, expiry_date, purchase_date, purchase_price } = req.body;
  const { rows } = await pool.query(
    `UPDATE pantry_items SET
     name = COALESCE($1, name), quantity = COALESCE($2, quantity),
     unit = COALESCE($3, unit), category = COALESCE($4, category),
     storage_zone = COALESCE($5, storage_zone),
     expiry_date = $6, purchase_date = $7,
     purchase_price = COALESCE($8, purchase_price)
     WHERE id = $9 AND user_id = $10 RETURNING *`,
    [name, quantity, unit, category, storage_zone,
     expiry_date || null, purchase_date || null, purchase_price, req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Item not found' });
  res.json(rows[0]);
});

router.delete('/items/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM pantry_items WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ message: 'Item deleted' });
});

module.exports = router;
