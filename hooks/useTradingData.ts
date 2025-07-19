'use client';

import { useState, useEffect, useCallback } from 'react';
import { tradingApi, TradingStats, Trade, NewsItem, UserPerformance } from '@/lib/api';

// Hook for user trading data
export function useTradingData(userId: string, period: string = '7d') {
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, tradesData, newsData] = await Promise.all([
        tradingApi.getUserTradingStats(userId, period),
        tradingApi.getUserTrades(userId, 10),
        tradingApi.getMarketNews(10)
      ]);

      setStats(statsData);
      setTrades(tradesData);
      setNews(newsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trading data');
      console.error('Trading data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up real-time updates
  useEffect(() => {
    const unsubscribe = tradingApi.subscribeToUpdates(userId, (data) => {
      if (data.type === 'stats_update') {
        setStats(prev => ({ ...prev, ...data.stats }));
      } else if (data.type === 'trade_update') {
        setTrades(prev => [data.trade, ...prev.slice(0, 9)]);
      } else if (data.type === 'news_update') {
        setNews(prev => [data.news, ...prev.slice(0, 9)]);
      }
    });

    return unsubscribe;
  }, [userId]);

  return {
    stats,
    trades,
    news,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for admin dashboard data
export function useAdminData(period: string = '7d') {
  const [usersPerformance, setUsersPerformance] = useState<UserPerformance[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [performanceData, analyticsData] = await Promise.all([
        tradingApi.getAllUsersPerformance(period),
        tradingApi.getTradingAnalytics(period)
      ]);

      setUsersPerformance(performanceData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin data');
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    usersPerformance,
    analytics,
    loading,
    error,
    refetch: fetchData
  };
}

// Hook for real-time notifications
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = tradingApi.subscribeToUpdates(userId, (data) => {
      if (data.type === 'notification') {
        setNotifications(prev => [data.notification, ...prev.slice(0, 9)]);
      }
    });

    return unsubscribe;
  }, [userId]);

  return notifications;
}