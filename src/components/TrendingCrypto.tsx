import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CryptoTrend {
  name: string;
  symbol: string;
  price: string;
  change: number;
  marketCap: string;
}

const trendingData: CryptoTrend[] = [
  { name: 'Bitcoin', symbol: 'BTC', price: '$43,250', change: 2.4, marketCap: '$847B' },
  { name: 'Ethereum', symbol: 'ETH', price: '$2,580', change: -1.2, marketCap: '$310B' },
  { name: 'Cardano', symbol: 'ADA', price: '$0.48', change: 5.7, marketCap: '$17B' },
  { name: 'Solana', symbol: 'SOL', price: '$98.50', change: 3.1, marketCap: '$42B' },
  { name: 'Polkadot', symbol: 'DOT', price: '$7.25', change: -0.8, marketCap: '$9B' },
  { name: 'Chainlink', symbol: 'LINK', price: '$14.80', change: 1.9, marketCap: '$8B' }
];

export const TrendingCrypto: React.FC = () => {
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
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-emerald-400" />
        Trending Cryptocurrencies
      </h2>
      
      <div className="space-y-3">
        {trendingData.map((crypto, index) => (
          <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-sm">{crypto.name}</div>
                <div className="text-xs text-gray-400">{crypto.symbol}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-sm">{crypto.price}</div>
              <div className={`flex items-center gap-1 text-xs ${getTrendColor(crypto.change)}`}>
                {getTrendIcon(crypto.change)}
                {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 text-center">
          💡 Data updates every 5 minutes • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};