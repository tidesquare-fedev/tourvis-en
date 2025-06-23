import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReservationHeader } from "@/components/reservation/ReservationHeader";
import { ProductInfo } from "@/components/reservation/ProductInfo";
import { ContactInfo } from "@/components/reservation/ContactInfo";
import { PaymentInfo } from "@/components/reservation/PaymentInfo";
import { CustomerService } from "@/components/reservation/CustomerService";

const BookingInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participants: 1,
    date: "",
    requests: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process booking
    navigate("/booking-confirmation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <img 
                src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
                alt="Korea Tours" 
                className="h-6 sm:h-8"
              />
            </Link>
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link to="/products" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Tours
              </Link>
              <Link to="/inquiry-list" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Direct Inquiry
              </Link>
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Reservations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <ReservationHeader />

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Tour Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductInfo />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactInfo />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentInfo />
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="requests">Requests</Label>
                <Textarea
                  id="requests"
                  placeholder="Any special requests?"
                  value={formData.requests}
                  onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                />
              </div>
              <Button type="submit">Book Now</Button>
            </form>
          </CardContent>
        </Card>

        <CustomerService />
      </div>
    </div>
  );
};

export default BookingInfo;
