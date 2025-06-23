
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Calendar, Users, Clock } from "lucide-react";

const TourDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [participants, setParticipants] = useState(1);

  // Mock tour data - in real app this would come from API
  const tour = {
    id: id,
    title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80"
    ],
    originalPrice: 120,
    discountRate: 26,
    price: 89,
    rating: 4.8,
    reviewCount: 324,
    location: "Jeju, South Korea",
    duration: "8 hours",
    maxParticipants: 15,
    description: "Experience the breathtaking sunrise from Korea's highest mountain. This guided hiking tour takes you through beautiful trails to witness the spectacular dawn views from Hallasan Peak.",
    highlights: [
      "Professional mountain guide",
      "Transportation included",
      "Traditional Korean breakfast",
      "Safety equipment provided",
      "Small group experience"
    ],
    itinerary: [
      { time: "03:00", activity: "Hotel pickup" },
      { time: "04:30", activity: "Start hiking from Seongpanak Trail" },
      { time: "06:30", activity: "Reach summit for sunrise viewing" },
      { time: "08:00", activity: "Traditional breakfast on the mountain" },
      { time: "10:30", activity: "Descent begins" },
      { time: "12:00", activity: "Return to starting point" }
    ]
  };

  const handleBooking = () => {
    // Navigate to booking page with tour details
    console.log("Booking tour:", { tourId: id, date: selectedDate, participants });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <img 
                src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
                alt="Korea Tours" 
                className="h-6 sm:h-8"
              />
            </Link>
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link to="/products" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Tours
              </Link>
              <Link to="/inquiry-list" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Direct Inquiry
              </Link>
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Reservations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Tour Detail */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Carousel */}
        <div className="relative mb-6">
          <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden">
            <img 
              src={tour.images[0]}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Tour Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{tour.title}</h1>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              {tour.location}
            </div>

            <div className="flex items-center text-yellow-600 mb-4">
              <Star className="w-4 h-4 mr-2 fill-current" />
              {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Daily
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {tour.duration}
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Up to {tour.maxParticipants} participants
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-gray-500 line-through">${tour.originalPrice}</div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-500">{tour.discountRate}% OFF</span>
                <div className="text-2xl font-bold text-blue-600">${tour.price}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description & Highlights */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 mb-4">{tour.description}</p>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">Highlights</h2>
            <ul className="list-disc list-inside text-gray-700">
              {tour.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Itinerary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Itinerary</h2>
            <div className="space-y-3">
              {tour.itinerary.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-24 font-semibold text-gray-700">{item.time}</div>
                  <div className="text-gray-700">{item.activity}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book Your Tour</h2>
            
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date:</label>
              <input 
                type="date" 
                id="date" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700">Number of Participants:</label>
              <input
                type="number"
                id="participants"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                min="1"
                max={tour.maxParticipants}
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value))}
              />
            </div>

            <Button onClick={handleBooking} className="w-full">Book Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourDetail;
