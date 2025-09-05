import type { TourOptionData } from '@/types/tour'

export type FetchDateOptionsParams = {
  productId: string
  date: string // YYYY-MM-DD
}

export type FetchPeriodOptionsParams = {
  productId: string
}

export type FetchOptionPriceParams = {
  productId: string
  optionCode: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
}

// NOTE: Mock API layer – replace with real API calls later

export async function fetchDateOptions({ productId, date }: FetchDateOptionsParams): Promise<TourOptionData> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 150))
  // Return deterministic mock options based on productId/date
  return {
    per_min: 1,
    per_max: 10,
    outer_id: null,
    booking_api_is: true,
    resell_is: false,
    options: [
      {
        code: 'OPT-A',
        title: `Standard Option (${date})`,
        description: '기본 옵션 (날짜형)',
        per_min: 1,
        per_max: 10,
        outer_id: 'STD',
        sort_order: 1,
        sale_start_date: null,
        sale_end_date: null,
        use_start_date: date,
        use_end_date: date,
        use_period: null,
        stock_quantity: 20,
        labels: [
          {
            code: null,
            title: 'Adult',
            net_price_currency: 0, // will be overridden by price API
            sale_price_currency: null,
            normal_price_currency: null,
            required: true,
            outer_id: 'ADULT',
            sort_order: 1,
            per_min: 1,
            per_max: 10,
          },
        ],
        timeslots: [],
        dynamic_price: true,
        attrs: {},
        resell_is: false,
      },
      {
        code: 'OPT-B',
        title: `Premium Option (${date})`,
        description: '프리미엄 옵션 (날짜형)',
        per_min: 1,
        per_max: 10,
        outer_id: 'PRM',
        sort_order: 2,
        sale_start_date: null,
        sale_end_date: null,
        use_start_date: date,
        use_end_date: date,
        use_period: null,
        stock_quantity: 10,
        labels: [
          {
            code: null,
            title: 'Adult',
            net_price_currency: 0,
            sale_price_currency: null,
            normal_price_currency: null,
            required: true,
            outer_id: 'ADULT',
            sort_order: 1,
            per_min: 1,
            per_max: 10,
          },
        ],
        timeslots: [],
        dynamic_price: true,
        attrs: {},
        resell_is: false,
      },
    ],
  }
}

export async function fetchPeriodOptions({ productId }: FetchPeriodOptionsParams): Promise<TourOptionData> {
  await new Promise((r) => setTimeout(r, 120))
  return {
    per_min: 1,
    per_max: 10,
    outer_id: null,
    booking_api_is: true,
    resell_is: false,
    options: [
      {
        code: 'PERIOD-1',
        title: '3-Day Pass',
        description: '기간형 3일 패스',
        per_min: 1,
        per_max: 10,
        outer_id: 'P3',
        sort_order: 1,
        sale_start_date: null,
        sale_end_date: null,
        use_start_date: null,
        use_end_date: null,
        use_period: 'P3D',
        stock_quantity: 50,
        labels: [
          {
            code: null,
            title: 'Adult',
            net_price_currency: 0,
            sale_price_currency: null,
            normal_price_currency: null,
            required: true,
            outer_id: 'ADULT',
            sort_order: 1,
            per_min: 1,
            per_max: 10,
          },
        ],
        timeslots: [],
        dynamic_price: true,
        attrs: {},
        resell_is: false,
      },
      {
        code: 'PERIOD-2',
        title: '7-Day Pass',
        description: '기간형 7일 패스',
        per_min: 1,
        per_max: 10,
        outer_id: 'P7',
        sort_order: 2,
        sale_start_date: null,
        sale_end_date: null,
        use_start_date: null,
        use_end_date: null,
        use_period: 'P7D',
        stock_quantity: 30,
        labels: [
          {
            code: null,
            title: 'Adult',
            net_price_currency: 0,
            sale_price_currency: null,
            normal_price_currency: null,
            required: true,
            outer_id: 'ADULT',
            sort_order: 1,
            per_min: 1,
            per_max: 10,
          },
        ],
        timeslots: [],
        dynamic_price: true,
        attrs: {},
        resell_is: false,
      },
    ],
  }
}

export async function fetchOptionPrice({ productId, optionCode, startDate, endDate }: FetchOptionPriceParams): Promise<{ price: number }> {
  await new Promise((r) => setTimeout(r, 80))
  // Simple deterministic mock: hash-like by option code/date length
  const base = optionCode.length * 1000
  const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
  return { price: base * days + 1234 }
}


