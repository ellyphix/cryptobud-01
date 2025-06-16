import { CryptoDatabase } from './types';

export const CRYPTO_DB: CryptoDatabase = {
  "Bitcoin": {
    price_trend: "rising",
    market_cap: "high",
    energy_use: "high",
    sustainability_score: 3
  },
  "Ethereum": {
    price_trend: "stable",
    market_cap: "high",
    energy_use: "medium",
    sustainability_score: 6
  },
  "Cardano": {
    price_trend: "rising",
    market_cap: "medium",
    energy_use: "low",
    sustainability_score: 8
  },
  "Solana": {
    price_trend: "rising",
    market_cap: "medium",
    energy_use: "low",
    sustainability_score: 7
  },
  "Polkadot": {
    price_trend: "stable",
    market_cap: "medium",
    energy_use: "low",
    sustainability_score: 7
  },
  "Chainlink": {
    price_trend: "rising",
    market_cap: "medium",
    energy_use: "medium",
    sustainability_score: 6
  }
};

export const BOT_PERSONALITY = {
  name: "CryptoBuddy",
  greeting: "Hey there! 👋 I'm CryptoBuddy, your AI-powered financial sidekick! I'm here to help you navigate the crypto world with smart insights on profitability and sustainability. What would you like to know?",
  disclaimer: "⚠️ Remember: Crypto investments are high-risk. Always do your own research and never invest more than you can afford to lose!"
};

export const QUERY_PATTERNS = {
  sustainability: ['sustainable', 'eco', 'green', 'environment', 'energy', 'eco-friendly'],
  profitability: ['profit', 'gain', 'invest', 'buy', 'trending', 'rising', 'growth'],
  comparison: ['compare', 'vs', 'versus', 'difference', 'better'],
  general: ['what', 'which', 'how', 'best', 'recommend', 'suggest']
};