const express = require('express');
const { auth } = require('../middleware/auth');
const { getMandiPrices, COMMODITIES, STATES } = require('../services/mandiService');

const router = express.Router();

router.get('/commodities', auth, (req, res) => {
  res.json({ commodities: COMMODITIES, states: STATES });
});

router.get('/prices', auth, (req, res) => {
  const { commodity, state } = req.query;
  if (!commodity) return res.status(400).json({ message: 'Commodity parameter required' });
  const data = getMandiPrices(commodity, state || 'MH');
  if (!data) return res.status(404).json({ message: 'Commodity not found' });
  res.json(data);
});

module.exports = router;
