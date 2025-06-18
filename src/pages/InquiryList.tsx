
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <img 
            src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
            alt="KoreaTours" 
            className="h-8"
          />
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">Reservation</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Inquiry List</h1>
            <p className="text-lg text-gray-600">
              View and manage your 1:1 inquiries
            </p>
          </div>
          <Link to="/inquiry">
            <Button className="flex items-center space-x-2" style={{ backgroundColor: '#01c5fd' }}>
              <Plus className="w-4 h-4" />
              <span>Make New Inquiry</span>
            </Button>
          </Link>
        </div>

        {/* Inquiry List */}
        <div className="space-y-4">
          {mockInquiries.length > 0 ? (
            mockInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{inquiry.subject}</h3>
                        <Badge className={getStatusColor(inquiry.status)}>
                          {getStatusText(inquiry.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Inquiry ID: {inquiry.id}</p>
                        <p>Category: {inquiry.category}</p>
                        <p>Created: {inquiry.createdAt}</p>
                        {inquiry.lastReply && (
                          <p>Last Reply: {inquiry.lastReply}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inquiries Yet</h3>
                <p className="text-gray-600 mb-4">
                  You haven't made any inquiries yet. Feel free to contact us with any questions.
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

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Inquiry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Weekdays AM 10:00 - PM 06:00 (Closed on weekends and holidays)</p>
              <p>• Inquiry responses will be sent to your registered email within 24 hours</p>
              <p>• For urgent matters, please contact customer service (+82-2-1234-5678)</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }}>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InquiryList;
