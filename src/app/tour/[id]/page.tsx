'use client'

import { AppHeader } from '@/components/shared/AppHeader'
import { useParams, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Check, X, MapPin, AlertTriangle, Package, XCircle, Info, ChevronRight } from 'lucide-react'
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
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  const optionsRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const guideRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const cancellationRef = useRef<HTMLDivElement>(null)

  // Mock API data - 실제로는 API에서 가져올 데이터
  const baseTourRome: TourApiResponse = {
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
      description: "<p>바티칸 시티 가이드 워킹 투어를 통해 로마에서 가장 인기 있는 명소를 둘러보세요. 가이드와 함께 바티칸 박물관, 시스티나 성당, 성 베드로 대성당을 방문하고 화려한 인테리어와 유명한 예술품을 감상하세요.</p><p>바티칸 박물관 입구 근처에서 가이드를 만나 박물관 내에서 가장 흥미로운 갤러리를 둘러보세요. 원형 홀, 태피스트리 갤러리, 지도 갤러리 등을 둘러보세요. 각 방의 화려한 천장을 감상하고 벽을 장식한 고대 조각상, 프레스코화, 태피스트리를 감상하세요.</p><p>그런 다음 시스티나 성당에 들어가 천장과 벽 전체를 덮고 있는 정교한 프레스코화를 감상하세요. 미켈란젤로가 1508년에서 1512년 사이에 그린 시스티나 성당은 르네상스 예술의 초석이 되는 작품입니다.</p><p>아담의 창조부터 최후의 심판까지 미켈란젤로는 로마의 교황들을 만족시키기 위해 밤낮으로, 심지어 예배당에서 잠을 자면서까지 시스티나 성당을 위해 최고의 세월을 바쳤습니다. 예술가는 또한 작품에 숨겨진 의미를 통해 자신의 좌절감을 표현했는데, 이후 그 의미가 밝혀지고 해독되었습니다. 가이드가 들려주는 미켈란젤로의 사적인 농담을 들어보세요.</p><p>마지막으로 성 베드로 대성당으로 이동하여 가이드가 안내하는 도보 여행의 마지막을 즐겨보세요. 이 성당은 르네상스 건축의 가장 유명한 작품 중 하나이며 세계에서 가장 큰 교회라는 타이틀을 가지고 있습니다.</p><p>가이드와 함께 이 웅장한 건축물의 내부를 둘러보고 대성당을 가득 채운 르네상스와 바로크 예술의 걸작들을 감상하세요. 미켈란젤로의 유명한 피에타와 베르니니의 정교한 성 베드로의 발다친을 감상하세요.</p><p>성당 밖에서 투어가 끝납니다. 이곳에서 성 베드로 광장을 자유롭게 거닐거나 인근의 카스텔 산탄젤로를 혼자서 방문해 보세요.</p>",
      preparations: "",
      how_to_use: "",
      warnings: "",
      additional_info: "<ul><li>세데 바칸테 기간 동안 시스티나 성당은 교황 콘클라베(새 교황 선출)로 인해 사전 통지 없이 일반인에게 공개되지 않습니다<br>이는 바티칸에서 결정한 사항이므로 이 기간 동안 시스티나 성당에 대한 접근이 보장되지 않습니다<br>이러한 휴관 기간에는 환불이나 할인 혜택이 제공되지 않습니다.</li><li>성 베드로 대성당은 수요일 오전(오전 8시~오후 12시), 12월 24일, 12월 31일에 휴관합니다<br>희년 미사 중 종교 의식 또는 군중 통제로 인해 사전 통지 없이 성 베드로 대성당 우선입장이 제한될 수 있습니다.</li><li>오후 3시 이후에 시작하는 성 베드로 대성당을 포함한 투어의 경우, 대성당 방문은 셀프 가이드로 진행됩니다.</li><li>바티칸 박물관은 입장 시간이 엄격하게 정해져 있으므로 늦게 도착하면 입장이 보장되지 않습니다.</li><li>도착 시 보안 검색을 위해 사진이 부착된 유효한 신분증이 필요합니다.</li><li>복장 규정이 엄격하게 적용되며 어깨와 무릎을 가려야 합니다<br>민소매 상의, 로우컷 의상, 무릎 위 반바지, 미니스커트는 허용되지 않습니다.</li></ul>",
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
      additional_fields: [
        {
          key: "meetingPoint",
          title: "미팅포인트",
          content: "<p><p>미팅 포인트는 예약한 옵션에 따라 다를 수 있습니다.</p><br><ul><li><b>영어 가이드 투어 2 곳 (바실리카 없음)</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>미팅 포인트의 정확한 주소는 로마의 Via Mocenigo, 15입니다.<br><br>사무실은 바티칸 박물관 입구에서 북서쪽으로 약 200미터 떨어진 곳에 있습니다. 계단을 내려가실 때 첫 번째 좌회전하여 비아 세바스티아노 베니에로를 따라가신 다음 길 끝까지 계속 직진하세요. 우회전하면 비아 모세니고에 도착합니다. 사무실은 쿠카라차 레스토랑 앞에 있습니다.</li></ul><p>"
        },
        {
          key: "notSuitable",
          title: "참가가 어려워요",
          content: "<li>휠체어 사용자</li>"
        },
        {
          key: "bringItem",
          title: "준비물",
          content: "<li>여권 또는 신분증</li>\n<li>편한 신발</li>"
        },
        {
          key: "notAllowed",
          title: "허용되지 않아요",
          content: "<li>반바지</li>\n<li>유모차</li>\n<li>짧은 치마</li>\n<li>민소매 셔츠</li>"
        }
      ]
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

  // 추가 상품: 라스베가스 앤텔로프/호스슈 벤드 (사용자 제공 데이터)
  const tourVegas: TourApiResponse = {
    basic: {
      code: null,
      provider_code: "PRV3006455682",
      name: "라스베가스: 앤털로프 캐년 & 호스슈 벤드(점심, 와이파이 포함)",
      sub_name: "라스베가스: 앤털로프 캐년 & 호스슈 벤드(점",
      calendar_type: "DATE",
      price_scope: "DATE",
      timeslot_is: true,
      inventory_scope: "OPTION_TIMESLOT",
      need_reservation: false,
      min_book_days: 0,
      working_date_type: "PROVIDER",
      latitude: "36.171909",
      longitude: "-115.139969",
      currency: "EUR",
      timezone: null,
      sort_order: 100,
      booking_type: "AUTO",
      areas: [
        { code: "100222", name: "미국" },
        { code: "11578", name: "페이지 (AZ)" },
        { code: "10916", name: "라스베가스 (NV)" },
      ],
      categories: [
        { code: "CG28", name: "워킹투어" },
        { code: "CG14", name: "요트/유람선" },
        { code: "CG23", name: "등산/트래킹" },
        { code: "CG19", name: "익스트림 액티비티" },
        { code: "CG70", name: "일일투어" },
        { code: "CG15", name: "해양 액티비티" },
        { code: "CG39", name: "나이트라이프" },
        { code: "CG55", name: "보트/페리" },
        { code: "CG10", name: "공원/자연" },
        { code: "CG29", name: "버스투어" },
        { code: "CG05", name: "전망대/케이블카/관람차" },
      ],
    },
    summary: {
      confirm_hour: "IN0H",
      voucher_type: "M_VOUCHER",
      customs: [],
      product_policies: ["INSTANT_CONFIRMATION"],
    },
    filter: {
      min_depart: null,
      language: ["ENGLISH"],
      duration: "OV6H",
      depart_hour: [],
    },
    detail: {
      notice_title: null,
      notice_detail: null,
      highlight_title:
        "라스베이거스에서 출발하는 당일 여행으로 그림 같은 앤털로프 캐년과 호스슈 벤드를 방문하세요. 입장료가 포함된 에어컨이 완비된 고급 코치 버스를 타고 편안하게 이동하세요.",
      highlight_detail:
        "<ul><li>나바호 가이드와 함께 앤털로프 캐년에서 경치 좋은 워킹 투어를 즐겨보세요.</li><li>호스슈 벤드 오버룩의 1000피트 높이 전망대 보기</li><li>라스베이거스 스트립에서 럭셔리 코치로 여행하기</li></ul>",
      event: "",
      description:
        "<p>입장권이 포함된 라스베이거스 당일 여행으로 세계적으로 유명한 앤털로프 캐년과 호스슈 벤드를 탐험하세요. 애리조나의 풍경을 하이킹하며 아름다운 명소에서 사진을 찍으세요.<br><br>라스베이거스에서 가이드를 만나 에어컨이 완비된 럭셔리 코치 버스에 탑승하여 체험을 시작하세요. 페이지로 이동하는 동안 휴식을 취하고 에스칼란테/그랜드 스테어케이스 국립 기념물에서 버진 리버 협곡과 암석의 경치를 감상하세요.<br><br>유명한 조각된 사암 벽 사이를 걸으며 사진으로만 보던 만화경 같은 빛의 색과 패턴을 감상하세요.<br><br>나바호 가이드의 현지 역사와 문화에 대한 이야기를 들으며 나만의 사진을 찍어보세요. 도중에 배가 고프거나 목이 마르면 포함된 그래놀라 바와 물을 즐기세요.<br><br>다음으로 콜로라도 강이 말굽 모양의 유명한 굽이를 새겨 놓은 호스슈 벤드 오버룩으로 계속 이동하세요. 1.5마일(2.4킬로미터)의 짧은 왕복 하이킹을 통해 전망대에 도착한 후 글렌 캐년을 흐르는 강을 감상하세요.<br><br>다시 버스로 돌아와 원래 출발 지점에서 하차하여 라스베이거스로 돌아오세요.<p>",
      preparations: "",
      how_to_use: "",
      warnings: "",
      additional_info:
        "<ul><li>기본 픽업 서비스는 트레저 아일랜드 호텔이며 점심 식사는 터키 샌드위치입니다<br>기본 옵션을 다른 옵션으로 변경하려면 예약 후 당사에 문의하시기 바랍니다.</li><li>모든 게스트는 도움 없이 걸을 수 있어야 합니다.</li><li>호스슈 벤드 오버룩에 도착하려면 약간의 경사가 있는 모래와 평평한 바위 위를 왕복 1.5마일 또는 2.4킬로미터 걸어가야 합니다.</li><li>앤털로프 캐년은 허용하지 않습니다: 하이킹 스틱, 지팡이, 보행기 또는 휠체어.</li><li>악천후 등 현지 파트너가 통제할 수 없는 요인으로 인해 목적지가 폐쇄될 수 있습니다.</li><li>전문 카메라, 비디오 녹화 및 가방(배낭, 쌍안경 케이스, 카메라 가방, 착색 비닐봉지, 힙색, 지갑, 대형 토트백, 메쉬백)은 앤털로프 캐년 가이드 투어 중에는 반입이 허용되지 않지만 호스슈 벤드 오버룩에서는 반입이 허용됩니다.</li><li>투어는 최소 인원수에 제한이 있으며, 인원이 충족되지 않을 경우 일정을 변경하거나 다른 체험으로 변경하거나 전액 환불해 드립니다.</li></ul>",
      meeting_address: "",
      meeting_latitude: "",
      meeting_longitude: "",
      meeting_info: "",
      pickup_drop: null,
      includes:
        "앤털로프 캐년 입장\n호스슈 벤드 입장료\n나바호족 국가 허가 수수료\nWiFi가 포함 된 왕복 고급 버스 교통편\n도시락\n그래놀라 바\n생수",
      meeting_image: null,
      excludes: "팁",
      qnas: [],
      primary_image: {
        display_name: "1",
        file_url: "https://cdn.getyourguide.com/img/tour/60ddfbb556044.jpeg/145.jpg",
        file_size: 100,
      },
      images: [
        { display_name: "1", file_url: "https://cdn.getyourguide.com/img/tour/60ddfbb556044.jpeg/145.jpg", file_size: 100 },
        { display_name: "2", file_url: "https://cdn.getyourguide.com/img/tour/5dd10c5949747c34.jpeg/145.jpg", file_size: 100 },
        { display_name: "3", file_url: "https://cdn.getyourguide.com/img/tour/89f7f123dee53df10b6f468262d9f3e0bbc7aacd618e7e8f775b25511c1a6267.jpg/145.jpg", file_size: 100 },
        { display_name: "4", file_url: "https://cdn.getyourguide.com/img/tour/433d4798fd24b72a.jpeg/145.jpg", file_size: 100 },
        { display_name: "5", file_url: "https://cdn.getyourguide.com/img/tour/c458d3369677b7ee.jpeg/145.jpg", file_size: 100 },
        { display_name: "6", file_url: "https://cdn.getyourguide.com/img/tour/1862ac0a98a493d5.jpeg/145.jpg", file_size: 100 },
        { display_name: "7", file_url: "https://cdn.getyourguide.com/img/tour/5a84c6181d1cc641.jpeg/145.jpg", file_size: 100 },
        { display_name: "8", file_url: "https://cdn.getyourguide.com/img/tour/b486ec60b41cf25d.jpeg/145.jpg", file_size: 100 },
        { display_name: "9", file_url: "https://cdn.getyourguide.com/img/tour/60d04113a027f.jpeg/145.jpg", file_size: 100 },
        { display_name: "10", file_url: "https://cdn.getyourguide.com/img/tour/af142a55960570aa.jpeg/145.jpg", file_size: 100 },
        { display_name: "11", file_url: "https://cdn.getyourguide.com/img/tour/60d0411744dbe.jpeg/145.jpg", file_size: 100 },
        { display_name: "12", file_url: "https://cdn.getyourguide.com/img/tour/444515b63a210df9.jpeg/145.jpg", file_size: 100 },
        { display_name: "13", file_url: "https://cdn.getyourguide.com/img/tour/84ac2880789063a8.jpeg/145.jpg", file_size: 100 },
        { display_name: "14", file_url: "https://cdn.getyourguide.com/img/tour/3f63af11139066c471a9b728bd1d1b67b0d75d6de27e3c2f051c4135956af361.jpg/145.jpg", file_size: 100 },
        { display_name: "15", file_url: "https://cdn.getyourguide.com/img/tour/c8387df94a738a23.jpeg/145.jpg", file_size: 100 },
        { display_name: "16", file_url: "https://cdn.getyourguide.com/img/tour/4ba0b183a2c094db.jpeg/145.jpg", file_size: 100 },
        { display_name: "17", file_url: "https://cdn.getyourguide.com/img/tour/a7c5ecf9bfe86def.jpeg/145.jpg", file_size: 100 },
        { display_name: "18", file_url: "https://cdn.getyourguide.com/img/tour/6429c13d9765c3da.jpeg/145.jpg", file_size: 100 },
        { display_name: "19", file_url: "https://cdn.getyourguide.com/img/tour/f052400a7372f6b4.jpeg/145.jpg", file_size: 100 },
        { display_name: "20", file_url: "https://cdn.getyourguide.com/img/tour/801837f239d1032c.jpeg/145.jpg", file_size: 100 },
        { display_name: "21", file_url: "https://cdn.getyourguide.com/img/tour/cd9455778f0b9613.jpeg/145.jpg", file_size: 100 },
        { display_name: "22", file_url: "https://cdn.getyourguide.com/img/tour/e17bb7b682ea9c54.jpeg/145.jpg", file_size: 100 },
        { display_name: "23", file_url: "https://cdn.getyourguide.com/img/tour/38dc571251e273a6.jpeg/145.jpg", file_size: 100 },
        { display_name: "24", file_url: "https://cdn.getyourguide.com/img/tour/7e606aaa23d8da1fce84e9e493a4624a90fac534c0bed7b4dd86ae7cc5c48595.jpg/145.jpg", file_size: 100 },
      ],
      additional_fields: [
        { key: "meetingPoint", title: "미팅포인트", content: "<p><p>미팅 포인트는 예약한 옵션에 따라 다를 수 있습니다.</p><br><ul><li><b>호스슈 벤드 및 점심 식사, 와이파이가 포함된 앤털로프 캐년 X 투어</b> </br><br>픽업 장소는 트레저 아일랜드 호텔 투어 버스 픽업 구역입니다. 이 픽업 장소는 실제로 프런트 데스크에서 오른쪽으로 바로 바깥쪽, 미스테어 드림스 애비뉴(구 사이렌스 코브 대로)에 있습니다. 무료 주차가 가능한 주차장과 가깝습니다. 다른 픽업 장소를 이용하려면 내셔널 파크 익스프레스에 연락하여 대체 장소를 요청하세요.</li><br><li><b>로어 앤털로프 캐년, 프라임 타임 입장, 점심 식사 포함</b> </br><br>픽업 장소는 트레저 아일랜드 호텔 투어 버스 픽업 구역입니다. 이 픽업 장소는 실제로 프런트 데스크에서 오른쪽으로 바로 바깥쪽, 미스테어 드림스 애비뉴(구 사이렌스 코브 대로)에 있습니다. 무료 주차가 가능한 주차장과 가깝습니다. 다른 픽업 장소를 이용하려면 내셔널 파크 익스프레스에 연락하여 대체 장소를 요청하세요.</li><br><li><b>호스슈 벤드와 점심식사가 포함된 어퍼 앤털로프 투어</b> </br><br>픽업 장소는 트레저 아일랜드 호텔 투어 버스 픽업 구역입니다. 이 픽업 장소는 실제로 프런트 데스크에서 오른쪽으로 바로 바깥쪽, 미스테어 드림스 애비뉴(구 사이렌스 코브 대로)에 있습니다. 무료 주차가 가능한 주차장과 가깝습니다. 다른 픽업 장소를 이용하려면 내셔널 파크 익스프레스에 연락하여 대체 장소를 요청하세요.</li></ul><p>" },
        { key: "notSuitable", title: "참가가 어려워요", content: "<li>거동이 불편하신 분</li>" },
        { key: "bringItem", title: "준비물", content: "<li>여권 또는 신분증</li>\n<li>편한 신발</li>" },
        { key: "notAllowed", title: "허용되지 않아요", content: "<li>반려동물</li>\n<li>음주한 상태</li>\n<li>지팡이</li>\n<li>알코올 및 약물</li>\n<li>차량 내 주류 반입</li>" },
      ],
    },
    refund: {
      code: "REF3006883077",
      refund_type: "CONDITIONAL",
      cancel_type: "AUTO",
      cancel_time: "PROVIDER",
      cancel_info: "",
      provider_cancel_days: null,
      partial_cancel_is: null,
    },
    memo: null,
    seo: null,
    voucher_info: { contact_point: "/", remark: "", delivery_type: "ATTACH", details: [] },
    attrs: null,
    course_groups: [],
    priority_provider_title: false,
    option: {
      per_min: 1,
      per_max: 999,
      outer_id: null,
      booking_api_is: true,
      resell_is: null,
      options: [
        {
          code: null,
          title: "호스슈 벤드 및 점심 식사, 와이파이가 포함된 앤털로프 캐년 X 투어",
          description:
            "캐년 엑스는 어퍼 앤털로프 캐년과 로어 앤털로프 캐년의 특징이 잘 어우러진 곳으로, 애리조나 주 페이지의 관문 마을 남동쪽에 위치해 있습니다. 캐년 X가 제공하는 것에 놀랄 준비를 하세요. 이 옵션에는 점심 식사가 포함되어 있습니다.",
          per_min: 1,
          per_max: 999,
          outer_id: "173577^759946",
          sort_order: 0,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            { code: null, title: "성인(나이 0-99)", net_price_currency: 0, sale_price_currency: null, normal_price_currency: null, required: false, outer_id: "ADULT;1;INDIVIDUALS", sort_order: 0, per_min: null, per_max: 999 },
          ],
          timeslots: [ { code: null, title: "05:30", description: null, outer_id: "05:30", sort_order: 0 } ],
          dynamic_price: false,
          attrs: null,
          resell_is: false,
        },
        {
          code: null,
          title: "로어 앤털로프 캐년, 프라임 타임 입장, 점심 식사 포함",
          description:
            "로어 앤털로프 캐년의 나바호 가이드 투어, 호스슈 벤드 방문, 델리 스타일의 점심 식사가 포함되어 있습니다. 오전 11시 30분에서 오후 1시 사이가 정오 정시 입장 시간으로, 이 시간이 가장 멋진 조명을 감상할 수 있는 시간대입니다. 15개 주요 호텔에서 픽업 서비스를 제공합니다.",
          per_min: 1,
          per_max: 999,
          outer_id: "173577^759947",
          sort_order: 1,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            { code: null, title: "성인(나이 0-99)", net_price_currency: 0, sale_price_currency: null, normal_price_currency: null, required: false, outer_id: "ADULT;1;INDIVIDUALS", sort_order: 0, per_min: null, per_max: 999 },
          ],
          timeslots: [ { code: null, title: "05:30", description: null, outer_id: "05:30", sort_order: 0 } ],
          dynamic_price: false,
          attrs: null,
          resell_is: false,
        },
        {
          code: null,
          title: "호스슈 벤드와 점심식사가 포함된 어퍼 앤털로프 투어",
          description: "어퍼 앤털로프는 협곡 바닥에 있는 걷기 좋은 복도를 통해 조각된 사암 벽의 멋진 사진을 찍을 수 있는 기회를 제공합니다.\n\n점심 포함",
          per_min: 1,
          per_max: 999,
          outer_id: "173577^759948",
          sort_order: 2,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            { code: null, title: "성인(나이 0-99)", net_price_currency: 0, sale_price_currency: null, normal_price_currency: null, required: false, outer_id: "ADULT;1;INDIVIDUALS", sort_order: 0, per_min: null, per_max: 999 },
          ],
          timeslots: [ { code: null, title: "05:30", description: null, outer_id: "05:30", sort_order: 0 } ],
          dynamic_price: false,
          attrs: null,
          resell_is: false,
        },
      ],
    },
  }

  // id에 따라 투어 선택 (예: /tour/PRD2001371482, /tour/rome)
  const tourData: TourApiResponse = params.id === 'PRD2001371482' ? tourVegas : baseTourRome

  // 기존 데이터 구조에 맞게 변환
  const itineraryData = params.id === 'PRD2001371482'
    ? []
    : [
      { time: '09:00', activity: '미팅 포인트에서 만남' },
      { time: '09:30', activity: '바티칸 박물관 우선 입장' },
      { time: '11:00', activity: '시스티나 성당 관람' },
      { time: '12:30', activity: '투어 종료' },
    ]

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
    duration: tourData.filter.duration.replace('IN', '').replace('OV', 'Over ').replace('H', ' hours').replace('D', ' days'),
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
    itinerary: itineraryData,
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
      const y = section.ref.current.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(({ id, ref }) => {
      const el = ref.current
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        {
          root: null,
          rootMargin: '-72px 0px -60% 0px',
          threshold: [0, 0.25, 0.5, 1],
        }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 스티키 헤더 표시 여부 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // 매우 낮은 트리거 포인트로 설정하여 빨리 나타나도록 함
      const triggerPoint = 50
      const shouldShow = scrollY > triggerPoint
      setShowStickyHeader(shouldShow)
      console.log('Scroll Y:', scrollY, 'Trigger:', triggerPoint, 'Show sticky:', shouldShow, 'State:', showStickyHeader)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기 상태 설정
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showStickyHeader])

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
  const canBook = Boolean(selectedDate) && quantity >= 1

  const toBulletedList = (html: string): string => {
    if (!html || typeof html !== 'string') return ''
    if (html.includes('<ul')) {
      return html.replace('<ul', '<ul class="list-disc pl-5 space-y-1"')
    }
    return `<ul class="list-disc pl-5 space-y-1">${html}</ul>`
  }

  return (
    <div className="min-h-screen bg-white overflow-visible">
      <AppHeader active="tours" mobileTitle={tour.title} />
      
      {/* 스티키 헤더 - sticky로 설정하고 z-index 50으로 높임 */}
      {showStickyHeader && (
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{tour.title}</h1>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeSection === section.id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {section.label}
                  <span className={`absolute left-0 right-0 -bottom-px h-0.5 transition-all ${
                    activeSection === section.id ? 'bg-blue-600' : 'bg-transparent'
                  }`}></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      


      <div className="max-w-7xl mx-auto px-4 pt-20 pb-24">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 booking-grid min-w-0">
          <div className="lg:col-span-2 min-w-0">
            <TourImageGallery images={tour.images} title={tour.title} />
            <TourHeader location={tour.location} title={tour.title} subtitle={tour.subtitle} />
            <div className="mb-6">
              {typeof tour.discountRate === 'number' && tour.discountRate > 0 && (
                <div className="text-lg text-gray-500 line-through mb-1">${tour.originalPrice}</div>
              )}
              <div className="flex items-center gap-2 md:gap-3">
                {typeof tour.discountRate === 'number' && tour.discountRate > 0 && (
                  <span className="text-2xl font-bold text-red-500">{tour.discountRate}%</span>
                )}
                <span className="text-2xl md:text-3xl font-bold text-blue-600">${tour.price}</span>
              </div>
              <TourStats
                durationCode={tourData.filter.duration}
                languages={tourData.filter.language?.filter(Boolean)}
                confirmHour={tourData.summary.confirm_hour}
                voucherType={tourData.summary.voucher_type}
                productPolicies={tourData.summary.product_policies}
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
              <h3 className="text-[22px] font-semibold mb-6">Option Selection</h3>
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
              <h3 className="text-[22px] font-semibold mb-6">Usage Guide</h3>
              <div className="space-y-6">
                {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
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
                )}

                <div className="space-y-8">
                  {/* Meeting Point */}
                  {tourData.detail.additional_fields.find(field => field.key === 'meetingPoint') && (
                    <div className="border-l-4 border-blue-500 pl-6">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <h4 className="text-lg font-semibold text-gray-900">Meeting Point</h4>
                      </div>
                      <div 
                        className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: tourData.detail.additional_fields.find(field => field.key === 'meetingPoint')?.content || '' 
                        }}
                      />
                    </div>
                  )}

                  

                  {/* What's Included / Not Included */}
                  <div className="grid gap-8 md:grid-cols-2 pt-4 border-t border-gray-200">
                    <div className="border-l-4 border-green-500 pl-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Check className="w-5 h-5 text-green-600" />
                        <h4 className="text-lg font-semibold text-gray-900">What's Included</h4>
                      </div>
                    <div className="space-y-2">
                      {tour.included.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                    <div className="border-l-4 border-red-500 pl-6">
                      <div className="flex items-center gap-3 mb-4">
                        <X className="w-5 h-5 text-red-600" />
                        <h4 className="text-lg font-semibold text-gray-900">What's Not Included</h4>
                      </div>
                    <div className="space-y-2">
                      {tour.notIncluded.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                  {/* Important information (titles only, open modal on click) */}
                  <div className="mt-2 rounded-xl border border-purple-200 bg-purple-50/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Info className="w-4 h-4 text-purple-600" />
              </div>
                      <h4 className="text-[18px] font-semibold text-purple-900">Important information</h4>
            </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tourData.detail.additional_fields.find(f => f.key === 'bringItem') && (
                        <button
                          type="button"
                          onClick={() => setInfoModal({
                            title: 'What to Bring',
                            content: toBulletedList(tourData.detail.additional_fields.find(f => f.key === 'bringItem')?.content || '')
                          })}
                          className="group flex items-center justify-between rounded-lg border border-purple-200 bg-white px-4 py-3 hover:bg-purple-50/60 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-sm text-gray-800">
                            <Package className="w-4 h-4 text-orange-500" /> What to Bring
                          </span>
                          <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600" />
                        </button>
                      )}

                      {tourData.detail.additional_fields.find(f => f.key === 'notAllowed') && (
                        <button
                          type="button"
                          onClick={() => setInfoModal({
                            title: 'Not Allowed',
                            content: toBulletedList(tourData.detail.additional_fields.find(f => f.key === 'notAllowed')?.content || '')
                          })}
                          className="group flex items-center justify-between rounded-lg border border-purple-200 bg-white px-4 py-3 hover:bg-purple-50/60 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-sm text-gray-800">
                            <XCircle className="w-4 h-4 text-red-500" /> Not Allowed
                          </span>
                          <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600" />
                        </button>
                      )}

                      {tourData.detail.additional_fields.find(f => f.key === 'notSuitable') && (
                        <button
                          type="button"
                          onClick={() => setInfoModal({
                            title: 'Not Suitable For',
                            content: toBulletedList(tourData.detail.additional_fields.find(f => f.key === 'notSuitable')?.content || '')
                          })}
                          className="group flex items-center justify-between rounded-lg border border-purple-200 bg-white px-4 py-3 hover:bg-purple-50/60 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-sm text-gray-800">
                            <AlertTriangle className="w-4 h-4 text-yellow-500" /> Not Suitable For
                          </span>
                          <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600" />
                        </button>
                      )}

                      {tourData.detail.additional_info && (
                        <button
                          type="button"
                          onClick={() => setInfoModal({
                            title: 'Before you travel',
                            content: toBulletedList(tourData.detail.additional_info)
                          })}
                          className="group flex items-center justify-between rounded-lg border border-purple-200 bg-white px-4 py-3 hover:bg-purple-50/60 transition-colors"
                        >
                          <span className="flex items-center gap-2 text-sm text-gray-800">
                            <Check className="w-4 h-4 text-purple-600" /> Before you travel
                          </span>
                          <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-purple-600" />
                        </button>
                      )}
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
                onShowLess={() => setShowAllReviews(false)}
                maskName={maskName}
                starColor={STAR_COLOR}
              />
                    </div>
                    </div>

          <div className="lg:col-span-1 sidebar">
            <div className="lg:sticky lg:top-24">
              <TourBookingCard
                discountRate={tour.discountRate}
                originalPrice={tour.originalPrice}
                price={tour.price}
                selectedDate={selectedDate}
                quantity={quantity}
                onBook={handleBooking}
              />
            </div>
            <div className="fixed inset-x-0 bottom-0 z-40 bg-white/90 backdrop-blur border-t p-3 lg:hidden">
              <div className="max-w-7xl mx-auto px-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-lg font-semibold text-blue-600">${totalPrice}</div>
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={!canBook}
                    className="px-5 py-3 rounded-lg bg-black text-white disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {canBook ? 'Book now' : 'Select date & qty'}
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
              </div>
            </div>
      {/* Info Modal */}
      {infoModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                {infoModal.title === 'What to Bring' && <Package className="w-4 h-4 text-orange-500" />}
                {infoModal.title === 'Not Allowed' && <XCircle className="w-4 h-4 text-red-500" />}
                {infoModal.title === 'Not Suitable For' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                {infoModal.title === 'Before you travel' && <Check className="w-4 h-4 text-purple-600" />}
                <h4 className="text-base font-semibold text-gray-900">{infoModal.title}</h4>
          </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={() => setInfoModal(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
            <div className="p-4 text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: infoModal.content }} />
            <div className="p-4 pt-0 flex justify-end">
              <button className="px-4 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-black" onClick={() => setInfoModal(null)}>
                Close
                        </button>
                  </div>
                    </div>
                    </div>
                  )}
    </div>
  )
}
