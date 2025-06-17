
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Users, Star, Calendar, Phone, Mail, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    date: "",
    participants: "1",
    specialRequests: ""
  });

  // Mock tour data - in real app this would come from API
  const tour = {
    id: "jeju-hallasan-hiking",
    title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    description: "Experience the breathtaking sunrise from Korea's highest peak. This unforgettable journey takes you through pristine forests and volcanic landscapes to witness one of the most spectacular sunrises in Asia.",
    image: "photo-1469474968028-56623f02e42e",
    price: 89,
    originalPrice: 120,
    duration: "8 hours",
    rating: 4.8,
    reviewCount: 324,
    location: "Jeju Island, South Korea",
    highlights: [
      "Watch sunrise from Korea's highest peak (1,947m)",
      "Guided hike through Hallasan National Park",
      "Learn about volcanic geology and local flora",
      "Traditional Korean breakfast included",
      "Small group experience (max 12 people)",
      "Professional English-speaking guide"
    ],
    included: [
      "Professional English-speaking guide",
      "Transportation from/to meeting point",
      "Traditional Korean breakfast",
      "Hiking equipment (walking sticks, headlamps)",
      "Entrance fees to National Park",
      "Travel insurance"
    ],
    notIncluded: [
      "Personal expenses",
      "Lunch and dinner",
      "Tips for guide (optional)",
      "Travel to/from Jeju Island"
    ],
    itinerary: [
      { time: "02:30", activity: "Pick-up from designated meeting points" },
      { time: "03:30", activity: "Arrive at trailhead, equipment check and briefing" },
      { time: "04:00", activity: "Begin hiking to Baengnokdam crater" },
      { time: "06:00", activity: "Reach summit area for sunrise viewing" },
      { time: "07:30", activity: "Traditional Korean breakfast at mountain hut" },
      { time: "08:30", activity: "Explore crater area and take photos" },
      { time: "09:30", activity: "Begin descent" },
      { time: "11:30", activity: "Return to trailhead and transportation back" }
    ]
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || 
        !bookingData.phone || !bookingData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate reservation number
    const reservationNumber = "KT" + Date.now().toString().slice(-8);
    
    // Store booking data in localStorage (in real app, this would go to a database)
    const reservation = {
      reservationNumber,
      ...bookingData,
      tourTitle: tour.title,
      tourPrice: tour.price,
      totalAmount: tour.price * parseInt(bookingData.participants),
      bookingDate: new Date().toISOString(),
      status: "confirmed"
    };
    
    localStorage.setItem(`reservation_${reservationNumber}`, JSON.stringify(reservation));
    
    // Navigate to confirmation page
    navigate(`/booking-confirmation?reservation=${reservationNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">KoreaTours</h1>
          <nav className="flex items-center space-x-6">
            <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
              Check Reservation
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tour Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image and Basic Info */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <img 
                  src={`https://images.unsplash.com/${tour.image}?auto=format&fit=crop&w=1200&q=80`}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save ${tour.originalPrice - tour.price}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {tour.location}
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {tour.rating} ({tour.reviewCount} reviews)
                  </div>
                </div>
                <CardTitle className="text-2xl">{tour.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Small group (max 12)
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Tour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tour.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="w-16 text-sm font-semibold text-blue-600 flex-shrink-0">
                        {item.time}
                      </div>
                      <div className="text-gray-700">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included & Not Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">✓ Included</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {tour.included.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">✗ Not Included</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {tour.notIncluded.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-blue-600">${tour.price}</div>
                      <div className="text-sm text-gray-500 line-through">${tour.originalPrice}</div>
                    </div>
                    <Badge variant="secondary">Per person</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={bookingData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={bookingData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={bookingData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="e.g., United States"
                      />
                    </div>

                    <div>
                      <Label htmlFor="date">Tour Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="participants">Number of Participants</Label>
                      <Select value={bookingData.participants} onValueChange={(value) => handleInputChange("participants", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'person' : 'people'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        placeholder="Any dietary restrictions, mobility issues, or special requests..."
                        rows={3}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>${tour.price} × {bookingData.participants} person(s)</span>
                        <span>${tour.price * parseInt(bookingData.participants)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">${tour.price * parseInt(bookingData.participants)}</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Free cancellation up to 24 hours before the tour
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
