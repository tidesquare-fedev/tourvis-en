
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductInfo } from "@/components/reservation/ProductInfo";
import { PaymentInfo } from "@/components/reservation/PaymentInfo";
import { CustomerService } from "@/components/reservation/CustomerService";

interface Reservation {
  reservationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  date: string;
  participants: string;
  specialRequests: string;
  tourTitle: string;
  tourPrice: number;
  totalAmount: number;
  bookingDate: string;
  status: string;
}

// Mock data for testing
const mockReservation: Reservation = {
  reservationNumber: "KT12345678",
  firstName: "홍",
  lastName: "길동",
  email: "hong.gildong@example.com",
  phone: "+82-10-1234-5678",
  country: "대한민국",
  date: "2024-07-15",
  participants: "2",
  specialRequests: "채식 위주 식사 선호",
  tourTitle: "서울 시티 하이라이트 투어",
  tourPrice: 150,
  totalAmount: 300,
  bookingDate: "2024-06-15",
  status: "확정"
};

const ReservationDetails = () => {
  const reservation = mockReservation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <img 
              src="https://i.namu.wiki/i/FbtahqHU60dnSITTtIs-h90AEG8OS8WhMlCv12wGgqqUhQr5T_VWe0OTKA7vJRQNxIJLAx4jKhcn9ILNtNWT1Q.svg" 
              alt="KoreaTours" 
              className="h-6 sm:h-8"
            />
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link to="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">홈</Link>
              <Link to="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">예약 확인</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Reservation History Header - Responsive */}
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">예약 내역</h2>
            <div className="text-sm sm:text-base text-gray-600">
              <p>예약번호: {reservation.reservationNumber}</p>
              <p>예약일: {reservation.bookingDate}</p>
            </div>
          </div>

          <ProductInfo reservation={reservation} hidePrice={true} />
          <PaymentInfo reservation={reservation} />
          <CustomerService />

          {/* Cancel Button - Responsive */}
          <div className="text-center">
            <Button variant="outline" size="sm" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }} className="w-full sm:w-auto text-xs sm:text-sm">
              취소 요청
            </Button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Link to="/reservation-lookup">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }} className="w-full sm:w-auto text-sm sm:text-base">
              조회로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
