'use client'

import { LayoutProvider } from '@/components/layout/LayoutProvider'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useTourDetailState } from '@/features/tour/hooks/useTourDetailState'
import { TourOption } from '@/types/tour'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Check, X, MapPin, AlertTriangle, Package, XCircle, Info, ChevronRight, Clock, ChevronUp, ChevronDown, Users } from 'lucide-react'
import { TourImageGallery } from '@/features/tour/components/TourImageGallery'
import { TourHeader } from '@/features/tour/components/TourHeader'
import { TourStats } from '@/features/tour/components/TourStats'
import { TourHighlights } from '@/features/tour/components/TourHighlights'
import { TourSectionTabs } from '@/features/tour/components/TourSectionTabs'
import { TourDatePicker } from '@/features/tour/components/TourDatePicker'
import { TourOptions } from '@/features/tour/components/TourOptions'
import { TourDescription } from '@/features/tour/components/TourDescription'
import { TourReviews } from '@/features/tour/components/TourReviews'
import { TourBookingCard } from '@/features/tour/components/TourBookingCard'
import { TopReviewsCarousel } from '@/features/tour/components/TopReviewsCarousel'
import { TourHeroSection } from '@/features/tour/components/TourHeroSection'
import { TourUsageGuide } from '@/features/tour/components/TourUsageGuide'
import { ImportantInformation } from '@/features/tour/components/ImportantInformation'
import { IncludedExcluded } from '@/features/tour/components/IncludedExcluded'
import { TourApiResponse } from '@/types/tour'

interface TourDetailClientProps {
  tourData: TourApiResponse
  tourId: string
}

