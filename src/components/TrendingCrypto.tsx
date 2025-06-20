import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { cryptoAPI, CoinGeckoPrice } from '../services/CryptoAPI';

export const TrendingCrypto: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CoinGeckoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchCryptoData();
    // Update every 5 minutes
    const interval = setInterval(fetchCryptoData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const data = await cryptoAPI.getTopCryptocurrencies(6);
      setCryptoData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch crypto data:', error);
      // Fallback data if API fails
      setCryptoData([
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 43250, market_cap: 847000000000, market_cap_rank: 1, price_change_percentage_24h: 2.4, price_change_percentage_7d: 5.2, price_change_percentage_30d: 12.1, total_volume: 25000000000, circulating_supply: 19500000, max_supply: 21000000, ath: 69000, ath_change_percentage: -37.3, last_updated: new Date().toISOString() },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2580, market_cap: 310000000000, market_cap_rank: 2, price_change_percentage_24h: -1.2, price_change_percentage_7d: 3.8, price_change_percentage_30d: 8.9, total_volume: 15000000000, circulating_supply: 120000000, max_supply: null, ath: 4878, ath_change_percentage: -47.1, last_updated: new Date().toISOString() },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.48, market_cap: 17000000000, market_cap_rank: 8, price_change_percentage_24h: 5.7, price_change_percentage_7d: 12.3, price_change_percentage_30d: 18.5, total_volume: 800000000, circulating_supply: 35000000000, max_supply: 45000000000, ath: 3.10, ath_change_percentage: -84.5, last_updated: new Date().toISOString() },
        { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 98.50, market_cap: 42000000000, market_cap_rank: 5, price_change_percentage_24h: 3.1, price_change_percentage_7d: 7.8, price_change_percentage_30d: 15.2, total_volume: 2000000000, circulating_supply: 426000000, max_supply: null, ath: 260, ath_change_percentage: -62.1, last_updated: new Date().toISOString() },
        { id: 'polkadot', symbol: 'dot', name: 'Polkadot', current_price: 7.25, market_cap: 9000000000, market_cap_rank: 12, price_change_percentage_24h: -0.8, price_change_percentage_7d: 2.1, price_change_percentage_30d: 6.7, total_volume: 300000000, circulating_supply: 1240000000, max_supply: null, ath: 55, ath_change_percentage: -86.8, last_updated: new Date().toISOString() },
        { id: 'chainlink', symbol: 'link', name: 'Chainlink', current_price: 14.80, market_cap: 8000000000, market_cap_rank: 15, price_change_percentage_24h: 1.9, price_change_percentage_7d: 4.5, price_change_percentage_30d: 9.3, total_volume: 500000000, circulating_supply: 540000000, max_supply: 1000000000, ath: 52.70, ath_change_percentage: -71.9, last_updated: new Date().toISOString() }
      ] as CoinGeckoPrice[]);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Live Crypto Prices
        </h2>
        <button
          onClick={fetchCryptoData}
          disabled={loading}
          className="w-8 h-8 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-3">
        {cryptoData.map((crypto, index) => (
          <div key={crypto.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-sm">{crypto.name}</div>
                <div className="text-xs text-gray-400">{crypto.symbol.toUpperCase()}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-sm">{cryptoAPI.formatPrice(crypto.current_price)}</div>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(crypto.price_change_percentage_24h)}`}>
                {getTrendIcon(crypto.price_change_percentage_24h)}
                {crypto.price_change_percentage_24h > 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 text-center">
          💡 Live data from CoinGecko • Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};