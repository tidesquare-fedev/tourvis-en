
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex justify-between items-center">
              <img 
                src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
                alt="KoreaTours" 
                className="h-6 sm:h-8"
              />
              <nav className="flex items-center space-x-3 sm:space-x-6">
                <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">홈</Link>
                <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">예약 확인</Link>
              </nav>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">문의를 찾을 수 없습니다</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">요청하신 문의가 존재하지 않습니다.</p>
              <Link to="/inquiry-list">
                <Button className="w-full sm:w-auto">문의 목록으로 돌아가기</Button>
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
        return "대기중";
      case "answered":
        return "답변완료";
      case "closed":
        return "종료";
      default:
        return "알 수 없음";
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
              <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">홈</Link>
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">예약 확인</Link>
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
              목록으로
            </Button>
          </Link>
          <div className="order-2 sm:order-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">문의 상세</h1>
            <p className="text-base sm:text-lg text-gray-600">
              문의 내용과 답변을 확인하세요
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
                  <strong>문의 번호:</strong> {inquiry.id}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>카테고리:</strong> {inquiry.category}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>작성일:</strong> {inquiry.createdAt}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>이름:</strong> {inquiry.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 break-all">
                  <strong>이메일:</strong> {inquiry.email}
                </p>
                {inquiry.phone && (
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong>전화번호:</strong> {inquiry.phone}
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
              내 문의 내용
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
                답변
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 break-words">{inquiry.reply.message}</p>
                <div className="text-xs sm:text-sm text-gray-600">
                  <p><strong>답변자:</strong> {inquiry.reply.repliedBy}</p>
                  <p><strong>답변일:</strong> {inquiry.reply.repliedAt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-4 sm:mb-6">
            <CardContent className="p-6 sm:p-8 text-center">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">답변 대기중</h3>
              <p className="text-sm sm:text-base text-gray-600">
                문의를 접수했습니다. 24시간 내에 답변드리겠습니다.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/inquiry-list" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">문의 목록으로</Button>
          </Link>
          <Link to="/inquiry" className="w-full sm:w-auto">
            <Button style={{ backgroundColor: '#01c5fd' }} className="w-full sm:w-auto">새 문의하기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
