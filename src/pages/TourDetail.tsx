import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Clock, Users, Star, Calendar as CalendarIcon, Phone, Mail, CreditCard, Check, X, Heart, Share2, MessageCircle, ChevronDown, ChevronUp, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { addMonths, format } from "date-fns";
import { ko } from "date-fns/locale";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [activeSection, setActiveSection] = useState("options");
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Refs for sections
  const optionsRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const cancellationRef = useRef<HTMLDivElement>(null);

  // Mock tour data
  const tour = {
    id: "jeju-hallasan-hiking",
    title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
    subtitle: "Experience the breathtaking sunrise from Korea's highest peak",
    description: "Experience the breathtaking sunrise from Korea's highest peak. This unforgettable journey takes you through pristine forests and volcanic landscapes to witness one of the most spectacular sunrises in Asia. Our expert guides will lead you through ancient trails while sharing fascinating stories about the island's volcanic history and unique ecosystem.",
    longDescription: "Hallasan Mountain is the symbol of Jeju Island and the highest mountain in South Korea. This majestic mountain, standing at 1,947m above sea level, was formed by volcanic activity about 25,000 years ago and is currently designated as a national park. This tour starts early in the morning, providing a special experience to enjoy the true beauty of Hallasan with the sunrise.",
    images: [
      "photo-1469474968028-56623f02e42e",
      "photo-1472396961693-142e6e269027",
      "photo-1500673922987-e212871fec22",
      "photo-1482938289607-e9573fc25ebb",
      "photo-1506905925346-21bda4d32df4",
      "photo-1441974231531-c6227db76b6e"
    ],
    price: 89,
    originalPrice: 120,
    discountRate: 26,
    duration: "8 hours",
    rating: 4.7,
    reviewCount: 587,
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
        name: "Kim Min-su",
        rating: 5,
        date: "2025.06.09",
        comment: "Used it for 3 nights and 4 days and it worked well without being complicated\nIt didn't send photos very well, but there were no other problems!",
        helpful: 31,
        tags: ["Reasonable price"]
      },
      {
        name: "Lee Seo-yeon",
        rating: 5,
        date: "2025.06.16",
        comment: "It was a really good experience. The guide was kind and the sunrise was so beautiful!",
        helpful: 15,
        tags: ["Detailed product description"]
      }
    ]
  };

  // Navigation sections
  const sections = [
    { id: "options", label: "Option Selection", ref: optionsRef },
    { id: "description", label: "Product Description", ref: descriptionRef },
    { id: "guide", label: "Usage Guide", ref: guideRef },
    { id: "reviews", label: "Reviews", ref: reviewsRef },
    { id: "cancellation", label: "Cancellation & Refund", ref: cancellationRef }
  ];

  const scrollToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.ref.current) {
      section.ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleBooking = () => {
    navigate(`/booking-info?tour=${id}`);
  };

  // Group images into pairs for the carousel
  const imageGroups = [];
  for (let i = 0; i < tour.images.length; i += 2) {
    imageGroups.push(tour.images.slice(i, i + 2));
  }

  // Calendar months
  const currentMonth = new Date();
  const nextMonth = addMonths(currentMonth, 1);

  return (
    <div className="min-h-screen bg-white">
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
          <nav className="flex items-center space-x-6">
            <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
              Check Reservation
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Carousel - 2 images per slide */}
            <div className="mb-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {imageGroups.map((group, index) => (
                    <CarouselItem key={index}>
                      <div className="grid grid-cols-2 gap-2 h-80">
                        {group.map((image, imgIndex) => (
                          <img 
                            key={imgIndex}
                            src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=600&h=400&q=80`}
                            alt={`${tour.title} ${index * 2 + imgIndex + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{tour.location}</span>
            </div>

            {/* Title and Subtitle */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tour.title}</h1>
              <p className="text-lg text-gray-600">{tour.subtitle}</p>
            </div>

            {/* Price - Updated Layout */}
            <div className="mb-6">
              <div className="text-lg text-gray-500 line-through mb-1">${tour.originalPrice}</div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-red-500">{tour.discountRate}%</span>
                <span className="text-3xl font-bold text-blue-600">${tour.price}</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">Tour Highlights</h3>
              <ul className="space-y-2">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-800 text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sticky Navigation */}
            <div className="sticky top-0 z-10 bg-white border-b mb-6">
              <div className="flex space-x-1 overflow-x-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeSection === section.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options Section */}
            <div ref={optionsRef} className="mb-12">
              <h3 className="text-xl font-semibold mb-6">Option Selection</h3>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-medium">Basic Tour</h4>
                      <p className="text-sm text-gray-600">Hallasan sunrise hiking + breakfast included</p>
                    </div>
                    <span className="text-lg font-bold text-blue-600">${tour.price}</span>
                  </div>
                </div>
                
                {/* Calendar Selection */}
                <div>
                  <h4 className="font-medium mb-4">Select Date</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        {format(currentMonth, "MMMM yyyy")}
                      </h5>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        month={currentMonth}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        {format(nextMonth, "MMMM yyyy")}
                      </h5>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        month={nextMonth}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div ref={descriptionRef} className="mb-12">
              <h3 className="text-xl font-semibold mb-6">Product Description</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&h=250&q=80"
                    alt="Hallasan sunrise"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=400&h=250&q=80"
                    alt="Hiking trail"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <p className="text-gray-700 leading-relaxed mb-4">{tour.description}</p>
                  {showFullDescription && (
                    <p className="text-gray-700 leading-relaxed mb-4">{tour.longDescription}</p>
                  )}
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showFullDescription ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Show More <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      <div className="text-sm text-gray-600">Max Group</div>
                      <div className="font-semibold">{tour.maxGroup} people</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
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
              </div>
            </div>

            {/* Guide Section */}
            <div ref={guideRef} className="mb-12">
              <h3 className="text-xl font-semibold mb-6">Usage Guide</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Itinerary</h4>
                  <div className="space-y-3">
                    {tour.itinerary.map((item, index) => (
                      <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 text-sm font-semibold text-blue-600 flex-shrink-0">
                          {item.time}
                        </div>
                        <div className="text-gray-700">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                      <Check className="w-5 h-5 mr-2" />
                      What's Included
                    </h4>
                    <div className="space-y-2">
                      {tour.included.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                      <X className="w-5 h-5 mr-2" />
                      What's Not Included
                    </h4>
                    <div className="space-y-2">
                      {tour.notIncluded.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef} className="mb-12">
              <h3 className="text-xl font-semibold mb-6">Reviews</h3>
              
              {/* Rating Summary */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold">{tour.rating}</div>
                  <div className="text-gray-500">/ 5</div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(tour.rating) ? 'text-pink-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-600 mb-4">
                  <span className="font-semibold">{tour.reviewCount}</span> verified reviews on TourVis!
                </div>
                
                {/* Review Categories */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">😊 Reasonable price</span>
                    </div>
                    <span className="text-blue-600 font-semibold">31</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👥 Detailed product description</span>
                    </div>
                    <span className="text-blue-600 font-semibold">15</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👨‍👩‍👧‍👦 Family-friendly</span>
                    </div>
                    <span className="text-blue-600 font-semibold">13</span>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {tour.reviews.map((review, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <span className="font-semibold text-lg">{review.rating}.0</span>
                          <div className="flex ml-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-pink-500 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.name}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">
                        Tour date: {review.date}
                      </span>
                      <br />
                      <span className="text-xs text-gray-500">
                        C.2GB/day 5G (Softbank local network)
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3 whitespace-pre-line">{review.comment}</p>
                    
                    {review.tags && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {review.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                          >
                            😊 {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <span>Was this review helpful?</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.helpful}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancellation Section */}
            <div ref={cancellationRef} className="mb-12">
              <h3 className="text-xl font-semibold mb-6">Cancellation & Refund Policy</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Cancellation Fees</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• Cancel 24+ hours before tour: Free cancellation</li>
                    <li>• Cancel within 24 hours: 50% of tour fee</li>
                    <li>• Same-day cancellation or no-show: 100% of tour fee</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Refund Information</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Refunds processed within 3-5 business days</li>
                    <li>• Refund to original payment method</li>
                    <li>• 100% refund for weather-related cancellations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Simplified Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <div className="text-lg text-gray-500 line-through mb-1">${tour.originalPrice}</div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-xl font-bold text-red-500">{tour.discountRate}%</span>
                      <span className="text-3xl font-bold text-blue-600">${tour.price}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleBooking} className="w-full" size="lg">
                    Book Now
                  </Button>
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
