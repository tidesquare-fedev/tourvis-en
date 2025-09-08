'use client'

import { useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { nextTnaApi } from '@/lib/api/next-tna'

type DateRange = { from?: Date; to?: Date }

export function useTnaOptions(productId: string, args: { calendarType: 'DATE' | 'PERIOD'; selectedDate?: Date; range?: DateRange }) {
  const { calendarType, selectedDate, range } = args

  const dateStr = useMemo(() => (selectedDate ? new Date(selectedDate).toISOString().slice(0, 10) : undefined), [selectedDate])
  const startStr = useMemo(() => (range?.from ? new Date(range.from).toISOString().slice(0, 10) : undefined), [range?.from])
  const endStr = useMemo(() => (range?.to ? new Date(range.to).toISOString().slice(0, 10) : startStr), [range?.to, startStr])

  const isDateType = calendarType === 'DATE'

  const optionsQuery = useQuery({
    queryKey: ['tna', 'options', productId, calendarType, dateStr, startStr, endStr],
    enabled: Boolean(productId) && (isDateType ? Boolean(dateStr) : true),
    queryFn: async () => {
      if (isDateType && dateStr) {
        const bundle = await nextTnaApi.bundle({ product_id: productId, date: dateStr, option_codes: [] })
        if (bundle?.success && bundle?.data) return bundle.data.options
        const legacy = await nextTnaApi.optionsDateType(productId, dateStr)
        if (legacy?.success) return (legacy as any).data
        return null
      }
      const res = await nextTnaApi.optionsPeriodType(productId)
      return (res as any)?.success ? (res as any).data : null
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const priceDateType = useMutation({
    mutationKey: ['tna', 'price', 'date', productId, startStr, endStr],
    mutationFn: async (payload: { product_option_code: string; start_date: string; end_date: string }) => {
      return nextTnaApi.priceDateType(productId, payload)
    },
  })

  const pricePeriodType = useMutation({
    mutationKey: ['tna', 'price', 'period', productId, startStr, endStr],
    mutationFn: async (payload: { product_option_code: string; start_date: string; end_date: string }) => {
      return nextTnaApi.pricePeriodType(productId, payload)
    },
  })

  return { optionsQuery, priceDateType, pricePeriodType, isDateType, dateStr, startStr, endStr }
}


