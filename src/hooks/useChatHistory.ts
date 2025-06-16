import { useState, useEffect } from 'react';
import { ChatSession, ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useChatHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      setSessions([]);
      setCurrentSession(null);
    }
  }, [user]);

  const loadSessions = () => {
    if (!user) return;
    
    const storedSessions = localStorage.getItem(`cryptobuddy_sessions_${user.id}`);
    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(parsedSessions);
      } catch (error) {
        console.error('Error loading chat sessions:', error);
      }
    }
  };

  const saveSessions = (updatedSessions: ChatSession[]) => {
    if (!user) return;
    
    localStorage.setItem(`cryptobuddy_sessions_${user.id}`, JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  };

  const createNewSession = (initialMessage?: ChatMessage): ChatSession => {
    if (!user) throw new Error('User must be authenticated');

    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: initialMessage ? 
        initialMessage.text.slice(0, 50) + (initialMessage.text.length > 50 ? '...' : '') :
        'New Chat',
      messages: initialMessage ? [initialMessage] : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedSessions = [newSession, ...sessions];
    saveSessions(updatedSessions);
    setCurrentSession(newSession);
    
    return newSession;
  };

  const updateSession = (sessionId: string, messages: ChatMessage[]) => {
    const updatedSessions = sessions.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            messages, 
            updatedAt: new Date(),
            title: messages.find(m => !m.isBot)?.text.slice(0, 50) + 
                   (messages.find(m => !m.isBot)?.text.length > 50 ? '...' : '') || session.title
          }
        : session
    );
    
    saveSessions(updatedSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(updatedSessions.find(s => s.id === sessionId) || null);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    saveSessions(updatedSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  const selectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    setCurrentSession(session || null);
  };

  return {
    sessions,
    currentSession,
    createNewSession,
    updateSession,
    deleteSession,
    selectSession,
    setCurrentSession
  };
};