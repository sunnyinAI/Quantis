const { pool } = require('./pool');
const fs = require('fs');
const path = require('path');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const runMigrations = async (retries = 10, delayMs = 3000) => {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001_initial.sql'), 'utf8');
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query(sql);
      console.log('✅ DB migrations applied');
      return;
    } catch (err) {
      console.error(`Migration attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) {
        console.log(`Retrying in ${delayMs / 1000}s...`);
        await sleep(delayMs);
      } else {
        throw err;
      }
    }
  }
};

module.exports = { runMigrations };
