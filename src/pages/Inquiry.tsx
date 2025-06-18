
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
        description: "24시간 내에 답변 드리겠습니다.",
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">KoreaTours</h1>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">Reservation</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/reservation-lookup" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">1:1 온라인 문의</h1>
            <p className="text-lg text-gray-600">
              궁금한 사항이 있으시면 언제든 문의해주세요
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              문의하기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    value={inquiryData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="홍길동"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={inquiryData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  value={inquiryData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>

              <div>
                <Label htmlFor="category">문의 유형 *</Label>
                <Select value={inquiryData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
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
                <Label htmlFor="subject">제목 *</Label>
                <Input
                  id="subject"
                  value={inquiryData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="문의 제목을 입력해주세요"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">문의 내용 *</Label>
                <Textarea
                  id="message"
                  value={inquiryData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="문의 내용을 자세히 작성해주세요"
                  rows={6}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>
                {loading ? "문의 접수 중..." : "문의하기"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>문의 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 평일 AM 10:00 - PM 06:00 (주말 · 공휴일 휴무)</p>
              <p>• 문의 답변은 접수 후 24시간 이내에 등록하신 이메일로 회신됩니다</p>
              <p>• 긴급한 사항은 고객센터 전화(+82-2-1234-5678)로 문의해주세요</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inquiry;
