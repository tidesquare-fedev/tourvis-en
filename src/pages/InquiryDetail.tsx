
import { useParams, Link } from "react-router-dom";
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

// Mock data for inquiry details
const mockInquiryDetails: { [key: string]: InquiryDetail } = {
  "INQ001": {
    id: "INQ001",
    subject: "Question about tour cancellation policy",
    category: "Cancellation/Refund",
    status: "answered",
    createdAt: "2024-06-15",
    message: "Hello, I would like to know about the cancellation policy for the Seoul City Tour I booked for next week. What are the refund terms if I need to cancel due to unexpected circumstances? Thank you.",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-123-4567",
    reply: {
      message: "Hello John, Thank you for your inquiry. For the Seoul City Tour, you can cancel up to 24 hours before the tour start time for a full refund. Cancellations made within 24 hours will receive a 50% refund. In case of extreme weather or other circumstances beyond our control, we offer full refunds or rescheduling options. Please let us know if you have any other questions.",
      repliedAt: "2024-06-16",
      repliedBy: "Customer Service Team"
    }
  },
  "INQ002": {
    id: "INQ002",
    subject: "Dietary restrictions for Seoul food tour",
    category: "Product Inquiry",
    status: "pending",
    createdAt: "2024-06-18",
    message: "Hi, I have booked the Seoul Food Tour for next month. I have severe allergies to shellfish and nuts. Can you please confirm if the tour can accommodate these dietary restrictions? I want to make sure I can safely participate in all the food tastings. Looking forward to your response.",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1-555-987-6543"
  },
  "INQ003": {
    id: "INQ003",
    subject: "Change reservation date request",
    category: "Reservation Change",
    status: "closed",
    createdAt: "2024-06-10",
    message: "I need to change my reservation date for the Busan Beach Tour from June 20th to June 27th due to a schedule conflict. Is this possible? My reservation number is RES123456. Please let me know the process and any additional fees.",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    reply: {
      message: "Hello Mike, We have successfully changed your reservation from June 20th to June 27th. There are no additional fees for this change as it was requested more than 48 hours in advance. Your new confirmation number is RES123789. Please save this for your records. Have a great trip!",
      repliedAt: "2024-06-12",
      repliedBy: "Reservation Team"
    }
  }
};

const InquiryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const inquiry = id ? mockInquiryDetails[id] : null;

  if (!inquiry) {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Inquiry Not Found</h2>
              <p className="text-gray-600 mb-4">The inquiry you're looking for doesn't exist.</p>
              <Link to="/inquiry-list">
                <Button>Back to Inquiry List</Button>
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
        <div className="flex items-center mb-6">
          <Link to="/inquiry-list" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiry Details</h1>
            <p className="text-lg text-gray-600">
              View your inquiry and responses
            </p>
          </div>
        </div>

        {/* Inquiry Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-3">
                  <span>{inquiry.subject}</span>
                  <Badge className={getStatusColor(inquiry.status)}>
                    {getStatusText(inquiry.status)}
                  </Badge>
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Inquiry ID:</strong> {inquiry.id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {inquiry.category}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Created:</strong> {inquiry.createdAt}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Name:</strong> {inquiry.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {inquiry.email}
                </p>
                {inquiry.phone && (
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {inquiry.phone}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Original Inquiry */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Your Inquiry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{inquiry.message}</p>
          </CardContent>
        </Card>

        {/* Reply Section */}
        {inquiry.reply ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Our Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-gray-700 leading-relaxed mb-3">{inquiry.reply.message}</p>
                <div className="text-sm text-gray-600">
                  <p><strong>Replied by:</strong> {inquiry.reply.repliedBy}</p>
                  <p><strong>Replied on:</strong> {inquiry.reply.repliedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiting for Response</h3>
              <p className="text-gray-600">
                We have received your inquiry and will respond within 24 hours.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link to="/inquiry-list">
            <Button variant="outline">Back to Inquiry List</Button>
          </Link>
          <Link to="/inquiry">
            <Button style={{ backgroundColor: '#01c5fd' }}>Make New Inquiry</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
