const express = require('express');
const collectionsRouter = require('./routes/collections');
const database = require('./database/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'NFTScope API',
    version: '0.1.0',
    status: 'running',
    endpoints: [
      '/collections/:contract',
      '/collections/:contract/stats',
      '/collections/:contract/rarity'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/collections', collectionsRouter);

// Initialize database and start server
database.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`NFTScope server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });