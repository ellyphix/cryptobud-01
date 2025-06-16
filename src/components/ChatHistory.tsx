import React from 'react';
import { MessageSquare, Trash2, Plus, Clock } from 'lucide-react';
import { useChatHistory } from '../hooks/useChatHistory';
import { useAuth } from '../contexts/AuthContext';

interface ChatHistoryProps {
  onNewChat: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ onNewChat }) => {
  const { sessions, currentSession, selectSession, deleteSession } = useChatHistory();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-300">Sign in to save your chat history</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white border border-white/20 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          Chat History
        </h2>
        <button
          onClick={onNewChat}
          className="w-8 h-8 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg flex items-center justify-center transition-colors"
          title="New Chat"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300">No chat history yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a conversation to see it here</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                currentSession?.id === session.id
                  ? 'bg-emerald-500/20 border border-emerald-500/30'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
              }`}
              onClick={() => selectSession(session.id)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-400">{formatDate(session.updatedAt)}</p>
                  <span className="text-xs text-gray-500">•</span>
                  <p className="text-xs text-gray-400">{session.messages.length} messages</p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                title="Delete chat"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {sessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 text-center">
            {sessions.length} chat session{sessions.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      )}
    </div>
  );
};