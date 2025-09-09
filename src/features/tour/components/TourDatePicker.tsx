"use client"

import { useState } from 'react'
import { addMonths, format, startOfMonth, isBefore } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type TourDatePickerProps = {
  selectedDate?: Date
  onSelect: (date?: Date) => void
  mode?: 'single' | 'range'
  selectedRange?: { from?: Date; to?: Date }
  onRangeSelect?: (range?: { from?: Date; to?: Date }) => void
  availableDates?: string[]
  dateStates?: Record<string, string>
}

export function TourDatePicker({ selectedDate, onSelect, mode = 'single', selectedRange, onRangeSelect, availableDates, dateStates }: TourDatePickerProps) {
  const [baseMonth, setBaseMonth] = useState<Date>(new Date())
  const currentMonth = baseMonth
  const nextMonth = addMonths(baseMonth, 1)
  const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const formatters = {
    formatWeekdayName: (date: Date) => weekdayLabels[date.getDay()],
  }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const minMonth = startOfMonth(today)
  const canGoPrev = !isBefore(startOfMonth(baseMonth), minMonth)
  const availableSet = new Set((availableDates || []).map((s) => s.trim()))
  const isAllowedDate = (date: Date) => {
    // Past dates disabled
    if (date < today) return false
    // If availableDates provided (DATE type), only allow those
    if (availableSet.size > 0) {
      const key = format(date, 'yyyy-MM-dd')
      if (!availableSet.has(key)) return false
      const state = dateStates?.[key]
      // 상태가 CLOSED/UNAVAILABLE 등일 때 비활성화
      if (state && /close|sold|full|unavail/i.test(state)) return false
      return true
    }
    return true
  }

  const clampMonth = (m: Date) => (isBefore(startOfMonth(m), minMonth) ? minMonth : m)

  return (
    <div className="overflow-visible">
      <h4 className="font-medium mb-4 text-[18px]">Select Date</h4>
      <div className="relative overflow-visible">
        {/* Navigation buttons */}
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setBaseMonth(clampMonth(addMonths(baseMonth, -1)))}
          disabled={!canGoPrev}
          className="absolute left-0 top-2 md:top-1 -translate-y-1/2 md:translate-y-0 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
          className="absolute right-0 top-2 md:top-1 -translate-y-1/2 md:translate-y-0 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-8 md:gap-12">
          {/* Current month */}
          <div className="w-full max-w-[420px]">
            <h5 className="text-base md:text-[22px] font-semibold text-center mb-2">{format(currentMonth, 'MMMM yyyy')}</h5>
            <div className="flex justify-center">
              <Calendar
                mode={mode}
                selected={mode === 'single' ? selectedDate : (selectedRange as any)}
                onSelect={mode === 'single' ? (onSelect as any) : (onRangeSelect as any)}
                month={currentMonth}
                onMonthChange={setBaseMonth}
                locale={enUS}
                showOutsideDays={false}
                className="border-0 shadow-none"
                formatters={formatters as any}
                classNames={{
                  caption: 'hidden',
                  head_cell: 'w-10 text-center text-gray-500 font-normal',
                  row: 'grid grid-cols-7 mt-2',
                  cell: 'h-10 w-10 text-center p-0',
                  day: 'h-10 w-10 rounded-full aria-selected:bg-blue-600 aria-selected:text-white hover:bg-gray-100',
                  day_outside: 'text-gray-300',
                  day_disabled: 'text-gray-300 opacity-50 pointer-events-none',
                }}
                disabled={(date: Date) => !isAllowedDate(date)}
              />
            </div>
          </div>

          {/* Next month (mobile 숨김) */}
          <div className="w-full max-w-[420px] hidden md:block">
            <h5 className="text-[22px] font-semibold text-center mb-2">{format(nextMonth, 'MMMM yyyy')}</h5>
            <div className="flex justify-center">
              <Calendar
                mode={mode}
                selected={mode === 'single' ? selectedDate : (selectedRange as any)}
                onSelect={mode === 'single' ? (onSelect as any) : (onRangeSelect as any)}
                month={nextMonth}
                onMonthChange={(m) => setBaseMonth(addMonths(m, -1))}
                locale={enUS}
                showOutsideDays={false}
                className="border-0 shadow-none"
                formatters={formatters as any}
                classNames={{
                  caption: 'hidden',
                  head_cell: 'w-10 text-center text-gray-500 font-normal',
                  row: 'grid grid-cols-7 mt-2',
                  cell: 'h-10 w-10 text-center p-0',
                  day: 'h-10 w-10 rounded-full aria-selected:bg-blue-600 aria-selected:text-white hover:bg-gray-100',
                  day_outside: 'text-gray-300',
                  day_disabled: 'text-gray-300 opacity-50 pointer-events-none',
                }}
                disabled={(date: Date) => !isAllowedDate(date)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


