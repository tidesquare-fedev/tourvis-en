
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Users, Mail, Phone, MapPin, Clock } from "lucide-react";

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

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  
  useEffect(() => {
    const reservationNumber = searchParams.get('reservation');
    if (reservationNumber) {
      const savedReservation = localStorage.getItem(`reservation_${reservationNumber}`);
      if (savedReservation) {
        setReservation(JSON.parse(savedReservation));
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">KoreaTours</h1>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
              Check Reservation
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for booking with KoreaTours. Your reservation has been confirmed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Reservation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Reservation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Reservation Number:</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {reservation.reservationNumber}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <Badge className="bg-green-500">Confirmed</Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold">Booking Date:</span>
                <span>{new Date(reservation.bookingDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold">Tour Date:</span>
                <span>{new Date(reservation.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold">Participants:</span>
                <span>{reservation.participants} person(s)</span>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="font-semibold">Tour:</span>
                <span className="text-right max-w-xs">{reservation.tourTitle}</span>
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

          {/* Payment Summary */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>${reservation.tourPrice} × {reservation.participants} person(s)</span>
                  <span>${reservation.totalAmount}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-blue-600">${reservation.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• A confirmation email has been sent to {reservation.email}</li>
                <li>• Please arrive at the meeting point 15 minutes before departure</li>
                <li>• Bring comfortable hiking shoes and weather-appropriate clothing</li>
                <li>• Contact us if you need to make any changes to your booking</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Cancellation Policy</h4>
              <p className="text-sm text-yellow-700">
                Free cancellation up to 24 hours before the tour start time. 
                Contact us at info@koreatours.com for cancellations or changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <Link to="/">
            <Button variant="outline">Book Another Tour</Button>
          </Link>
          <Link to="/reservation-lookup">
            <Button>Check Reservation Status</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
