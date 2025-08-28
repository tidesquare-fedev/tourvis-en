'use client'
export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductInfo } from '@/components/reservation/ProductInfo'
import { PaymentInfo } from '@/components/reservation/PaymentInfo'
import { CustomerService } from '@/components/reservation/CustomerService'
import { Clock, MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

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
  activityDetails: {
    duration: string
    meetingPoint: string
    meetingTime: string
    inclusions: string[]
    exclusions: string[]
    requirements: string[]
  }
}

function ReservationDetailsContent() {
  const params = useSearchParams()
  const [reservation, setReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    const reservationNumber = params.get('reservation')
    if (reservationNumber) {
      const saved = localStorage.getItem(`reservation_${reservationNumber}`)
      if (saved) setReservation(JSON.parse(saved))
    }
    if (!reservation && !reservationNumber) {
      const mockReservation: Reservation = {
        reservationNumber: 'KT12345678',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+82-10-1234-5678',
        country: 'South Korea',
        date: '2024-07-15',
        participants: '2',
        specialRequests: 'Vegetarian meals preferred',
        tourTitle: 'Seoul City Highlights Tour',
        tourPrice: 150,
        totalAmount: 300,
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'Confirmed',
        activityDetails: {
          duration: '8 hours (9:00 AM - 5:00 PM)',
          meetingPoint: 'Myeongdong Station Exit 6',
          meetingTime: '8:45 AM (Please arrive 15 minutes early)',
          inclusions: [
            'Professional English-speaking guide',
            'Transportation by air-conditioned vehicle',
            'Entrance fees to all attractions',
            'Traditional Korean lunch',
            'Hotel pickup and drop-off (selected hotels)',
          ],
          exclusions: ['Personal expenses', 'Travel insurance', 'Tips and gratuities', 'Alcoholic beverages'],
          requirements: ['Comfortable walking shoes required', 'Weather-appropriate clothing', 'Valid passport or ID required', 'Moderate physical fitness required'],
        },
      }
      setReservation(mockReservation)
    }
  }, [params])

  if (!reservation) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <span className="logo h-6 sm:h-8 w-24 sm:w-28" role="img" aria-label="TOURVIS" />
            <nav className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/reservation-lookup" className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors">Check Reservation</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Reservation Details</h2>
            <div className="text-sm sm:text-base text-gray-600">
              <p>Reservation Number: {reservation.reservationNumber}</p>
              <p>Booking Date: {reservation.bookingDate}</p>
            </div>
          </div>

          <ProductInfo reservation={reservation} hidePrice={true} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Reservation Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-sm flex items-center"><Clock className="w-4 h-4 mr-1" /> Duration:</span>
                    <p className="text-sm text-gray-600 ml-5">{reservation.activityDetails.duration}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm flex items-center"><MapPin className="w-4 h-4 mr-1" /> Meeting Point:</span>
                    <p className="text-sm text-gray-600 ml-5">{reservation.activityDetails.meetingPoint}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-sm flex items-center"><Clock className="w-4 h-4 mr-1" /> Meeting Time:</span>
                    <p className="text-sm text-gray-600 ml-5">{reservation.activityDetails.meetingTime}</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <span className="font-semibold text-sm flex items-center mb-2"><CheckCircle className="w-4 h-4 mr-1 text-green-600" /> Included:</span>
                <ul className="list-disc list-inside ml-5 space-y-1 text-sm text-gray-600">
                  {reservation.activityDetails.inclusions.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </div>
              <div className="border-t pt-4">
                <span className="font-semibold text-sm flex items-center mb-2"><XCircle className="w-4 h-4 mr-1 text-red-600" /> Not Included:</span>
                <ul className="list-disc list-inside ml-5 space-y-1 text-sm text-gray-600">
                  {reservation.activityDetails.exclusions.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </div>
              <div className="border-t pt-4">
                <span className="font-semibold text-sm flex items-center mb-2"><AlertTriangle className="w-4 h-4 mr-1 text-orange-600" /> Requirements:</span>
                <ul className="list-disc list-inside ml-5 space-y-1 text-sm text-gray-600">
                  {reservation.activityDetails.requirements.map((item, index) => (<li key={index}>{item}</li>))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <PaymentInfo reservation={reservation} />
          <CustomerService />

          <div className="text-center">
            <Button variant="outline" size="sm" style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }} className="w-full sm:w-auto text-xs sm:text-sm">Request Cancellation</Button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Link href="/reservation-lookup">
            <Button variant="outline" style={{ backgroundColor: '#01c5fd', color: 'white' }} className="w-full sm:w-auto text-sm sm:text-base">Back to Search</Button>
          </Link>
        </div>
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


