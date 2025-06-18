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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">내 문의 내역</h1>
            <p className="text-base sm:text-lg text-gray-600">
              1:1 문의 내역을 확인하고 관리하세요
            </p>
          </div>
          <Link to="/inquiry">
            <Button className="flex items-center space-x-2 w-full sm:w-auto" style={{ backgroundColor: '#01c5fd' }}>
              <Plus className="w-4 h-4" />
              <span>새 문의하기</span>
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
                        <p>문의 번호: {inquiry.id}</p>
                        <p>카테고리: {inquiry.category}</p>
                        <p>작성일: {inquiry.createdAt}</p>
                        {inquiry.lastReply && (
                          <p>최근 답변: {inquiry.lastReply}</p>
                        )}
                      </div>
                    </div>
                    <Link to={`/inquiry-detail/${inquiry.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        상세보기
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 문의가 없습니다</h3>
                <p className="text-gray-600 mb-4">
                  궁금한 것이 있으시면 언제든지 문의해 주세요.
                </p>
                <Link to="/inquiry">
                  <Button style={{ backgroundColor: '#01c5fd' }}>
                    첫 문의하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section - Responsive */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">문의 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 운영시간: 평일 오전 10:00 - 오후 06:00 (주말 및 공휴일 휴무)</p>
              <p>• 문의 답변은 등록된 이메일로 24시간 내에 발송됩니다</p>
              <p>• 긴급한 사항은 고객센터로 연락해 주세요 (+82-2-1234-5678)</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 sm:mt-8">
          <Link to="/">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }} className="w-full sm:w-auto">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InquiryList;
