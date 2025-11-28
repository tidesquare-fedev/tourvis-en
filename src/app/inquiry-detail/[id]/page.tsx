'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutProvider } from '@/components/layout/LayoutProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  Lock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InquiryDetail {
  id: string;
  author: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

interface InquiryReply {
  id: string;
  inquiry_id: string;
  admin_id: string;
  content: string;
  created_at: string;
  admin_name?: string;
}

export default function InquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [replies, setReplies] = useState<InquiryReply[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ author: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const inquiryId = params.id as string;

  useEffect(() => {
    // URL에서 쿼리 파라미터로 author와 password를 받을 수 있도록 처리
    const urlParams = new URLSearchParams(window.location.search);
    const author = urlParams.get('author');
    const password = urlParams.get('password');

    if (author && password) {
      setLoginData({ author, password });
      authenticateAndLoadInquiry(author, password);
    } else {
      setLoading(false);
    }
  }, [inquiryId]);

  const authenticateAndLoadInquiry = async (
    author: string,
    password: string,
  ) => {
    try {
      setAuthLoading(true);

      // 문의 조회 API 호출
      const response = await fetch('/en/api/inquiries/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }

      const result = await response.json();

      if (result.success) {
        const targetInquiry = result.inquiries.find(
          (inq: InquiryDetail) => inq.id === inquiryId,
        );
        if (targetInquiry) {
          setInquiry(targetInquiry);
          setIsAuthenticated(true);
          // 답변도 로드
          await loadReplies(inquiryId);
        } else {
          toast({
            title: 'Error',
            description: 'Inquiry not found',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Invalid credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error loading inquiry:', error);
      toast({
        title: 'Error',
        description: 'Failed to load inquiry',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const loadReplies = async (inquiryId: string) => {
    try {
      const response = await fetch(`/en/api/inquiries/${inquiryId}/replies`);
      if (response.ok) {
        const data = await response.json();
        setReplies(data);
      }
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authenticateAndLoadInquiry(loginData.author, loginData.password);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'answered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            대기 중
          </Badge>
        );
      case 'answered':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            답변 완료
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            종료
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            알 수 없음
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">높음</Badge>;
      case 'medium':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            보통
          </Badge>
        );
      case 'low':
        return <Badge variant="outline">낮음</Badge>;
      default:
        return <Badge variant="outline">보통</Badge>;
    }
  };

  if (loading || authLoading) {
    return (
      <LayoutProvider>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </LayoutProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <LayoutProvider>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Inquiry Authentication
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Enter your credentials to view this inquiry
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lock className="w-5 h-5 mr-2" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={loginData.author}
                    onChange={e =>
                      setLoginData(prev => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={e =>
                      setLoginData(prev => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={authLoading}
                  style={{ backgroundColor: '#01c5fd' }}
                >
                  {authLoading ? 'Authenticating...' : 'View Inquiry'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </LayoutProvider>
    );
  }

  if (!inquiry) {
    return (
      <LayoutProvider>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Inquiry Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The requested inquiry could not be found.
            </p>
            <Link href="/inquiry-list">
              <Button variant="outline">Back to Inquiry List</Button>
            </Link>
          </div>
        </div>
      </LayoutProvider>
    );
  }

  return (
    <LayoutProvider>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/inquiry-list">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Inquiry Details
              </h1>
              <p className="text-gray-600">Inquiry #{inquiry.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(inquiry.status)}
            {getPriorityBadge(inquiry.priority)}
          </div>
        </div>

        {/* Inquiry Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              {getStatusIcon(inquiry.status)}
              <span className="ml-2">{inquiry.subject}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Author
                  </Label>
                  <p className="text-sm">{inquiry.author}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Name
                  </Label>
                  <p className="text-sm">{inquiry.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Email
                  </Label>
                  <p className="text-sm">{inquiry.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Phone
                  </Label>
                  <p className="text-sm">{inquiry.phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Category
                  </Label>
                  <p className="text-sm">{inquiry.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Created
                  </Label>
                  <p className="text-sm">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Message
                </Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {inquiry.message}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        {replies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Replies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {replies.map(reply => (
                  <div
                    key={reply.id}
                    className="border-l-4 border-blue-500 pl-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Reply</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reply.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {replies.length === 0 && inquiry.status === 'pending' && (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Waiting for Response
              </h3>
              <p className="text-gray-600">
                Your inquiry is being reviewed. We will respond within 24 hours.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutProvider>
  );
}
