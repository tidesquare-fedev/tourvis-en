import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { ExternalLink, FileText, Info, Users, Calendar } from 'lucide-react';

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
  // 실제 상품 데이터 추가
  tour?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  selections?: Array<{
    optionTitle: string;
    timeslotTitle?: string;
    lines: Array<{ label: string; qty: number; unit: number }>;
    subtotal: number;
  }>;
  travelerText?: string;
  dateTimeText?: string;
  activityDetails?: {
    duration: string;
    meetingPoint: string;
    meetingTime: string;
    inclusions: string[];
    exclusions: string[];
    requirements: string[];
  };
}

interface ProductInfoProps {
  reservation: Reservation;
  hidePrice?: boolean;
}

export const ProductInfo = ({
  reservation,
  hidePrice = false,
}: ProductInfoProps) => {
  const formatNum = (n: number) =>
    new Intl.NumberFormat('en-US').format(Math.max(0, Number(n) || 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0">
            <img
              src={reservation.tour?.image || '/placeholder.svg'}
              alt={reservation.tour?.title || reservation.tourTitle}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {reservation.tour?.title || reservation.tourTitle}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              {reservation.dateTimeText ? (
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{reservation.dateTimeText}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Usage Date:</span>
                  <span>{reservation.date}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Participants:</span>
                <span>
                  {reservation.travelerText ||
                    `${reservation.participants} Travelers`}
                </span>
              </div>
              {!hidePrice && (
                <>
                  <div className="flex justify-between">
                    <span>Price per person:</span>
                    <span>${formatNum(reservation.tourPrice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                    <span>Total Amount:</span>
                    <span>${formatNum(reservation.totalAmount)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                href={`/tour/${reservation.tour?.id || '1'}`}
                className="flex-1 min-w-0"
              >
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </Link>

              {/* 옵션 정보 Dialog */}
              {reservation.selections && reservation.selections.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 min-w-0 text-xs"
                    >
                      <Info className="w-3 h-3 mr-1" />
                      Option Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Option Information</DialogTitle>
                    </DialogHeader>
                    <div className="px-2 sm:px-4 pb-6">
                      <div className="bg-white rounded-lg border p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                          <img
                            src={reservation.tour?.image || '/placeholder.svg'}
                            alt={
                              reservation.tour?.title || reservation.tourTitle
                            }
                            className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">
                              {reservation.tour?.title || reservation.tourTitle}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Usage Date: {reservation.date}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-4 border-t pt-4">
                          {reservation.selections.map((s, idx) => (
                            <div
                              key={idx}
                              className="border rounded-lg p-2 sm:p-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                                <span className="font-medium text-sm sm:text-base break-words">
                                  {s.optionTitle}
                                  {s.timeslotTitle
                                    ? ` • ${s.timeslotTitle}`
                                    : ''}
                                </span>
                              </div>
                              <div className="mt-2 space-y-1">
                                {s.lines.map((ln, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between text-xs sm:text-sm text-gray-700"
                                  >
                                    <span className="break-words">
                                      {ln.label}
                                    </span>
                                    <span className="flex-shrink-0 ml-2">
                                      x {ln.qty}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t mt-2">
                                <span className="text-xs sm:text-sm font-semibold">
                                  Subtotal
                                </span>
                                <span className="text-xs sm:text-sm font-bold">
                                  ${formatNum(s.subtotal)}
                                </span>
                              </div>
                            </div>
                          ))}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t gap-1 sm:gap-2">
                            <span className="text-base sm:text-lg font-semibold">
                              Total Product Amount
                            </span>
                            <div className="text-right">
                              <span className="text-base sm:text-lg font-bold">
                                ${formatNum(reservation.totalAmount)}
                              </span>
                              <br />
                              <span className="text-xs sm:text-sm font-normal text-gray-600">
                                ${formatNum(reservation.tourPrice)} per person
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Button
                variant="outline"
                size="sm"
                className="flex-1 min-w-0 text-xs"
              >
                <FileText className="w-3 h-3 mr-1" />
                View Voucher
              </Button>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0 text-xs"
                  >
                    <Info className="w-3 h-3 mr-1" />
                    Reservation Info
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-w-4xl mx-auto">
                  <DrawerHeader>
                    <DrawerTitle className="text-center">
                      Reservation Information
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Basic Reservation Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">
                          Reservation Number:
                        </span>
                        <p className="text-gray-600">
                          {reservation.reservationNumber}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>
                        <p className="text-green-600 font-medium">
                          {reservation.status}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">Booking Date:</span>
                        <p className="text-gray-600">
                          {reservation.bookingDate}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">Tour Date:</span>
                        <p className="text-gray-600">
                          {reservation.dateTimeText || reservation.date}
                        </p>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="border-t pt-4">
                      <span className="font-semibold text-sm">
                        Customer Information:
                      </span>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Name:</strong> {reservation.firstName}{' '}
                          {reservation.lastName}
                        </p>
                        <p>
                          <strong>Email:</strong> {reservation.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {reservation.phone}
                        </p>
                        <p>
                          <strong>Country:</strong> {reservation.country}
                        </p>
                        <p>
                          <strong>Participants:</strong>{' '}
                          {reservation.travelerText ||
                            `${reservation.participants} Travelers`}
                        </p>
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="border-t pt-4">
                      <span className="font-semibold text-sm">
                        Product Information:
                      </span>
                      <div className="mt-2 space-y-2 text-sm">
                        <div>
                          <strong>Tour Title:</strong>{' '}
                          {reservation.tour?.title || reservation.tourTitle}
                        </div>
                        <div>
                          <strong>Price per person:</strong> $
                          {formatNum(reservation.tourPrice)}
                        </div>
                        <div>
                          <strong>Total Amount:</strong> $
                          {formatNum(reservation.totalAmount)}
                        </div>
                        {reservation.selections &&
                          reservation.selections.length > 0 && (
                            <div>
                              <strong>Selected Options:</strong>
                              <ul className="list-disc list-inside ml-2 text-gray-600 mt-1">
                                {reservation.selections.map((s, idx) => (
                                  <li key={idx}>
                                    {s.optionTitle}
                                    {s.timeslotTitle
                                      ? ` • ${s.timeslotTitle}`
                                      : ''}{' '}
                                    - ${formatNum(s.subtotal)}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Activity Details */}
                    {reservation.activityDetails && (
                      <div className="border-t pt-4">
                        <span className="font-semibold text-sm">
                          Activity Details:
                        </span>
                        <div className="mt-2 space-y-3 text-sm">
                          <div>
                            <strong>Duration:</strong>{' '}
                            {reservation.activityDetails.duration}
                          </div>
                          <div>
                            <strong>Meeting Point:</strong>{' '}
                            {reservation.activityDetails.meetingPoint}
                          </div>
                          <div>
                            <strong>Meeting Time:</strong>{' '}
                            {reservation.activityDetails.meetingTime}
                          </div>

                          <div>
                            <strong>Inclusions:</strong>
                            <ul className="list-disc list-inside ml-2 text-gray-600">
                              {reservation.activityDetails.inclusions.map(
                                (item, index) => (
                                  <li key={index}>{item}</li>
                                ),
                              )}
                            </ul>
                          </div>

                          <div>
                            <strong>Exclusions:</strong>
                            <ul className="list-disc list-inside ml-2 text-gray-600">
                              {reservation.activityDetails.exclusions.map(
                                (item, index) => (
                                  <li key={index}>{item}</li>
                                ),
                              )}
                            </ul>
                          </div>

                          <div>
                            <strong>Requirements:</strong>
                            <ul className="list-disc list-inside ml-2 text-gray-600">
                              {reservation.activityDetails.requirements.map(
                                (item, index) => (
                                  <li key={index}>{item}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Special Requests */}
                    {reservation.specialRequests && (
                      <div className="border-t pt-4">
                        <span className="font-semibold text-sm">
                          Special Requests:
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {reservation.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
