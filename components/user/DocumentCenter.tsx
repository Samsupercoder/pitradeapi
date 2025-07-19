'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download, 
  Eye,
  PenTool,
  Shield,
  Info
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'privacy_policy' | 'terms_conditions' | 'disclaimer' | 'risk_disclosure' | 'consent_form' | 'user_agreement';
  status: 'pending' | 'read' | 'signed';
  required: boolean;
  lastUpdated: string;
  content: string;
  requiresSignature: boolean;
}

interface DocumentCenterProps {
  userId: string;
}

export function DocumentCenter({ userId }: DocumentCenterProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [hasReadDocument, setHasReadDocument] = useState(false);
  const [isSigningMode, setIsSigningMode] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(true);

  // Mock documents - in production, fetch from API
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'DOC-001',
        title: 'Privacy Policy',
        type: 'privacy_policy',
        status: 'pending',
        required: true,
        lastUpdated: '2024-12-01',
        requiresSignature: false,
        content: `
# Privacy Policy

## 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.

## 2. How We Use Your Information
We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.

## 3. Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.

## 4. Data Security
We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## 5. Your Rights
You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.

## 6. Contact Us
If you have any questions about this Privacy Policy, please contact us at privacy@pitrade.com.

Last updated: December 1, 2024
        `
      },
      {
        id: 'DOC-002',
        title: 'Terms and Conditions',
        type: 'terms_conditions',
        status: 'pending',
        required: true,
        lastUpdated: '2024-12-01',
        requiresSignature: false,
        content: `
# Terms and Conditions

## 1. Acceptance of Terms
By accessing and using PiTrade services, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Service Description
PiTrade provides algorithmic trading API services and related financial technology solutions.

## 3. User Responsibilities
Users are responsible for maintaining the confidentiality of their account information and for all activities under their account.

## 4. Trading Risks
Trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results.

## 5. Limitation of Liability
PiTrade shall not be liable for any indirect, incidental, special, or consequential damages.

## 6. Termination
We may terminate or suspend your account at any time for violations of these terms.

Last updated: December 1, 2024
        `
      },
      {
        id: 'DOC-003',
        title: 'Disclaimer',
        type: 'disclaimer',
        status: 'pending',
        required: true,
        lastUpdated: '2024-12-01',
        requiresSignature: false,
        content: `
# Disclaimer

## Important Notice
The information provided by PiTrade is for educational and informational purposes only and should not be construed as investment advice.

## No Guarantee of Profits
Trading results may vary and there is no guarantee of profits. All trading involves risk of loss.

## Professional Advice
You should consult with a qualified financial advisor before making any investment decisions.

## Market Risks
Financial markets are volatile and unpredictable. Past performance does not guarantee future results.

## Technology Risks
Our services depend on technology systems that may experience downtime or technical issues.

Last updated: December 1, 2024
        `
      },
      {
        id: 'DOC-004',
        title: 'Risk Disclosure Statement',
        type: 'risk_disclosure',
        status: 'pending',
        required: true,
        lastUpdated: '2024-12-01',
        requiresSignature: false,
        content: `
# Risk Disclosure Statement

## Trading Risks
Trading in financial instruments involves substantial risk of loss and may not be suitable for all investors.

## Leverage Risk
The use of leverage can amplify both profits and losses. You may lose more than your initial investment.

## Market Volatility
Financial markets are subject to rapid and unpredictable changes that can result in significant losses.

## Technology Risk
Electronic trading systems may experience failures that could result in order execution delays or failures.

## Regulatory Risk
Changes in regulations may affect the availability or terms of our services.

## Liquidity Risk
Some financial instruments may have limited liquidity, making it difficult to execute trades at desired prices.

By acknowledging this disclosure, you confirm that you understand these risks and accept responsibility for your trading decisions.

Last updated: December 1, 2024
        `
      },
      {
        id: 'DOC-005',
        title: 'Consent Acknowledgement Form',
        type: 'consent_form',
        status: 'pending',
        required: true,
        lastUpdated: '2024-12-01',
        requiresSignature: true,
        content: `
# Consent Acknowledgement Form

## Acknowledgement of Understanding
I hereby acknowledge that I have read, understood, and agree to the following:

1. I have reviewed all provided legal documents including Privacy Policy, Terms and Conditions, Disclaimer, and Risk Disclosure Statement.

2. I understand the risks associated with algorithmic trading and accept full responsibility for my trading decisions.

3. I consent to the collection and processing of my personal data as outlined in the Privacy Policy.

4. I acknowledge that PiTrade provides technology services and does not provide investment advice.

5. I understand that trading results may vary and there is no guarantee of profits.

## Digital Signature Required
By signing below, I confirm my understanding and acceptance of all terms and conditions.

Signature: _________________________ Date: _____________

Full Name: _________________________

User ID: ${userId}
        `
      },
      {
        id: 'DOC-006',
        title: 'User Agreement',
        type: 'user_agreement',
        status: 'pending',
        required: true,
        lastUpdated: '2024-12-01',
        requiresSignature: true,
        content: `
# User Agreement

## Service Agreement
This agreement governs your use of PiTrade services and establishes the terms of our relationship.

## Account Terms
1. You must provide accurate and complete information when creating your account.
2. You are responsible for maintaining the security of your account credentials.
3. You must notify us immediately of any unauthorized use of your account.

## Trading Authorization
By signing this agreement, you authorize PiTrade to:
1. Execute trades on your behalf based on algorithmic signals
2. Access your trading account through approved API connections
3. Provide performance reporting and analytics

## Fees and Charges
You agree to pay all applicable fees as outlined in our fee schedule.

## Compliance
You agree to comply with all applicable laws and regulations in your jurisdiction.

## Digital Signature Required
Your digital signature below constitutes your agreement to all terms.

Signature: _________________________ Date: _____________

Full Name: _________________________

User ID: ${userId}
        `
      }
    ];

    setDocuments(mockDocuments);

    // Check if user has completed all required documents
    const allCompleted = mockDocuments.every(doc => 
      !doc.required || doc.status === 'signed' || (!doc.requiresSignature && doc.status === 'read')
    );
    setShowNotification(!allCompleted);
  }, [userId]);

  const handleDocumentRead = (documentId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, status: 'read' } : doc
    ));
    setHasReadDocument(true);
  };

  const handleDigitalSignature = async (documentId: string) => {
    try {
      // In production, integrate with digital signature APIs like:
      // - DocuSign API
      // - Adobe Sign API
      // - HelloSign API
      // - Or native device signature capture
      
      // Mock signature process
      const signature = await mockDigitalSignature();
      
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, status: 'signed' } : doc
      ));
      
      setSignatureData(signature);
      setIsSigningMode(false);
      
      // Check if all documents are completed
      const updatedDocs = documents.map(doc => 
        doc.id === documentId ? { ...doc, status: 'signed' } : doc
      );
      
      const allCompleted = updatedDocs.every(doc => 
        !doc.required || doc.status === 'signed' || (!doc.requiresSignature && doc.status === 'read')
      );
      
      if (allCompleted) {
        setShowNotification(false);
      }
      
    } catch (error) {
      console.error('Signature error:', error);
      alert('Digital signature failed. Please try again.');
    }
  };

  // Mock digital signature function
  const mockDigitalSignature = (): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate signature capture delay
      setTimeout(() => {
        const timestamp = new Date().toISOString();
        const signature = `${userId}_signature_${timestamp}`;
        resolve(signature);
      }, 2000);
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'read':
        return <Eye className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary' as const,
      read: 'outline' as const,
      signed: 'default' as const
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const pendingDocuments = documents.filter(doc => doc.required && doc.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Notification Alert for New Users */}
      {showNotification && pendingDocuments.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Action Required:</strong> Please review and complete {pendingDocuments.length} required legal document(s) to activate your account.
            {pendingDocuments.some(doc => doc.requiresSignature) && (
              <span className="block mt-1">
                <PenTool className="h-4 w-4 inline mr-1" />
                Digital signature required for some documents.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Document Center</h2>
        <div className="flex items-center space-x-2">
          <Info className="h-4 w-4 text-blue-600" />
          <span className="text-sm text-gray-600">
            {documents.filter(doc => doc.status === 'signed' || doc.status === 'read').length} of {documents.length} completed
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((document) => (
          <Card key={document.id} className={`hover:shadow-md transition-shadow ${
            document.required && document.status === 'pending' ? 'border-orange-200 bg-orange-50' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  {document.requiresSignature ? (
                    <PenTool className="h-5 w-5 text-purple-600" />
                  ) : (
                    <FileText className="h-5 w-5 text-blue-600" />
                  )}
                  <span>{document.title}</span>
                </CardTitle>
                {getStatusIcon(document.status)}
              </div>
              <div className="flex items-center justify-between">
                {getStatusBadge(document.status)}
                {document.required && (
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    Required
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Last updated: {document.lastUpdated}
                </p>
                
                {document.requiresSignature && (
                  <div className="flex items-center space-x-2 text-sm text-purple-600">
                    <Shield className="h-4 w-4" />
                    <span>Digital signature required</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedDocument(document)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>{selectedDocument?.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <ScrollArea className="h-96 w-full border rounded-lg p-4">
                          <div className="whitespace-pre-wrap text-sm">
                            {selectedDocument?.content}
                          </div>
                        </ScrollArea>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="confirm-read"
                            checked={hasReadDocument}
                            onCheckedChange={(checked) => setHasReadDocument(checked as boolean)}
                          />
                          <label htmlFor="confirm-read" className="text-sm">
                            I have read and understood this document
                          </label>
                        </div>

                        <div className="flex space-x-3">
                          {!selectedDocument?.requiresSignature ? (
                            <Button 
                              onClick={() => selectedDocument && handleDocumentRead(selectedDocument.id)}
                              disabled={!hasReadDocument}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Read
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => selectedDocument && handleDigitalSignature(selectedDocument.id)}
                              disabled={!hasReadDocument}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <PenTool className="h-4 w-4 mr-2" />
                              Digital Sign
                            </Button>
                          )}
                          
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Status */}
      {!showNotification && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">All Documents Completed</h3>
                <p className="text-sm text-green-600">
                  You have successfully reviewed and signed all required legal documents. Your account is now fully activated.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}