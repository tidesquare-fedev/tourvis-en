
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState } from "react";

const Index = () => {
  const [visibleTours, setVisibleTours] = useState(20);

  const banners = [
    {
      id: 1,
      image: "photo-1472396961693-142e6e269027",
      title: "Autumn Jeju Bus Tour",
      subtitle: "Book until September!",
    },
    {
      id: 2,
      image: "photo-1500673922987-e212871fec22",
      title: "Osaka Airport ↔ City",
      subtitle: "Must-take JR Haruka",
    },
    {
      id: 3,
      image: "photo-1482938289607-e9573fc25ebb",
      title: "Japan Shopping Deals?",
      subtitle: "Up to 18% coupon pack!",
    }
  ];

  const allTours = [
    {
      id: "jeju-hallasan-hiking",
      title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
      image: "photo-1469474968028-56623f02e42e",
      originalPrice: 120,
      discountRate: 26,
      price: 89,
      rating: 4.8,
      reviewCount: 324,
      location: "Jeju, South Korea"
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
      location: "Seoul, South Korea"
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
      location: "Busan, South Korea"
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
      location: "Gyeongju, South Korea"
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
      location: "Seoul, South Korea"
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
      location: "Gapyeong, South Korea"
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
      location: "Andong, South Korea"
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
      location: "Sokcho, South Korea"
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
      location: "Gangneung, South Korea"
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
      location: "Jeonju, South Korea"
    },
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `tour-${i + 11}`,
      title: `Amazing Korea Tour ${i + 11}`,
      image: ["photo-1469474968028-56623f02e42e", "photo-1472396961693-142e6e269027", "photo-1500673922987-e212871fec22"][i % 3],
      originalPrice: 80 + Math.floor(Math.random() * 40),
      discountRate: 15 + Math.floor(Math.random() * 15),
      price: 60 + Math.floor(Math.random() * 30),
      rating: 4.3 + Math.random() * 0.6,
      reviewCount: 50 + Math.floor(Math.random() * 300),
      location: ["Seoul, South Korea", "Busan, South Korea", "Jeju, South Korea", "Gyeongju, South Korea", "Incheon, South Korea"][i % 5]
    }))
  ];

  const handleLoadMore = () => {
    setVisibleTours(prev => Math.min(prev + 20, allTours.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header - Responsive and Sticky */}
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

      {/* Banner Carousel - Responsive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3">
                <div className="relative w-full h-[150px] sm:h-[298px] rounded-lg overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${banner.image}?auto=format&fit=crop&w=400&h=200&q=80`}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <h2 className="text-sm sm:text-lg font-bold mb-1">{banner.title}</h2>
                      <p className="text-xs sm:text-sm">{banner.subtitle}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center mt-4 space-x-4">
            <CarouselPrevious className="relative translate-x-0 translate-y-0" />
            <CarouselNext className="relative translate-x-0 translate-y-0" />
          </div>
        </Carousel>
      </section>

      {/* Tour Products - Responsive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {allTours.slice(0, visibleTours).map((tour) => (
            <Link key={tour.id} to={`/tour/${tour.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${tour.image}?auto=format&fit=crop&w=400&q=80`}
                    alt={tour.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="truncate">{tour.location}</span>
                  </div>
                  
                  <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-tight">
                    {tour.title}
                  </h3>
                  
                  <div className="flex items-center text-xs sm:text-sm text-yellow-600 mb-3">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 fill-current" />
                    {tour.rating.toFixed(1)} ({tour.reviewCount})
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm text-gray-500 line-through">${tour.originalPrice}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-red-500">{tour.discountRate}% OFF</span>
                      <div className="text-lg sm:text-xl font-bold text-blue-600">${tour.price}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-6 sm:mt-8 space-y-4">
          {visibleTours < allTours.length && (
            <Button onClick={handleLoadMore} variant="outline" size="lg" className="text-sm sm:text-base">
              More
            </Button>
          )}
          <div>
            <Link to="/products">
              <Button variant="default" size="lg" className="text-sm sm:text-base">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
