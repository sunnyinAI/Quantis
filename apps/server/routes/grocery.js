const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../db/pool');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/lists', auth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT gl.*, COUNT(gi.id)::int as item_count,
            SUM(CASE WHEN gi.is_checked=1 THEN 1 ELSE 0 END)::int as checked_count
     FROM grocery_lists gl
     LEFT JOIN grocery_items gi ON gi.list_id = gl.id
     WHERE gl.user_id = $1
     GROUP BY gl.id ORDER BY gl.created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

router.post('/lists', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'List name required' });
  const { rows } = await pool.query(
    'INSERT INTO grocery_lists (user_id, name) VALUES ($1, $2) RETURNING *',
    [req.user.id, name]
  );
  res.status(201).json(rows[0]);
});

router.put('/lists/:id', auth, async (req, res) => {
  const { name } = req.body;
  const { rows } = await pool.query(
    'UPDATE grocery_lists SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [name, req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'List not found' });
  res.json(rows[0]);
});

router.delete('/lists/:id', auth, async (req, res) => {
  const { rowCount } = await pool.query(
    'DELETE FROM grocery_lists WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (!rowCount) return res.status(404).json({ message: 'List not found' });
  res.json({ message: 'List deleted' });
});

router.get('/lists/:id/items', auth, async (req, res) => {
  const { rows: [list] } = await pool.query(
    `SELECT gl.* FROM grocery_lists gl
     LEFT JOIN list_collaborators lc ON lc.list_id = gl.id AND lc.user_id = $1
     WHERE gl.id = $2 AND (gl.user_id = $1 OR lc.user_id IS NOT NULL)`,
    [req.user.id, req.params.id]
  );
  if (!list) return res.status(404).json({ message: 'List not found' });
  const { rows } = await pool.query(
    'SELECT * FROM grocery_items WHERE list_id = $1 ORDER BY category, name',
    [req.params.id]
  );
  res.json(rows);
});

router.post('/lists/:id/items', auth, async (req, res) => {
  const { name, name_hi, quantity, unit, category, is_recurring, notes } = req.body;
  if (!name) return res.status(400).json({ message: 'Item name required' });
  const { rows } = await pool.query(
    `INSERT INTO grocery_items
     (list_id, name, name_hi, quantity, unit, category, is_recurring, notes, added_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.params.id, name, name_hi || null, quantity || 1, unit || 'piece',
     category || 'household', is_recurring ? 1 : 0, notes || null, req.user.id]
  );
  res.status(201).json(rows[0]);
});

router.put('/items/:id', auth, async (req, res) => {
  const { name, name_hi, quantity, unit, category, is_recurring, notes } = req.body;
  const { rows } = await pool.query(
    `UPDATE grocery_items SET
     name = COALESCE($1, name), name_hi = COALESCE($2, name_hi),
     quantity = COALESCE($3, quantity), unit = COALESCE($4, unit),
     category = COALESCE($5, category),
     is_recurring = COALESCE($6, is_recurring), notes = COALESCE($7, notes)
     WHERE id = $8 RETURNING *`,
    [name, name_hi, quantity, unit, category,
     is_recurring !== undefined ? (is_recurring ? 1 : 0) : null, notes, req.params.id]
  );
  res.json(rows[0]);
});

router.patch('/items/:id/toggle', auth, async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE grocery_items SET is_checked = CASE WHEN is_checked=1 THEN 0 ELSE 1 END
     WHERE id = $1 RETURNING *`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Item not found' });
  res.json(rows[0]);
});

router.delete('/items/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM grocery_items WHERE id = $1', [req.params.id]);
  res.json({ message: 'Item deleted' });
});

router.post('/lists/:id/reset', auth, async (req, res) => {
  await pool.query('UPDATE grocery_items SET is_checked = 0 WHERE list_id = $1', [req.params.id]);
  res.json({ message: 'List reset' });
});

module.exports = router;
