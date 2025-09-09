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
  canBook?: boolean
  selectedOptionTitle?: string
  selectedLabelTitle?: string
  selectedTimeslotTitle?: string
  currencyCode?: string
  totalAmount?: number
  selections?: Array<{
    optionTitle: string
    timeslotTitle?: string
    lines: Array<{ label: string; qty: number; unit: number }>
    subtotal: number
  }>
}

export function TourBookingCard({ discountRate, originalPrice, price, selectedDate, quantity, onBook, onValidateMsg, canBook, selectedOptionTitle, selectedLabelTitle, selectedTimeslotTitle, currencyCode = 'USD', totalAmount, selections = [] }: TourBookingCardProps) {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.max(0, Number(value) || 0))
  const unitPrice = Math.max(0, Number(price) || 0)
  const total = typeof totalAmount === 'number' && totalAmount > 0 ? totalAmount : (quantity > 0 ? quantity * unitPrice : 0)
  return (
    <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="text-center">
            {/* Unit price hidden per requirement */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDate && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Selected date</div>
              <div className="font-semibold">{format(selectedDate, 'PPP')}</div>
            </div>
          )}
          {/* Global selected time panel removed as time is shown per option */}
          {selections.length > 0 && (
            <div className="space-y-2">
              {selections.map((sel, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="text-sm font-semibold text-gray-900 flex items-center justify-between gap-2">
                    <span>{sel.optionTitle}</span>
                    {sel.timeslotTitle && (
                      <span className="text-gray-700 font-medium">{sel.timeslotTitle}</span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {sel.lines.map((ln, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{ln.label} × {ln.qty}</span>
                        <span className="text-gray-900 font-medium">{formatCurrency(ln.qty * ln.unit)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                    <span>Subtotal</span>
                    <span>{formatCurrency(sel.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {typeof total === 'number' && (
            <div className="text-center p-3 rounded-lg">
              <div className="text-sm text-gray-600">Participants: {quantity}</div>
              <div className="text-xl font-bold text-black">Total: {formatCurrency(total)}</div>
            </div>
          )}
          <Button onClick={onBook} className="w-full bg-[#01c5fd] hover:bg-[#01b7ea] text-white" size="lg" disabled={!canBook}>
            {canBook ? 'Confirm & pay' : 'Complete selections'}
          </Button>
          {onValidateMsg && <p className="text-xs text-gray-500 text-center">{onValidateMsg}</p>}
        </CardContent>
      </Card>
  )
}


