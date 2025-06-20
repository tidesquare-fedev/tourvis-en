
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Info } from "lucide-react";

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
  hidePrice?: boolean;
}

export const ProductInfo = ({ reservation, hidePrice = false }: ProductInfoProps) => {
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
                <span>Usage Date:</span>
                <span>{reservation.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>{reservation.participants} Travelers</span>
              </div>
              {!hidePrice && (
                <>
                  <div className="flex justify-between">
                    <span>Price per person:</span>
                    <span>${reservation.tourPrice}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>${reservation.totalAmount}</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Link to="/tour/1" className="flex-1 min-w-0">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </Link>
              
              <Button variant="outline" size="sm" className="flex-1 min-w-0 text-xs">
                <FileText className="w-3 h-3 mr-1" />
                View Voucher
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 min-w-0 text-xs">
                    <Info className="w-3 h-3 mr-1" />
                    Reservation Info
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reservation Information</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Reservation Number:</span>
                        <p className="text-gray-600">{reservation.reservationNumber}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>
                        <p className="text-green-600 font-medium">{reservation.status}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Booking Date:</span>
                        <p className="text-gray-600">{reservation.bookingDate}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Tour Date:</span>
                        <p className="text-gray-600">{reservation.date}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <span className="font-semibold text-sm">Customer Information:</span>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p><strong>Name:</strong> {reservation.firstName} {reservation.lastName}</p>
                        <p><strong>Email:</strong> {reservation.email}</p>
                        <p><strong>Phone:</strong> {reservation.phone}</p>
                        <p><strong>Country:</strong> {reservation.country}</p>
                      </div>
                    </div>
                    
                    {reservation.specialRequests && (
                      <div className="border-t pt-4">
                        <span className="font-semibold text-sm">Special Requests:</span>
                        <p className="text-sm text-gray-600 mt-1">{reservation.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
