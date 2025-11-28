'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import { format } from 'date-fns';

export default function PaymentPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '12/25',
    cvv: '123',
    holderName: 'John Doe',
  });

  useEffect(() => {
    const savedBookingData = localStorage.getItem('bookingData');
    if (savedBookingData) setBookingData(JSON.parse(savedBookingData));
    else router.push('/');
  }, [router]);

  const handlePayment = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    const reservationNumber = `KT${Date.now().toString().slice(-8)}`;
    const reservationData = {
      reservationNumber,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      email: bookingData.email,
      phone: bookingData.phone,
      country: bookingData.country || 'South Korea',
      date: bookingData.date || new Date().toISOString().split('T')[0],
      participants: (bookingData.adults + bookingData.children).toString(),
      specialRequests: bookingData.specialRequests || '',
      tourTitle: bookingData.tour.title,
      tourPrice: bookingData.tour.price,
      totalAmount: bookingData.totalAmount,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      ticketUser: bookingData.ticketUser,
      activityDetails: {
        duration: '8 hours (9:00 AM - 5:00 PM)',
        meetingPoint: 'Tour meeting point will be confirmed',
        meetingTime: '8:45 AM (Please arrive 15 minutes early)',
        inclusions: [
          'Professional English-speaking guide',
          'Transportation by air-conditioned vehicle',
          'Entrance fees to all attractions',
          'Traditional lunch included',
          'Hotel pickup and drop-off (selected hotels)',
        ],
        exclusions: [
          'Personal expenses',
          'Travel insurance',
          'Tips and gratuities',
          'Alcoholic beverages',
        ],
        requirements: [
          'Comfortable walking shoes required',
          'Weather-appropriate clothing',
          'Valid passport or ID required',
          'Moderate physical fitness required',
        ],
      },
    };
    localStorage.setItem(
      `reservation_${reservationNumber}`,
      JSON.stringify(reservationData),
    );
    localStorage.removeItem('bookingData');
    router.replace(`/reservation-details?reservation=${reservationNumber}`);
  };

  if (!bookingData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Back"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <Link href="/" className="flex items-center ml-auto md:ml-0">
            <span className="logo h-8 w-28" role="img" aria-label="TOURVIS" />
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Payment Method
                  </Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label
                        htmlFor="credit-card"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="h-5 w-5" />
                        Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem value="apple-pay" id="apple-pay" />
                      <Label
                        htmlFor="apple-pay"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Smartphone className="h-5 w-5" />
                        Apple Pay
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                {paymentMethod === 'credit-card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.cardNumber}
                        onChange={e =>
                          setCardInfo({
                            ...cardInfo,
                            cardNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={e =>
                            setCardInfo({
                              ...cardInfo,
                              expiryDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cardInfo.cvv}
                          onChange={e =>
                            setCardInfo({ ...cardInfo, cvv: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="holderName">Cardholder Name *</Label>
                      <Input
                        id="holderName"
                        placeholder="John Doe"
                        value={cardInfo.holderName}
                        onChange={e =>
                          setCardInfo({
                            ...cardInfo,
                            holderName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cancellation & Refund Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      Cancellation Policy
                    </h4>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      <li>• Cancel 24+ hours before tour: Free cancellation</li>
                      <li>• Cancel within 24 hours: 50% of tour fee</li>
                      <li>
                        • Same-day cancellation or no-show: 100% of tour fee
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={c => setAgreedToTerms(!!c)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the terms and conditions and cancellation
                      policy
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={handlePayment}
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-white"
              size="lg"
              disabled={!agreedToTerms}
            >
              Complete Payment
            </Button>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      bookingData.tour.image ||
                      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&h=80&q=80'
                    }
                    alt="Tour"
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-lg">
                      {bookingData.tour.title}
                    </h4>
                    <p className="text-gray-600">
                      Date:{' '}
                      {bookingData.date
                        ? format(new Date(bookingData.date), 'PPP')
                        : 'Date to be confirmed'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Product Price</span>
                    <span>${bookingData.tour.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{bookingData.adults + bookingData.children}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>${bookingData.totalAmount}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Name:</strong> {bookingData.firstName}{' '}
                  {bookingData.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {bookingData.email}
                </p>
                <p>
                  <strong>Phone:</strong> {bookingData.phone}
                </p>
                {bookingData.specialRequests && (
                  <p>
                    <strong>Special Requests:</strong>{' '}
                    {bookingData.specialRequests}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
