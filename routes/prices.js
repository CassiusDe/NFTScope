const express = require('express');
const PriceTracker = require('../utils/priceTracker');
const router = express.Router();

const tracker = new PriceTracker();

// Get price history for a collection
router.get('/:contract/history', async (req, res) => {
  try {
    const { contract } = req.params;
    const { days = 30 } = req.query;

    // Generate mock price history
    const priceHistory = tracker.generateMockPriceHistory(parseInt(days));

    res.json({
      success: true,
      data: {
        contract_address: contract,
        period_days: parseInt(days),
        history: priceHistory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price history'
    });
  }
});

// Get price analytics for a collection
router.get('/:contract/analytics', async (req, res) => {
  try {
    const { contract } = req.params;
    const { days = 30 } = req.query;

    // Generate mock data for analysis
    const priceHistory = tracker.generateMockPriceHistory(parseInt(days));
    const stats = tracker.calculatePriceStats(priceHistory);
    const trends = tracker.analyzeTrends(priceHistory);

    res.json({
      success: true,
      data: {
        contract_address: contract,
        period_days: parseInt(days),
        statistics: stats,
        trends: trends,
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate price analytics'
    });
  }
});

module.exports = router;