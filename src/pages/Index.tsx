
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredTours = [
    {
      id: "jeju-hallasan-hiking",
      title: "Jeju Hallasan Mountain Sunrise Hiking Tour",
      description: "Experience the breathtaking sunrise from Korea's highest peak",
      image: "photo-1469474968028-56623f02e42e",
      price: 89,
      duration: "8 hours",
      rating: 4.8,
      reviewCount: 324,
      location: "Jeju Island, South Korea"
    },
    {
      id: "seoul-palace-tour",
      title: "Seoul Royal Palace & Traditional Culture Tour",
      description: "Discover Korea's royal heritage and traditional culture",
      image: "photo-1472396961693-142e6e269027",
      price: 65,
      duration: "6 hours", 
      rating: 4.7,
      reviewCount: 156,
      location: "Seoul, South Korea"
    },
    {
      id: "busan-coastal-tour",
      title: "Busan Coastal Scenic Tour & Temple Visit",
      description: "Explore stunning coastal views and ancient temples",
      image: "photo-1500673922987-e212871fec22",
      price: 75,
      duration: "7 hours",
      rating: 4.9,
      reviewCount: 289,
      location: "Busan, South Korea"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">KoreaTours</h1>
          <nav className="flex items-center space-x-6">
            <Link to="/reservation-lookup" className="text-gray-600 hover:text-blue-600 transition-colors">
              Check Reservation
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
        <div className="text-center z-10">
          <h2 className="text-5xl font-bold mb-4">Discover Korea</h2>
          <p className="text-xl mb-8">Unforgettable tours and experiences across South Korea</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Explore Tours
          </Button>
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Featured Tours */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Tours</h3>
          <p className="text-gray-600 text-lg">Hand-picked experiences for your Korean adventure</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${tour.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={tour.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {tour.location}
                  </div>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {tour.rating} ({tour.reviewCount})
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{tour.title}</CardTitle>
                <CardDescription className="line-clamp-2">{tour.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    Small group
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">${tour.price}</div>
                  <Link to={`/tour/${tour.id}`}>
                    <Button>Book Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
