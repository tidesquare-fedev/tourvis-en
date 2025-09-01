'use client'

import { AppHeader } from '@/components/shared/AppHeader'
import { useParams, useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Check, X } from 'lucide-react'
import { TourImageGallery } from '@/features/tour/components/TourImageGallery'
import { TourHeader } from '@/features/tour/components/TourHeader'
import { TourStats } from '@/features/tour/components/TourStats'
import { TourHighlights } from '@/features/tour/components/TourHighlights'
import { TourSectionTabs } from '@/features/tour/components/TourSectionTabs'
import { TourDatePicker } from '@/features/tour/components/TourDatePicker'
import { TourOptions } from '@/features/tour/components/TourOptions'
import { TourDescription } from '@/features/tour/components/TourDescription'
import { TourReviews } from '@/features/tour/components/TourReviews'
import { TourBookingCard } from '@/features/tour/components/TourBookingCard'
import { TopReviewsCarousel } from '@/features/tour/components/TopReviewsCarousel'
import { TourApiResponse } from '@/types/tour'

export default function TourDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [quantity, setQuantity] = useState(0)
  const [activeSection, setActiveSection] = useState('options')
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const optionsRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const guideRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const cancellationRef = useRef<HTMLDivElement>(null)

  // Mock API data - 실제로는 API에서 가져올 데이터
  const tourData: TourApiResponse = {
    basic: {
      code: null,
      provider_code: "PRV3006455682",
      name: "로마 바티칸 박물관, 시스티나 성당 및 바실리카 투어",
      sub_name: "로마 바티칸 박물관, 시스티나 성당 및 바실리",
      calendar_type: "DATE",
      price_scope: "DATE",
      timeslot_is: true,
      inventory_scope: "LABEL_TIMESLOT",
      need_reservation: false,
      min_book_days: 0,
      working_date_type: "PROVIDER",
      latitude: "41.903111",
      longitude: "12.49576",
      currency: "EUR",
      timezone: null,
      sort_order: 100,
      booking_type: "AUTO",
      areas: [
        { code: "100104", name: "이탈리아" },
        { code: "5418", name: "로마" }
      ],
      categories: [
        { code: "CG04", name: "역사문화명소" },
        { code: "CG03", name: "박물관/미술관/전시" },
        { code: "CG70", name: "일일투어" }
      ]
    },
    summary: {
      confirm_hour: "IN0H",
      voucher_type: "M_VOUCHER",
      customs: [],
      product_policies: ["INSTANT_CONFIRMATION"]
    },
    filter: {
      min_depart: null,
      language: ["ENGLISH", "ETC"],
      duration: "IN4H",
      depart_hour: []
    },
    detail: {
      notice_title: null,
      notice_detail: null,
      highlight_title: "바티칸 박물관과 시스티나 성당을 우선입장하고 성 베드로 대성당 방문을 선택하실 수 있습니다. 원하는 체험을 선택하고 스트레스 없이 바티칸의 걸작을 둘러보세요.",
      highlight_detail: "<ul><li>바티칸 박물관의 주요 명소를 우선 입장할 수 있습니다.</li><li>바티칸의 지도 갤러리, 거대한 타피스트리, 고대 로툰다 조각상을 감상하세요.</li><li>시스티나 성당에서 미켈란젤로의 걸작들을 감상하세요.</li><li>피에타와 베르니니의 발다키니를 포함한 성 베드로 대성당을 탐험하기 위해 업그레이드하세요.</li><li>전문가 안내로 진행되는 스토리텔링을 통해 바티칸의 예술과 역사가 생생하게 살아납니다.</li></ul>",
      event: "",
      description: "<p>바티칸은 매우 넓고, 솔직히 말해 혼자 탐험하기에는 압도적일 수 있습니다. 바로 그 이유 때문에 우리 전문 가이드가 함께합니다. 주요 명소를 직접 안내해 드리며, 놓치는 것 없이 완벽한 경험을 선사합니다.</p>",
      preparations: "",
      how_to_use: "",
      warnings: "",
      additional_info: "",
      meeting_address: "",
      meeting_latitude: "",
      meeting_longitude: "",
      meeting_info: "",
      pickup_drop: "",
      includes: "바티칸 박물관 및 시스티나 성당 우선입장 티켓으로 입장 가능\n성 베드로 대성당 우선입장 티켓 스킵 (일부 옵션으로 이용 가능)\n열정적이고 전문적인 라이센스 투어 가이드\n가이드의 설명을 명확하게 들을 수 있는 오디오 시스템",
      meeting_image: null,
      excludes: "",
      qnas: [],
      primary_image: {
        display_name: "1",
        file_url: "https://cdn.getyourguide.com/img/tour/a05866aaf07a1c1a7bd66074b53bebd7877ab261eefc1efd7b57e6b6b3c64714.jpg/145.jpg",
        file_size: 100
      },
      images: [
        {
          display_name: "1",
          file_url: "https://cdn.getyourguide.com/img/tour/a05866aaf07a1c1a7bd66074b53bebd7877ab261eefc1efd7b57e6b6b3c64714.jpg/145.jpg",
          file_size: 100
        },
        {
          display_name: "2", 
          file_url: "https://cdn.getyourguide.com/img/tour/675fa45a06605bb1c4dfe1096eee6b986062f520547e174837bde2a6e1d4b417.jpeg/145.jpg",
          file_size: 100
        },
        {
          display_name: "3",
          file_url: "https://cdn.getyourguide.com/img/tour/66157649959eed06e162dfde8795eb1da315dd167ce40687236fcfa00a6d0059.jpg/145.jpg",
          file_size: 100
        },
        {
          display_name: "4",
          file_url: "https://cdn.getyourguide.com/img/tour/54ed558038a28c8f406ff4c2b776cad0cab6fa38216609e74e76ee22c9a28609.jpg/145.jpg",
          file_size: 100
        },
        {
          display_name: "5",
          file_url: "https://cdn.getyourguide.com/img/tour/feea8a72dc654be8bc092856bbfc79f576740dd313089cbb47546633ddda3934.jpg/145.jpg",
          file_size: 100
        }
      ],
      additional_fields: []
    },
    refund: {
      code: "REF3006749759",
      refund_type: "CONDITIONAL",
      cancel_type: "AUTO",
      cancel_time: "PROVIDER",
      cancel_info: "",
      provider_cancel_days: null,
      partial_cancel_is: null
    },
    memo: null,
    seo: null,
    voucher_info: {
      contact_point: "/",
      remark: "",
      delivery_type: "ATTACH",
      details: []
    },
    attrs: null,
    course_groups: [],
    priority_provider_title: false,
    option: {
      per_min: 1,
      per_max: 5230,
      outer_id: null,
      booking_api_is: true,
      resell_is: null,
      options: [
        {
          code: null,
          title: "영어 가이드 투어 2 곳 (바실리카 없음)",
          description: "영어 가이드 투어를 통해 바티칸 박물관과 시스티나 성당을 우선입장할 수 있는 혜택을 누리며 하루를 알차게 보내세요.",
          per_min: 1,
          per_max: 25,
          outer_id: "429439^1076178",
          sort_order: 0,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 45,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 35,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 25
            }
          ],
          timeslots: [
            { code: null, title: "09:00", description: null, outer_id: "09:00", sort_order: 0 },
            { code: null, title: "10:30", description: null, outer_id: "10:30", sort_order: 1 },
            { code: null, title: "13:30", description: null, outer_id: "13:30", sort_order: 2 },
            { code: null, title: "15:00", description: null, outer_id: "15:00", sort_order: 3 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: null,
          title: "3개 사이트 모두의 영어 가이드 투어",
          description: "바티칸 시국이 제공하는 모든 것을 탐험해 보세요. 바티칸 박물관, 시스티나 성당, 성 베드로 대성당에 대한 우선입장권과 영어를 구사하는 전문 가이드가 있어 대기 시간을 줄이고 바로 관람에 들어가 보세요.",
          per_min: 1,
          per_max: 20,
          outer_id: "429439^773702",
          sort_order: 1,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 65,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 50,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 20
            }
          ],
          timeslots: [
            { code: null, title: "08:30", description: null, outer_id: "08:30", sort_order: 0 },
            { code: null, title: "10:00", description: null, outer_id: "10:00", sort_order: 1 },
            { code: null, title: "13:00", description: null, outer_id: "13:00", sort_order: 2 },
            { code: null, title: "14:30", description: null, outer_id: "14:30", sort_order: 3 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: null,
          title: "프랑스어 가이드 투어 2 곳 (바실리카 없음)",
          description: "프랑스어 가이드 투어로 바티칸 박물관과 시스티나 성당을 우선입장하여 하루를 알차게 보내세요.",
          per_min: 1,
          per_max: 25,
          outer_id: "429439^1076320",
          sort_order: 2,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 45,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 35,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 25
            }
          ],
          timeslots: [
            { code: null, title: "09:00", description: null, outer_id: "09:00", sort_order: 0 },
            { code: null, title: "13:30", description: null, outer_id: "13:30", sort_order: 1 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: null,
          title: "3곳 모두 프랑스어 가이드 투어",
          description: "바티칸 시국이 제공하는 모든 것을 탐험해 보세요. 바티칸 박물관, 시스티나 성당, 성 베드로 대성당 우선입장권과 프랑스어 전문 가이드와 함께라면 대기 시간을 줄이고 바로 관람할 수 있어요.",
          per_min: 1,
          per_max: 20,
          outer_id: "429439^780825",
          sort_order: 3,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 65,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 50,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 20
            }
          ],
          timeslots: [
            { code: null, title: "09:00", description: null, outer_id: "09:00", sort_order: 0 },
            { code: null, title: "13:30", description: null, outer_id: "13:30", sort_order: 1 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: null,
          title: "독일 가이드 투어 2 곳 (바실리카 없음)",
          description: "독일어 가이드 투어로 바티칸 박물관과 시스티나 성당을 우선입장하여 하루를 알차게 보내세요.",
          per_min: 1,
          per_max: 25,
          outer_id: "429439^1076293",
          sort_order: 4,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 45,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 35,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 25
            }
          ],
          timeslots: [
            { code: null, title: "13:00", description: null, outer_id: "13:00", sort_order: 0 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: null,
          title: "스페인어 가이드 투어 2 곳 (바실리카 없음)",
          description: "스페인어 가이드 투어로 바티칸 박물관과 시스티나 성당을 우선입장하여 하루를 알차게 보내세요.",
          per_min: 1,
          per_max: 25,
          outer_id: "429439^1076287",
          sort_order: 5,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 45,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 35,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 25
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 25
            }
          ],
          timeslots: [
            { code: null, title: "11:00", description: null, outer_id: "11:00", sort_order: 0 },
            { code: null, title: "14:00", description: null, outer_id: "14:00", sort_order: 1 },
            { code: null, title: "14:30", description: null, outer_id: "14:30", sort_order: 2 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: null,
          title: "세 곳 모두 스페인어 가이드 투어",
          description: "바티칸 시국이 제공하는 모든 것을 탐험해 보세요. 바티칸 박물관, 시스티나 성당, 성 베드로 대성당에 대한 우선입장권과 스페인어 전문 가이드와 함께라면 대기 시간을 줄이고 바로 관람할 수 있어요.",
          per_min: 1,
          per_max: 20,
          outer_id: "429439^781127",
          sort_order: 6,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 65,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 50,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 20
            }
          ],
          timeslots: [
            { code: null, title: "11:00", description: null, outer_id: "11:00", sort_order: 0 },
            { code: null, title: "14:00", description: null, outer_id: "14:00", sort_order: 1 },
            { code: null, title: "14:30", description: null, outer_id: "14:30", sort_order: 2 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: null,
          title: "세 곳 모두의 독일어 가이드 투어",
          description: "바티칸 시국이 제공하는 모든 것을 탐험해 보세요. 바티칸 박물관, 시스티나 성당, 성 베드로 대성당에 대한 우선입장권과 독일어 전문 가이드가 있어 대기 시간을 줄이고 바로 관람할 수 있습니다.",
          per_min: 1,
          per_max: 20,
          outer_id: "429439^781124",
          sort_order: 7,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: null,
              title: "성인(나이 18-99)",
              net_price_currency: 65,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "어린이(나이 7-17)",
              net_price_currency: 50,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 20
            },
            {
              code: null,
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 20
            }
          ],
          timeslots: [
            { code: null, title: "13:00", description: null, outer_id: "13:00", sort_order: 0 }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        }
      ]
    }
  }

  // 기존 데이터 구조에 맞게 변환
  const tour = {
    id: params.id,
    title: tourData.basic.name,
    subtitle: tourData.basic.sub_name,
    description: tourData.detail.description.replace(/<[^>]*>/g, ''),
    longDescription: tourData.detail.highlight_title,
    images: tourData.detail.images.map(img => img.file_url),
    price: tourData.option.options[0]?.labels[0]?.net_price_currency || 45,
    originalPrice: null,
    discountRate: null,
    duration: tourData.filter.duration.replace('IN', '').replace('H', ' hours'),
    rating: 4.7,
    reviewCount: 587,
    location: tourData.basic.areas.map(area => area.name).join(', '),
    category: tourData.basic.categories[0]?.name || '',
    minAge: 7,
    maxGroup: 25,
    language: tourData.filter.language.join(', '),
    meetingPoint: 'Via Mocenigo, 15, Roma',
    highlights: tourData.detail.highlight_detail
      .replace(/<ul><li>/g, '')
      .replace(/<\/li><li>/g, '|')
      .replace(/<\/li><\/ul>/g, '')
      .split('|'),
    included: tourData.detail.includes.split('\n').filter(item => item.trim()),
    notIncluded: ['개인 비용', '팁 (선택사항)', '식사'],
    itinerary: [
      { time: '09:00', activity: '미팅 포인트에서 만남' },
      { time: '09:30', activity: '바티칸 박물관 우선 입장' },
      { time: '11:00', activity: '시스티나 성당 관람' },
      { time: '12:30', activity: '투어 종료' },
    ],
    reviews: [
      { name: 'Kim Min-su', rating: 5, date: '2025.06.09', comment: "정말 좋은 경험이었습니다. 가이드가 친절하고 시스티나 성당이 너무 아름다웠어요!", helpful: 31, tags: ['합리적인 가격'] },
      { name: 'Lee Seo-yeon', rating: 5, date: '2025.06.16', comment: '바티칸 박물관의 예술 작품들이 정말 인상적이었습니다. 우선입장으로 대기시간 없이 관람할 수 있어서 좋았어요.', helpful: 15, tags: ['상세한 상품 설명'] },
      { name: 'Park Ji-hoon', rating: 4, date: '2025.05.22', comment: '가이드의 설명이 매우 상세했고, 미켈란젤로의 작품을 직접 볼 수 있어서 감동적이었습니다.', helpful: 12 },
      { name: 'Choi Min-jung', rating: 5, date: '2025.04.10', comment: '성 베드로 대성당까지 포함된 투어로 정말 알찬 하루였습니다. 추천합니다!', helpful: 8 },
      { name: 'Jung Ho-seok', rating: 5, date: '2025.03.18', comment: '소그룹으로 진행되어 더욱 집중해서 관람할 수 있었습니다. 가이드님이 역사적 배경도 잘 설명해주셨어요.', helpful: 19 },
    ],
  }

  const sections = [
    { id: 'options', label: 'Option Selection', ref: optionsRef },
    { id: 'description', label: 'Product Description', ref: descriptionRef },
    { id: 'guide', label: 'Usage Guide', ref: guideRef },
    { id: 'reviews', label: 'Reviews', ref: reviewsRef },
    { id: 'cancellation', label: 'Cancellation & Refund', ref: cancellationRef },
  ]

  const scrollToSection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (section?.ref.current) {
      section.ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  const handleBooking = () => {
    if (quantity < 1) {
      toast({ title: 'Quantity Required', description: 'Please select at least 1 participant to continue.', variant: 'destructive' })
      return
    }
    router.push(`/booking-info?tour=${params.id}&date=${selectedDate?.toISOString()}&quantity=${quantity}`)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= tour.maxGroup) {
      setQuantity(newQuantity)
    }
  }

  const STAR_COLOR = '#ff00cc'

  const maskName = (fullName: string): string => {
    if (!fullName || typeof fullName !== 'string') return ''
    const maskPart = (part: string) => (part.length <= 1 ? part : part[0] + '*'.repeat(Math.max(1, part.length - 1)))
    return fullName
      .split(' ')
      .map((segment) => segment.split('-').map(maskPart).join('-'))
      .join(' ')
  }

  const totalPrice = quantity * tour.price

  return (
    <div className="min-h-screen bg-white">
      <AppHeader active="tours" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TourImageGallery images={tour.images} title={tour.title} />
            <TourHeader location={tour.location} title={tour.title} subtitle={tour.subtitle} />
            <div className="mb-6">
              {typeof tour.discountRate === 'number' && tour.discountRate > 0 && (
                <div className="text-lg text-gray-500 line-through mb-1">${tour.originalPrice}</div>
              )}
              <div className="flex items-center gap-3">
                {typeof tour.discountRate === 'number' && tour.discountRate > 0 && (
                  <span className="text-2xl font-bold text-red-500">{tour.discountRate}%</span>
                )}
                <span className="text-3xl font-bold text-blue-600">${tour.price}</span>
              </div>
              <TourStats
                duration={tour.duration}
                maxGroup={tour.maxGroup}
                minAge={tour.minAge}
                language={tour.language}
              />
              <div className="border-t border-gray-200 my-8"></div>
              <TopReviewsCarousel 
                reviews={tour.reviews as any} 
                starColor={STAR_COLOR} 
                rating={tour.rating}
                reviewCount={tour.reviewCount}
                onScrollToReviews={() => scrollToSection('reviews')}
                maskName={maskName}
              />
              <TourHighlights highlights={tour.highlights} />
              <TourSectionTabs sections={sections.map(({ id, label }) => ({ id, label }))} activeSection={activeSection} onClick={scrollToSection} />
            </div>

            <div ref={optionsRef} className="mb-14">
              <h3 className="text-xl font-semibold mb-6">Option Selection</h3>
              <div className="space-y-6">
                <TourDatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
                {selectedDate && (
                  <TourOptions selectedDate={selectedDate} options={tourData.option.options} quantity={quantity} onQuantityChange={handleQuantityChange} />
                )}
              </div>
            </div>

            <div ref={descriptionRef} className="mb-14">
              <TourDescription
                description={tour.description}
                longDescription={tour.longDescription}
                images={[tour.images[0], tour.images[1]]}
              />
            </div>

            <div ref={guideRef} className="mb-14">
              <h3 className="text-xl font-semibold mb-6">Usage Guide</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Itinerary</h4>
                  <div className="space-y-3">
                    {tour.itinerary.map((item, index) => (
                      <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 text-sm font-semibold text-blue-600 flex-shrink-0">{item.time}</div>
                        <div className="text-gray-700">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                      <Check className="w-5 h-5 mr-2" /> What's Included
                    </h4>
                    <div className="space-y-2">
                      {tour.included.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                      <X className="w-5 h-5 mr-2" /> What's Not Included
                    </h4>
                    <div className="space-y-2">
                      {tour.notIncluded.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div ref={reviewsRef} className="mb-14">
              <TourReviews
                rating={tour.rating}
                reviews={tour.reviews as any}
                showAll={showAllReviews}
                onShowAll={() => setShowAllReviews(true)}
                maskName={maskName}
                starColor={STAR_COLOR}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <TourBookingCard
              discountRate={tour.discountRate}
              originalPrice={tour.originalPrice}
              price={tour.price}
              selectedDate={selectedDate}
              quantity={quantity}
              onBook={handleBooking}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


