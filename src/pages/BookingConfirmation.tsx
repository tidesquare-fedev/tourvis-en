
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Users, Mail, Phone, MapPin, Clock } from "lucide-react";
import { ProductInfo } from "@/components/reservation/ProductInfo";

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

// Enhanced mock data with activity details
const createMockReservation = (reservationNumber: string): Reservation => ({
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
});

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  
  useEffect(() => {
    const reservationNumber = searchParams.get('reservation');
    if (reservationNumber) {
      // Try to get from localStorage first
      const savedReservation = localStorage.getItem(`reservation_${reservationNumber}`);
      if (savedReservation) {
        const parsedReservation = JSON.parse(savedReservation);
        // Enhance with activity details if not present
        if (!parsedReservation.activityDetails) {
          parsedReservation.activityDetails = createMockReservation(reservationNumber).activityDetails;
        }
        setReservation(parsedReservation);
      } else {
        // Create mock reservation with full details
        const mockReservation = createMockReservation(reservationNumber);
        setReservation(mockReservation);
        // Save to localStorage for consistency
        localStorage.setItem(`reservation_${reservationNumber}`, JSON.stringify(mockReservation));
      }
    }
  }, [searchParams]);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Reservation not found</p>
            <Link to="/">
              <Button className="mt-4">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive and Sticky */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <img 
              src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
              alt="Korea Tours" 
              className="h-6 sm:h-8"
            />
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Check Reservation
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Success Message - Responsive */}
        <div className="text-center mb-6 sm:mb-8">
          <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-base sm:text-lg text-gray-600">
            Thank you for booking with KoreaTours. Your reservation has been confirmed.
          </p>
        </div>

        <div className="space-y-6">
          {/* Product Information with all interactive elements */}
          <ProductInfo reservation={reservation} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Reservation Details - Responsive */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Reservation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm sm:text-base">Reservation Number:</span>
                  <Badge variant="outline" className="text-sm sm:text-lg px-2 sm:px-3 py-1">
                    {reservation.reservationNumber}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold text-sm sm:text-base">Status:</span>
                  <Badge className="bg-green-500 text-xs sm:text-sm">Confirmed</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold text-sm sm:text-base">Booking Date:</span>
                  <span className="text-sm sm:text-base">{new Date(reservation.bookingDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold text-sm sm:text-base">Tour Date:</span>
                  <span className="text-sm sm:text-base">{new Date(reservation.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold text-sm sm:text-base">Participants:</span>
                  <span className="text-sm sm:text-base">{reservation.participants} person(s)</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm sm:text-base">Tour:</span>
                  <span className="text-right max-w-xs text-sm sm:text-base">{reservation.tourTitle}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information - Responsive */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm sm:text-base">Name:</span>
                  <span className="text-sm sm:text-base">{reservation.firstName} {reservation.lastName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center text-sm sm:text-base">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Email:
                  </span>
                  <span className="text-right text-sm sm:text-base break-all">{reservation.email}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center text-sm sm:text-base">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Phone:
                  </span>
                  <span className="text-sm sm:text-base">{reservation.phone}</span>
                </div>
                
                {reservation.country && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold flex items-center text-sm sm:text-base">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Country:
                    </span>
                    <span className="text-sm sm:text-base">{reservation.country}</span>
                  </div>
                )}
                
                {reservation.specialRequests && (
                  <div>
                    <span className="font-semibold text-sm sm:text-base">Special Requests:</span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{reservation.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary - Responsive */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>${reservation.tourPrice} × {reservation.participants} person(s)</span>
                  <span>${reservation.totalAmount}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total Amount</span>
                  <span className="text-blue-600">${reservation.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information - Responsive */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">What's Next?</h4>
              <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                <li>• A confirmation email has been sent to {reservation.email}</li>
                <li>• Please arrive at the meeting point 15 minutes before departure</li>
                <li>• Bring comfortable hiking shoes and weather-appropriate clothing</li>
                <li>• Contact us if you need to make any changes to your booking</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">Cancellation Policy</h4>
              <p className="text-xs sm:text-sm text-yellow-700">
                Free cancellation up to 24 hours before the tour start time. 
                Contact us at info@koreatours.com for cancellations or changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Responsive */}
        <div className="text-center mt-6 sm:mt-8 space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row sm:justify-center">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">Book Another Tour</Button>
          </Link>
          <Link to="/reservation-lookup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto text-sm sm:text-base">Check Reservation Status</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
