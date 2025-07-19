'use client';

import { 
  BarChart3, 
  Users, 
  FileCheck, 
  TrendingUp, 
  Receipt, 
  FileText,
  Settings,
  LogOut,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: PieChart },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Trading Analytics', icon: TrendingUp },
    { id: 'invoices', label: 'Invoice Management', icon: Receipt },
    { id: 'documents', label: 'Document Management', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-2 p-6 border-b">
        <span className="text-xl font-bold text-gray-900">PiTrade Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start text-left',
              activeTab === item.id && 'bg-blue-600 text-white hover:bg-blue-700'
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">AD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@pitrade.com</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}