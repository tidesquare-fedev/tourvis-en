import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MapPin, Calendar, Users } from "lucide-react";

const BookingConfirmation = () => {
  const bookingDetails = {
    confirmationNumber: "KT2024001234",
    tourName: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    date: "2024-03-15",
    participants: 2,
    totalAmount: 178,
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "+1-555-0123"
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

      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2 space-x-2">
            <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
            <CardTitle className="text-2xl font-bold tracking-tight">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <h2 className="text-lg font-semibold">Thank you, {bookingDetails.customerName}!</h2>
              <p className="text-gray-600">Your booking has been successfully confirmed. Here are your booking details:</p>
            </div>

            <div className="grid gap-2">
              <div className="font-semibold">Confirmation Number:</div>
              <div className="text-gray-600">{bookingDetails.confirmationNumber}</div>
            </div>

            <div className="grid gap-2">
              <div className="font-semibold">Tour Name:</div>
              <div className="text-gray-600">{bookingDetails.tourName}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div className="font-semibold">Date:</div>
                </div>
                <div className="text-gray-600">{bookingDetails.date}</div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div className="font-semibold">Participants:</div>
                </div>
                <div className="text-gray-600">{bookingDetails.participants}</div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="font-semibold">Total Amount:</div>
              <div className="text-green-600 font-bold text-xl">${bookingDetails.totalAmount}</div>
            </div>

            <div className="grid gap-2">
              <div className="font-semibold">Contact Information:</div>
              <div className="text-gray-600">
                Email: {bookingDetails.customerEmail}
                <br />
                Phone: {bookingDetails.customerPhone}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="font-semibold">What's Next?</div>
              <p className="text-gray-600">
                You will receive a detailed email with your booking confirmation and tour details.
                Please check your email for further instructions.
              </p>
            </div>

            <div className="flex justify-between">
              <Link to="/">
                <Button variant="secondary">Go to Homepage</Button>
              </Link>
              <Link to="/reservation-lookup">
                <Button>View Reservation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingConfirmation;
