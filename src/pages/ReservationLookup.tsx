
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Users, Mail, Phone, MapPin, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Reservation {
  reservationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  date: string;
  participants: string;
  specialRequests: string;
  tourTitle: string;
  tourPrice: number;
  totalAmount: number;
  bookingDate: string;
  status: string;
}

const ReservationLookup = () => {
  const [searchData, setSearchData] = useState({
    reservationNumber: "",
    email: ""
  });
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!searchData.reservationNumber || !searchData.email) {
      toast({
        title: "Missing Information",
        description: "Please enter both reservation number and email address",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const savedReservation = localStorage.getItem(`reservation_${searchData.reservationNumber}`);
      
      if (savedReservation) {
        const reservationData: Reservation = JSON.parse(savedReservation);
        
        // Check if email matches
        if (reservationData.email.toLowerCase() === searchData.email.toLowerCase()) {
          setReservation(reservationData);
          toast({
            title: "Reservation Found",
            description: "Your reservation details have been retrieved successfully",
          });
        } else {
          toast({
            title: "Invalid Information",
            description: "The email address doesn't match our records",
            variant: "destructive"
          });
          setReservation(null);
        }
      } else {
        toast({
          title: "Reservation Not Found",
          description: "No reservation found with the provided information",
          variant: "destructive"
        });
        setReservation(null);
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">KoreaTours</h1>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Reservation</h1>
          <p className="text-lg text-gray-600">
            Enter your reservation number and email address to view your booking details
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Find Your Reservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="reservationNumber">Reservation Number</Label>
                <Input
                  id="reservationNumber"
                  value={searchData.reservationNumber}
                  onChange={(e) => handleInputChange("reservationNumber", e.target.value)}
                  placeholder="e.g., KT12345678"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={searchData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#01c5fd' }}>
                {loading ? "Searching..." : "Find Reservation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reservation Details */}
        {reservation && (
          <div className="space-y-6">
            {/* Reservation Header */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">예약접수</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>예약번호 {reservation.reservationNumber}</span>
                <span>예약일 {new Date(reservation.bookingDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>상품 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&h=80&q=80"
                    alt="Tour"
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{reservation.tourTitle}</h3>
                    <p className="text-sm text-gray-600">상품코드: {reservation.reservationNumber}</p>
                  </div>
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{reservation.participants} Travelers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(reservation.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>결제정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>주문 금액</span>
                    <span>${reservation.totalAmount} USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span>상품금액</span>
                    </span>
                    <span>${reservation.totalAmount} USD</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold">총 결제금액</span>
                    <span className="text-lg font-bold">${reservation.totalAmount} USD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Service */}
            <Card>
              <CardHeader>
                <CardTitle>1:1 온라인 문의</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">평일 AM 10:00 - PM 06:00 주말 · 공휴일 휴무</p>
                  <Button variant="outline" size="sm" style={{ backgroundColor: '#01c5fd', color: 'white' }}>
                    1:1 문의하기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Name:</span>
                  <span>{reservation.firstName} {reservation.lastName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email:
                  </span>
                  <span className="text-right">{reservation.email}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Phone:
                  </span>
                  <span>{reservation.phone}</span>
                </div>
                
                {reservation.country && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Country:
                    </span>
                    <span>{reservation.country}</span>
                  </div>
                )}
                
                {reservation.specialRequests && (
                  <div>
                    <span className="font-semibold">Special Requests:</span>
                    <p className="text-sm text-gray-600 mt-1">{reservation.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cancel Button */}
            <div className="text-center">
              <Button variant="outline" size="sm" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
                취소 요청
              </Button>
            </div>
          </div>
        )}

        {/* Help Section - Only show when no reservation found */}
        {!reservation && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Can't find your reservation?</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Make sure you're using the exact reservation number and email address 
                    that was provided during booking.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contact Support</h4>
                  <p className="text-sm text-gray-600">
                    Email: support@koreatours.com<br />
                    Phone: +82-2-1234-5678<br />
                    Hours: 9:00 AM - 6:00 PM (KST)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }}>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationLookup;
