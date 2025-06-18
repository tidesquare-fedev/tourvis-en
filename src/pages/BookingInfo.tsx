
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
import { Info, X, CreditCard, Edit, Apple } from "lucide-react";

const BookingInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tourId = searchParams.get('tour');
  
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketFirstName: "",
    ticketLastName: "",
    ticketEmail: "",
    ticketPhone: ""
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
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰" },
    { code: "+372", country: "Estonia", flag: "🇪🇪" },
    { code: "+371", country: "Latvia", flag: "🇱🇻" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹" }
  ];

  const validateField = (field: string, value: string, type: 'traveler' | 'ticket' = 'traveler') => {
    let error = "";
    
    switch (field) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "This field is required";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Only English letters are allowed";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else if (value.length < 8) {
          error = "Please enter a valid phone number";
        }
        break;
    }

    const errorKey = type === 'ticket' ? `ticket${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
    setErrors(prev => ({
      ...prev,
      [errorKey]: error
    }));

    return error === "";
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

  const handleBlur = (field: string, value: string, type: 'traveler' | 'ticket' = 'traveler') => {
    validateField(field, value, type);
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

  const handleNextStep = (step: number) => {
    if (step === 1) {
      // Validate all fields for step 1
      const isFirstNameValid = validateField("firstName", formData.firstName);
      const isLastNameValid = validateField("lastName", formData.lastName);
      const isEmailValid = validateField("email", formData.email);
      const isPhoneValid = validateField("phone", formData.phone);

      if (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid) {
        setCompletedSteps(prev => [...prev, 1]);
        setActiveStep(2);
      }
    } else if (step === 2) {
      // Validate ticket user information
      const isTicketFirstNameValid = validateField("firstName", ticketUserData.firstName, "ticket");
      const isTicketLastNameValid = validateField("lastName", ticketUserData.lastName, "ticket");
      const isTicketEmailValid = validateField("email", ticketUserData.email, "ticket");
      const isTicketPhoneValid = validateField("phone", ticketUserData.phone, "ticket");

      if (isTicketFirstNameValid && isTicketLastNameValid && isTicketEmailValid && isTicketPhoneValid) {
        setCompletedSteps(prev => [...prev, 2]);
        setActiveStep(3);
      }
    }
  };

  const handleEditStep = (step: number) => {
    setActiveStep(step);
    setCompletedSteps(prev => prev.filter(s => s !== step));
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

  const getStepIcon = (step: number) => {
    if (completedSteps.includes(step)) {
      return <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">✓</div>;
    } else if (activeStep === step) {
      return <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm">{step}</div>;
    } else {
      return <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm">{step}</div>;
    }
  };

  const isStepActive = (step: number) => activeStep === step;
  const isStepCompleted = (step: number) => completedSteps.includes(step);
  const isStepAccessible = (step: number) => step <= activeStep || completedSteps.includes(step);

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
        <Card className="mb-6">
          <CardHeader className="cursor-pointer" onClick={() => isStepAccessible(1) && setActiveStep(1)}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(1)}
                Contact details
              </div>
              {isStepCompleted(1) && (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleEditStep(1); }} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardTitle>
            {!isStepActive(1) && (
              <p className="text-sm text-gray-600">We'll use this information to send you confirmation and updates about your booking</p>
            )}
          </CardHeader>
          
          {isStepActive(1) && (
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">We'll use this information to send you confirmation and updates about your booking</p>
              
              <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <span className="text-sm">👤 Log in or Sign-up for a faster checkout and to redeem available Viator Rewards</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="kil"
                    value={formData.firstName}
                    onChange={(e) => handleEnglishOnlyInput(e, "firstName", "traveler")}
                    onBlur={(e) => handleBlur("firstName", e.target.value)}
                    required
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="lim"
                    value={formData.lastName}
                    onChange={(e) => handleEnglishOnlyInput(e, "lastName", "traveler")}
                    onBlur={(e) => handleBlur("lastName", e.target.value)}
                    required
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email ℹ️</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="unique_86@naver.com"
                  value={formData.email}
                  onChange={(e) => handleEmailInput(e, "traveler")}
                  onBlur={(e) => handleBlur("email", e.target.value)}
                  required
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                <p className="text-sm text-gray-500 mt-1 bg-green-50 p-2 rounded">
                  Your booking confirmation will be sent to {formData.email || "your email"}
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone number ℹ️</Label>
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
                    onBlur={(e) => handleBlur("phone", e.target.value)}
                    className="flex-1"
                    required
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="emailUpdates" />
                <Label htmlFor="emailUpdates" className="text-sm">
                  Get emails with special offers, inspiration, tips, and other updates from Viator. You can unsubscribe at any time.
                </Label>
              </div>

              <Button 
                onClick={() => handleNextStep(1)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Next
              </Button>
            </CardContent>
          )}

          {isStepCompleted(1) && !isStepActive(1) && (
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">{formData.countryCode} {formData.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">{formData.email}</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Step 2: Activity Details */}
        <Card className="mb-6">
          <CardHeader className={`cursor-pointer ${isStepAccessible(2) ? '' : 'opacity-50'}`} onClick={() => isStepAccessible(2) && setActiveStep(2)}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStepIcon(2)}
                Activity details
              </div>
              {isStepCompleted(2) && (
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleEditStep(2); }} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          
          {isStepActive(2) && (
            <CardContent className="space-y-6">
              {/* Ticket User Information */}
              <div className="space-y-4">
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
                      onBlur={(e) => handleBlur("firstName", e.target.value, "ticket")}
                      disabled={sameAsTraveler}
                      required
                    />
                    {errors.ticketFirstName && <p className="text-sm text-red-500 mt-1">{errors.ticketFirstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="ticketLastName">Last Name (English only)</Label>
                    <Input
                      id="ticketLastName"
                      placeholder="GILDONG"
                      value={ticketUserData.lastName}
                      onChange={(e) => handleEnglishOnlyInput(e, "lastName", "ticket")}
                      onBlur={(e) => handleBlur("lastName", e.target.value, "ticket")}
                      disabled={sameAsTraveler}
                      required
                    />
                    {errors.ticketLastName && <p className="text-sm text-red-500 mt-1">{errors.ticketLastName}</p>}
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
                    onBlur={(e) => handleBlur("email", e.target.value, "ticket")}
                    disabled={sameAsTraveler}
                    required
                  />
                  {errors.ticketEmail && <p className="text-sm text-red-500 mt-1">{errors.ticketEmail}</p>}
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
                      onBlur={(e) => handleBlur("phone", e.target.value, "ticket")}
                      disabled={sameAsTraveler}
                      className="flex-1"
                      required
                    />
                  </div>
                  {errors.ticketPhone && <p className="text-sm text-red-500 mt-1">{errors.ticketPhone}</p>}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4 border-t pt-4">
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
              </div>

              <Button 
                onClick={() => handleNextStep(2)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Next
              </Button>
            </CardContent>
          )}

          {isStepCompleted(2) && !isStepActive(2) && (
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Ticket User</p>
                  <p className="text-gray-600">{ticketUserData.firstName} {ticketUserData.lastName}</p>
                  <p className="text-gray-600">{ticketUserData.email}</p>
                  <p className="text-gray-600">{ticketUserData.countryCode} {ticketUserData.phone}</p>
                </div>
                {formData.specialRequests && (
                  <div>
                    <p className="font-medium">Special Requests</p>
                    <p className="text-gray-600">{formData.specialRequests}</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Step 3: Payment Details */}
        <Card className="mb-6">
          <CardHeader className={`cursor-pointer ${isStepAccessible(3) ? '' : 'opacity-50'}`} onClick={() => isStepAccessible(3) && setActiveStep(3)}>
            <CardTitle className="flex items-center gap-2">
              {getStepIcon(3)}
              Payment details
            </CardTitle>
          </CardHeader>
          
          {isStepActive(3) && (
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
                
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="apple-pay" id="apple-pay" />
                  <Label htmlFor="apple-pay" className="flex items-center gap-4 cursor-pointer flex-1">
                    <Apple className="h-6 w-6" />
                    <span>Apple Pay</span>
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

              {/* Payment Summary */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tour Price</span>
                    <span>${tour.price}.00 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span>{formData.adults + formData.children}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>${(tour.price * (formData.adults + formData.children)).toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                disabled={!paymentMethod}
              >
                Book Now
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BookingInfo;
