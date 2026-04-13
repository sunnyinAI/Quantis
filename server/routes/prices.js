const express = require('express');
const { auth } = require('../middleware/auth');
const { comparePrices } = require('../services/priceService');

const router = express.Router();

router.get('/compare', auth, (req, res) => {
  const { q, qty, unit } = req.query;
  if (!q) return res.status(400).json({ message: 'Query parameter q required' });
  const result = comparePrices(q, parseFloat(qty) || 1, unit || 'kg');
  res.json(result);
});

module.exports = router;
