const { getDb } = require('../db/database');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = header.slice(7);
  const db = getDb();
  const session = db.prepare(
    `SELECT s.*, u.id as uid, u.name, u.phone, u.language, u.dark_mode,
            u.dietary_pref, u.family_size, u.monthly_budget
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires_at > datetime('now')`
  ).get(token);

  if (!session) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }

  req.user = {
    id: session.uid,
    name: session.name,
    phone: session.phone,
    language: session.language,
    dark_mode: session.dark_mode,
    dietary_pref: session.dietary_pref,
    family_size: session.family_size,
    monthly_budget: session.monthly_budget
  };
  next();
};

module.exports = { auth };
