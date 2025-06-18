
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

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

interface ReservationHeaderProps {
  reservation: Reservation;
}

export const ReservationHeader = ({ reservation }: ReservationHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reservation Details</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            {reservation.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Booking Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Reservation Number:</span>
                <span className="font-medium">{reservation.reservationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Booking Date:</span>
                <span>{reservation.bookingDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tour Date:</span>
                <span>{reservation.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Participants:</span>
                <span>{reservation.participants} people</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Customer Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span>{reservation.firstName} {reservation.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{reservation.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{reservation.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span>{reservation.country}</span>
              </div>
            </div>
          </div>
        </div>
        
        {reservation.specialRequests && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-2">Special Requests</h4>
            <p className="text-sm text-gray-600">{reservation.specialRequests}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
