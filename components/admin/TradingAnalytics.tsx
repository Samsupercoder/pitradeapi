'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Target } from 'lucide-react';

export function TradingAnalytics() {
  const performanceMetrics = [
    {
      title: 'Total Trading Volume',
      value: '$2.4M',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Traders',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Average P&L',
      value: '+$1,832',
      change: '+12.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Success Rate',
      value: '73.4%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600'
    }
  ];

  const topPerformers = [
    { name: 'John Smith', profit: '+$12,450', trades: 156, successRate: '78%' },
    { name: 'Michael Brown', profit: '+$9,320', trades: 298, successRate: '82%' },
    { name: 'Sarah Johnson', profit: '+$7,890', trades: 89, successRate: '71%' },
    { name: 'Emma Wilson', profit: '+$6,540', trades: 134, successRate: '69%' },
    { name: 'David Chen', profit: '+$5,210', trades: 67, successRate: '76%' }
  ];

  const tradingActivity = [
    { pair: 'EUR/USD', volume: '$245,000', trades: 1234, avgSize: '$198' },
    { pair: 'GBP/USD', volume: '$189,000', trades: 987, avgSize: '$191' },
    { pair: 'USD/JPY', volume: '$167,000', trades: 876, avgSize: '$191' },
    { pair: 'AUD/USD', volume: '$134,000', trades: 654, avgSize: '$205' },
    { pair: 'USD/CAD', volume: '$112,000', trades: 543, avgSize: '$206' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Trading Analytics</h2>
        <div className="flex space-x-4">
          <Select defaultValue="7d">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex items-center space-x-1">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p className={`text-xs font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} from last period
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance Overview</TabsTrigger>
          <TabsTrigger value="activity">Trading Activity</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers (This Week)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((trader, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{trader.name}</p>
                          <p className="text-sm text-gray-500">{trader.trades} trades • {trader.successRate} success</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{trader.profit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* P&L Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly P&L Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive P&L Chart</p>
                    <p className="text-sm text-gray-500">Chart.js/D3.js integration placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">+$89,320</p>
                  <p className="text-sm text-gray-600">December 2024</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">+$76,540</p>
                  <p className="text-sm text-gray-600">November 2024</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">+$92,180</p>
                  <p className="text-sm text-gray-600">October 2024</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">+$68,900</p>
                  <p className="text-sm text-gray-600">September 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Trading Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Most Traded Currency Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradingActivity.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-gray-700">{pair.pair.split('/')[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pair.pair}</p>
                        <p className="text-sm text-gray-500">{pair.trades} trades</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{pair.volume}</p>
                      <p className="text-sm text-gray-500">Avg: {pair.avgSize}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Volume Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Trading Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <p className="text-gray-600">Volume Chart Visualization</p>
                  <p className="text-sm text-gray-500">Real-time trading volume data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">7.2</div>
                  <p className="text-sm text-gray-600">Moderate Risk</p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Max Drawdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">-8.4%</div>
                  <p className="text-sm text-gray-600">Last 30 Days</p>
                  <p className="text-xs text-gray-500 mt-2">Peak: Dec 15, 2024</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">1.42</div>
                  <p className="text-sm text-gray-600">Good Performance</p>
                  <p className="text-xs text-gray-500 mt-2">Risk-adjusted return</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution by Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Conservative Accounts</p>
                    <p className="text-sm text-gray-500">542 accounts • Average risk: 3.2</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">34%</p>
                    <p className="text-sm text-gray-500">of portfolio</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Moderate Accounts</p>
                    <p className="text-sm text-gray-500">789 accounts • Average risk: 6.1</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">51%</p>
                    <p className="text-sm text-gray-500">of portfolio</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Aggressive Accounts</p>
                    <p className="text-sm text-gray-500">234 accounts • Average risk: 8.7</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">15%</p>
                    <p className="text-sm text-gray-500">of portfolio</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}