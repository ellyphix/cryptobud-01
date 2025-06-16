import React from 'react';
import { Flame, Leaf, Shield, Zap } from 'lucide-react';

export const QuickStats: React.FC = () => {
  const stats = [
    {
      icon: Flame,
      label: "Hot Pick",
      value: "Cardano",
      subtitle: "+5.7% today",
      color: "from-red-400 to-orange-500"
    },
    {
      icon: Leaf,
      label: "Eco Leader",
      value: "Cardano",
      subtitle: "8/10 sustainability",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Shield,
      label: "Most Stable",
      value: "Ethereum",
      subtitle: "Low volatility",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Zap,
      label: "Fast Rising",
      value: "Solana",
      subtitle: "+3.1% growth",
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-white border border-white/20 shadow-lg hover:bg-white/15 transition-colors">
          <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
            <stat.icon className="w-4 h-4 text-white" />
          </div>
          <div className="text-xs text-gray-300 mb-1">{stat.label}</div>
          <div className="font-semibold text-sm">{stat.value}</div>
          <div className="text-xs text-gray-400">{stat.subtitle}</div>
        </div>
      ))}
    </div>
  );
};