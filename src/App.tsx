import React, { useState } from 'react';
import { ChatBot } from './components/ChatBot';
import { TrendingCrypto } from './components/TrendingCrypto';
import { MarketInsights } from './components/MarketInsights';
import { QuickStats } from './components/QuickStats';
import { ChatHistory } from './components/ChatHistory';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Shield, TrendingUp, Leaf, Sparkles, LogIn } from 'lucide-react';
import { useChatHistory } from './hooks/useChatHistory';

const AppContent: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { setCurrentSession } = useChatHistory();

  const handleNewChat = () => {
    setCurrentSession(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="lg:w-1/3 xl:w-1/4 space-y-6 overflow-y-auto">
          {/* Authentication Section */}
          {!isAuthenticated ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Join CryptoBuddy</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Sign in to save your chat history and get personalized crypto insights
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          ) : (
            <UserProfile />
          )}

          {/* Chat History */}
          <ChatHistory onNewChat={handleNewChat} />

          {/* Main Info Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CryptoBuddy</h1>
                <p className="text-sm text-gray-300">AI Crypto Intelligence</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Real-Time Analysis
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Live Market Data</p>
                    <p className="text-xs text-gray-400">Real-time prices, trends & analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Sustainability Insights</p>
                    <p className="text-xs text-gray-400">Energy efficiency & eco-impact scoring</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold text-sm mb-2 text-yellow-400">⚠️ Investment Disclaimer</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Cryptocurrency investments carry high risk and volatility. This AI provides educational analysis only. 
                Always conduct thorough research and never invest more than you can afford to lose.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Trending Cryptocurrencies */}
          <TrendingCrypto />

          {/* Market Insights */}
          <MarketInsights />
        </div>

        {/* Chat Interface */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="bg-white rounded-2xl shadow-2xl h-full max-h-[85vh] lg:max-h-full overflow-hidden border border-gray-200">
            <ChatBot />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;