export default function TourDetailClient({ tourData, tourId }: TourDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  const optionsRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const usageGuideRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const cancellationRef = useRef<HTMLDivElement>(null)
  
  const [isMeetingPointExpanded, setIsMeetingPointExpanded] = useState(false)

  // Meeting Point 내용을 간결하게 요약하는 함수
  const getMeetingPointSummary = (content: string) => {
    // HTML 태그 제거
    const textContent = content.replace(/<[^>]*>/g, '')
    // 첫 번째 문장이나 200자까지만 표시
    const firstSentence = textContent.split('.')[0]
    if (firstSentence.length <= 200) {
      return firstSentence + (textContent.length > firstSentence.length ? '...' : '')
    }
    return textContent.substring(0, 200) + '...'
  }

  // Mock tour data - 실제로는 API에서 가져올 데이터
  const tour = {
    id: tourId,
    title: tourData.basic.name,
    subtitle: tourData.basic.sub_name,
    location: "로마, 이탈리아",
    rating: 4.8,
    reviewCount: 1247,
    images: tourData.basic.images,
    price: tourData.basic.price,
    originalPrice: tourData.basic.originalPrice,
    discountRate: tourData.basic.discountRate,
    currency: tourData.basic.currency,
    duration: `${tourData.basic.duration}분`,
    durationUnit: tourData.basic.duration_unit,
    language: "한국어, 영어",
    meetingPoint: tourData.detail.additional_fields?.find(field => field.key === 'meetingPoint')?.content || tourData.basic.meeting_point,
    meetingPointAddress: tourData.basic.meeting_point_address,
    meetingPointLatitude: tourData.basic.meeting_point_latitude,
    meetingPointLongitude: tourData.basic.meeting_point_longitude,
    meetingPointDescription: tourData.basic.meeting_point_description,
    meetingPointImage: tourData.basic.meeting_point_image,
    cancellationPolicy: tourData.basic.cancellation_policy,
    cancellationHours: tourData.basic.cancellation_hours,
    cancellationDescription: tourData.basic.cancellation_description,
    instantConfirmation: tourData.basic.instant_confirmation,
    mobileVoucher: tourData.basic.mobile_voucher,
    printVoucher: tourData.basic.print_voucher,
    languages: tourData.basic.languages,
    included: tourData.basic.included,
    excluded: tourData.basic.excluded,
    bringItems: tourData.basic.bring_items,
    notAllowed: tourData.basic.not_allowed,
    notSuitable: tourData.basic.not_suitable,
    additionalInfo: tourData.basic.additional_info,
    description: tourData.detail.description,
    highlights: tourData.detail.highlights,
    itinerary: tourData.detail.itinerary,
    additionalFields: tourData.detail.additional_fields,
    reviews: tourData.basic.reviews,
    availableDates: tourData.basic.available_dates,
    timeslots: tourData.basic.timeslots
  }

  // Section refs for navigation
  const sections = [
    { id: 'options', label: 'Options', ref: optionsRef },
    { id: 'description', label: 'Description', ref: descriptionRef },
    { id: 'usage-guide', label: 'Itinerary', ref: usageGuideRef },
    { id: 'reviews', label: 'Reviews', ref: reviewsRef },
    { id: 'cancellation', label: 'Cancellation', ref: cancellationRef }
  ]

  // Use custom hook for state management
  const {
    selectedDate,
    quantity,
    activeSection,
    showFullDescription,
    showAllReviews,
    infoModal,
    scrollToSection,
    handleQuantityChange,
    setSelectedDate,
  } = useTourDetailState(sections)



  const handleBooking = () => {
    if (quantity < 1) {
      toast({ title: 'Quantity Required', description: 'Please select at least 1 participant to continue.', variant: 'destructive' })
      return
    }
    router.push(`/booking-info?tour=${tourId}&date=${selectedDate?.toISOString()}&quantity=${quantity}`)
  }

  const STAR_COLOR = '#ff00cc'

  const maskName = (fullName: string): string => {
    if (!fullName || typeof fullName !== 'string') return ''
    const maskPart = (part: string) => (part.length <= 1 ? part : part[0] + '*'.repeat(Math.max(1, part.length - 1)))
    return fullName
      .split(' ')
      .map((segment) => segment.split('-').map(maskPart).join('-'))
      .join(' ')
  }

  const totalPrice = quantity * tour.price
  const canBook = Boolean(selectedDate) && quantity >= 1

  const toBulletedList = (html: string): string => {
    if (!html || typeof html !== 'string') return ''
    if (html.includes('<ul')) {
      return html.replace('<ul', '<ul class="list-disc pl-5 space-y-1"')
    }
    return `<ul class="list-disc pl-5 space-y-1">${html}</ul>`
  }

  return (
    <LayoutProvider
      tourTitle={tour.title}
      sections={sections}
      activeSection={activeSection}
      onSectionClick={scrollToSection}
    >
      {/* New Hero Section */}
      <TourHeroSection 
        tourData={tourData} 
        tour={{...tour, reviews: tour.reviews}} 
        starColor={STAR_COLOR}
        onScrollToReviews={() => scrollToSection('reviews')}
        maskName={maskName}
      />

      {/* Tour Highlights */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <TourHighlights highlights={tour.highlights} />
      </div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Options Section */}
            <div ref={optionsRef} id="options" className="scroll-mt-20">
                    <TourSectionTabs
        sections={sections}
        activeSection={activeSection}
        onClick={scrollToSection}
      />
              
              <div className="mt-6 space-y-6">
                <TourDatePicker
                  selectedDate={selectedDate}
                  onSelect={setSelectedDate}
                />
                
                {selectedDate && (
                                  <TourOptions
                  selectedDate={selectedDate}
                  options={tourData.option?.options || []}
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                />
                )}
              </div>
            </div>

            {/* Description Section */}
            <div ref={descriptionRef} id="description" className="scroll-mt-20">
              <TourDescription
                description={tour.description}
                longDescription=""
                images={tour.images}
              />
            </div>

            {/* Itinerary Section */}
            <div className="scroll-mt-20">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Itinerary</h3>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  
                  <div className="space-y-6">
                    {tour.itinerary.map((item, index) => (
                      <div key={index} className="relative flex items-start">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">{index + 1}</span>
                        </div>
                        
                        {/* Content */}
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900 text-lg">{item.title}</h4>
                            <span className="text-sm font-medium text-gray-600">{item.duration}</span>
                          </div>
                          <p className="text-gray-700 mb-3 text-base leading-relaxed">{item.description}</p>
                          
                          {/* Activities */}
                          {item.activities && item.activities.length > 0 && (
                            <div className="space-y-2">
                              {item.activities.map((activity, activityIndex) => (
                                <div key={activityIndex} className="flex items-start gap-2">
                                  <span className="text-gray-400 mt-1.5 flex-shrink-0">•</span>
                                  <span className="text-gray-600 text-base leading-relaxed">{activity}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Cost info */}
                          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <span>Admission Ticket Free</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup & Drop Section */}
            {tourData.detail.pickup_drop && (
              <div className="scroll-mt-20">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Pickup & Drop</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="p-4">
                        <div 
                          className="text-base text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: tourData.detail.pickup_drop 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Point Section */}
            <div className="scroll-mt-20">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Meeting Point</h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          {isMeetingPointExpanded ? (
                            <div 
                              className="text-base text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: tourData.detail.additional_fields?.find(field => field.key === 'meetingPoint')?.content || tourData.basic.meeting_point 
                              }}
                            />
                          ) : (
                            <div className="text-base text-gray-700 leading-relaxed">
                              {getMeetingPointSummary(tourData.detail.additional_fields?.find(field => field.key === 'meetingPoint')?.content || tourData.basic.meeting_point)}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => setIsMeetingPointExpanded(!isMeetingPointExpanded)}
                          className="flex items-center justify-center sm:justify-start gap-1 text-gray-900 hover:text-gray-700 text-sm font-medium transition-colors flex-shrink-0 w-full sm:w-auto py-2 sm:py-0 sm:mt-1"
                        >
                          {isMeetingPointExpanded ? (
                            <>
                              <span>Show Less</span>
                              <ChevronUp className="w-4 h-4" />
                            </>
                          ) : (
                            <>
                              <span>Show More</span>
                              <ChevronDown className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information Section */}
            <div className="scroll-mt-20">
              <ImportantInformation
                bringItems={tour.bringItems}
                notAllowed={tour.notAllowed}
                notSuitable={tour.notSuitable}
                beforeTravel={tourData.detail.additional_info ? [tourData.detail.additional_info] : []}
              />
            </div>

            {/* What's Included & Not Included Section */}
            <div className="scroll-mt-20">
              <IncludedExcluded
                included={tour.included}
                excluded={tour.excluded}
              />
            </div>

            {/* Reviews Section */}
            <div ref={reviewsRef} id="reviews" className="scroll-mt-20">
              <TourReviews
                rating={tour.rating}
                reviews={tour.reviews}
                showAll={showAllReviews}
                onShowAll={() => {
                  // Mock toggle
                }}
                onShowLess={() => {
                  // Mock toggle
                }}
                starColor={STAR_COLOR}
              />
            </div>

            {/* Cancellation Section */}
            <div ref={cancellationRef} id="cancellation" className="scroll-mt-20">
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Free Cancellation</h4>
                      <p className="text-sm text-gray-600">Cancel up to 24 hours before the tour for a full refund.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">No Show Policy</h4>
                      <p className="text-sm text-gray-600">No refund for no-shows or cancellations within 24 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TourBookingCard
                discountRate={tour.discountRate}
                originalPrice={tour.originalPrice}
                price={tour.price}
                selectedDate={selectedDate}
                quantity={quantity}
                onBook={handleBooking}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Booking Button */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 lg:hidden shadow-lg">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-lg font-semibold text-blue-600">${totalPrice}</div>
            </div>
            <button
              onClick={handleBooking}
              disabled={!canBook}
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold disabled:opacity-40 disabled:pointer-events-none hover:bg-blue-700 transition-colors"
            >
              {canBook ? 'Book now' : 'Select date & qty'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{infoModal.title}</h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => {
                  // Mock close
                }}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: infoModal.content }} />
            <div className="p-4 pt-0 flex justify-end">
              <button className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black" onClick={() => {
                // Mock close
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </LayoutProvider>
  )
}
