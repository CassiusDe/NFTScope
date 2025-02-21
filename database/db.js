const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, 'nftscope.db');

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Database connection failed:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initTables().then(resolve).catch(reject);
        }
      });
    });
  }

  initTables() {
    return new Promise((resolve, reject) => {
      const queries = [
        `CREATE TABLE IF NOT EXISTS collections (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          contract_address TEXT UNIQUE NOT NULL,
          name TEXT,
          description TEXT,
          total_supply INTEGER,
          floor_price REAL,
          volume_24h REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS nfts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          collection_id INTEGER,
          token_id INTEGER,
          name TEXT,
          rarity_score REAL,
          rarity_rank INTEGER,
          traits TEXT, -- JSON string
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(collection_id) REFERENCES collections(id)
        )`,

        `CREATE TABLE IF NOT EXISTS price_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nft_id INTEGER,
          price REAL,
          transaction_hash TEXT,
          block_number INTEGER,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(nft_id) REFERENCES nfts(id)
        )`
      ];

      let completed = 0;
      queries.forEach(query => {
        this.db.run(query, (err) => {
          if (err) {
            reject(err);
          } else {
            completed++;
            if (completed === queries.length) {
              console.log('Database tables initialized');
              resolve();
            }
          }
        });
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

module.exports = new Database();