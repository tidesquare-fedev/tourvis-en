"use client"

import { format } from 'date-fns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type TourBookingCardProps = {
  discountRate?: number
  originalPrice?: number
  price: number
  selectedDate?: Date
  quantity: number
  onBook: () => void
  onValidateMsg?: string
}

export function TourBookingCard({ discountRate, originalPrice, price, selectedDate, quantity, onBook, onValidateMsg }: TourBookingCardProps) {
  const total = quantity > 0 ? quantity * price : undefined
  return (
    <div className="sticky top-4">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="text-center">
            {typeof discountRate === 'number' && discountRate > 0 && (
              <div className="text-lg text-gray-500 line-through mb-1">${originalPrice}</div>
            )}
            <div className="flex items-center justify-center gap-3 mb-2">
              {typeof discountRate === 'number' && discountRate > 0 && (
                <span className="text-xl font-bold text-red-500">{discountRate}%</span>
              )}
              <span className="text-3xl font-bold text-blue-600">${price}</span>
            </div>
            <div className="text-sm text-gray-600">per person</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDate && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Selected Date</div>
              <div className="font-semibold">{format(selectedDate, 'PPP')}</div>
            </div>
          )}
          {typeof total === 'number' && (
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Participants: {quantity}</div>
              <div className="text-xl font-bold text-green-600">Total: ${total}</div>
            </div>
          )}
          <Button onClick={onBook} className="w-full" size="lg" disabled={!selectedDate || quantity < 1}>
            {!selectedDate ? 'Select Date' : quantity < 1 ? 'Select Quantity' : 'Book Now'}
          </Button>
          {!selectedDate && <p className="text-xs text-gray-500 text-center">Please select a date to continue</p>}
          {selectedDate && quantity < 1 && <p className="text-xs text-gray-500 text-center">Please select at least 1 participant</p>}
          {onValidateMsg && <p className="text-xs text-gray-500 text-center">{onValidateMsg}</p>}
        </CardContent>
      </Card>
    </div>
  )
}


