// API Configuration and Base Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Trading Data Types
export interface TradingStats {
  portfolioValue: number;
  todaysPnL: number;
  totalTrades: number;
  winRate: number;
  currency: string;
}

export interface Trade {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  size: string;
  profit: number;
  timestamp: string;
  status: 'open' | 'closed';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  category: 'market' | 'economic' | 'company' | 'crypto';
  impact: 'high' | 'medium' | 'low';
  source: string;
}

export interface UserPerformance {
  userId: string;
  userName: string;
  email: string;
  portfolioValue: number;
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  lastActive: string;
  accountType: string;
}

// API Functions
export const tradingApi = {
  // User Trading Data
  getUserTradingStats: async (userId: string, period: string = '7d'): Promise<TradingStats> => {
    const response = await apiClient.get<TradingStats>(`/trading/stats/${userId}?period=${period}`);
    return response.data;
  },

  getUserTrades: async (userId: string, limit: number = 10): Promise<Trade[]> => {
    const response = await apiClient.get<Trade[]>(`/trading/trades/${userId}?limit=${limit}`);
    return response.data;
  },

  // News Data
  getMarketNews: async (limit: number = 10): Promise<NewsItem[]> => {
    const response = await apiClient.get<NewsItem[]>(`/news/market?limit=${limit}`);
    return response.data;
  },

  // Admin Data
  getAllUsersPerformance: async (period: string = '7d'): Promise<UserPerformance[]> => {
    const response = await apiClient.get<UserPerformance[]>(`/admin/users/performance?period=${period}`);
    return response.data;
  },

  getTradingAnalytics: async (period: string = '7d') => {
    const response = await apiClient.get(`/admin/analytics/trading?period=${period}`);
    return response.data;
  },

  // Real-time updates
  subscribeToUpdates: (userId: string, callback: (data: any) => void) => {
    // WebSocket connection for real-time updates
    if (typeof window !== 'undefined') {
      const ws = new WebSocket(`ws://localhost:3001/ws/${userId}`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      };

      return () => ws.close();
    }
    return () => {};
  }
};