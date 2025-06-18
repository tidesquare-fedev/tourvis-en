
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

interface ProductInfoProps {
  reservation: Reservation;
}

export const ProductInfo = ({ reservation }: ProductInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0">
            <img 
              src="/placeholder.svg" 
              alt={reservation.tourTitle}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{reservation.tourTitle}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Price per person:</span>
                <span>${reservation.tourPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>{reservation.participants} people</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                <span>Total Amount:</span>
                <span>${reservation.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
