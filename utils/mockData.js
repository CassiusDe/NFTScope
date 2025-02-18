// Generate mock NFT collection data for testing
function generateMockCollection(size = 100) {
  const traits = {
    background: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
    eyes: ['Normal', 'Laser', 'Sleepy', 'Wink'],
    mouth: ['Smile', 'Frown', 'Surprised', 'Neutral'],
    accessories: ['Hat', 'Glasses', 'Earrings', 'None']
  };

  const nfts = [];

  for (let i = 1; i <= size; i++) {
    const nftTraits = [];

    // Add traits with different rarity distributions
    Object.entries(traits).forEach(([traitType, values]) => {
      let selectedValue;

      // Make some traits rarer than others
      if (traitType === 'eyes' && Math.random() < 0.1) {
        selectedValue = 'Laser'; // Very rare
      } else if (traitType === 'accessories' && Math.random() < 0.3) {
        selectedValue = 'None';
      } else {
        selectedValue = values[Math.floor(Math.random() * values.length)];
      }

      nftTraits.push({
        trait_type: traitType,
        value: selectedValue
      });
    });

    nfts.push({
      token_id: i,
      name: `Mock NFT #${i}`,
      traits: nftTraits
    });
  }

  return nfts;
}

module.exports = {
  generateMockCollection
};