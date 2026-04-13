const express = require('express');
const { getDb } = require('../db/database');
const { auth } = require('../middleware/auth');
const { generateMealPlan } = require('../services/claudeService');

const router = express.Router();

router.get('/plans', auth, (req, res) => {
  const { week } = req.query;
  const db = getDb();
  let plan;
  if (week) {
    plan = db.prepare('SELECT * FROM meal_plans WHERE user_id = ? AND week_start = ?').get(req.user.id, week);
  } else {
    plan = db.prepare('SELECT * FROM meal_plans WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.user.id);
  }
  if (!plan) return res.json(null);
  res.json({ ...plan, plan_json: JSON.parse(plan.plan_json) });
});

router.post('/generate', auth, async (req, res) => {
  try {
    const db = getDb();
    const pantryItems = db.prepare('SELECT * FROM pantry_items WHERE user_id = ?').all(req.user.id);

    const weekStart = req.body.week_start || getMonday();
    const preferences = {
      dietary: req.user.dietary_pref || 'vegetarian',
      family_size: req.user.family_size || 2,
      budget: req.user.monthly_budget ? req.user.monthly_budget / 4 : 3000
    };

    const planData = await generateMealPlan(pantryItems, preferences, weekStart);

    // Upsert meal plan
    const existing = db.prepare('SELECT id FROM meal_plans WHERE user_id = ? AND week_start = ?').get(req.user.id, weekStart);
    if (existing) {
      db.prepare('UPDATE meal_plans SET plan_json = ?, created_at = datetime("now") WHERE id = ?')
        .run(JSON.stringify(planData), existing.id);
    } else {
      db.prepare('INSERT INTO meal_plans (user_id, week_start, plan_json) VALUES (?, ?, ?)')
        .run(req.user.id, weekStart, JSON.stringify(planData));
    }

    res.json({ week_start: weekStart, plan_json: planData });
  } catch (err) {
    console.error('Meal plan error:', err);
    res.status(500).json({ message: err.message || 'Failed to generate meal plan' });
  }
});

const getMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};

module.exports = router;
