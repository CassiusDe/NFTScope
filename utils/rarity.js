class RarityCalculator {
  constructor() {
    this.traitCounts = {};
    this.totalItems = 0;
  }

  // Calculate trait rarity scores
  calculateTraitRarity(traits) {
    const rarityScore = traits.reduce((score, trait) => {
      const traitKey = `${trait.trait_type}:${trait.value}`;
      const frequency = this.traitCounts[traitKey] || 0;
      const rarity = frequency > 0 ? 1 / (frequency / this.totalItems) : 1;
      return score + rarity;
    }, 0);

    return {
      rarity_score: parseFloat(rarityScore.toFixed(4)),
      rank: 0 // Will be calculated when sorting all items
    };
  }

  // Process collection to build trait frequency map
  processCollection(nfts) {
    this.totalItems = nfts.length;
    this.traitCounts = {};

    // Count trait frequencies
    nfts.forEach(nft => {
      if (nft.traits) {
        nft.traits.forEach(trait => {
          const traitKey = `${trait.trait_type}:${trait.value}`;
          this.traitCounts[traitKey] = (this.traitCounts[traitKey] || 0) + 1;
        });
      }
    });

    // Calculate rarity scores for all NFTs
    const nftsWithRarity = nfts.map(nft => ({
      ...nft,
      rarity: this.calculateTraitRarity(nft.traits || [])
    }));

    // Sort by rarity score and assign ranks
    nftsWithRarity.sort((a, b) => b.rarity.rarity_score - a.rarity.rarity_score);

    nftsWithRarity.forEach((nft, index) => {
      nft.rarity.rank = index + 1;
    });

    return nftsWithRarity;
  }

  // Get trait frequency stats
  getTraitStats() {
    const stats = {};

    Object.entries(this.traitCounts).forEach(([traitKey, count]) => {
      const [traitType, traitValue] = traitKey.split(':');

      if (!stats[traitType]) {
        stats[traitType] = {};
      }

      stats[traitType][traitValue] = {
        count,
        percentage: parseFloat(((count / this.totalItems) * 100).toFixed(2))
      };
    });

    return stats;
  }
}

module.exports = RarityCalculator;