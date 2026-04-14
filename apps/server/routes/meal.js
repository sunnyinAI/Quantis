const express = require('express');
const { pool } = require('../db/pool');
const { auth } = require('../middleware/auth');
const { generateMealPlan } = require('../services/claudeService');

const router = express.Router();

const getMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};

router.get('/plans', auth, async (req, res) => {
  const { week } = req.query;
  let result;
  if (week) {
    result = await pool.query(
      'SELECT * FROM meal_plans WHERE user_id = $1 AND week_start = $2',
      [req.user.id, week]
    );
  } else {
    result = await pool.query(
      'SELECT * FROM meal_plans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );
  }
  if (!result.rows[0]) return res.json(null);
  const plan = result.rows[0];
  res.json({ ...plan, plan_json: typeof plan.plan_json === 'string' ? JSON.parse(plan.plan_json) : plan.plan_json });
});

router.post('/generate', auth, async (req, res) => {
  try {
    const { rows: pantryItems } = await pool.query(
      'SELECT * FROM pantry_items WHERE user_id = $1', [req.user.id]
    );

    const weekStart = req.body.week_start || getMonday();
    const preferences = {
      dietary: req.user.dietary_pref || 'vegetarian',
      family_size: req.user.family_size || 2,
      budget: req.user.monthly_budget ? req.user.monthly_budget / 4 : 3000,
    };

    const planData = await generateMealPlan(pantryItems, preferences, weekStart);

    const { rows: [existing] } = await pool.query(
      'SELECT id FROM meal_plans WHERE user_id = $1 AND week_start = $2',
      [req.user.id, weekStart]
    );

    if (existing) {
      await pool.query(
        'UPDATE meal_plans SET plan_json = $1, created_at = NOW() WHERE id = $2',
        [JSON.stringify(planData), existing.id]
      );
    } else {
      await pool.query(
        'INSERT INTO meal_plans (user_id, week_start, plan_json) VALUES ($1, $2, $3)',
        [req.user.id, weekStart, JSON.stringify(planData)]
      );
    }

    res.json({ week_start: weekStart, plan_json: planData });
  } catch (err) {
    console.error('Meal plan error:', err);
    res.status(500).json({ message: err.message || 'Failed to generate meal plan' });
  }
});

module.exports = router;
