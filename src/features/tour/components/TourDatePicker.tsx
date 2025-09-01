"use client"

import { useState } from 'react'
import { addMonths, format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'

type TourDatePickerProps = {
  selectedDate?: Date
  onSelect: (date?: Date) => void
}

export function TourDatePicker({ selectedDate, onSelect }: TourDatePickerProps) {
  const [baseMonth, setBaseMonth] = useState<Date>(new Date())
  const currentMonth = baseMonth
  const nextMonth = addMonths(baseMonth, 1)

  return (
    <div>
      <h4 className="font-medium mb-4">Select Date</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 justify-items-center place-content-center mx-auto">
        <div className="w-full max-w-[420px] p-3 sm:p-4 border rounded-xl bg-white shadow-sm">
          <h5 className="text-sm font-medium text-gray-700 mb-3 text-center">{format(currentMonth, 'MMMM yyyy')}</h5>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelect}
              month={currentMonth}
              onMonthChange={setBaseMonth}
              className="rounded-md border"
            />
          </div>
        </div>
        <div className="w-full max-w-[420px] p-3 sm:p-4 border rounded-xl bg-white shadow-sm">
          <h5 className="text-sm font-medium text-gray-700 mb-3 text-center">{format(nextMonth, 'MMMM yyyy')}</h5>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelect}
              month={nextMonth}
              onMonthChange={(m) => setBaseMonth(addMonths(m, -1))}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>
    </div>
  )
}


