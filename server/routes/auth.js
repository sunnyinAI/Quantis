const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// In-memory OTP store: phone -> { otp, expiresAt }
const otpStore = new Map();

router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ message: 'Valid 10-digit Indian mobile number required' });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  const response = { message: 'OTP sent successfully' };
  if (process.env.DEV_OTP_VISIBLE === 'true') {
    response.otp = otp;
  }
  res.json(response);
});

router.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone and OTP required' });
  }

  const stored = otpStore.get(phone);
  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  otpStore.delete(phone);
  const db = getDb();

  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user) {
    const result = db.prepare('INSERT INTO users (phone) VALUES (?)').run(phone);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);

    // Create default grocery list
    db.prepare('INSERT INTO grocery_lists (user_id, name) VALUES (?, ?)').run(user.id, 'Weekly Essentials');
  }

  const token = uuidv4();
  const expiryDays = parseInt(process.env.SESSION_EXPIRY_DAYS || '30');
  db.prepare(
    `INSERT INTO sessions (token, user_id, expires_at)
     VALUES (?, ?, datetime('now', '+${expiryDays} days'))`
  ).run(token, user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      language: user.language,
      dark_mode: user.dark_mode,
      dietary_pref: user.dietary_pref,
      family_size: user.family_size,
      monthly_budget: user.monthly_budget
    }
  });
});

router.post('/logout', auth, (req, res) => {
  const token = req.headers.authorization.slice(7);
  getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token);
  res.json({ message: 'Logged out' });
});

router.delete('/account', auth, (req, res) => {
  const db = getDb();
  const deleteAccount = db.transaction((userId) => {
    db.prepare('UPDATE grocery_items SET added_by = NULL WHERE added_by = ?').run(userId);
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  });

  deleteAccount(req.user.id);
  res.json({ message: 'Account and associated data deleted' });
});

router.put('/profile', auth, (req, res) => {
  const { name, language, dark_mode, dietary_pref, family_size, monthly_budget } = req.body;
  const db = getDb();
  db.prepare(
    `UPDATE users SET name=COALESCE(?,name), language=COALESCE(?,language),
     dark_mode=COALESCE(?,dark_mode), dietary_pref=COALESCE(?,dietary_pref),
     family_size=COALESCE(?,family_size), monthly_budget=COALESCE(?,monthly_budget)
     WHERE id=?`
  ).run(name, language, dark_mode, dietary_pref, family_size, monthly_budget, req.user.id);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

module.exports = router;
