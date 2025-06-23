import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Phone, Mail, CreditCard } from "lucide-react";

const ReservationDetails = () => {
  // Mock reservation data
  const reservation = {
    confirmationNumber: "KT2024001234",
    status: "Confirmed",
    tourName: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    date: "2024-03-15",
    time: "03:00 AM",
    duration: "8 hours",
    participants: 2,
    totalAmount: 178,
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0123"
    },
    payment: {
      method: "Credit Card",
      lastFour: "1234",
      paidAt: "2024-02-20"
    },
    location: "Jeju, South Korea"
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
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-blue-600 font-medium">
                Reservations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Reservation Details</CardTitle>
            <Badge variant="secondary">{reservation.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-gray-700 font-medium">Confirmation Number</p>
              <p className="text-gray-500">{reservation.confirmationNumber}</p>
            </div>

            <div className="space-y-1">
              <p className="text-gray-700 font-medium">Tour Information</p>
              <p className="text-gray-500">{reservation.tourName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-gray-700 font-medium">Date</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {reservation.date}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-gray-700 font-medium">Time</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  {reservation.time} ({reservation.duration})
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-gray-700 font-medium">Participants</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <Users className="h-4 w-4" />
                  {reservation.participants}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-gray-700 font-medium">Location</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {reservation.location}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-gray-700 font-medium">Customer Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-gray-500">Name: {reservation.customer.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Email: {reservation.customer.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Phone: {reservation.customer.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-gray-700 font-medium">Payment Information</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-gray-500">Method: {reservation.payment.method}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Last Four Digits: ****-{reservation.payment.lastFour}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Paid At: {reservation.payment.paidAt}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-gray-700 font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">${reservation.totalAmount}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center">
          <Link to="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
