import React from 'react';
import { BarChart3, PieChart, Activity, AlertTriangle } from 'lucide-react';

export const MarketInsights: React.FC = () => {
  const insights = [
    {
      icon: BarChart3,
      title: "Market Cap",
      value: "$1.7T",
      change: "+2.1%",
      positive: true,
      description: "Total crypto market"
    },
    {
      icon: Activity,
      title: "24h Volume",
      value: "$89.2B",
      change: "-5.3%",
      positive: false,
      description: "Trading activity"
    },
    {
      icon: PieChart,
      title: "BTC Dominance",
      value: "49.8%",
      change: "+0.4%",
      positive: true,
      description: "Bitcoin market share"
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-emerald-400" />
        Market Insights
      </h2>
      
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

      <div className="mt-4 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-yellow-200 font-medium">Market Alert</p>
            <p className="text-xs text-yellow-300/80 mt-1">
              High volatility detected. Consider dollar-cost averaging for safer investments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};