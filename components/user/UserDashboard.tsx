'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Wallet,
  Bell,
  CreditCard,
  Bitcoin,
  FileText,
  Settings,
  User
} from 'lucide-react';
import { useTradingData } from '@/hooks/useTradingData';
import { UserSidebar } from './UserSidebar';
import { DocumentCenter } from './DocumentCenter';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  // Mock user ID - in production, get from authentication context
  const userId = '1';
  
  const { stats, trades, news, loading, error } = useTradingData(userId, selectedPeriod);

  // Generate portfolio stats from API data
  const portfolioStats = stats ? [
    {
      title: 'Portfolio Value',
      value: `$${stats.portfolioValue.toLocaleString()}`,
      change: '+12.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Today\'s P&L',
      value: `+$${stats.todaysPnL.toLocaleString()}`,
      change: '+4.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Total Trades',
      value: stats.totalTrades.toString(),
      change: '+23',
      trend: 'up',
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      title: 'Win Rate',
      value: `${stats.winRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ] : [];

  // Convert API trades to display format
  const recentTrades = trades.map(trade => ({
    pair: trade.pair,
    type: trade.type,
    size: trade.size,
    profit: trade.profit > 0 ? `+$${trade.profit.toFixed(2)}` : `-$${Math.abs(trade.profit).toFixed(2)}`,
    time: new Date(trade.timestamp).toLocaleString(),
    status: trade.status
  }));

  // Convert news to notifications format
  const notifications = news.map(item => ({
    type: 'news',
    message: item.title,
    time: new Date(item.timestamp).toLocaleString(),
    impact: item.impact
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">Welcome back, John Smith</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Account Balance Display */}
              <div className="bg-white border rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">Account Balance</p>
                <p className="text-lg font-bold text-green-600">${stats?.portfolioValue.toLocaleString() || '0'}</p>
              </div>
              
              {/* P&L with Dropdown */}
              <div className="bg-white border rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">P&L</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-bold text-green-600">+${stats?.todaysPnL.toLocaleString() || '0'}</p>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-20 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7d</SelectItem>
                      <SelectItem value="14d">14d</SelectItem>
                      <SelectItem value="21d">21d</SelectItem>
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="3m">3m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Portfolio Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {portfolioStats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="flex items-center space-x-1">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <p className={`text-xs font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change} from yesterday
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trading Performance Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Trading Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-gray-600">Real-time Performance Chart</p>
                        <p className="text-sm text-gray-500">Chart.js integration placeholder</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      New Trade
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bitcoin className="h-4 w-4 mr-2" />
                      Crypto Payment
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      View Documents
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Trades */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Trades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTrades.map((trade, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              trade.type === 'BUY' ? 'bg-green-600' : 'bg-red-600'
                            }`} />
                            <div>
                              <p className="font-medium text-gray-900">{trade.pair}</p>
                              <p className="text-sm text-gray-500">{trade.type} {trade.size}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${
                              trade.profit && trade.profit.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {trade.profit}
                            </p>
                            <p className="text-xs text-gray-500">{trade.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'news' && notification.impact === 'high' ? 'bg-red-600' :
                            notification.type === 'news' && notification.impact === 'medium' ? 'bg-orange-600' :
                            notification.type === 'news' && notification.impact === 'low' ? 'bg-blue-600' :
                            notification.type === 'trade' ? 'bg-blue-600' :
                            notification.type === 'payment' ? 'bg-green-600' :
                            notification.type === 'document' ? 'bg-orange-600' :
                            'bg-gray-600'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Bitcoin className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">Stablecoin Payments</p>
                          <p className="text-sm text-gray-500">USDT, USDC supported</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Credit Card</p>
                          <p className="text-sm text-gray-500">Visa, Mastercard</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Bank Transfer</p>
                          <p className="text-sm text-gray-500">IBAN</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'documents' && (
            <DocumentCenter userId={userId} />
          )}
        </main>
      </div>
    </div>
  );
}