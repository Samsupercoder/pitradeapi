const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Mock database - In production, use PostgreSQL
const mockDatabase = {
  users: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      accountType: 'Corporate',
      tradingPlatformId: 'TP001'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      accountType: 'Beginner',
      tradingPlatformId: 'TP002'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      accountType: 'Expert',
      tradingPlatformId: 'TP003'
    }
  ],
  
  tradingStats: {
    '1': {
      portfolioValue: 25430.50,
      todaysPnL: 1245.30,
      totalTrades: 156,
      winRate: 73.4,
      currency: 'USD'
    },
    '2': {
      portfolioValue: 5250.00,
      todaysPnL: 125.50,
      totalTrades: 23,
      winRate: 65.2,
      currency: 'USD'
    },
    '3': {
      portfolioValue: 89750.25,
      todaysPnL: 2890.75,
      totalTrades: 298,
      winRate: 82.1,
      currency: 'USD'
    }
  },

  trades: {
    '1': [
      {
        id: 'T001',
        pair: 'EUR/USD',
        type: 'BUY',
        size: '10,000',
        profit: 245.30,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'closed'
      },
      {
        id: 'T002',
        pair: 'GBP/USD',
        type: 'SELL',
        size: '15,000',
        profit: 189.50,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'closed'
      }
    ]
  },

  news: [
    {
      id: 'N001',
      title: 'Federal Reserve Announces Interest Rate Decision',
      summary: 'The Fed maintains current rates amid economic uncertainty',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      category: 'economic',
      impact: 'high',
      source: 'Reuters'
    },
    {
      id: 'N002',
      title: 'EUR/USD Reaches New Monthly High',
      summary: 'European currency strengthens against dollar following ECB statements',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      category: 'market',
      impact: 'medium',
      source: 'Bloomberg'
    }
  ]
};

// Simulate real trading platform API integration
class TradingPlatformAPI {
  static async fetchUserStats(platformId, period = '7d') {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, this would call actual trading platform APIs
    // like Capital.com, MetaTrader, etc.
    const userId = mockDatabase.users.find(u => u.tradingPlatformId === platformId)?.id;
    return mockDatabase.tradingStats[userId] || null;
  }

  static async fetchUserTrades(platformId, limit = 10) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userId = mockDatabase.users.find(u => u.tradingPlatformId === platformId)?.id;
    return mockDatabase.trades[userId] || [];
  }

  static async fetchMarketNews(limit = 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In production, integrate with news APIs like Alpha Vantage, NewsAPI, etc.
    return mockDatabase.news.slice(0, limit);
  }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  // In production, verify JWT token properly
  req.user = { id: '1', role: 'user' }; // Mock user
  next();
};

// API Routes

// User Trading Stats
app.get('/api/trading/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '7d' } = req.query;
    
    const user = mockDatabase.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const stats = await TradingPlatformAPI.fetchUserStats(user.tradingPlatformId, period);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User Trades
app.get('/api/trading/trades/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    
    const user = mockDatabase.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const trades = await TradingPlatformAPI.fetchUserTrades(user.tradingPlatformId, limit);
    
    res.json({
      success: true,
      data: trades
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Market News
app.get('/api/news/market', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const news = await TradingPlatformAPI.fetchMarketNews(limit);
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Routes
app.get('/api/admin/users/performance', authenticateToken, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    const usersPerformance = await Promise.all(
      mockDatabase.users.map(async (user) => {
        const stats = await TradingPlatformAPI.fetchUserStats(user.tradingPlatformId, period);
        return {
          userId: user.id,
          userName: user.name,
          email: user.email,
          portfolioValue: stats?.portfolioValue || 0,
          totalPnL: stats?.todaysPnL || 0,
          totalTrades: stats?.totalTrades || 0,
          winRate: stats?.winRate || 0,
          lastActive: new Date().toISOString(),
          accountType: user.accountType
        };
      })
    );
    
    res.json({
      success: true,
      data: usersPerformance
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/analytics/trading', authenticateToken, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate aggregate analytics
    const allStats = await Promise.all(
      mockDatabase.users.map(user => 
        TradingPlatformAPI.fetchUserStats(user.tradingPlatformId, period)
      )
    );
    
    const analytics = {
      totalVolume: allStats.reduce((sum, stats) => sum + (stats?.portfolioValue || 0), 0),
      totalPnL: allStats.reduce((sum, stats) => sum + (stats?.todaysPnL || 0), 0),
      totalTrades: allStats.reduce((sum, stats) => sum + (stats?.totalTrades || 0), 0),
      averageWinRate: allStats.reduce((sum, stats) => sum + (stats?.winRate || 0), 0) / allStats.length,
      activeUsers: mockDatabase.users.length
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// WebSocket for real-time updates
wss.on('connection', (ws, req) => {
  const userId = req.url.split('/').pop();
  console.log(`WebSocket connected for user: ${userId}`);
  
  // Send periodic updates
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      // Simulate real-time data updates
      const updateType = Math.random() > 0.5 ? 'stats_update' : 'news_update';
      
      if (updateType === 'stats_update') {
        ws.send(JSON.stringify({
          type: 'stats_update',
          stats: {
            todaysPnL: mockDatabase.tradingStats[userId]?.todaysPnL + (Math.random() - 0.5) * 100
          }
        }));
      } else {
        ws.send(JSON.stringify({
          type: 'news_update',
          news: {
            id: `N${Date.now()}`,
            title: 'Market Update',
            summary: 'Real-time market movement detected',
            timestamp: new Date().toISOString(),
            category: 'market',
            impact: 'medium',
            source: 'PiTrade'
          }
        }));
      }
    }
  }, 30000); // Update every 30 seconds

  ws.on('close', () => {
    clearInterval(interval);
    console.log(`WebSocket disconnected for user: ${userId}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server ready for real-time updates`);
});