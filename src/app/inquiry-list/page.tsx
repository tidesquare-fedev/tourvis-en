'use client';

import Link from 'next/link';
import { LayoutProvider } from '@/components/layout/LayoutProvider';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle, Plus, Lock, Search, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InquiryItem {
  id: string;
  author: string;
  password: string;
  subject: string;
  category: string;
  status: 'pending' | 'answered' | 'closed';
  created_at: string;
  lastReply?: string;
}

// 샘플 데이터 제거 - 이제 실제 데이터베이스에서만 가져옴

export default function InquiryListPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInquiries, setUserInquiries] = useState<InquiryItem[]>([]);
  const [loginData, setLoginData] = useState({ author: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [inquiryDetails, setInquiryDetails] = useState<Record<string, any>>({});
  const [replies, setReplies] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    // 새로고침 시 인증 초기화
    setIsAuthenticated(false);
  }, []);

  const authenticateAndLoadInquiries = async (
    author: string,
    password: string,
  ) => {
    try {
      const response = await fetch('/en/api/inquiries/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search inquiries');
      }

      const result = await response.json();
      console.log('API Response:', result);
      console.log('Response structure:', {
        success: result.success,
        hasData: !!result.data,
        hasInquiries: !!(result.data && result.data.inquiries),
        inquiriesLength: result.data?.inquiries?.length || 0,
      });

      if (
        result.success &&
        result.data &&
        result.data.inquiries &&
        result.data.inquiries.length > 0
      ) {
        setIsAuthenticated(true);
        setUserInquiries(result.data.inquiries);
        return true;
      } else {
        console.log('No inquiries found or invalid response structure');
        return false;
      }
    } catch (error) {
      console.error('Error searching inquiries:', error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await authenticateAndLoadInquiries(
        loginData.author,
        loginData.password,
      );
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to your inquiry dashboard',
        });
      } else {
        toast({
          title: 'Login Failed',
          description: 'No inquiries found for this author and password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Failed to search inquiries. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInquiryDetails = async (inquiryId: string) => {
    try {
      // 문의 상세 정보 로드
      const inquiryResponse = await fetch(`/en/api/inquiries/${inquiryId}`);
      if (inquiryResponse.ok) {
        const inquiryData = await inquiryResponse.json();
        console.log('Inquiry details response:', inquiryData);
        setInquiryDetails(prev => ({
          ...prev,
          [inquiryId]: inquiryData.data || inquiryData,
        }));
      }

      // 답변 로드
      const repliesResponse = await fetch(
        `/en/api/inquiries/${inquiryId}/replies`,
      );
      console.log('Replies response status:', repliesResponse.status);
      if (repliesResponse.ok) {
        const repliesData = await repliesResponse.json();
        console.log('Replies data:', repliesData);
        setReplies(prev => ({
          ...prev,
          [inquiryId]: repliesData.data || repliesData,
        }));
      } else {
        console.error(
          'Failed to load replies:',
          repliesResponse.status,
          repliesResponse.statusText,
        );
      }
    } catch (error) {
      console.error('Error loading inquiry details:', error);
    }
  };

  const toggleInquiryDetails = async (inquiryId: string) => {
    if (expandedInquiry === inquiryId) {
      setExpandedInquiry(null);
    } else {
      setExpandedInquiry(inquiryId);
      // 상세 정보가 아직 로드되지 않았다면 로드
      if (!inquiryDetails[inquiryId]) {
        await loadInquiryDetails(inquiryId);
      }
    }
  };

  const getStatusColor = (status: string) =>
    (
      ({
        pending: 'bg-yellow-100 text-yellow-800',
        answered: 'bg-green-100 text-green-800',
        closed: 'bg-gray-100 text-gray-800',
      }) as any
    )[status] || 'bg-gray-100 text-gray-800';
  const getStatusText = (status: string) =>
    (({ pending: 'Pending', answered: 'Answered', closed: 'Closed' }) as any)[
      status
    ] || 'Unknown';

  if (!isAuthenticated) {
    return (
      <LayoutProvider>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Check Inquiry
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Enter your name and password to view your 1:1 inquiry history and
              check the response
            </p>
          </div>
          <Card className="max-w-md mx-auto mb-6 sm:mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Search className="w-5 h-5 mr-2" />
                Inquiry Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={loginData.author}
                    onChange={e =>
                      setLoginData(p => ({ ...p, author: e.target.value }))
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
                      setLoginData(p => ({ ...p, password: e.target.value }))
                    }
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  style={{ backgroundColor: '#01c5fd' }}
                >
                  {loading ? 'Searching...' : 'Search Inquiry'}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Don't have any inquiries yet?
                </p>
                <Link href="/inquiry">
                  <Button variant="outline" className="w-full">
                    Make Your First Inquiry
                  </Button>
                </Link>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium mb-1">Note:</p>
                <p className="text-xs text-blue-600">
                  Use the same Author and Password you used when submitting your
                  inquiry.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6 sm:mt-8">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    Can't find your reservation?
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                    Please make sure you're using the exact reservation number
                    and email address provided at the time of booking.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    Customer Support
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Email: support@koreatours.com
                    <br />
                    Phone: +82-2-1234-5678
                    <br />
                    Hours: 9:00 AM - 6:00 PM (KST)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutProvider>
    );
  }

  return (
    <LayoutProvider>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Inquiry History
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Check and manage your Direct Inquiry
            </p>
          </div>
          <Link href="/inquiry">
            <Button
              className="flex items-center space-x-2 w-full sm:w-auto"
              style={{ backgroundColor: '#01c5fd' }}
            >
              <Plus className="w-4 h-4" />
              <span>New Inquiry</span>
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {userInquiries.length > 0 ? (
            userInquiries.map(inquiry => (
              <Card
                key={inquiry.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                          {inquiry.subject}
                        </h3>
                        <Badge
                          className={`${getStatusColor(inquiry.status)} w-fit`}
                        >
                          {getStatusText(inquiry.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Inquiry Number: {inquiry.id}</p>
                        <p>Category: {inquiry.category}</p>
                        <p>
                          Created:{' '}
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </p>
                        {inquiry.lastReply && (
                          <p>Last Reply: {inquiry.lastReply}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => toggleInquiryDetails(inquiry.id)}
                    >
                      {expandedInquiry === inquiry.id
                        ? 'Hide Details'
                        : 'View Details'}
                    </Button>
                  </div>

                  {/* 확장된 문의 상세 내용 */}
                  {expandedInquiry === inquiry.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {inquiryDetails[inquiry.id] ? (
                        <div className="space-y-4">
                          {/* 문의 상세 정보 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Author
                              </Label>
                              <p className="text-sm">
                                {inquiryDetails[inquiry.id].author}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Name
                              </Label>
                              <p className="text-sm">
                                {inquiryDetails[inquiry.id].name}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Email
                              </Label>
                              <p className="text-sm">
                                {inquiryDetails[inquiry.id].email}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Phone
                              </Label>
                              <p className="text-sm">
                                {inquiryDetails[inquiry.id].phone ||
                                  'Not provided'}
                              </p>
                            </div>
                          </div>

                          {/* 문의 내용 */}
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              Message
                            </Label>
                            <div className="mt-1 p-3 bg-gray-50 rounded-md">
                              <p className="text-sm whitespace-pre-wrap">
                                {inquiryDetails[inquiry.id].message}
                              </p>
                            </div>
                          </div>

                          {/* 관리자 답변 */}
                          {replies[inquiry.id] &&
                            replies[inquiry.id].length > 0 && (
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <Label className="text-sm font-semibold text-blue-800 mb-3 block">
                                  Replies ({replies[inquiry.id].length})
                                </Label>
                                <div className="space-y-3">
                                  {replies[inquiry.id].map(
                                    (reply: any, index: number) => (
                                      <div
                                        key={reply.id || index}
                                        className="bg-white rounded-md p-3 border-l-4 border-blue-500 shadow-sm"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <p className="text-sm font-medium text-black">
                                            TOURVIS
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {reply.created_at
                                              ? new Date(
                                                  reply.created_at,
                                                ).toLocaleString('en-US', {
                                                  year: 'numeric',
                                                  month: 'numeric',
                                                  day: 'numeric',
                                                  hour: 'numeric',
                                                  minute: '2-digit',
                                                  second: '2-digit',
                                                  hour12: true,
                                                })
                                              : 'Unknown date'}
                                          </p>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                          {reply.content ||
                                            reply.message ||
                                            'No content'}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {(!replies[inquiry.id] ||
                            replies[inquiry.id].length === 0) &&
                            inquiry.status === 'answered' && (
                              <div className="text-center py-4 bg-green-50 rounded-md">
                                <Clock className="w-8 h-8 mx-auto text-green-500 mb-2" />
                                <p className="text-sm text-green-700">
                                  Answered - Loading replies...
                                </p>
                              </div>
                            )}

                          {(!replies[inquiry.id] ||
                            replies[inquiry.id].length === 0) &&
                            inquiry.status === 'pending' && (
                              <div className="text-center py-4 bg-yellow-50 rounded-md">
                                <Clock className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                                <p className="text-sm text-yellow-700">
                                  Waiting for admin response
                                </p>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="mt-2 text-sm text-gray-600">
                            Loading details...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No inquiries yet
                </h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions, feel free to contact us anytime.
                </p>
                <Link href="/inquiry">
                  <Button style={{ backgroundColor: '#01c5fd' }}>
                    Make Your First Inquiry
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Inquiry Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                • Business Hours: Weekdays 10:00 AM - 06:00 PM (Closed on
                weekends and holidays)
              </p>
              <p>
                • Inquiry responses are sent to your registered email within 24
                hours
              </p>
              <p>
                • For urgent matters, please contact our customer service
                (+82-2-1234-5678)
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Removed Back to Home button per requirements */}
      </div>
    </LayoutProvider>
  );
}
