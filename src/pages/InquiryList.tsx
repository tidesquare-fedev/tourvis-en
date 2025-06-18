
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MessageCircle, Plus } from "lucide-react";

interface InquiryItem {
  id: string;
  subject: string;
  category: string;
  status: "pending" | "answered" | "closed";
  createdAt: string;
  lastReply?: string;
}

// Mock data for inquiry list
const mockInquiries: InquiryItem[] = [
  {
    id: "INQ001",
    subject: "Question about tour cancellation policy",
    category: "Cancellation/Refund",
    status: "answered",
    createdAt: "2024-06-15",
    lastReply: "2024-06-16"
  },
  {
    id: "INQ002",
    subject: "Dietary restrictions for Seoul food tour",
    category: "Product Inquiry",
    status: "pending",
    createdAt: "2024-06-18"
  },
  {
    id: "INQ003",
    subject: "Change reservation date request",
    category: "Reservation Change",
    status: "closed",
    createdAt: "2024-06-10",
    lastReply: "2024-06-12"
  }
];

const InquiryList = () => {
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
          {mockInquiries.length > 0 ? (
            mockInquiries.map((inquiry) => (
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
