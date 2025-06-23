import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, Leaf, Info, Loader, AlertTriangle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { aiService } from '../services/AIService';
import { ChatMessage as ChatMessageType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useChatHistory } from '../hooks/useChatHistory';
import { NLPService } from '../services/NLPService';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { currentSession, createNewSession, updateSession } = useChatHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages);
    } else {
      const greeting: ChatMessageType = {
        id: Date.now().toString(),
        text: `🚀 **Welcome to CryptoBud - Your Proprietary Crypto Intelligence Platform!**\n\nI'm your advanced AI assistant powered by real-time market data and sophisticated analysis. I can help you with:\n\n📊 **Live Market Analysis**\n• Real-time prices and trends\n• Market cap and volume data\n• Technical indicators\n\n💰 **Investment Intelligence**\n• Portfolio recommendations\n• Risk assessments\n• Profit/loss calculations\n\n🌱 **Sustainability Insights**\n• Energy consumption analysis\n• Eco-friendly crypto rankings\n• Environmental impact scores\n\n🤖 **General Assistant**\n• Answer any questions\n• Explain complex topics\n• Have natural conversations\n\n💡 **Try asking me:**\n• "What's Bitcoin's current price?"\n• "Compare Ethereum vs Cardano sustainability"\n• "Should I invest in Solana?"\n• "Explain DeFi in simple terms"\n• "What's 2+2?" (I can handle general questions too!)\n\n⚠️ **Important:** All investment information is educational only. Cryptocurrency is highly risky - always do your own research!\n\nWhat would you like to explore today? 🌟`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [currentSession]);

  const addMessage = (text: string, isBot: boolean) => {
    const message: ChatMessageType = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    if (user) {
      if (currentSession) {
        updateSession(currentSession.id, updatedMessages);
      } else if (!isBot) {
        const newSession = createNewSession(message);
        const greeting: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          text: `🚀 **Welcome back to CryptoBud!**\n\nI'm ready to help you with cryptocurrency analysis and any other questions you might have. What would you like to know?`,
          isBot: true,
          timestamp: new Date()
        };
        updateSession(newSession.id, [greeting, message]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setSuggestions([]);
    addMessage(userMessage, false);

    setIsTyping(true);

    try {
      const complexity = NLPService.getQueryComplexity(userMessage);
      const baseTime = complexity === 'simple' ? 1000 : complexity === 'medium' ? 2000 : 3000;
      const thinkingTime = baseTime + Math.random() * 1000;
      
      const aiResponse = await aiService.processQuery(userMessage);
      
      await new Promise(resolve => setTimeout(resolve, thinkingTime));
      
      setIsTyping(false);
      addMessage(aiResponse.message, true);
      
      const newSuggestions = NLPService.generateSuggestions(userMessage);
      setSuggestions(newSuggestions);
      
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      addMessage(
        "🔧 I'm experiencing some technical difficulties accessing real-time data. However, I can still help with general questions and provide crypto education! Please try asking me something else, or check back in a moment for live market data.",
        true
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const quickActions = [
    { icon: TrendingUp, text: "Bitcoin price", query: "What's the current price of Bitcoin with analysis?" },
    { icon: Leaf, text: "Sustainable cryptos", query: "Which cryptocurrencies are most sustainable and eco-friendly?" },
    { icon: Info, text: "Market overview", query: "Give me a comprehensive crypto market analysis" },
    { icon: AlertTriangle, text: "Investment risks", query: "What are the main risks of cryptocurrency investing?" }
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CryptoBud Intelligence</h1>
            <p className="text-sm text-emerald-100">Real-time Analysis • Professional Insights • Advanced AI</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Data</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <Loader className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">Processing with advanced AI & live data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {suggestions.length > 0 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">💡 Suggested follow-ups:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">🚀 Quick start:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(action.query);
                }}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
              >
                <action.icon className="w-4 h-4" />
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about crypto or any general question..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isTyping}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {inputValue.length > 0 && `${inputValue.length} chars`}
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          ⚠️ Crypto investments are risky. This is educational content, not financial advice.
        </div>
      </div>
    </div>
  );
};