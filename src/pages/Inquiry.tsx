
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
        title: "Inquiry has been submitted",
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

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/reservation-lookup" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">1:1 Online Inquiry</h1>
            <p className="text-lg text-gray-600">
              Please feel free to contact us with any questions
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Make Inquiry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={inquiryData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={inquiryData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1-555-123-4567"
                />
              </div>

              <div>
                <Label htmlFor="category">Inquiry Type *</Label>
                <Select value={inquiryData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
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
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={inquiryData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Please enter inquiry subject"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={inquiryData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please write your inquiry in detail"
                  rows={6}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>
                {loading ? "Submitting Inquiry..." : "Submit Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
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
      </div>
    </div>
  );
};

export default Inquiry;
