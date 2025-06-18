
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface ContactInfoProps {
  reservation: Reservation;
}

export const ContactInfo = ({ reservation }: ContactInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Primary Contact:</span>
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
      </CardContent>
    </Card>
  );
};
