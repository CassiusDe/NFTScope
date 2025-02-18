const express = require('express');
const axios = require('axios');
const RarityCalculator = require('../utils/rarity');
const { generateMockCollection } = require('../utils/mockData');
const router = express.Router();

// Get collection info
router.get('/:contract', async (req, res) => {
  try {
    const { contract } = req.params;

    // Mock data for now
    const mockData = {
      contract_address: contract,
      name: 'Sample Collection',
      description: 'A sample NFT collection',
      total_supply: 10000,
      floor_price: 0.05,
      volume_24h: 12.5
    };

    res.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection data'
    });
  }
});

// Get collection stats
router.get('/:contract/stats', async (req, res) => {
  try {
    const { contract } = req.params;

    const mockStats = {
      floor_price: 0.05,
      ceil_price: 15.0,
      volume_24h: 12.5,
      volume_7d: 85.3,
      owners: 3450,
      listings: 234
    };

    res.json({
      success: true,
      data: mockStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection stats'
    });
  }
});

// Get collection rarity analysis
router.get('/:contract/rarity', async (req, res) => {
  try {
    const { contract } = req.params;
    const { limit = 20 } = req.query;

    // Generate mock collection data
    const mockNFTs = generateMockCollection(1000);

    // Calculate rarity
    const calculator = new RarityCalculator();
    const nftsWithRarity = calculator.processCollection(mockNFTs);

    // Return top items by rarity
    const topRare = nftsWithRarity.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        total_items: nftsWithRarity.length,
        top_rare: topRare,
        trait_stats: calculator.getTraitStats()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate rarity'
    });
  }
});

module.exports = router;