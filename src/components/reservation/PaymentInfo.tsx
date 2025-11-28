import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface PaymentInfoProps {
  reservation: Reservation;
}

export const PaymentInfo = ({ reservation }: PaymentInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Status:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span>Credit Card</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-sm">
              TXN-{reservation.reservationNumber}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-4 border-t">
            <span>Total Paid:</span>
            <span>${reservation.totalAmount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
