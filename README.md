# NFTScope

A comprehensive NFT collection analysis and tracking tool.

## Overview

NFTScope provides REST API endpoints for analyzing NFT collections, calculating rarity scores, and tracking price trends. Perfect for developers building NFT analytics applications.

## Features

- ✅ Collection data analysis
- ✅ Advanced rarity calculation with trait frequency
- ✅ Price trend tracking and analytics
- ✅ SQLite database integration
- ✅ Mock data generation for testing

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

### Start the Server

```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Collection Information

#### Get Collection Details
```
GET /collections/:contract
```

Returns basic collection information including name, description, total supply, and floor price.

#### Get Collection Statistics
```
GET /collections/:contract/stats
```

Returns detailed statistics including floor price, volume, owners count, and active listings.

#### Get Rarity Analysis
```
GET /collections/:contract/rarity?limit=20
```

Returns rarity rankings for the collection with trait frequency analysis.

### Price Tracking

#### Get Price History
```
GET /prices/:contract/history?days=30
```

Returns historical price data for the specified time period.

#### Get Price Analytics
```
GET /prices/:contract/analytics?days=30
```

Returns comprehensive price analysis including trends, support/resistance levels, and volatility metrics.

## Development

- Built with Node.js and Express
- SQLite database for data persistence
- Modular architecture with separate utilities for rarity and price analysis

## Database Schema

- **collections**: Store NFT collection metadata
- **nfts**: Individual NFT data with rarity scores
- **price_history**: Historical price and transaction data