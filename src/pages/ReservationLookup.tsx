import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ReservationHeader } from "@/components/reservation/ReservationHeader";
import { ProductInfo } from "@/components/reservation/ProductInfo";
import { PaymentInfo } from "@/components/reservation/PaymentInfo";
import { CustomerService } from "@/components/reservation/CustomerService";

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

// Mock data for testing
const mockReservation: Reservation = {
  reservationNumber: "KT12345678",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1-555-123-4567",
  country: "United States",
  date: "2024-07-15",
  participants: "2",
  specialRequests: "Vegetarian meals preferred",
  tourTitle: "Seoul City Highlights Tour",
  tourPrice: 150,
  totalAmount: 300,
  bookingDate: "2024-06-15",
  status: "Confirmed"
};

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

    // Always show mock reservation data for testing
    setTimeout(() => {
      setReservation(mockReservation);
      toast({
        title: "Reservation Found",
        description: "Your reservation details have been retrieved successfully",
      });
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
            {/* 예약 내역 헤더 */}
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">예약 내역</h2>
              <div className="text-gray-600">
                <p>예약번호: {reservation.reservationNumber}</p>
                <p>예약일: {reservation.bookingDate}</p>
              </div>
            </div>

            <ProductInfo reservation={reservation} hidePrice={true} />
            <PaymentInfo reservation={reservation} />
            <CustomerService />

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
