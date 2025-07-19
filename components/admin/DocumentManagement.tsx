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
import { Search, Filter, Upload, Eye, Download, FileText, FileCheck, FilePen as FilePenTool, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'kyc' | 'agreement' | 'report' | 'invoice';
  status: 'draft' | 'pending_signature' | 'signed' | 'archived';
  userId: string;
  userName: string;
  uploadDate: string;
  lastModified: string;
  size: string;
  signedDate?: string;
  signers?: string[];
}

export function DocumentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const documents: Document[] = [
    {
      id: 'DOC-001',
      name: 'Trading Agreement - John Smith',
      type: 'agreement',
      status: 'signed',
      userId: '1',
      userName: 'John Smith',
      uploadDate: '2024-12-20',
      lastModified: '2024-12-20',
      size: '245 KB',
      signedDate: '2024-12-20',
      signers: ['John Smith', 'PiTrade Admin']
    },
    {
      id: 'DOC-002',
      name: 'KYC Documents - Sarah Johnson',
      type: 'kyc',
      status: 'pending_signature',
      userId: '2',
      userName: 'Sarah Johnson',
      uploadDate: '2024-12-18',
      lastModified: '2024-12-19',
      size: '1.2 MB',
      signers: ['Sarah Johnson']
    },
    {
      id: 'DOC-003',
      name: 'Risk Disclosure Agreement - Michael Brown',
      type: 'agreement',
      status: 'signed',
      userId: '3',
      userName: 'Michael Brown',
      uploadDate: '2024-12-15',
      lastModified: '2024-12-15',
      size: '189 KB',
      signedDate: '2024-12-15',
      signers: ['Michael Brown', 'PiTrade Admin']
    },
    {
      id: 'DOC-004',
      name: 'Monthly Trading Report - Q4 2024',
      type: 'report',
      status: 'draft',
      userId: 'admin',
      userName: 'System Generated',
      uploadDate: '2024-12-21',
      lastModified: '2024-12-21',
      size: '567 KB'
    },
    {
      id: 'DOC-005',
      name: 'Privacy Policy Agreement - Emma Wilson',
      type: 'agreement',
      status: 'pending_signature',
      userId: '4',
      userName: 'Emma Wilson',
      uploadDate: '2024-12-17',
      lastModified: '2024-12-17',
      size: '156 KB',
      signers: ['Emma Wilson']
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const configs = {
      draft: { variant: 'outline' as const, icon: FileText, color: 'text-gray-600' },
      pending_signature: { variant: 'secondary' as const, icon: FilePenTool, color: 'text-orange-600' },
      signed: { variant: 'default' as const, icon: FileCheck, color: 'text-green-600' },
      archived: { variant: 'outline' as const, icon: FileText, color: 'text-gray-400' }
    };
    
    const config = configs[status as keyof typeof configs];
    const Icon = config.icon;
    
    return (
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <Badge variant={config.variant}>{status.replace('_', ' ')}</Badge>
      </div>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'kyc':
        return <FileCheck className="h-5 w-5 text-green-600" />;
      case 'agreement':
        return <FilePenTool className="h-5 w-5 text-purple-600" />;
      case 'report':
        return <FileText className="h-5 w-5 text-orange-600" />;
      case 'invoice':
        return <FileText className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const documentStats = {
    total: documents.length,
    pending: documents.filter(doc => doc.status === 'pending_signature').length,
    signed: documents.filter(doc => doc.status === 'signed').length,
    draft: documents.filter(doc => doc.status === 'draft').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button>
            <FilePenTool className="h-4 w-4 mr-2" />
            Create Contract
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{documentStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Signature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{documentStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Signed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{documentStats.signed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{documentStats.draft}</div>
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
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="kyc">KYC Documents</SelectItem>
                <SelectItem value="agreement">Agreement</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_signature">Pending Signature</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(document.type)}
                      <div>
                        <p className="font-medium text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-500">{document.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{document.userName}</p>
                      <p className="text-sm text-gray-500">ID: {document.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {document.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(document.status)}</TableCell>
                  <TableCell>{document.uploadDate}</TableCell>
                  <TableCell>{document.size}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedDocument(document)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Document Details - {selectedDocument?.name}</DialogTitle>
                          </DialogHeader>
                          {selectedDocument && (
                            <div className="space-y-6">
                              {/* Document Info */}
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Document Name</Label>
                                    <p className="text-gray-900">{selectedDocument.name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Document ID</Label>
                                    <p className="text-gray-900">{selectedDocument.id}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Type</Label>
                                    <p className="text-gray-900 capitalize">{selectedDocument.type.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">File Size</Label>
                                    <p className="text-gray-900">{selectedDocument.size}</p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                                    <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Upload Date</Label>
                                    <p className="text-gray-900">{selectedDocument.uploadDate}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Last Modified</Label>
                                    <p className="text-gray-900">{selectedDocument.lastModified}</p>
                                  </div>
                                  {selectedDocument.signedDate && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Signed Date</Label>
                                      <p className="text-gray-900">{selectedDocument.signedDate}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* User Info */}
                              <div className="border-t pt-4">
                                <Label className="text-sm font-medium text-gray-600">Associated User</Label>
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                  <p className="font-medium text-gray-900">{selectedDocument.userName}</p>
                                  <p className="text-sm text-gray-500">User ID: {selectedDocument.userId}</p>
                                </div>
                              </div>

                              {/* Signers */}
                              {selectedDocument.signers && (
                                <div className="border-t pt-4">
                                  <Label className="text-sm font-medium text-gray-600">Signers</Label>
                                  <div className="mt-2 space-y-2">
                                    {selectedDocument.signers.map((signer, index) => (
                                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                        {selectedDocument.status === 'signed' ? (
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                          <Clock className="h-4 w-4 text-orange-600" />
                                        )}
                                        <span className="text-gray-900">{signer}</span>
                                        {selectedDocument.status === 'signed' && (
                                          <Badge variant="outline" className="text-xs">Signed</Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex space-x-3 pt-4 border-t">
                                <Button size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                                {selectedDocument.status === 'pending_signature' && (
                                  <Button variant="outline" size="sm">
                                    <FilePenTool className="h-4 w-4 mr-2" />
                                    Send Reminder
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
                      {document.status === 'pending_signature' && (
                        <Button variant="outline" size="sm" className="text-blue-600">
                          <FilePenTool className="h-4 w-4" />
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