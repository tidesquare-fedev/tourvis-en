
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
    longDescription: "한라산은 제주도의 상징이자 대한민국에서 가장 높은 산입니다. 해발 1,947m의 이 웅장한 산은 약 25,000년 전 화산 활동으로 형성되었으며, 현재는 국립공원으로 지정되어 보호받고 있습니다. 이 투어는 새벽 일찍 시작되어 일출과 함께 한라산의 진정한 아름다움을 만끽할 수 있는 특별한 경험을 제공합니다.",
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
        name: "김민수",
        rating: 5,
        date: "2025.06.09",
        comment: "3박 4일동안 사용했는데 복잡하지 않게 잘 사용했어요\n다만 사진 보낼 때 잘 안보내지긴 했는데 그 이상 문제는 없었어요!",
        helpful: 31,
        tags: ["가격이 합리적이에요"]
      },
      {
        name: "이서연",
        rating: 5,
        date: "2025.06.16",
        comment: "정말 좋은 경험이었습니다. 가이드분도 친절하시고 일출도 너무 아름다웠어요!",
        helpful: 15,
        tags: ["상품설명이 자세해요"]
      }
    ]
  };

  // Navigation sections
  const sections = [
    { id: "options", label: "옵션 선택", ref: optionsRef },
    { id: "description", label: "상품설명", ref: descriptionRef },
    { id: "guide", label: "이용안내", ref: guideRef },
    { id: "reviews", label: "이용후기", ref: reviewsRef },
    { id: "cancellation", label: "취소 환불", ref: cancellationRef }
  ];

  const scrollToSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.ref.current) {
      section.ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleBooking = () => {
    navigate(`/booking-confirmation?tour=${tour.id}`);
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

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                {tour.discountRate}% OFF
              </span>
              <span className="text-sm text-gray-500 line-through">${tour.originalPrice}</span>
              <span className="text-3xl font-bold text-blue-600">${tour.price}</span>
              <span className="text-gray-600">per person</span>
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
              <h3 className="text-xl font-semibold mb-6">옵션 선택</h3>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-medium">기본 투어</h4>
                      <p className="text-sm text-gray-600">한라산 일출 하이킹 + 조식 포함</p>
                    </div>
                    <span className="text-lg font-bold text-blue-600">${tour.price}</span>
                  </div>
                </div>
                
                {/* Calendar Selection */}
                <div>
                  <h4 className="font-medium mb-4">날짜 선택</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        {format(currentMonth, "yyyy년 M월", { locale: ko })}
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
                        {format(nextMonth, "yyyy년 M월", { locale: ko })}
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
              <h3 className="text-xl font-semibold mb-6">상품설명</h3>
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
                        접기 <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        더보기 <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">소요시간</div>
                      <div className="font-semibold">{tour.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">최대 인원</div>
                      <div className="font-semibold">{tour.maxGroup}명</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">최소 연령</div>
                      <div className="font-semibold">{tour.minAge}세</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-600">언어</div>
                      <div className="font-semibold">{tour.language}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guide Section */}
            <div ref={guideRef} className="mb-12">
              <h3 className="text-xl font-semibold mb-6">이용안내</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">일정 안내</h4>
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
                      포함 사항
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
                      불포함 사항
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
              <h3 className="text-xl font-semibold mb-6">이용후기</h3>
              
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
                  투어비스에서 검증한 <span className="font-semibold">{tour.reviewCount}개</span>의 이용후기가 있어요!
                </div>
                
                {/* Review Categories */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">😊 가격이 합리적이에요</span>
                    </div>
                    <span className="text-blue-600 font-semibold">31</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👥 상품설명이 자세해요</span>
                    </div>
                    <span className="text-blue-600 font-semibold">15</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">👨‍👩‍👧‍👦 가족과 함께</span>
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
                        <span className="text-sm text-gray-500">현*</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">
                        이용일: {review.date}
                      </span>
                      <br />
                      <span className="text-xs text-gray-500">
                        C.2GB/일제공 5G (Softbank 로컬망)
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
                          <span>후기가 도움이 되셨나요?</span>
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
              <h3 className="text-xl font-semibold mb-6">취소 및 환불 정책</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">취소 수수료</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• 투어 24시간 전 취소: 무료 취소</li>
                    <li>• 투어 24시간 이내 취소: 투어 요금의 50% 수수료</li>
                    <li>• 투어 당일 취소 또는 노쇼: 투어 요금의 100% 수수료</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">환불 안내</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• 환불은 취소 요청 후 3-5 영업일 내 처리됩니다</li>
                    <li>• 결제 수단과 동일한 방법으로 환불됩니다</li>
                    <li>• 기상 악화로 인한 투어 취소 시 100% 환불</li>
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
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-gray-500 line-through">${tour.originalPrice}</span>
                      <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                        {tour.discountRate}% OFF
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">${tour.price}</div>
                    <div className="text-sm text-gray-600">per person</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleBooking} className="w-full" size="lg">
                    예약하기
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    투어 24시간 전까지 무료 취소
                  </p>
                </CardContent>
              </Card>

              {/* Meeting Point Info */}
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">집합 장소</CardTitle>
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
