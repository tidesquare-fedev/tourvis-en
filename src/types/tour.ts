export interface TourImage {
  display_name: string
  file_url: string
  file_size: number
}

export interface TourArea {
  code: string
  name: string
}

export interface TourCategory {
  code: string
  name: string
}

export interface TourBasic {
  code: string | null
  provider_code: string
  name: string
  sub_name: string
  calendar_type: string
  price_scope: string
  timeslot_is: boolean
  inventory_scope: string
  need_reservation: boolean
  min_book_days: number
  max_book_days: number
  min_participants: number
  max_participants: number
  duration: number
  duration_unit: string
  meeting_point: string
  meeting_point_address: string
  meeting_point_latitude: number
  meeting_point_longitude: number
  meeting_point_description: string
  meeting_point_image: string
  cancellation_policy: string
  cancellation_hours: number
  cancellation_description: string
  instant_confirmation: boolean
  mobile_voucher: boolean
  print_voucher: boolean
  languages: string[]
  included: string[]
  excluded: string[]
  bring_items: string[]
  not_allowed: string[]
  not_suitable: string[]
  additional_info: string
  images: string[]
  reviews: Array<{
    id: number
    name: string
    rating: number
    date: string
    comment: string
    helpful: number
  }>
  price: number
  originalPrice: number
  discountRate: number
  currency: string
  available_dates: string[]
  timeslots: Array<{
    id: string
    name: string
    start_time: string
    end_time: string
    price: number
    available: boolean
  }>
  working_date_type: string
  latitude: string
  longitude: string
  timezone: string | null
  sort_order: number
  booking_type: string
  areas: TourArea[]
  categories: TourCategory[]
}

export interface TourSummary {
  confirm_hour: string
  voucher_type: string
  customs: any[]
  product_policies: string[]
}

export interface TourFilter {
  min_depart: string | null
  language: string[]
  duration: string
  depart_hour: any[]
}

export interface TourDetail {
  notice_title: string | null
  notice_detail: string | null
  highlight_title: string
  highlight_detail: string
  event: string
  description: string
  highlights: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
    duration: string
    activities: string[]
  }>
  preparations: string
  how_to_use: string
  warnings: string
  additional_info: string
  meeting_address: string
  meeting_latitude: string
  meeting_longitude: string
  meeting_info: string
  pickup_drop: string
  includes: string
  meeting_image: string | null
  excludes: string
  qnas: any[]
  primary_image: TourImage
  images: TourImage[]
  additional_fields: {
    key: string
    title: string
    content: string
  }[]
}

export interface TourRefund {
  code: string
  refund_type: string
  cancel_type: string
  cancel_time: string
  cancel_info: string
  provider_cancel_days: number | null
  partial_cancel_is: boolean | null
}

export interface TourLabel {
  code: string | null
  title: string
  net_price_currency: number
  sale_price_currency: number | null
  normal_price_currency: number | null
  required: boolean
  outer_id: string
  sort_order: number
  per_min: number | null
  per_max: number
}

export interface TourTimeslot {
  code: string | null
  title: string
  description: string | null
  outer_id: string
  sort_order: number
}

export interface TourOption {
  code: string | null
  title: string
  description: string
  per_min: number
  per_max: number
  outer_id: string
  sort_order: number
  sale_start_date: string | null
  sale_end_date: string | null
  use_start_date: string | null
  use_end_date: string | null
  use_period: string | null
  stock_quantity: number | null
  labels: TourLabel[]
  timeslots: TourTimeslot[]
  dynamic_price: boolean
  attrs: any
  resell_is: boolean
}

export interface TourOptionData {
  per_min: number
  per_max: number
  outer_id: string | null
  booking_api_is: boolean
  resell_is: boolean | null
  options: TourOption[]
}

export interface TourApiResponse {
  basic: TourBasic
  summary: TourSummary
  filter: TourFilter
  detail: TourDetail
  refund: TourRefund
  memo: string | null
  seo: any
  voucher_info: {
    contact_point: string
    remark: string
    delivery_type: string
    details: any[]
  }
  attrs: any
  course_groups: any[]
  priority_provider_title: boolean
  option: TourOptionData
}
