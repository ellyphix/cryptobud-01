import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex items-start gap-3 mb-4 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      {message.isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          message.isBot 
            ? 'bg-white shadow-md border border-gray-100' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
        }`}>
          <div className={`text-sm leading-relaxed ${message.isBot ? 'text-gray-800' : 'text-white'}`}>
            {message.text.split('\n').map((line, index) => (
              <div key={index} className={index > 0 ? 'mt-2' : ''}>
                {line.includes('**') ? (
                  <span className="font-semibold">
                    {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </span>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={`text-xs text-gray-500 mt-1 ${message.isBot ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {!message.isBot && (
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center order-2">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};