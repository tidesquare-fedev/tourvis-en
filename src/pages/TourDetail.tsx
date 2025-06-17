import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, MapPin, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import BookingForm from "@/components/BookingForm";

const TourDetail = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [participants, setParticipants] = useState(1);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [tour, setTour] = useState(null);

  useEffect(() => {
    // Mock tour data for demonstration
    const mockTours = [
      {
        id: "jeju-hallasan-hiking",
        title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
        image: "photo-1469474968028-56623f02e42e",
        originalPrice: 120,
        discountRate: 26,
        price: 89,
        rating: 4.8,
        reviewCount: 324,
        location: "Jeju Island"
      },
      {
        id: "seoul-palace-tour",
        title: "Seoul Royal Palace & Traditional Culture Tour",
        image: "photo-1472396961693-142e6e269027",
        originalPrice: 85,
        discountRate: 24,
        price: 65,
        rating: 4.7,
        reviewCount: 156,
        location: "Seoul"
      },
      {
        id: "busan-coastal-tour",
        title: "Busan Coastal Scenic Tour & Temple Visit",
        image: "photo-1500673922987-e212871fec22",
        originalPrice: 95,
        discountRate: 21,
        price: 75,
        rating: 4.9,
        reviewCount: 289,
        location: "Busan"
      },
      {
        id: "gyeongju-history-tour",
        title: "Gyeongju Historical Sites Full Day Tour",
        image: "photo-1465146344425-f00d5f5c8f07",
        originalPrice: 110,
        discountRate: 18,
        price: 90,
        rating: 4.6,
        reviewCount: 201,
        location: "Gyeongju"
      },
      {
        id: "dmz-tour",
        title: "DMZ & Joint Security Area Tour from Seoul",
        image: "photo-1509316975850-ff9c5deb0cd9",
        originalPrice: 80,
        discountRate: 15,
        price: 68,
        rating: 4.5,
        reviewCount: 445,
        location: "Seoul"
      },
      {
        id: "nami-island-tour",
        title: "Nami Island & Petite France Day Tour",
        image: "photo-1472396961693-142e6e269027",
        originalPrice: 70,
        discountRate: 20,
        price: 56,
        rating: 4.7,
        reviewCount: 332,
        location: "Gapyeong"
      },
      {
        id: "andong-village-tour",
        title: "Andong Hahoe Folk Village Cultural Tour",
        image: "photo-1500673922987-e212871fec22",
        originalPrice: 90,
        discountRate: 22,
        price: 70,
        rating: 4.4,
        reviewCount: 178,
        location: "Andong"
      },
      {
        id: "seoraksan-hiking",
        title: "Seoraksan National Park Hiking Adventure",
        image: "photo-1482938289607-e9573fc25ebb",
        originalPrice: 100,
        discountRate: 25,
        price: 75,
        rating: 4.8,
        reviewCount: 267,
        location: "Sokcho"
      },
      {
        id: "gangneung-beach-tour",
        title: "Gangneung Beach & Coffee Street Tour",
        image: "photo-1469474968028-56623f02e42e",
        originalPrice: 65,
        discountRate: 17,
        price: 54,
        rating: 4.6,
        reviewCount: 189,
        location: "Gangneung"
      },
      {
        id: "jeonju-hanok-tour",
        title: "Jeonju Hanok Village Food & Culture Tour",
        image: "photo-1465146344425-f00d5f5c8f07",
        originalPrice: 75,
        discountRate: 19,
        price: 61,
        rating: 4.7,
        reviewCount: 298,
        location: "Jeonju"
      },
    ];

    const foundTour = mockTours.find(mockTour => mockTour.id === id);
    if (foundTour) {
      setTour(foundTour);
    }
  }, [id]);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Tour not found</p>
      </div>
    );
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={`https://images.unsplash.com/${tour.image}?auto=format&fit=crop&w=800&q=80`}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Tour Description */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{tour.title}</h1>
              
              <div className="flex items-center text-yellow-600 mb-4">
                <Star className="w-5 h-5 mr-1 fill-current" />
                <span className="font-semibold mr-2">{tour.rating.toFixed(1)}</span>
                <span className="text-gray-600">({tour.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                {tour.location}
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Experience the breathtaking beauty of {tour.location} with our expertly guided tour. 
                  This carefully crafted journey will take you through the most spectacular sights and 
                  hidden gems that this destination has to offer.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our professional guides will share fascinating stories about the history, culture, 
                  and traditions of the area while ensuring your safety and comfort throughout the experience.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-lg text-gray-500 line-through mb-1">${tour.originalPrice}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-red-500">{tour.discountRate}% OFF</span>
                    <div className="text-3xl font-bold text-blue-600">${tour.price}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Participants
                    </label>
                    <div className="flex items-center border rounded-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setParticipants(Math.max(1, participants - 1))}
                        className="px-3"
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center py-2">{participants}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setParticipants(participants + 1)}
                        className="px-3"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${tour.price * participants}
                      </span>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingForm 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        tour={{
          id: tour.id,
          title: tour.title,
          price: tour.price
        }}
      />
    </div>
  );
};

export default TourDetail;
