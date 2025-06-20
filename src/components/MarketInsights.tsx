import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { cryptoAPI } from '../services/CryptoAPI';

export const MarketInsights: React.FC = () => {
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData();
    // Update every 10 minutes
    const interval = setInterval(fetchMarketData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const [globalData, topCryptos] = await Promise.all([
        cryptoAPI.getGlobalMarketData(),
        cryptoAPI.getTopCryptocurrencies(10)
      ]);
      
      const totalVolume = topCryptos.reduce((sum, crypto) => sum + crypto.total_volume, 0);
      
      setMarketData({
        totalMarketCap: globalData.data.total_market_cap.usd,
        marketCapChange: globalData.data.market_cap_change_percentage_24h_usd,
        btcDominance: globalData.data.market_cap_percentage.btc,
        totalVolume,
        activeCryptos: globalData.data.active_cryptocurrencies
      });
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      // Fallback data
      setMarketData({
        totalMarketCap: 1700000000000,
        marketCapChange: 2.1,
        btcDominance: 49.8,
        totalVolume: 89200000000,
        activeCryptos: 8500
      });
    } finally {
      setLoading(false);
    }
  };

  if (!marketData) return null;

  const insights = [
    {
      icon: BarChart3,
      title: "Market Cap",
      value: cryptoAPI.formatMarketCap(marketData.totalMarketCap),
      change: `${marketData.marketCapChange > 0 ? '+' : ''}${marketData.marketCapChange.toFixed(1)}%`,
      positive: marketData.marketCapChange > 0,
      description: "Total crypto market"
    },
    {
      icon: Activity,
      title: "24h Volume",
      value: cryptoAPI.formatMarketCap(marketData.totalVolume),
      change: "Live",
      positive: true,
      description: "Trading activity"
    },
    {
      icon: PieChart,
      title: "BTC Dominance",
      value: `${marketData.btcDominance.toFixed(1)}%`,
      change: marketData.btcDominance > 50 ? "High" : "Moderate",
      positive: marketData.btcDominance < 60,
      description: "Bitcoin market share"
    }
  ];

  const getMarketSentiment = () => {
    if (marketData.marketCapChange > 3) return { text: "Very Bullish", color: "text-green-400", icon: "🚀" };
    if (marketData.marketCapChange > 0) return { text: "Bullish", color: "text-green-400", icon: "📈" };
    if (marketData.marketCapChange > -3) return { text: "Neutral", color: "text-yellow-400", icon: "⚖️" };
    return { text: "Bearish", color: "text-red-400", icon: "📉" };
  };

  const sentiment = getMarketSentiment();

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          Market Insights
        </h2>
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className="w-8 h-8 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                <insight.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-sm">{insight.title}</div>
                <div className="text-xs text-gray-400">{insight.description}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-lg">{insight.value}</div>
              <div className={`text-xs ${insight.positive ? 'text-green-400' : 'text-red-400'}`}>
                {insight.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-4 p-3 rounded-xl border ${sentiment.color === 'text-green-400' ? 'bg-green-500/10 border-green-500/20' : sentiment.color === 'text-yellow-400' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
        <div className="flex items-start gap-2">
          <span className="text-lg">{sentiment.icon}</span>
          <div>
            <p className={`text-sm font-medium ${sentiment.color}`}>Market Sentiment: {sentiment.text}</p>
            <p className="text-xs text-gray-300 mt-1">
              {marketData.activeCryptos.toLocaleString()} active cryptocurrencies being tracked
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};