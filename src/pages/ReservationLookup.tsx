import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const ReservationLookup = () => {
  const [searchData, setSearchData] = useState({
    confirmationNumber: "",
    email: ""
  });
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search the database
    if (searchData.confirmationNumber && searchData.email) {
      navigate("/reservation-details", { 
        state: { 
          confirmationNumber: searchData.confirmationNumber,
          email: searchData.email 
        }
      });
    }
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
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-blue-600 font-medium">
                Reservations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto mt-12 p-6 rounded-md shadow-md bg-white">
        <Card>
          <CardHeader>
            <CardTitle>Reservation Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="confirmationNumber">Confirmation Number</Label>
                <Input
                  id="confirmationNumber"
                  type="text"
                  value={searchData.confirmationNumber}
                  onChange={(e) => setSearchData({ ...searchData, confirmationNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={searchData.email}
                  onChange={(e) => setSearchData({ ...searchData, email: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReservationLookup;
