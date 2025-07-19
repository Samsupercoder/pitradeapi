'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Plus, Eye, Download, Send, CreditCard, Bitcoin } from 'lucide-react';

interface Invoice {
  id: string;
  userId: string;
  userName: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod: 'crypto' | 'stripe' | 'bank_transfer';
  dueDate: string;
  createdDate: string;
  description: string;
  currency: string;
}

export function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      userId: '1',
      userName: 'John Smith',
      amount: '2450.00',
      status: 'paid',
      paymentMethod: 'crypto',
      dueDate: '2024-12-25',
      createdDate: '2024-12-20',
      description: 'Premium Trading Plan - Q1 2025',
      currency: 'USD'
    },
    {
      id: 'INV-002',
      userId: '2',
      userName: 'Sarah Johnson',
      amount: '1850.00',
      status: 'pending',
      paymentMethod: 'stripe',
      dueDate: '2024-12-28',
      createdDate: '2024-12-18',
      description: 'Basic Trading Plan - Monthly',
      currency: 'USD'
    },
    {
      id: 'INV-003',
      userId: '3',
      userName: 'Michael Brown',
      amount: '3200.00',
      status: 'paid',
      paymentMethod: 'bank_transfer',
      dueDate: '2024-12-20',
      createdDate: '2024-12-15',
      description: 'Professional Trading Plan - Q1 2025',
      currency: 'USD'
    },
    {
      id: 'INV-004',
      userId: '4',
      userName: 'Emma Wilson',
      amount: '1650.00',
      status: 'overdue',
      paymentMethod: 'stripe',
      dueDate: '2024-12-15',
      createdDate: '2024-12-12',
      description: 'Basic Trading Plan - Monthly',
      currency: 'USD'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      cancelled: 'outline'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'crypto':
        return <Bitcoin className="h-4 w-4" />;
      case 'stripe':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const totalStats = {
    total: invoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0),
    paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + parseFloat(inv.amount), 0),
    pending: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + parseFloat(inv.amount), 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalStats.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalStats.paid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalStats.pending.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalStats.overdue.toLocaleString()}</div>
          </CardContent>
        </Card>
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
                  placeholder="Search invoices..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.id}</p>
                      <p className="text-sm text-gray-500">{invoice.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.userName}</p>
                      <p className="text-sm text-gray-500">ID: {invoice.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      ${parseFloat(invoice.amount).toLocaleString()} {invoice.currency}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(invoice.paymentMethod)}
                      <span className="capitalize">{invoice.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Invoice Details - {selectedInvoice?.id}</DialogTitle>
                          </DialogHeader>
                          {selectedInvoice && (
                            <div className="space-y-6">
                              {/* Invoice Header */}
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-bold">PiTrade</h3>
                                  <p className="text-sm text-gray-600">Professional Trading Platform</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold">{selectedInvoice.id}</p>
                                  {getStatusBadge(selectedInvoice.status)}
                                </div>
                              </div>

                              {/* Customer Info */}
                              <div className="grid grid-cols-2 gap-6 border-t pt-6">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Bill To:</h4>
                                  <p className="text-gray-900">{selectedInvoice.userName}</p>
                                  <p className="text-sm text-gray-600">User ID: {selectedInvoice.userId}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-2">Invoice Details:</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-600">Created:</span> {selectedInvoice.createdDate}</p>
                                    <p><span className="text-gray-600">Due:</span> {selectedInvoice.dueDate}</p>
                                    <p><span className="text-gray-600">Currency:</span> {selectedInvoice.currency}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Invoice Items */}
                              <div className="border-t pt-6">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Description</TableHead>
                                      <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>{selectedInvoice.description}</TableCell>
                                      <TableCell className="text-right font-medium">
                                        ${parseFloat(selectedInvoice.amount).toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Total */}
                              <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-medium">Total:</span>
                                  <span className="text-2xl font-bold">
                                    ${parseFloat(selectedInvoice.amount).toLocaleString()} {selectedInvoice.currency}
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex space-x-3 pt-4 border-t">
                                <Button size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Send className="h-4 w-4 mr-2" />
                                  Send Reminder
                                </Button>
                                {selectedInvoice.status === 'pending' && (
                                  <Button variant="outline" size="sm">
                                    Mark as Paid
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
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