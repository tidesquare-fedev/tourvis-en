
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
        title: "Inquiry Submitted",
        description: "We will respond within 24 hours.",
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
              <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Check Reservation</Link>
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
              Back
            </Button>
          </Link>
          <div className="order-2 sm:order-2 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Direct Inquiry</h1>
            <p className="text-base sm:text-lg text-gray-600">
              If you have any questions, feel free to contact us anytime
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Make Inquiry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                  <Input
                    id="name"
                    value={inquiryData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
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
                <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                <Input
                  id="phone"
                  value={inquiryData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="010-1234-5678"
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm sm:text-base">Inquiry Type *</Label>
                <Select value={inquiryData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Please select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reservation">Reservation Inquiry</SelectItem>
                    <SelectItem value="cancel">Cancellation/Refund Inquiry</SelectItem>
                    <SelectItem value="change">Reservation Change Inquiry</SelectItem>
                    <SelectItem value="product">Product Inquiry</SelectItem>
                    <SelectItem value="other">Other Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-sm sm:text-base">Subject *</Label>
                <Input
                  id="subject"
                  value={inquiryData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Please enter inquiry subject"
                  required
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm sm:text-base">Message *</Label>
                <Textarea
                  id="message"
                  value={inquiryData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please describe your inquiry in detail"
                  rows={6}
                  required
                  className="text-sm sm:text-base"
                />
              </div>
              
              <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>
                {loading ? "Submitting Inquiry..." : "Submit Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Section - Responsive */}
        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Inquiry Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs sm:text-sm text-gray-600">
              <p>• Business Hours: Weekdays 10:00 AM - 06:00 PM (Closed on weekends and holidays)</p>
              <p>• Inquiry responses are sent to your registered email within 24 hours</p>
              <p>• For urgent matters, please contact our customer service (+82-2-1234-5678)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inquiry;
