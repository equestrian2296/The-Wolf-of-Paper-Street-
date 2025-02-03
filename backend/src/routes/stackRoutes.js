const express = require('express');
const router = express.Router();
const { STOCKS } = require('../utils/constants');
const { fetchHistoricalData } = require('../services/backtestService');
const { backtestStockStrategy } = require('../services/backtestService');

router.get('/stocks', (req, res) => {
  res.json({ stocks: STOCKS });
});

router.post('/fetch-stock-data', async (req, res) => {
  const { symbol, startDate, endDate } = req.body;
  try {
    if (!symbol || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    const data = await fetchHistoricalData(symbol, startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backtest', async (req, res) => {
  try {
    const { symbol, startDate, endDate, stopLoss, takeProfit, entryPeriod, exitPeriod } = req.body;
    const data = await fetchHistoricalData(symbol, startDate, endDate);
    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'No data found for the given dates' });
    }
    const result = backtestStockStrategy(data, stopLoss, takeProfit, entryPeriod, exitPeriod);
    return res.json(result);
  } catch (error) {
    console.error('Error during backtesting:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
