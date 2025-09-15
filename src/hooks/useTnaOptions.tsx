'use client'

import { useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { nextTnaApi } from '@/lib/api/next-tna'

type DateRange = { from?: Date; to?: Date }

// 요청 payload 타입 정의
export type TnaRequestPayload = {
  startDate: string
  labelId: string
  count: number
  timeslotId: string
  productId: string
  optionId: string
}

// 동적 가격 요청 타입 정의
export type DynamicPriceRequest = {
  selected_date: string
  labels: Array<{ id: string; quantity: number }>
  timeslot: { id: string }
}

export function useTnaOptions(productId: string, args: { calendarType: 'DATE' | 'PERIOD'; selectedDate?: Date; range?: DateRange }) {
  const { calendarType, selectedDate, range } = args

  // 시간대 문제를 피하기 위해 로컬 날짜로 변환
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const dateStr = useMemo(() => (selectedDate ? formatLocalDate(new Date(selectedDate)) : undefined), [selectedDate])
  const startStr = useMemo(() => (range?.from ? formatLocalDate(new Date(range.from)) : undefined), [range?.from])
  const endStr = useMemo(() => (range?.to ? formatLocalDate(new Date(range.to)) : startStr), [range?.to, startStr])

  const isDateType = calendarType === 'DATE'

  const optionsQuery = useQuery({
    queryKey: ['tna', 'options', productId, calendarType, dateStr, startStr, endStr],
    enabled: Boolean(productId) && (isDateType ? Boolean(dateStr) : true),
    queryFn: async () => {
      if (isDateType && dateStr) {
        console.log('🔍 TNA 옵션 조회 시작:', { productId, dateStr })
        
        const bundle = await nextTnaApi.bundle({ product_id: productId, date: dateStr, option_codes: [] })
        console.log('📦 Bundle API 응답:', bundle)
        if (bundle?.success && bundle?.data) {
          console.log('✅ Bundle API 성공:', bundle.data.options)
          return bundle.data.options
        }
        
        const legacy = await nextTnaApi.optionsDateType(productId, dateStr)
        console.log('🔄 Legacy API 응답:', legacy)
        if (legacy?.success) {
          console.log('✅ Legacy API 성공:', legacy.data)
          return (legacy as any).data
        }
        
        console.log('❌ 모든 API 실패')
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

  // 동적 가격 조회를 위한 mutation
  const dynamicPrice = useMutation({
    mutationKey: ['tna', 'dynamic-price', productId],
    mutationFn: async ({ optionId, payload }: { optionId: string; payload: DynamicPriceRequest }) => {
      console.log('🔄 동적 가격 조회:', { productId, optionId, payload })
      return nextTnaApi.dynamicPrice(productId, optionId, payload)
    },
  })

  // 요청 payload 생성 함수
  const createRequestPayload = (selectedOption: any, selectedTimeslot: any, count: number, selectedLabelId?: string): TnaRequestPayload | null => {
    if (!selectedOption || !selectedTimeslot || !dateStr) {
      return null
    }

    // 라벨 ID 결정: selectedLabelId가 있으면 사용, 없으면 첫 번째 라벨 사용
    let labelId = selectedLabelId
    if (!labelId && selectedOption.labels && selectedOption.labels.length > 0) {
      labelId = selectedOption.labels[0].id
    }
    if (!labelId) {
      labelId = selectedOption.label_code || selectedOption.id
    }

    return {
      startDate: dateStr,
      labelId: labelId,
      count: count,
      timeslotId: selectedTimeslot.id,
      productId: productId,
      optionId: selectedOption.id
    }
  }

  // 동적 가격 요청 payload 생성 함수
  const createDynamicPricePayload = (selectedOption: any, selectedTimeslot: any, count: number, selectedLabelId?: string): DynamicPriceRequest | null => {
    if (!selectedOption || !selectedTimeslot || !dateStr) {
      return null
    }

    // 라벨 ID 결정: selectedLabelId가 있으면 사용, 없으면 첫 번째 라벨 사용
    let labelId = selectedLabelId
    if (!labelId && selectedOption.labels && selectedOption.labels.length > 0) {
      labelId = selectedOption.labels[0].id
    }
    if (!labelId) {
      labelId = selectedOption.label_code || selectedOption.id
    }

    return {
      selected_date: dateStr,
      labels: [{
        id: labelId,
        quantity: count
      }],
      timeslot: {
        id: selectedTimeslot.id
      }
    }
  }

  // 동적 가격 조회 함수 (수량 변경 시 호출)
  const fetchDynamicPrice = async (selectedOption: any, selectedTimeslot: any, count: number, selectedLabelId?: string) => {
    const payload = createDynamicPricePayload(selectedOption, selectedTimeslot, count, selectedLabelId)
    if (!payload) {
      console.warn('동적 가격 요청 payload 생성 실패')
      return null
    }

    console.log('💰 동적 가격 조회 요청:', payload)
    return dynamicPrice.mutateAsync({ optionId: selectedOption.id, payload })
  }

  return { 
    optionsQuery, 
    priceDateType, 
    pricePeriodType, 
    dynamicPrice,
    isDateType, 
    dateStr, 
    startStr, 
    endStr,
    createRequestPayload,
    createDynamicPricePayload,
    fetchDynamicPrice
  }
}


