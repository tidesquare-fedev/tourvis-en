
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
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

const ReservationDetails = () => {
  const reservation = mockReservation;

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Reservation History Header */}
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation History</h2>
            <div className="text-gray-600">
              <p>Reservation Number: {reservation.reservationNumber}</p>
              <p>Booking Date: {reservation.bookingDate}</p>
            </div>
          </div>

          <ProductInfo reservation={reservation} hidePrice={true} />
          <PaymentInfo reservation={reservation} />
          <CustomerService />

          {/* Cancel Button */}
          <div className="text-center">
            <Button variant="outline" size="sm" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}>
              Cancel Request
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/reservation-lookup">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }}>Back to Search</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
