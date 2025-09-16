'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { AppHeader } from '@/components/shared/AppHeader'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductInfo } from '@/components/reservation/ProductInfo'
import { PaymentInfo } from '@/components/reservation/PaymentInfo'
import { CustomerService } from '@/components/reservation/CustomerService'
import { Clock, MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
// import { getProductDetailV2 } from '@/lib/api/tna-v2'

interface Reservation {
  reservationNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  date: string
  participants: string
  specialRequests: string
  tourTitle: string
  tourPrice: number
  totalAmount: number
  bookingDate: string
  status: string
  // 실제 상품 데이터 추가
  tour?: {
    id: string
    title: string
    price: number
    image: string
  }
  selections?: Array<{
    optionTitle: string
    timeslotTitle?: string
    lines: Array<{ label: string; qty: number; unit: number }>
    subtotal: number
  }>
  travelerText?: string
  dateTimeText?: string
  ticketUser?: {
    firstName: string
    lastName: string
    email: string
    phone: string
    countryCode: string
  }
  activityDetails?: {
    duration: string
    meetingPoint: string
    meetingTime: string
    inclusions: string[]
    exclusions: string[]
    requirements: string[]
  }
  productDetails?: {
    basic: {
      duration: string
      duration_unit: string
      meeting_point: string
      meeting_time: string
      included: string[]
      excluded: string[]
      requirements: string[]
    }
  }
}

function ReservationDetailsContent() {
  const params = useSearchParams()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [productDetails, setProductDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReservationData = async () => {
      const reservationNumber = params.get('reservation')
      console.log('=== Reservation Details Debug ===')
      console.log('Reservation number:', reservationNumber)
      
      if (reservationNumber) {
        const saved = localStorage.getItem(`reservation_${reservationNumber}`)
        console.log('Saved data exists:', !!saved)
        
        if (saved) {
          try {
            const reservationData = JSON.parse(saved)
            console.log('Reservation data:', reservationData)
            console.log('Tour ID:', reservationData.tour?.id)
            setReservation(reservationData)
            
            // 예약 데이터에서 상품 상세 정보 설정
            if (reservationData.tour?.id) {
              console.log('Using reservation data for tour ID:', reservationData.tour.id)
              
              // 예약 데이터에 포함된 상품 상세 정보 사용
              if (reservationData.productDetails) {
                console.log('Using stored product details:', reservationData.productDetails)
                setProductDetails(reservationData.productDetails)
              } else {
                // 기본 상품 상세 정보 생성
                const mockProductDetails = {
                  basic: {
                    duration: '3 hours',
                    duration_unit: 'hours',
                    meeting_point: 'Jeju Airport Terminal 1',
                    meeting_time: '09:00 AM',
                    included: ['Professional guide', 'Transportation', 'Lunch'],
                    excluded: ['Personal expenses', 'Tips'],
                    requirements: ['Valid ID', 'Comfortable shoes']
                  }
                }
                
                console.log('Using mock product details:', mockProductDetails)
                setProductDetails(mockProductDetails)
              }
            } else {
              console.log('No tour ID found')
            }
          } catch (error) {
            console.error('Parse Error:', error)
          }
        } else {
          console.log('No saved data found')
        }
      } else {
        console.log('No reservation number in URL')
      }
      setLoading(false)
    }
    
    loadReservationData()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader active="reservation" />
        <div className="h-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01c5fd] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reservation details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-white">
        <AppHeader active="reservation" />
        <div className="h-16"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservation Not Found</h2>
            <p className="text-gray-600 mb-6">The reservation you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="inline-block bg-[#01c5fd] text-white px-6 py-3 rounded-lg hover:bg-[#01b7ea] transition-colors">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader active="reservation" />

      {/* GNB 아래 여백 */}
      <div className="h-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Reservation Details</h2>
            <div className="text-sm sm:text-base text-gray-600">
              <p>Reservation Number: {reservation.reservationNumber}</p>
              <p>Booking Date: {reservation.bookingDate}</p>
            </div>
          </div>

          <ProductInfo reservation={reservation} hidePrice={true} />

          {/* Reservation Info - 상품 상세 API 데이터 사용 */}
          {productDetails && productDetails.basic && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Reservation Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {/* Duration - 상품 상세 API에서 가져온 값 */}
                    {(productDetails.basic?.duration || productDetails.basic?.duration_unit) && (
                      <div>
                        <span className="font-semibold text-sm flex items-center"><Clock className="w-4 h-4 mr-1" /> Duration:</span>
                        <p className="text-sm text-gray-600 ml-5">
                          {productDetails.basic.duration ? `${Math.floor(productDetails.basic.duration / 60)} hours` : 'Duration not specified'}
                        </p>
                      </div>
                    )}
                    
                    {/* Meeting Point - 상품 상세 API에서 가져온 값 */}
                    {(productDetails.basic?.meeting_point || productDetails.basic?.meeting_point_address) && (
                      <div>
                        <span className="font-semibold text-sm flex items-center"><MapPin className="w-4 h-4 mr-1" /> Meeting Point:</span>
                        <p className="text-sm text-gray-600 ml-5">
                          {productDetails.basic.meeting_point || productDetails.basic.meeting_point_address || 'Meeting point will be confirmed'}
                        </p>
                      </div>
                    )}
                    
                    {/* Meeting Time - 상품 상세 API에서 가져온 값 */}
                    {productDetails.basic?.meeting_time && (
                      <div>
                        <span className="font-semibold text-sm flex items-center"><Clock className="w-4 h-4 mr-1" /> Meeting Time:</span>
                        <p className="text-sm text-gray-600 ml-5">{productDetails.basic.meeting_time}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Included - 상품 상세 API에서 가져온 값 */}
                {productDetails.basic?.included && Array.isArray(productDetails.basic.included) && productDetails.basic.included.length > 0 && (
                  <div className="border-t pt-4">
                    <span className="font-semibold text-sm flex items-center mb-2"><CheckCircle className="w-4 h-4 mr-1 text-green-600" /> Included:</span>
                    <ul className="list-disc list-inside ml-5 space-y-1 text-sm text-gray-600">
                      {productDetails.basic.included.map((item: string, index: number) => (<li key={index}>{item}</li>))}
                    </ul>
                  </div>
                )}
                
                {/* Excluded - 상품 상세 API에서 가져온 값 */}
                {productDetails.basic?.excluded && Array.isArray(productDetails.basic.excluded) && productDetails.basic.excluded.length > 0 && (
                  <div className="border-t pt-4">
                    <span className="font-semibold text-sm flex items-center mb-2"><XCircle className="w-4 h-4 mr-1 text-red-600" /> <span style={{ color: '#ff00cc' }}>Not</span> Included:</span>
                    <ul className="list-disc list-inside ml-5 space-y-1 text-sm text-gray-600">
                      {productDetails.basic.excluded.map((item: string, index: number) => (<li key={index}>{item}</li>))}
                    </ul>
                  </div>
                )}
                
                {/* Requirements - 상품 상세 API에서 가져온 값 */}
                {productDetails.basic?.requirements && Array.isArray(productDetails.basic.requirements) && productDetails.basic.requirements.length > 0 && (
                  <div className="border-t pt-4">
                    <span className="font-semibold text-sm flex items-center mb-2"><AlertTriangle className="w-4 h-4 mr-1 text-orange-600" /> Requirements:</span>
                    <ul className="list-disc list-inside ml-5 space-y-1 text-sm text-gray-600">
                      {productDetails.basic.requirements.map((item: string, index: number) => (<li key={index}>{item}</li>))}
                    </ul>
                  </div>
                )}
                
              </CardContent>
            </Card>
          )}

          <PaymentInfo reservation={reservation} />
          <CustomerService />

          <div className="text-center">
            <span className="text-sm sm:text-base text-gray-600">Request Cancellation</span>
          </div>
        </div>

        {/* Removed Back to Search button as requested */}
      </div>
    </div>
  )
}

export default function ReservationDetailsPage() {
  return (
    <Suspense fallback={<div />}> 
      <ReservationDetailsContent />
    </Suspense>
  )
}


