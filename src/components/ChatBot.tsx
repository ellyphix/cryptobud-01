import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, Leaf, Info, Loader } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { aiService } from '../services/AIService';
import { ChatMessage as ChatMessageType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useChatHistory } from '../hooks/useChatHistory';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
      // Initial greeting for new sessions
      const greeting: ChatMessageType = {
        id: Date.now().toString(),
        text: `👋 **Welcome to CryptoBuddy!**\n\nI'm your AI-powered cryptocurrency assistant with access to real-time market data. I can help you with:\n\n📊 **Live price tracking & analysis**\n💰 **Investment insights & recommendations**\n🌱 **Sustainability assessments**\n⚖️ **Cryptocurrency comparisons**\n📰 **Latest market news & trends**\n🎓 **Crypto education & explanations**\n\n💡 **Try asking me:**\n• "What's Bitcoin's current price?"\n• "Which crypto is most sustainable?"\n• "Compare Ethereum vs Cardano"\n• "Should I invest in Solana?"\n• "Latest crypto news"\n\nWhat would you like to know about the crypto market today?`,
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
    
    // Save to history if user is authenticated
    if (user) {
      if (currentSession) {
        updateSession(currentSession.id, updatedMessages);
      } else if (!isBot) {
        // Create new session with first user message
        const newSession = createNewSession(message);
        // Add bot greeting to new session
        const greeting: ChatMessageType = {
          id: (Date.now() + 1).toString(),
          text: `👋 **Welcome to CryptoBuddy!**\n\nI'm your AI-powered cryptocurrency assistant with access to real-time market data. What would you like to know about the crypto market?`,
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
    addMessage(userMessage, false);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await aiService.processQuery(userMessage);
      
      // Simulate realistic thinking time based on query complexity
      const thinkingTime = Math.min(2000 + userMessage.length * 50, 5000);
      await new Promise(resolve => setTimeout(resolve, thinkingTime));
      
      setIsTyping(false);
      addMessage(aiResponse.message, true);
      
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      addMessage(
        "I apologize, but I'm experiencing some technical difficulties accessing the latest market data. Please try again in a moment, or ask me about general cryptocurrency concepts that I can help explain!",
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

  const quickActions = [
    { icon: TrendingUp, text: "Bitcoin price", query: "What's the current price of Bitcoin?" },
    { icon: Leaf, text: "Sustainable cryptos", query: "Which cryptocurrencies are most sustainable?" },
    { icon: Info, text: "Market analysis", query: "Give me a current crypto market analysis" }
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CryptoBuddy AI</h1>
            <p className="text-sm text-emerald-100">Real-time Crypto Intelligence</p>
          </div>
        </div>
      </div>

      {/* Messages */}
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
                <span className="text-sm">Analyzing market data...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
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

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about cryptocurrency..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isTyping}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};