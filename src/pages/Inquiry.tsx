
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";

const Inquiry = () => {
  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "문의가 접수되었습니다",
        description: "24시간 내에 답변드리겠습니다.",
      });
      setLoading(false);
      // Reset form
      setInquiryData({
        name: "",
        email: "",
        phone: "",
        category: "",
        subject: "",
        message: ""
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setInquiryData(prev => ({ ...prev, [field]: value }));
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4">
          <Link to="/inquiry-list" className="order-1 sm:order-1">
            <Button variant="ghost" size="sm" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          </Link>
          <div className="order-2 sm:order-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">1:1 온라인 문의</h1>
            <p className="text-base sm:text-lg text-gray-600">
              궁금한 것이 있으시면 언제든지 문의해 주세요
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              문의하기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">이름 *</Label>
                  <Input
                    id="name"
                    value={inquiryData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="홍길동"
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inquiryData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm sm:text-base">전화번호</Label>
                <Input
                  id="phone"
                  value={inquiryData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="010-1234-5678"
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm sm:text-base">문의 유형 *</Label>
                <Select value={inquiryData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="문의 유형을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reservation">예약 문의</SelectItem>
                    <SelectItem value="cancel">취소/환불 문의</SelectItem>
                    <SelectItem value="change">예약 변경 문의</SelectItem>
                    <SelectItem value="product">상품 문의</SelectItem>
                    <SelectItem value="other">기타 문의</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-sm sm:text-base">제목 *</Label>
                <Input
                  id="subject"
                  value={inquiryData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="문의 제목을 입력해주세요"
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm sm:text-base">내용 *</Label>
                <Textarea
                  id="message"
                  value={inquiryData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="문의 내용을 자세히 작성해주세요"
                  rows={6}
                  required
                  className="text-sm sm:text-base"
                />
              </div>
              
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>
                {loading ? "문의 접수 중..." : "문의 접수"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Section - Responsive */}
        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">문의 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <p>• 운영시간: 평일 오전 10:00 - 오후 06:00 (주말 및 공휴일 휴무)</p>
              <p>• 문의 답변은 등록된 이메일로 24시간 내에 발송됩니다</p>
              <p>• 긴급한 사항은 고객센터로 연락해 주세요 (+82-2-1234-5678)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inquiry;
