import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react";

interface BookingData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  participants: string;
  requests?: string;
  tour: {
    id: string;
    title: string;
    price: number;
  };
  totalAmount: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const savedData = sessionStorage.getItem('bookingData');
    if (savedData) {
      setBookingData(JSON.parse(savedData));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handlePayment = () => {
    if (!agreed) {
      alert("Please agree to the terms and conditions");
      return;
    }
    
    // Generate reservation number
    const reservationNumber = `KT${Date.now().toString().slice(-8)}`;
    
    // Create reservation object
    const reservation = {
      reservationNumber,
      ...bookingData,
      bookingDate: new Date().toISOString(),
      status: "confirmed"
    };
    
    // Store in localStorage
    localStorage.setItem(`reservation_${reservationNumber}`, JSON.stringify(reservation));
    
    // Navigate to confirmation page
    navigate(`/booking-confirmation?reservation=${reservationNumber}`);
  };

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <img 
            src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
            alt="Korea Tours" 
            className="h-8"
          />
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
              Check Reservation
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Booking
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{bookingData.tour.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tour Date:</span>
                    <span>{new Date(bookingData.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participants:</span>
                    <span>{bookingData.participants} person(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per person:</span>
                    <span>${bookingData.tour.price}</span>
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-blue-600">${bookingData.totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Method */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <CreditCard className="w-5 h-5" />
                    <Label htmlFor="credit-card">Credit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="apple-pay" id="apple-pay" />
                    <Smartphone className="w-5 h-5" />
                    <Label htmlFor="apple-pay">Apple Pay</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Details */}
              {paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input id="cardName" placeholder="John Doe" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Terms and Conditions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Cancellation Policy & Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Cancellation Policy</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Free cancellation up to 24 hours before the tour start time</li>
                <li>• 50% refund for cancellations made 12-24 hours before tour</li>
                <li>• No refund for cancellations made less than 12 hours before tour</li>
                <li>• Weather-related cancellations will receive full refund</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Important Notes</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Please arrive at the meeting point 15 minutes before departure</li>
                <li>• Bring comfortable hiking shoes and weather-appropriate clothing</li>
                <li>• Tour may be subject to changes due to weather conditions</li>
                <li>• Contact us at info@koreatours.com for any inquiries</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreed} 
                onCheckedChange={(checked) => setAgreed(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions and cancellation policy
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <div className="flex gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePayment}
            disabled={!agreed}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Complete Payment (${bookingData.totalAmount})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
