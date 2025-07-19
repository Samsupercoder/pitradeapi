'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Eye, CheckCircle, XCircle, Clock, Download, User, CreditCard, MapPin } from 'lucide-react';

interface KYCSubmission {
  id: string;
  userId: string;
  userName: string;
  email: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'requires_info';
  documents: {
    passport: string;
    proofOfAddress: string;
    bankStatement: string;
  };
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
  };
  reviewNotes?: string;
}

export function KYCVerification() {
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const submissions: KYCSubmission[] = [
    {
      id: 'KYC-001',
      userId: '2',
      userName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      submissionDate: '2024-12-18',
      status: 'pending',
      documents: {
        passport: 'passport_sarah_001.pdf',
        proofOfAddress: 'utility_bill_sarah.pdf',
        bankStatement: 'bank_statement_sarah.pdf'
      },
      personalInfo: {
        fullName: 'Sarah Elizabeth Johnson',
        dateOfBirth: '1990-05-15',
        nationality: 'United States',
        address: '123 Main Street, New York, NY 10001'
      }
    },
    {
      id: 'KYC-002',
      userId: '5',
      userName: 'David Chen',
      email: 'david.chen@example.com',
      submissionDate: '2024-12-19',
      status: 'requires_info',
      documents: {
        passport: 'passport_david_002.pdf',
        proofOfAddress: 'lease_agreement_david.pdf',
        bankStatement: ''
      },
      personalInfo: {
        fullName: 'David Wei Chen',
        dateOfBirth: '1985-11-22',
        nationality: 'Canada',
        address: '456 Oak Avenue, Toronto, ON M5V 2K1'
      },
      reviewNotes: 'Bank statement is missing. Please provide a recent bank statement within 3 months.'
    },
    {
      id: 'KYC-003',
      userId: '6',
      userName: 'Maria Rodriguez',
      email: 'maria.rodriguez@example.com',
      submissionDate: '2024-12-17',
      status: 'approved',
      documents: {
        passport: 'passport_maria_003.pdf',
        proofOfAddress: 'utility_maria.pdf',
        bankStatement: 'bank_maria.pdf'
      },
      personalInfo: {
        fullName: 'Maria Isabella Rodriguez',
        dateOfBirth: '1992-08-30',
        nationality: 'Spain',
        address: '789 Pine Street, Madrid, Spain 28001'
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      requires_info: { variant: 'outline' as const, icon: FileText, color: 'text-blue-600' }
    };
    
    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;
    
    return (
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <Badge variant={config.variant}>{status.replace('_', ' ')}</Badge>
      </div>
    );
  };

  const handleReview = (submission: KYCSubmission, action: 'approve' | 'reject' | 'request_info') => {
    // Handle KYC review action
    console.log(`${action} KYC submission ${submission.id}`, { notes: reviewNotes });
    setReviewNotes('');
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const reviewedSubmissions = submissions.filter(s => s.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">KYC Verification</h2>
        <div className="flex space-x-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{pendingSubmissions.length}</p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'approved').length}
            </p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Review ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({reviewedSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.userName}</CardTitle>
                    <p className="text-sm text-gray-500">{submission.email} • {submission.id}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(submission.status)}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>KYC Review - {selectedSubmission?.userName}</DialogTitle>
                        </DialogHeader>
                        {selectedSubmission && (
                          <div className="space-y-6">
                            {/* Personal Information */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center">
                                  <User className="h-5 w-5 mr-2" />
                                  Personal Information
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Full Name</Label>
                                  <p className="text-gray-900">{selectedSubmission.personalInfo.fullName}</p>
                                </div>
                                <div>
                                  <Label>Date of Birth</Label>
                                  <p className="text-gray-900">{selectedSubmission.personalInfo.dateOfBirth}</p>
                                </div>
                                <div>
                                  <Label>Nationality</Label>
                                  <p className="text-gray-900">{selectedSubmission.personalInfo.nationality}</p>
                                </div>
                                <div>
                                  <Label>Address</Label>
                                  <p className="text-gray-900">{selectedSubmission.personalInfo.address}</p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Documents */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center">
                                  <FileText className="h-5 w-5 mr-2" />
                                  Submitted Documents
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium">Passport</p>
                                        <p className="text-sm text-gray-500">{selectedSubmission.documents.passport}</p>
                                      </div>
                                      <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium">Proof of Address</p>
                                        <p className="text-sm text-gray-500">{selectedSubmission.documents.proofOfAddress}</p>
                                      </div>
                                      <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="p-4 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium">Bank Statement</p>
                                        <p className="text-sm text-gray-500">
                                          {selectedSubmission.documents.bankStatement || 'Not provided'}
                                        </p>
                                      </div>
                                      {selectedSubmission.documents.bankStatement && (
                                        <Button variant="outline" size="sm">
                                          <Download className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Review Actions */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Review Decision</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <Label>Review Notes</Label>
                                  <Textarea
                                    placeholder="Add notes about the review decision..."
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    className="mt-2"
                                  />
                                </div>
                                <div className="flex space-x-3">
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleReview(selectedSubmission, 'approve')}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => handleReview(selectedSubmission, 'request_info')}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Request More Info
                                  </Button>
                                  <Button 
                                    variant="destructive"
                                    onClick={() => handleReview(selectedSubmission, 'reject')}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Submission Date</p>
                    <p className="font-medium">{submission.submissionDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Documents</p>
                    <p className="font-medium">
                      {Object.values(submission.documents).filter(Boolean).length}/3
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Nationality</p>
                    <p className="font-medium">{submission.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Days Pending</p>
                    <p className="font-medium">
                      {Math.floor((new Date().getTime() - new Date(submission.submissionDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          {reviewedSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.userName}</CardTitle>
                    <p className="text-sm text-gray-500">{submission.email} • {submission.id}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(submission.status)}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Submission Date</p>
                    <p className="font-medium">{submission.submissionDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium capitalize">{submission.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Nationality</p>
                    <p className="font-medium">{submission.personalInfo.nationality}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Review Notes</p>
                    <p className="font-medium text-xs">
                      {submission.reviewNotes ? submission.reviewNotes.substring(0, 50) + '...' : 'No notes'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}