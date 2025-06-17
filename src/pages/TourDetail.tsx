
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
import { MapPin, Clock, Users, Star, Calendar, Phone, Mail, CreditCard, Check, X, Heart, Share2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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

  const [activeTab, setActiveTab] = useState("overview");

  // Mock tour data
  const tour = {
    id: "jeju-hallasan-hiking",
    title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    description: "Experience the breathtaking sunrise from Korea's highest peak. This unforgettable journey takes you through pristine forests and volcanic landscapes to witness one of the most spectacular sunrises in Asia.",
    images: [
      "photo-1469474968028-56623f02e42e",
      "photo-1472396961693-142e6e269027",
      "photo-1500673922987-e212871fec22",
      "photo-1482938289607-e9573fc25ebb"
    ],
    price: 89,
    originalPrice: 120,
    discountRate: 26,
    duration: "8 hours",
    rating: 4.8,
    reviewCount: 324,
    location: "Jeju Island, South Korea",
    category: "Adventure",
    minAge: 12,
    maxGroup: 12,
    language: "English, Korean",
    meetingPoint: "Jeju Airport Terminal 1",
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
    ],
    reviews: [
      {
        name: "Sarah Johnson",
        rating: 5,
        date: "2024-01-15",
        comment: "Amazing experience! The sunrise was absolutely breathtaking and our guide was very knowledgeable."
      },
      {
        name: "Mike Chen",
        rating: 4,
        date: "2024-01-10",
        comment: "Great tour, well organized. The hiking was challenging but worth it. Highly recommend!"
      }
    ]
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email || 
        !bookingData.phone || !bookingData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const reservationNumber = "KT" + Date.now().toString().slice(-8);
    
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
    navigate(`/booking-confirmation?reservation=${reservationNumber}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">KoreaTours</Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
              Check Reservation
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{tour.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Actions */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{tour.category}</Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tour.location}
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{tour.title}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{tour.rating}</span>
                    <span className="text-gray-500 ml-1">({tour.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-2 h-96">
                <div className="col-span-1 row-span-2">
                  <img 
                    src={`https://images.unsplash.com/${tour.images[0]}?auto=format&fit=crop&w=600&h=400&q=80`}
                    alt={tour.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 gap-2 h-full">
                  {tour.images.slice(1, 3).map((image, index) => (
                    <img 
                      key={index}
                      src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=300&h=200&q=80`}
                      alt={`${tour.title} ${index + 2}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{tour.duration}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Group Size</div>
                  <div className="font-semibold">Max {tour.maxGroup}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Min Age</div>
                  <div className="font-semibold">{tour.minAge} years</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Language</div>
                  <div className="font-semibold">{tour.language}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'itinerary', label: 'Itinerary' },
                    { id: 'included', label: 'What\'s Included' },
                    { id: 'reviews', label: 'Reviews' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">About This Tour</h3>
                      <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                      <ul className="space-y-2">
                        {tour.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Daily Itinerary</h3>
                    <div className="space-y-4">
                      {tour.itinerary.map((item, index) => (
                        <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-16 text-sm font-semibold text-blue-600 flex-shrink-0">
                            {item.time}
                          </div>
                          <div className="text-gray-700">{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'included' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {tour.included.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                        <X className="w-5 h-5 mr-2" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {tour.notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Customer Reviews</h3>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold">{tour.rating}</span>
                        <span className="text-gray-500">({tour.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {tour.reviews.map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">{review.name}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">{review.date}</div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                      {tour.discountRate}% OFF
                    </span>
                    <div className="text-3xl font-bold text-blue-600">${tour.price}</div>
                  </div>
                  <div className="text-sm text-gray-500 line-through">${tour.originalPrice}</div>
                  <div className="text-sm text-gray-600">per person</div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                        <Input
                          id="firstName"
                          value={bookingData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={bookingData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="date" className="text-sm font-medium">Tour Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="participants" className="text-sm font-medium">Participants</Label>
                      <Select value={bookingData.participants} onValueChange={(value) => handleInputChange("participants", value)}>
                        <SelectTrigger className="mt-1">
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
                      <Label htmlFor="specialRequests" className="text-sm font-medium">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                        placeholder="Any special requirements..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>${tour.price} × {bookingData.participants} person(s)</span>
                        <span>${tour.price * parseInt(bookingData.participants)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span className="text-blue-600">${tour.price * parseInt(bookingData.participants)}</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Book Now
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Free cancellation up to 24 hours before the tour
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Meeting Point Info */}
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Meeting Point</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="text-sm text-gray-700">{tour.meetingPoint}</div>
                  </div>
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
