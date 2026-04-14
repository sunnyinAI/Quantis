const { pool } = require('../db/pool');

const auth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = header.slice(7);
  try {
    const { rows } = await pool.query(
      `SELECT s.token, u.id as uid, u.name, u.phone, u.language, u.dark_mode,
              u.dietary_pref, u.family_size, u.monthly_budget
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (!rows[0]) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    const s = rows[0];
    req.user = {
      id: s.uid,
      name: s.name,
      phone: s.phone,
      language: s.language,
      dark_mode: s.dark_mode,
      dietary_pref: s.dietary_pref,
      family_size: s.family_size,
      monthly_budget: parseFloat(s.monthly_budget),
    };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { auth };
