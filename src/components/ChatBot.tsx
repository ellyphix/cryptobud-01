import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, Leaf, Info } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { CryptoAnalyzer } from '../CryptoAnalyzer';
import { BOT_PERSONALITY } from '../constants';
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
        text: BOT_PERSONALITY.greeting,
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
          text: BOT_PERSONALITY.greeting,
          isBot: true,
          timestamp: new Date()
        };
        updateSession(newSession.id, [greeting, message]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, false);

    // Show typing indicator
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate response
    let response: string;
    
    if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('commands')) {
      response = `I can help you with crypto analysis! Try asking me:\n\n🔹 "Which crypto is most sustainable?"\n🔹 "What's the best crypto for profit?"\n🔹 "Tell me about Bitcoin"\n🔹 "Compare Ethereum vs Cardano"\n🔹 "What should I invest in?"\n\n${CryptoAnalyzer.getRandomInsight()}`;
    } else if (userMessage.toLowerCase().includes('thank') || userMessage.toLowerCase().includes('thanks')) {
      response = `You're welcome! 😊 Remember, I'm always here to help you make informed crypto decisions. ${BOT_PERSONALITY.disclaimer}`;
    } else if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      response = `Hello again! 👋 Ready to explore some crypto opportunities? Ask me about sustainability, profitability, or any specific coin you're curious about!`;
    } else {
      response = CryptoAnalyzer.analyzeQuery(userMessage);
      
      // Add disclaimer for investment advice
      if (userMessage.toLowerCase().includes('invest') || userMessage.toLowerCase().includes('buy')) {
        response += `\n\n${BOT_PERSONALITY.disclaimer}`;
      }
    }

    setIsTyping(false);
    addMessage(response, true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: TrendingUp, text: "Best for profit", query: "Which crypto is best for profitability?" },
    { icon: Leaf, text: "Most sustainable", query: "Which crypto is most sustainable?" },
    { icon: Info, text: "Compare coins", query: "Compare Bitcoin vs Ethereum" }
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
            <h1 className="text-xl font-bold">{BOT_PERSONALITY.name}</h1>
            <p className="text-sm text-emerald-100">Your AI-Powered Financial Sidekick</p>
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
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
              placeholder="Ask me about crypto investments..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
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