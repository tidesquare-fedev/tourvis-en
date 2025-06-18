
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, User } from "lucide-react";

interface InquiryDetail {
  id: string;
  subject: string;
  category: string;
  status: "pending" | "answered" | "closed";
  createdAt: string;
  message: string;
  name: string;
  email: string;
  phone?: string;
  reply?: {
    message: string;
    repliedAt: string;
    repliedBy: string;
  };
}

// Mock data for inquiry details - updated to match InquiryList IDs
const mockInquiryDetails: { [key: string]: InquiryDetail } = {
  "INQ-001": {
    id: "INQ-001",
    subject: "Question about Seoul tour package",
    category: "Tour Package",
    status: "pending",
    createdAt: "2024-01-15",
    message: "Hello, I would like to know more details about the Seoul tour package. What are the main attractions included and what is the duration of the tour? Also, are meals included in the package?",
    name: "John Doe",
    email: "john@email.com",
    phone: "+1-555-123-4567"
  },
  "INQ-002": {
    id: "INQ-002",
    subject: "Cancellation policy inquiry",
    category: "Cancellation",
    status: "answered",
    createdAt: "2024-01-10",
    message: "Hi, I would like to know about the cancellation policy for tours. What are the refund terms if I need to cancel due to unexpected circumstances?",
    name: "John Doe",
    email: "john@email.com",
    phone: "+1-555-123-4567",
    reply: {
      message: "Hello John, Thank you for your inquiry. You can cancel up to 24 hours before the tour start time for a full refund. Cancellations made within 24 hours will receive a 50% refund. In case of extreme weather or other circumstances beyond our control, we offer full refunds or rescheduling options.",
      repliedAt: "2024-01-12",
      repliedBy: "Customer Service Team"
    }
  },
  "INQ-003": {
    id: "INQ-003",
    subject: "Group discount availability",
    category: "Pricing",
    status: "closed",
    createdAt: "2024-01-05",
    message: "Do you offer group discounts for parties of 10 or more people? We are planning a company outing and would like to know about special rates.",
    name: "Sarah Kim",
    email: "sarah@email.com",
    reply: {
      message: "Hello Sarah, Yes, we offer group discounts for parties of 10 or more. You can receive a 15% discount for groups of 10-19 people, and 20% discount for groups of 20 or more. Please contact us directly to arrange your booking.",
      repliedAt: "2024-01-08",
      repliedBy: "Sales Team"
    }
  },
  "INQ-004": {
    id: "INQ-004",
    subject: "Dietary restrictions for food tour",
    category: "Special Requirements",
    status: "pending",
    createdAt: "2024-01-20",
    message: "I have severe allergies to shellfish and nuts. Can the Seoul Food Tour accommodate these dietary restrictions? I want to make sure I can safely participate in all the food tastings.",
    name: "Mike Johnson",
    email: "mike@email.com",
    phone: "+1-555-987-6543"
  },
  "INQ-005": {
    id: "INQ-005",
    subject: "Transportation from airport",
    category: "Transportation",
    status: "answered",
    createdAt: "2024-01-18",
    message: "What transportation options are available from Incheon Airport to the tour meeting point? Do you provide pickup services?",
    name: "Sarah Kim",
    email: "sarah@email.com",
    reply: {
      message: "Hello Sarah, We offer airport pickup services for an additional fee of $30 per person. Alternatively, you can take the Airport Express train to Seoul Station and then a short taxi ride to our meeting point. We'll send detailed directions upon booking confirmation.",
      repliedAt: "2024-01-19",
      repliedBy: "Customer Service Team"
    }
  }
};

const InquiryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const inquiry = id ? mockInquiryDetails[id] : null;

  // 현재 경로를 저장하여 세션 관리에 활용
  useEffect(() => {
    sessionStorage.setItem('previousPath', window.location.pathname);
  }, []);

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Inquiry Not Found</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">The requested inquiry does not exist.</p>
              <Link to="/inquiry-list">
                <Button className="w-full sm:w-auto">Back to Inquiry List</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
          <Link to="/inquiry-list" className="order-1 sm:order-1">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </Link>
          <div className="order-2 sm:order-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Inquiry Details</h1>
            <p className="text-base sm:text-lg text-gray-600">
              View inquiry content and responses
            </p>
          </div>
        </div>

        {/* Inquiry Information - Responsive */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1 w-full">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className="text-base sm:text-lg break-words">{inquiry.subject}</span>
                  <Badge className={`${getStatusColor(inquiry.status)} w-fit`}>
                    {getStatusText(inquiry.status)}
                  </Badge>
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Inquiry Number:</strong> {inquiry.id}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Category:</strong> {inquiry.category}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Created:</strong> {inquiry.createdAt}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Name:</strong> {inquiry.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 break-all">
                  <strong>Email:</strong> {inquiry.email}
                </p>
                {inquiry.phone && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong>Phone:</strong> {inquiry.phone}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Original Inquiry - Responsive */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              My Inquiry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">{inquiry.message}</p>
          </CardContent>
        </Card>

        {/* Reply Section - Responsive */}
        {inquiry.reply ? (
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 break-words">{inquiry.reply.message}</p>
                <div className="text-xs sm:text-sm text-gray-600">
                  <p><strong>Responded by:</strong> {inquiry.reply.repliedBy}</p>
                  <p><strong>Response Date:</strong> {inquiry.reply.repliedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-6 sm:p-8 text-center">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Waiting for Response</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Your inquiry has been received. We will respond within 24 hours.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/inquiry-list" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Back to Inquiry List</Button>
          </Link>
          <Link to="/inquiry" className="w-full sm:w-auto">
            <Button style={{ backgroundColor: '#01c5fd' }} className="w-full sm:w-auto">New Inquiry</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
