
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { ProductInfo } from "@/components/reservation/ProductInfo";
import { PaymentInfo } from "@/components/reservation/PaymentInfo";
import { CustomerService } from "@/components/reservation/CustomerService";
import { useEffect, useState } from "react";

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
  activityDetails: {
    duration: string;
    meetingPoint: string;
    meetingTime: string;
    inclusions: string[];
    exclusions: string[];
    requirements: string[];
  };
}

const ReservationDetails = () => {
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const reservationNumber = searchParams.get('reservation');
    if (reservationNumber) {
      // Try to get from localStorage first
      const savedReservation = localStorage.getItem(`reservation_${reservationNumber}`);
      if (savedReservation) {
        setReservation(JSON.parse(savedReservation));
      } else {
        // Fallback to mock data if not found
        const mockReservation: Reservation = {
          reservationNumber,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "+82-10-1234-5678",
          country: "South Korea",
          date: "2024-07-15",
          participants: "2",
          specialRequests: "Vegetarian meals preferred",
          tourTitle: "Seoul City Highlights Tour",
          tourPrice: 150,
          totalAmount: 300,
          bookingDate: new Date().toISOString().split('T')[0],
          status: "Confirmed",
          activityDetails: {
            duration: "8 hours (9:00 AM - 5:00 PM)",
            meetingPoint: "Myeongdong Station Exit 6",
            meetingTime: "8:45 AM (Please arrive 15 minutes early)",
            inclusions: [
              "Professional English-speaking guide",
              "Transportation by air-conditioned vehicle",
              "Entrance fees to all attractions",
              "Traditional Korean lunch",
              "Hotel pickup and drop-off (selected hotels)"
            ],
            exclusions: [
              "Personal expenses",
              "Travel insurance",
              "Tips and gratuities",
              "Alcoholic beverages"
            ],
            requirements: [
              "Comfortable walking shoes required",
              "Weather-appropriate clothing",
              "Valid passport or ID required",
              "Moderate physical fitness required"
            ]
          }
        };
        setReservation(mockReservation);
      }
    } else {
      // If no reservation number, use mock data with default number
      const mockReservation: Reservation = {
        reservationNumber: "KT12345678",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+82-10-1234-5678",
        country: "South Korea",
        date: "2024-07-15",
        participants: "2",
        specialRequests: "Vegetarian meals preferred",
        tourTitle: "Seoul City Highlights Tour",
        tourPrice: 150,
        totalAmount: 300,
        bookingDate: new Date().toISOString().split('T')[0],
        status: "Confirmed",
        activityDetails: {
          duration: "8 hours (9:00 AM - 5:00 PM)",
          meetingPoint: "Myeongdong Station Exit 6",
          meetingTime: "8:45 AM (Please arrive 15 minutes early)",
          inclusions: [
            "Professional English-speaking guide",
            "Transportation by air-conditioned vehicle",
            "Entrance fees to all attractions",
            "Traditional Korean lunch",
            "Hotel pickup and drop-off (selected hotels)"
          ],
          exclusions: [
            "Personal expenses",
            "Travel insurance",
            "Tips and gratuities",
            "Alcoholic beverages"
          ],
          requirements: [
            "Comfortable walking shoes required",
            "Weather-appropriate clothing",
            "Valid passport or ID required",
            "Moderate physical fitness required"
          ]
        }
      };
      setReservation(mockReservation);
    }
  }, [searchParams]);

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive and Sticky */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Reservation History Header - Responsive */}
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Reservation Details</h2>
            <div className="text-sm sm:text-base text-gray-600">
              <p>Reservation Number: {reservation.reservationNumber}</p>
              <p>Booking Date: {reservation.bookingDate}</p>
            </div>
          </div>

          <ProductInfo reservation={reservation} hidePrice={true} />
          <PaymentInfo reservation={reservation} />
          <CustomerService />

          {/* Cancel Button - Responsive */}
          <div className="text-center">
            <Button variant="outline" size="sm" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }} className="w-full sm:w-auto text-xs sm:text-sm">
              Request Cancellation
            </Button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Link to="/reservation-lookup">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }} className="w-full sm:w-auto text-sm sm:text-base">
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
