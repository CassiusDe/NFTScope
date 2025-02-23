const axios = require('axios');

class PriceTracker {
  constructor() {
    this.etherscanApiKey = process.env.ETHERSCAN_API_KEY;
    this.alchemyApiKey = process.env.ALCHEMY_API_KEY;
  }

  // Generate mock price history
  generateMockPriceHistory(days = 30) {
    const prices = [];
    const endDate = new Date();
    let currentPrice = 0.05 + Math.random() * 0.95; // Start between 0.05-1 ETH

    for (let i = days; i >= 0; i--) {
      const date = new Date(endDate.getTime() - (i * 24 * 60 * 60 * 1000));

      // Add some realistic price movement
      const change = (Math.random() - 0.5) * 0.1; // ±5% max change
      currentPrice = Math.max(0.01, currentPrice + (currentPrice * change));

      prices.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(currentPrice.toFixed(4)),
        volume: Math.floor(Math.random() * 50) + 5 // Random volume
      });
    }

    return prices;
  }

  // Calculate price statistics
  calculatePriceStats(priceHistory) {
    if (!priceHistory || priceHistory.length === 0) {
      return null;
    }

    const prices = priceHistory.map(p => p.price);
    const volumes = priceHistory.map(p => p.volume);

    const currentPrice = prices[prices.length - 1];
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const totalVolume = volumes.reduce((a, b) => a + b, 0);

    // Calculate price change
    const previousPrice = prices.length > 1 ? prices[prices.length - 2] : currentPrice;
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

    return {
      current_price: parseFloat(currentPrice.toFixed(4)),
      min_price: parseFloat(minPrice.toFixed(4)),
      max_price: parseFloat(maxPrice.toFixed(4)),
      avg_price: parseFloat(avgPrice.toFixed(4)),
      price_change: parseFloat(priceChange.toFixed(4)),
      price_change_percent: parseFloat(priceChangePercent.toFixed(2)),
      total_volume: totalVolume,
      data_points: prices.length
    };
  }

  // Get price trends (support/resistance levels)
  analyzeTrends(priceHistory) {
    if (!priceHistory || priceHistory.length < 10) {
      return null;
    }

    const prices = priceHistory.map(p => p.price);

    // Simple trend analysis
    const recentPrices = prices.slice(-7); // Last 7 data points
    const olderPrices = prices.slice(0, 7); // First 7 data points

    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;

    let trend = 'sideways';
    if (recentAvg > olderAvg * 1.05) {
      trend = 'upward';
    } else if (recentAvg < olderAvg * 0.95) {
      trend = 'downward';
    }

    // Find support and resistance levels
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const support = sortedPrices[Math.floor(sortedPrices.length * 0.25)]; // 25th percentile
    const resistance = sortedPrices[Math.floor(sortedPrices.length * 0.75)]; // 75th percentile

    return {
      trend,
      support_level: parseFloat(support.toFixed(4)),
      resistance_level: parseFloat(resistance.toFixed(4)),
      volatility: this.calculateVolatility(prices)
    };
  }

  // Calculate volatility (standard deviation)
  calculateVolatility(prices) {
    if (prices.length < 2) return 0;

    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const squaredDiffs = prices.map(price => Math.pow(price - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;

    return parseFloat(Math.sqrt(avgSquaredDiff).toFixed(4));
  }
}

module.exports = PriceTracker;