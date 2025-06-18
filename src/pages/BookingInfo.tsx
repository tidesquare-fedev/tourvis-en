
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Info, X } from "lucide-react";

const BookingInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tourId = searchParams.get('tour');
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    adults: 1,
    children: 0,
    specialRequests: ""
  });

  const [ticketUserData, setTicketUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const [sameAsTraveler, setSameAsTraveler] = useState(false);

  // Mock tour data - in real app, fetch based on tourId
  const tour = {
    id: tourId || "jeju-hallasan-hiking",
    title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    price: 89
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store booking data in localStorage to pass to payment page
    localStorage.setItem("bookingData", JSON.stringify({
      ...formData,
      ticketUser: ticketUserData,
      tour: tour,
      totalAmount: tour.price * (formData.adults + formData.children)
    }));
    
    navigate("/payment");
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
        phone: formData.phone
      });
    } else {
      setTicketUserData({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
      });
    }
  };

  // Validation functions
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

  const handleTravelerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    const names = value.split(' ');
    handleInputChange("firstName", names[0] || "");
    handleInputChange("lastName", names.slice(1).join(' '));
    
    if (sameAsTraveler) {
      handleTicketUserChange("firstName", names[0] || "");
      handleTicketUserChange("lastName", names.slice(1).join(' '));
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
                              ${tour.price}<span className="text-sm">USD</span><br/>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Traveler Information */}
          <Card>
            <CardHeader>
              <CardTitle>Traveler Information *</CardTitle>
              <p className="text-sm text-gray-600">Enter your name and contact information for booking confirmation.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="travelerName">Traveler Name (English only)</Label>
                <Input
                  id="travelerName"
                  placeholder="HONG GILDONG"
                  value={`${formData.firstName} ${formData.lastName}`.trim()}
                  onChange={handleTravelerNameChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name (English only)</Label>
                  <Input
                    id="firstName"
                    placeholder="HONG"
                    value={formData.firstName}
                    onChange={(e) => handleEnglishOnlyInput(e, "firstName", "traveler")}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name (English only)</Label>
                  <Input
                    id="lastName"
                    placeholder="GILDONG"
                    value={formData.lastName}
                    onChange={(e) => handleEnglishOnlyInput(e, "lastName", "traveler")}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Mobile Number (Numbers only)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-5042-5138"
                  value={formData.phone}
                  onChange={(e) => handlePhoneInput(e, "traveler")}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleEmailInput(e, "traveler")}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Ticket User Information */}
          <Card>
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
                <Label htmlFor="ticketPhone">Mobile Number (Numbers only)</Label>
                <Input
                  id="ticketPhone"
                  type="tel"
                  placeholder="010-5042-5138"
                  value={ticketUserData.phone}
                  onChange={(e) => handlePhoneInput(e, "ticket")}
                  disabled={sameAsTraveler}
                  required
                />
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
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
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
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center pt-4">
            <p className="text-sm text-gray-500 mb-4">Are you ready for the best experience?</p>
          </div>
          
          <Button type="submit" className="w-full bg-cyan-400 hover:bg-cyan-500 text-white" size="lg">
            Next
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingInfo;
