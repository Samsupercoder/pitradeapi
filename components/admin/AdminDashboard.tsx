'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  FileText, 
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { useAdminData } from '@/hooks/useTradingData';
import { AdminSidebar } from './AdminSidebar';
import { UserManagement } from './UserManagement';
import { TradingAnalytics } from './TradingAnalytics';
import { InvoiceManagement } from './InvoiceManagement';
import { DocumentManagement } from './DocumentManagement';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  
  const { usersPerformance, analytics, loading, error } = useAdminData(selectedPeriod);
  
  // Calculate aggregate stats from users performance data
  const aggregateStats = usersPerformance.reduce((acc, user) => ({
    totalBalance: acc.totalBalance + user.portfolioValue,
    totalPnL: acc.totalPnL + user.totalPnL,
    totalTrades: acc.totalTrades + user.totalTrades,
    totalUsers: acc.totalUsers + 1
  }), { totalBalance: 0, totalPnL: 0, totalTrades: 0, totalUsers: 0 });

  const stats = analytics ? [
    {
      title: 'Total Users',
      value: analytics.activeUsers?.toString() || '0',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Trading Volume',
      value: `$${(analytics.totalVolume / 1000000).toFixed(1)}M`,
      change: '+23%',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: `$${analytics.totalPnL?.toLocaleString() || '0'}`,
      change: '+8%',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Pending KYC',
      value: '42',
      change: '-5%',
      icon: FileText,
      color: 'text-orange-600'
    }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin data...</p>
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
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Account Balance Display */}
              <div className="bg-white border rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">Account Balance</p>
                <p className="text-lg font-bold text-green-600">${aggregateStats.totalBalance.toLocaleString()}</p>
              </div>
              
              {/* P&L with Dropdown */}
              <div className="bg-white border rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">P&L</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-bold text-green-600">+${aggregateStats.totalPnL.toLocaleString()}</p>
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
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <p className="text-xs text-green-600 font-medium">
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Dashboard Grid - Based on Wireframe */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      User List
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {usersPerformance.slice(0, 4).map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{user.userName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <Badge 
                            variant="default"
                          >
                            active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* User Profile Detail */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>User Profile Detail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usersPerformance.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Full Name</label>
                          <p className="text-gray-900">{usersPerformance[0].userName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-gray-900">{usersPerformance[0].email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Phone</label>
                          <p className="text-gray-900">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Portfolio Value</label>
                          <p className="text-gray-900">${usersPerformance[0].portfolioValue.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Account Type</label>
                          <p className="text-gray-900">{usersPerformance[0].accountType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Win Rate</label>
                          <p className="text-gray-900">{usersPerformance[0].winRate}%</p>
                        </div>
                      </div>
                    </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Trade PnL Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Trade PnL Summary</CardTitle>
                  <CardDescription>Weekly profit and loss overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">+${aggregateStats.totalPnL.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">This Week</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">${(aggregateStats.totalBalance / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">${(aggregateStats.totalBalance * 1.2 / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-gray-600">This Quarter</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-600">{aggregateStats.totalTrades}</p>
                      <p className="text-sm text-gray-600">Total Trades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Invoice History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { id: 'INV-001', amount: '$2,450', status: 'paid', date: 'Dec 20, 2024' },
                        { id: 'INV-002', amount: '$1,850', status: 'pending', date: 'Dec 18, 2024' },
                        { id: 'INV-003', amount: '$3,200', status: 'paid', date: 'Dec 15, 2024' },
                        { id: 'INV-004', amount: '$1,650', status: 'overdue', date: 'Dec 12, 2024' }
                      ].map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{invoice.id}</p>
                            <p className="text-sm text-gray-500">{invoice.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{invoice.amount}</p>
                            <Badge 
                              variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'}
                            >
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Signed Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle>Signed Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Trading Agreement', status: 'signed', date: 'Dec 20, 2024' },
                        { name: 'Risk Disclosure', status: 'signed', date: 'Dec 18, 2024' },
                        { name: 'KYC Documents', status: 'pending', date: 'Dec 17, 2024' },
                        { name: 'Privacy Policy', status: 'signed', date: 'Dec 15, 2024' }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.status === 'signed' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-orange-600" />
                            )}
                            <Badge variant={doc.status === 'signed' ? 'default' : 'secondary'}>
                              {doc.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'analytics' && <TradingAnalytics />}
          {activeTab === 'invoices' && <InvoiceManagement />}
          {activeTab === 'documents' && <DocumentManagement />}
        </main>
      </div>
    </div>
  );
}