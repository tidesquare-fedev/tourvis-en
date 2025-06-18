
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Info, X, CreditCard } from "lucide-react";

const BookingInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tourId = searchParams.get('tour');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+82",
    date: undefined as Date | undefined,
    adults: 1,
    children: 0,
    specialRequests: ""
  });

  const [ticketUserData, setTicketUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+82"
  });

  const [sameAsTraveler, setSameAsTraveler] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    holderName: "",
    country: "South Korea",
    zipCode: ""
  });

  // Mock tour data
  const tour = {
    id: tourId || "jeju-hallasan-hiking",
    title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    price: 89
  };

  const countryCodes = [
    { code: "+82", country: "South Korea", flag: "🇰🇷" },
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+1", country: "Canada", flag: "🇨🇦" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
    { code: "+853", country: "Macau", flag: "🇲🇴" },
    { code: "+886", country: "Taiwan", flag: "🇹🇼" },
    { code: "+66", country: "Thailand", flag: "🇹🇭" },
    { code: "+84", country: "Vietnam", flag: "🇻🇳" },
    { code: "+63", country: "Philippines", flag: "🇵🇭" },
    { code: "+60", country: "Malaysia", flag: "🇲🇾" },
    { code: "+62", country: "Indonesia", flag: "🇮🇩" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+52", country: "Mexico", flag: "🇲🇽" },
    { code: "+7", country: "Russia", flag: "🇷🇺" }
  ];

  const validatePhoneNumber = (phone: string, countryCode: string) => {
    const phoneRegex = {
      "+82": /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/,
      "+1": /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
      "+81": /^[0-9]{2,4}-[0-9]{2,4}-[0-9]{4}$/,
      "+86": /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/,
      "+44": /^[0-9]{4}-[0-9]{3}-[0-9]{3}$/
    };
    return phoneRegex[countryCode as keyof typeof phoneRegex]?.test(phone) || phone.length > 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTicketUserChange = (field: string, value: any) => {
    setTicketUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSameAsTravelerChange = (checked: boolean) => {
    setSameAsTraveler(checked);
    if (checked) {
      setTicketUserData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode
      });
    } else {
      setTicketUserData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        countryCode: "+82"
      });
    }
  };

  const handleEnglishOnlyInput = (e: React.ChangeEvent<HTMLInputElement>, field: string, target: 'traveler' | 'ticket') => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    if (target === 'traveler') {
      handleInputChange(field, value);
      if (sameAsTraveler) {
        handleTicketUserChange(field, value);
      }
    } else {
      handleTicketUserChange(field, value);
    }
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>, target: 'traveler' | 'ticket') => {
    const value = e.target.value.replace(/[^0-9-]/g, '');
    if (target === 'traveler') {
      handleInputChange("phone", value);
      if (sameAsTraveler) {
        handleTicketUserChange("phone", value);
      }
    } else {
      handleTicketUserChange("phone", value);
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>, target: 'traveler' | 'ticket') => {
    const value = e.target.value;
    if (target === 'traveler') {
      handleInputChange("email", value);
      if (sameAsTraveler) {
        handleTicketUserChange("email", value);
      }
    } else {
      handleTicketUserChange("email", value);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("Please fill in all required fields");
        return;
      }
      if (!validatePhoneNumber(formData.phone, formData.countryCode)) {
        alert("Please enter a valid phone number for the selected country");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate step 2
      if (!ticketUserData.firstName || !ticketUserData.lastName || !ticketUserData.email || !ticketUserData.phone) {
        alert("Please fill in all ticket user information");
        return;
      }
      if (!validatePhoneNumber(ticketUserData.phone, ticketUserData.countryCode)) {
        alert("Please enter a valid phone number for ticket user");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    if (paymentMethod === "card" && (!cardInfo.cardNumber || !cardInfo.expiryMonth || !cardInfo.expiryYear || !cardInfo.cvv || !cardInfo.holderName)) {
      alert("Please fill in all card information");
      return;
    }
    
    // Store booking data and proceed to confirmation
    localStorage.setItem("bookingData", JSON.stringify({
      ...formData,
      ticketUser: ticketUserData,
      tour: tour,
      totalAmount: tour.price * (formData.adults + formData.children),
      paymentInfo: cardInfo
    }));
    
    navigate("/booking-confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
              alt="Korea Tours" 
              className="h-8"
            />
          </Link>
          <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
            Check Reservation
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Information</h1>
          <p className="text-gray-600">Please enter your information and preferences for the booking.</p>
        </div>

        {/* Progress Indicators */}
        <div className="flex items-center mb-8">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="ml-2 text-sm font-medium">Contact details</span>
          
          <div className={`ml-8 flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Activity details</span>
          
          <div className={`ml-8 flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="ml-2 text-sm font-medium">Payment details</span>
        </div>

        {/* Product Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=100&h=80&q=80"
                alt="Tour"
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{tour.title}</h3>
                <p className="text-sm text-gray-600">Usage Date: Friday, July 18, 2025</p>
              </div>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Option Information
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-w-2xl mx-auto">
                  <div className="mx-auto w-full max-w-2xl">
                    <DrawerHeader className="relative">
                      <DrawerTitle className="text-left">Option Information</DrawerTitle>
                      <DrawerClose className="absolute right-4 top-4">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </DrawerClose>
                    </DrawerHeader>
                    <div className="px-4 pb-6">
                      <div className="bg-white rounded-lg border p-4">
                        <div className="flex items-start gap-4 mb-4">
                          <img 
                            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=80&h=60&q=80"
                            alt="Tour"
                            className="w-20 h-15 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{tour.title}</h3>
                            <p className="text-sm text-gray-600">Usage Date: Friday, July 18, 2025</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Option</span>
                            <span className="font-medium">Jeju Mountain Tour</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Quantity</span>
                            <span className="font-medium">Adult/Child (Same rate) x 1</span>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-lg font-semibold">Total Product Amount</span>
                            <span className="text-lg font-bold text-right">
                              ${tour.price} USD<br/>
                              <span className="text-sm font-normal text-gray-600">${tour.price} USD</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Contact Details */}
        {currentStep >= 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">1</div>
                Contact details
              </CardTitle>
              <p className="text-sm text-gray-600">We'll use this information to send you confirmation and updates about your booking</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="kil"
                    value={formData.firstName}
                    onChange={(e) => handleEnglishOnlyInput(e, "firstName", "traveler")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="lim"
                    value={formData.lastName}
                    onChange={(e) => handleEnglishOnlyInput(e, "lastName", "traveler")}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="unique_86@naver.com"
                  value={formData.email}
                  onChange={(e) => handleEmailInput(e, "traveler")}
                  required
                />
                <p className="text-sm text-gray-500 mt-1 bg-green-50 p-2 rounded">
                  Your booking confirmation will be sent to {formData.email || "your email"}
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="flex gap-2">
                  <Select value={formData.countryCode} onValueChange={(value) => handleInputChange("countryCode", value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
                          {country.flag} {country.code} {country.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-5042-5138"
                    value={formData.phone}
                    onChange={(e) => handlePhoneInput(e, "traveler")}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              <Button 
                onClick={handleNextStep}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Next
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Activity Details */}
        {currentStep >= 2 && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">2</div>
                  Activity details
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Ticket User Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ticket User Information *</CardTitle>
                <p className="text-sm text-gray-600">Enter the ticket user's information (person who will use the ticket).</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sameAsTraveler" 
                    checked={sameAsTraveler}
                    onCheckedChange={handleSameAsTravelerChange}
                  />
                  <Label htmlFor="sameAsTraveler" className="text-sm">
                    Same as Traveler Information
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ticketFirstName">First Name (English only)</Label>
                    <Input
                      id="ticketFirstName"
                      placeholder="HONG"
                      value={ticketUserData.firstName}
                      onChange={(e) => handleEnglishOnlyInput(e, "firstName", "ticket")}
                      disabled={sameAsTraveler}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticketLastName">Last Name (English only)</Label>
                    <Input
                      id="ticketLastName"
                      placeholder="GILDONG"
                      value={ticketUserData.lastName}
                      onChange={(e) => handleEnglishOnlyInput(e, "lastName", "ticket")}
                      disabled={sameAsTraveler}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="ticketEmail">Email</Label>
                  <Input
                    id="ticketEmail"
                    type="email"
                    placeholder="example@email.com"
                    value={ticketUserData.email}
                    onChange={(e) => handleEmailInput(e, "ticket")}
                    disabled={sameAsTraveler}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ticketPhone">Phone number</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={ticketUserData.countryCode} 
                      onValueChange={(value) => handleTicketUserChange("countryCode", value)}
                      disabled={sameAsTraveler}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={`ticket-${country.code}-${country.country}`} value={country.code}>
                            {country.flag} {country.code} {country.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="ticketPhone"
                      type="tel"
                      placeholder="010-5042-5138"
                      value={ticketUserData.phone}
                      onChange={(e) => handlePhoneInput(e, "ticket")}
                      disabled={sameAsTraveler}
                      className="flex-1"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">• Be careful to write accurately when entering your reservation.</p>
                  <p className="text-sm text-gray-600">• Please provide accurate contact information for smooth reservation.</p>
                  <p className="text-sm text-gray-600">• Reservation information cannot be changed arbitrarily after reservation.</p>
                </div>
                
                <div>
                  <Label htmlFor="specialRequests">Please enter the details you want to inform the business.</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    placeholder="Please enter any special requests or requirements."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: Payment Details */}
        {currentStep >= 3 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">3</div>
                Payment details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-4 cursor-pointer flex-1">
                    <div className="flex gap-2">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlZJU0E8L3RleHQ+Cjwvc3ZnPgo=" alt="Visa" className="w-10 h-6" />
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwN0RDQyIvPgo8dGV4dCB4PSIyMCIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFNRVg8L3RleHQ+Cjwvc3ZnPgo=" alt="Amex" className="w-10 h-6" />
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSIyNSIgY3k9IjEyIiByPSI2IiBmaWxsPSIjRkY1RjAwIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4K" alt="Mastercard" className="w-10 h-6" />
                    </div>
                    <span>Debit/Credit Card</span>
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <Label htmlFor="holderName">Cardholder name</Label>
                    <Input
                      id="holderName"
                      placeholder="kil lim"
                      value={cardInfo.holderName}
                      onChange={(e) => setCardInfo({...cardInfo, holderName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Credit Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Expiration Date</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="MM"
                          value={cardInfo.expiryMonth}
                          onChange={(e) => setCardInfo({...cardInfo, expiryMonth: e.target.value})}
                        />
                        <span className="flex items-center">/</span>
                        <Input
                          placeholder="YY"
                          value={cardInfo.expiryYear}
                          onChange={(e) => setCardInfo({...cardInfo, expiryYear: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cvv">Security Code</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                      />
                      <span className="text-xs text-blue-600">What is this?</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select value={cardInfo.country} onValueChange={(value) => setCardInfo({...cardInfo, country: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="South Korea">South Korea</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Japan">Japan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP code</Label>
                      <Input
                        id="zipCode"
                        placeholder="12345"
                        value={cardInfo.zipCode}
                        onChange={(e) => setCardInfo({...cardInfo, zipCode: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                disabled={!paymentMethod}
              >
                Complete Payment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingInfo;
