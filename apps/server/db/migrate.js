const { pool } = require('./pool');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_initial.sql'), 'utf8');
  try {
    await pool.query(sql);
    console.log('✅ DB migrations applied');
  } catch (err) {
    console.error('Migration error:', err.message);
    throw err;
  }
};

module.exports = { runMigrations };
