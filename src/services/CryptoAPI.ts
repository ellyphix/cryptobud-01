export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  total_volume: number;
  circulating_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  last_updated: string;
}

export interface CoinGeckoMarketData {
  data: {
    active_cryptocurrencies: number;
    upcoming_icos: number;
    ongoing_icos: number;
    ended_icos: number;
    markets: number;
    total_market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    market_cap_percentage: { [key: string]: number };
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

class CryptoAPIService {
  private readonly COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private cache = new Map<string, { data: any; timestamp: number }>();

  private async fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`API fetch error for ${url}:`, error);
      // Return cached data if available, even if expired
      if (cached) return cached.data;
      throw error;
    }
  }

  async getTopCryptocurrencies(limit: number = 10): Promise<CoinGeckoPrice[]> {
    const url = `${this.COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h,7d,30d`;
    return this.fetchWithCache<CoinGeckoPrice[]>(url, `top-cryptos-${limit}`);
  }

  async getCryptocurrencyData(coinId: string): Promise<any> {
    const url = `${this.COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true`;
    return this.fetchWithCache(url, `crypto-${coinId}`);
  }

  async getGlobalMarketData(): Promise<CoinGeckoMarketData> {
    const url = `${this.COINGECKO_BASE}/global`;
    return this.fetchWithCache<CoinGeckoMarketData>(url, 'global-market');
  }

  async searchCryptocurrency(query: string): Promise<any[]> {
    const url = `${this.COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`;
    const result = await this.fetchWithCache<any>(url, `search-${query}`);
    return result.coins || [];
  }

  // Mock news service - in production, you'd use a real news API
  async getCryptoNews(limit: number = 5): Promise<NewsArticle[]> {
    // Simulated news data - replace with real API
    return [
      {
        title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
        description: "Major corporations continue to add Bitcoin to their treasury reserves, driving unprecedented demand.",
        url: "#",
        source: "CryptoNews",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive'
      },
      {
        title: "Ethereum 2.0 Staking Rewards Attract Long-term Investors",
        description: "The transition to proof-of-stake has created new opportunities for passive income generation.",
        url: "#",
        source: "BlockchainDaily",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive'
      },
      {
        title: "Regulatory Clarity Boosts Altcoin Market Confidence",
        description: "Recent regulatory developments provide clearer guidelines for cryptocurrency operations.",
        url: "#",
        source: "CryptoRegulatory",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive'
      }
    ];
  }

  formatPrice(price: number): string {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else if (price < 100) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  }
}

export const cryptoAPI = new CryptoAPIService();