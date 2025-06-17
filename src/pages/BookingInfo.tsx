
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const BookingInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tourId = searchParams.get('tour');
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    adults: 1,
    children: 0,
    specialRequests: ""
  });

  // Mock tour data - in real app, fetch based on tourId
  const tour = {
    id: tourId || "jeju-hallasan-hiking",
    title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    price: 89
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store booking data in localStorage to pass to payment page
    localStorage.setItem("bookingData", JSON.stringify({
      ...formData,
      tour: tour,
      totalAmount: tour.price * (formData.adults + formData.children)
    }));
    
    navigate("/payment");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
              alt="Korea Tours" 
              className="h-8"
            />
          </Link>
          <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
            Check Reservation
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Information</h1>
          <p className="text-gray-600">Please enter your information and preferences for the booking.</p>
        </div>

        {/* Product Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&h=80&q=80"
                alt="Tour"
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{tour.title}</h3>
                <p className="text-sm text-gray-600">Scheduled Date: Friday, July 18, 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Traveler Information */}
          <Card>
            <CardHeader>
              <CardTitle>Traveler Information *</CardTitle>
              <p className="text-sm text-gray-600">Enter your name and contact information for booking confirmation.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="travelerName">Traveler Name</Label>
                <Input
                  id="travelerName"
                  placeholder="LEEBAEKDAHEOSTO"
                  value={`${formData.firstName} ${formData.lastName}`.trim()}
                  onChange={(e) => {
                    const names = e.target.value.split(' ');
                    handleInputChange("firstName", names[0] || "");
                    handleInputChange("lastName", names.slice(1).join(' '));
                  }}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="HONG"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="GILDONG"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-5042-5138"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="lkil@tidesquare.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Be careful to write accurately when entering your reservation.</p>
                <p className="text-sm text-gray-600">• Please provide accurate contact information for smooth reservation.</p>
                <p className="text-sm text-gray-600">• Reservation information cannot be changed arbitrarily after reservation.</p>
              </div>
              
              <div>
                <Label htmlFor="specialRequests">Please enter the details you want to inform the business.</Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  placeholder="업체에 요청하실 내용을 입력해 주세요."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center pt-4">
            <p className="text-sm text-gray-500 mb-4">Are you ready for the best experience?</p>
          </div>
          
          <Button type="submit" className="w-full bg-cyan-400 hover:bg-cyan-500 text-white" size="lg">
            Next
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingInfo;
