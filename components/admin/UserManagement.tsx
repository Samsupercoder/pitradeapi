'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Filter, Plus, Edit, Eye, Ban, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  kycStatus: 'verified' | 'pending' | 'rejected';
  accountType: string;
  joinDate: string;
  lastLogin: string;
  totalTrades: number;
  balance: string;
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+971 543210123',
      status: 'active',
      kycStatus: 'verified',
      accountType: 'Corporate Trader',
      joinDate: '2024-03-15',
      lastLogin: '2024-12-20 14:30',
      totalTrades: 156,
      balance: '$25,430.50'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 234-5678',
      status: 'pending',
      kycStatus: 'pending',
      accountType: 'Beginner Trader',
      joinDate: '2024-12-18',
      lastLogin: '2024-12-19 09:15',
      totalTrades: 3,
      balance: '$1,250.00'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+44 34567890',
      status: 'active',
      kycStatus: 'verified',
      accountType: 'Expert Trader',
      joinDate: '2024-02-28',
      lastLogin: '2024-12-20 16:45',
      totalTrades: 298,
      balance: '$89,750.25'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+1 (555) 456-7890',
      status: 'suspended',
      kycStatus: 'rejected',
      accountType: 'Basic Trader',
      joinDate: '2024-11-05',
      lastLogin: '2024-12-15 11:20',
      totalTrades: 12,
      balance: '$500.00'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getKYCBadge = (status: string) => {
    const variants = {
      verified: 'default',
      pending: 'secondary',
      rejected: 'destructive'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Trades</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getKYCBadge(user.kycStatus)}</TableCell>
                  <TableCell>{user.accountType}</TableCell>
                  <TableCell className="font-medium">{user.balance}</TableCell>
                  <TableCell>{user.totalTrades}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details - {selectedUser?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                                  <p className="text-gray-900">{selectedUser.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                                  <p className="text-gray-900">{selectedUser.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                                  <p className="text-gray-900">{selectedUser.phone}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Account Status</Label>
                                  <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">KYC Status</Label>
                                  <div className="mt-1">{getKYCBadge(selectedUser.kycStatus)}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Account Type</Label>
                                  <p className="text-gray-900">{selectedUser.accountType}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Join Date</Label>
                                  <p className="text-gray-900">{selectedUser.joinDate}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Last Login</Label>
                                  <p className="text-gray-900">{selectedUser.lastLogin}</p>
                                </div>
                              </div>
                              <div className="col-span-2 pt-4 border-t">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{selectedUser.balance}</p>
                                    <p className="text-sm text-gray-600">Current Balance</p>
                                  </div>
                                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{selectedUser.totalTrades}</p>
                                    <p className="text-sm text-gray-600">Total Trades</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.status === 'active' ? (
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}