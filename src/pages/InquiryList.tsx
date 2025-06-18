import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Plus, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InquiryItem {
  id: string;
  author: string;
  password: string;
  subject: string;
  category: string;
  status: "pending" | "answered" | "closed";
  createdAt: string;
  lastReply?: string;
}

// Sample data for testing
const sampleInquiries: InquiryItem[] = [
  {
    id: "INQ-001",
    author: "john",
    password: "password123",
    subject: "Question about Seoul tour package",
    category: "Tour Package",
    status: "pending",
    createdAt: "2024-01-15",
  },
  {
    id: "INQ-002",
    author: "john",
    password: "password123",
    subject: "Cancellation policy inquiry",
    category: "Cancellation",
    status: "answered",
    createdAt: "2024-01-10",
    lastReply: "2024-01-12"
  },
  {
    id: "INQ-003",
    author: "sarah",
    password: "mypass456",
    subject: "Group discount availability",
    category: "Pricing",
    status: "closed",
    createdAt: "2024-01-05",
    lastReply: "2024-01-08"
  },
  {
    id: "INQ-004",
    author: "mike",
    password: "secure789",
    subject: "Dietary restrictions for food tour",
    category: "Special Requirements",
    status: "pending",
    createdAt: "2024-01-20",
  },
  {
    id: "INQ-005",
    author: "sarah",
    password: "mypass456",
    subject: "Transportation from airport",
    category: "Transportation",
    status: "answered",
    createdAt: "2024-01-18",
    lastReply: "2024-01-19"
  }
];

// 전역 변수로 현재 세션 정보를 저장 (메모리에만 저장)
let currentSession: { author: string; password: string } | null = null;

const InquiryList = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInquiries, setUserInquiries] = useState<InquiryItem[]>([]);
  const [loginData, setLoginData] = useState({ author: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // 컴포넌트 마운트 시 세션 확인
  useEffect(() => {
    const previousPath = sessionStorage.getItem('previousPath');
    const currentPath = location.pathname;
    
    console.log('Previous path:', previousPath);
    console.log('Current path:', currentPath);
    console.log('Current session:', currentSession);
    
    // inquiry 관련 페이지들 정의
    const inquiryPages = ['/inquiry-list', '/inquiry'];
    const isFromInquiryDetail = previousPath && previousPath.startsWith('/inquiry-detail/');
    const isFromInquiryPage = previousPath && (inquiryPages.includes(previousPath) || isFromInquiryDetail);
    
    const isToInquiryDetail = currentPath.startsWith('/inquiry-detail/');
    const isToInquiryPage = inquiryPages.includes(currentPath) || isToInquiryDetail;
    
    // 1. inquiry 관련 페이지 간 이동 시 세션 유지
    if (isFromInquiryPage && isToInquiryPage && currentSession) {
      console.log('Maintaining session between inquiry pages');
      const success = authenticateAndLoadInquiries(currentSession.author, currentSession.password);
      if (success) {
        setIsAuthenticated(true);
      } else {
        console.log('Session validation failed, clearing session');
        currentSession = null;
      }
    } 
    // 2. inquiry 관련 페이지가 아닌 곳에서 온 경우 세션 초기화
    else if (previousPath && !isFromInquiryPage && isToInquiryPage) {
      console.log('Coming from non-inquiry page, clearing session');
      currentSession = null;
      setIsAuthenticated(false);
    }
    // 3. 직접 접근하거나 새로고침한 경우 (previousPath가 없음)
    else if (!previousPath) {
      console.log('Direct access or refresh, clearing session');
      currentSession = null;
      setIsAuthenticated(false);
    }
    
    // 현재 경로를 저장
    sessionStorage.setItem('previousPath', currentPath);
  }, [location.pathname]);

  const authenticateAndLoadInquiries = (author: string, password: string) => {
    // Get inquiries from localStorage first, then fall back to sample data
    const storedInquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const allInquiries = [...storedInquiries, ...sampleInquiries];
    
    const userInquiries = allInquiries.filter((inquiry: InquiryItem) => 
      inquiry.author === author && inquiry.password === password
    );
    
    if (userInquiries.length > 0 || allInquiries.some((inquiry: InquiryItem) => 
      inquiry.author === author && inquiry.password === password)) {
      setIsAuthenticated(true);
      setUserInquiries(userInquiries);
      // 메모리에 세션 정보 저장
      currentSession = { author, password };
      return true;
    }
    return false;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = authenticateAndLoadInquiries(loginData.author, loginData.password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to your inquiry dashboard",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid author or password",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "answered":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "answered":
        return "Answered";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header - Responsive */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              <img 
                src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
                alt="KoreaTours" 
                className="h-6 sm:h-8"
              />
              <nav className="flex items-center space-x-3 sm:space-x-6">
                <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
                <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Check Reservation</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Lock className="w-5 h-5 mr-2" />
                My Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={loginData.author}
                    onChange={(e) => setLoginData(prev => ({ ...prev, author: e.target.value }))}
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
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Don't have any inquiries yet?</p>
                <Link to="/inquiry">
                  <Button variant="outline" className="w-full">
                    Make Your First Inquiry
                  </Button>
                </Link>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium mb-1">Test Accounts:</p>
                <p className="text-xs text-blue-600">john / password123</p>
                <p className="text-xs text-blue-600">sarah / mypass456</p>
                <p className="text-xs text-blue-600">mike / secure789</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <img 
              src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
              alt="KoreaTours" 
              className="h-6 sm:h-8"
            />
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Check Reservation</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Inquiry History</h1>
            <p className="text-base sm:text-lg text-gray-600">
              Check and manage your Direct Inquiry
            </p>
          </div>
          <Link to="/inquiry">
            <Button className="flex items-center space-x-2 w-full sm:w-auto" style={{ backgroundColor: '#01c5fd' }}>
              <Plus className="w-4 h-4" />
              <span>New Inquiry</span>
            </Button>
          </Link>
        </div>

        {/* Inquiry List - Responsive */}
        <div className="space-y-4">
          {userInquiries.length > 0 ? (
            userInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{inquiry.subject}</h3>
                        <Badge className={`${getStatusColor(inquiry.status)} w-fit`}>
                          {getStatusText(inquiry.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Inquiry Number: {inquiry.id}</p>
                        <p>Category: {inquiry.category}</p>
                        <p>Created: {inquiry.createdAt}</p>
                        {inquiry.lastReply && (
                          <p>Last Reply: {inquiry.lastReply}</p>
                        )}
                      </div>
                    </div>
                    <Link to={`/inquiry-detail/${inquiry.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-6 sm:p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries yet</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions, feel free to contact us anytime.
                </p>
                <Link to="/inquiry">
                  <Button style={{ backgroundColor: '#01c5fd' }}>
                    Make Your First Inquiry
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section - Responsive */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Inquiry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Business Hours: Weekdays 10:00 AM - 06:00 PM (Closed on weekends and holidays)</p>
              <p>• Inquiry responses are sent to your registered email within 24 hours</p>
              <p>• For urgent matters, please contact our customer service (+82-2-1234-5678)</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 sm:mt-8">
          <Link to="/">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }} className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InquiryList;
