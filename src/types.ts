export interface CryptoData {
  price_trend: 'rising' | 'stable' | 'falling';
  market_cap: 'high' | 'medium' | 'low';
  energy_use: 'high' | 'medium' | 'low';
  sustainability_score: number;
}

export interface CryptoDatabase {
  [key: string]: CryptoData;
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface AnalysisResult {
  recommendation: string;
  reason: string;
  score?: number;
  type: 'profitability' | 'sustainability' | 'general';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}