const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Lists
router.get('/lists', auth, (req, res) => {
  const db = getDb();
  const lists = db.prepare(
    `SELECT gl.*, COUNT(gi.id) as item_count,
            SUM(CASE WHEN gi.is_checked=1 THEN 1 ELSE 0 END) as checked_count
     FROM grocery_lists gl
     LEFT JOIN grocery_items gi ON gi.list_id = gl.id
     WHERE gl.user_id = ?
     GROUP BY gl.id ORDER BY gl.created_at DESC`
  ).all(req.user.id);
  res.json(lists);
});

router.post('/lists', auth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'List name required' });
  const db = getDb();
  const result = db.prepare('INSERT INTO grocery_lists (user_id, name) VALUES (?, ?)').run(req.user.id, name);
  const list = db.prepare('SELECT * FROM grocery_lists WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(list);
});

router.put('/lists/:id', auth, (req, res) => {
  const { name } = req.body;
  const db = getDb();
  const list = db.prepare('SELECT * FROM grocery_lists WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!list) return res.status(404).json({ message: 'List not found' });
  db.prepare('UPDATE grocery_lists SET name = ? WHERE id = ?').run(name, req.params.id);
  res.json({ ...list, name });
});

router.delete('/lists/:id', auth, (req, res) => {
  const db = getDb();
  const list = db.prepare('SELECT * FROM grocery_lists WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!list) return res.status(404).json({ message: 'List not found' });
  db.prepare('DELETE FROM grocery_lists WHERE id = ?').run(req.params.id);
  res.json({ message: 'List deleted' });
});

// Items
router.get('/lists/:id/items', auth, (req, res) => {
  const db = getDb();
  const list = db.prepare(
    `SELECT gl.* FROM grocery_lists gl
     LEFT JOIN list_collaborators lc ON lc.list_id = gl.id AND lc.user_id = ?
     WHERE gl.id = ? AND (gl.user_id = ? OR lc.user_id IS NOT NULL)`
  ).get(req.user.id, req.params.id, req.user.id);
  if (!list) return res.status(404).json({ message: 'List not found' });

  const items = db.prepare(
    'SELECT * FROM grocery_items WHERE list_id = ? ORDER BY category, name'
  ).all(req.params.id);
  res.json(items);
});

router.post('/lists/:id/items', auth, (req, res) => {
  const { name, name_hi, quantity, unit, category, is_recurring, notes } = req.body;
  if (!name) return res.status(400).json({ message: 'Item name required' });
  const db = getDb();
  const result = db.prepare(
    `INSERT INTO grocery_items (list_id, name, name_hi, quantity, unit, category, is_recurring, notes, added_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(req.params.id, name, name_hi || null, quantity || 1, unit || 'piece',
    category || 'household', is_recurring ? 1 : 0, notes || null, req.user.id);
  const item = db.prepare('SELECT * FROM grocery_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(item);
});

router.put('/items/:id', auth, (req, res) => {
  const { name, name_hi, quantity, unit, category, is_recurring, notes } = req.body;
  const db = getDb();
  db.prepare(
    `UPDATE grocery_items SET
     name=COALESCE(?,name), name_hi=COALESCE(?,name_hi), quantity=COALESCE(?,quantity),
     unit=COALESCE(?,unit), category=COALESCE(?,category),
     is_recurring=COALESCE(?,is_recurring), notes=COALESCE(?,notes)
     WHERE id=?`
  ).run(name, name_hi, quantity, unit, category, is_recurring !== undefined ? (is_recurring ? 1 : 0) : undefined, notes, req.params.id);
  const item = db.prepare('SELECT * FROM grocery_items WHERE id = ?').get(req.params.id);
  res.json(item);
});

router.patch('/items/:id/toggle', auth, (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM grocery_items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  db.prepare('UPDATE grocery_items SET is_checked = ? WHERE id = ?').run(item.is_checked ? 0 : 1, req.params.id);
  res.json({ ...item, is_checked: item.is_checked ? 0 : 1 });
});

router.delete('/items/:id', auth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM grocery_items WHERE id = ?').run(req.params.id);
  res.json({ message: 'Item deleted' });
});

// Reset checked items
router.post('/lists/:id/reset', auth, (req, res) => {
  const db = getDb();
  db.prepare('UPDATE grocery_items SET is_checked = 0 WHERE list_id = ?').run(req.params.id);
  res.json({ message: 'List reset' });
});

module.exports = router;
