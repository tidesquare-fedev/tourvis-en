import { TourApiResponse } from '@/types/tour'
import TourDetailClient from './TourDetailClient'
import { getProductDetailV2Cached, getProductDatesV2 } from '@/lib/api/tna-v2'

interface TourDetailPageProps {
  params: { id: string }
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  // 상품 ID에 따라 다른 데이터 반환 (모의 데이터 사용 금지)
  const getMockTourData = (id: string): TourApiResponse => {
    if (id === 'PRD2001371482') {
      // 아우슈비츠 투어 데이터
      return {
        basic: {
          code: null,
          provider_code: "PRV3006455682",
          name: "크라쿠프: 픽업 및 점심 옵션이 포함 된 아우슈비츠 가이드 투어",
          sub_name: "크라쿠프: 픽업 및 점심 옵션이 포함 된 아우",
          calendar_type: "DATE",
          price_scope: "DATE",
          timeslot_is: true,
          inventory_scope: "LABEL_TIMESLOT",
          need_reservation: false,
          min_book_days: 0,
          working_date_type: "PROVIDER",
          latitude: "50.0592719",
          longitude: "19.9428865",
          timezone: "Europe/Warsaw",
          sort_order: 100,
          booking_type: "AUTO",
          max_book_days: 365,
          min_participants: 1,
          max_participants: 20,
          duration: 360,
          duration_unit: "MINUTE",
          meeting_point: "위엘로폴 2 (키스&라이드 정류장)",
          meeting_point_address: "크라쿠프, 폴란드",
          meeting_point_latitude: 50.0592719,
          meeting_point_longitude: 19.9428865,
          meeting_point_description: "미팅 포인트는 예약한 옵션에 따라 다를 수 있습니다",
          meeting_point_image: null,
          cancellation_policy: "CONDITIONAL",
          cancellation_hours: 24,
          cancellation_description: "조건부 취소 정책",
          instant_confirmation: true,
          mobile_voucher: true,
          print_voucher: false,
          languages: ["ENGLISH", "ETC"],
          included: [
            "가이드",
            "호텔 또는 미팅 포인트에서 픽업 (선택한 옵션에 따라 다름)",
            "에어컨이 완비된 편안한 버스로 왕복 교통편 제공",
            "우선입장 티켓",
            "햄, 후무스, 치즈가 포함된 도시락(옵션 선택 시)"
          ],
          excluded: [],
          areas: [
            { code: "4826", name: "오시비엥침" },
            { code: "100171", name: "폴란드" },
            { code: "14169", name: "크라쿠프" }
          ],
          categories: [
            { code: "CG70", name: "일일투어" },
            { code: "CG35", name: "역사/문화 투어" },
            { code: "CG04", name: "역사문화명소" },
            { code: "CG28", name: "워킹투어" },
            { code: "CG19", name: "익스트림 액티비티" }
          ],
          reviews: [
            {
              id: 1,
              name: "김**",
              rating: 5,
              comment: "정말 의미있는 투어였습니다. 가이드분이 친절하고 설명도 잘해주셨어요.",
              date: "2024-01-15",
              helpful: 8
            },
            {
              id: 2, 
              name: "이**",
              rating: 4,
              comment: "역사적으로 중요한 장소를 방문할 수 있어서 좋았습니다.",
              date: "2024-01-10",
              helpful: 5
            }
          ],
          available_dates: [],
          timeslots: [],
          price: 89,
          originalPrice: 120,
          discountRate: 26,
          currency: "EUR",
          bring_items: ["여권 또는 신분증"],
          not_allowed: ["수하물 또는 큰 가방"],
          not_suitable: ["만 12세 미만의 어린이", "휠체어 사용자"],
          additional_info: "예약 시 제공된 이름과 입장 시 제시한 신분증의 이름이 일치해야 합니다.",
          images: [
            "https://cdn.getyourguide.com/img/tour/63613fcaed711.jpeg/145.jpg",
            "https://cdn.getyourguide.com/img/tour/636f83dbd45e4.jpeg/145.jpg",
            "https://cdn.getyourguide.com/img/tour/5b686bf34ff6e.jpeg/145.jpg",
            "https://cdn.getyourguide.com/img/tour/5b686bf3a279e.jpeg/145.jpg",
            "https://cdn.getyourguide.com/img/tour/5b686bf631d22.jpeg/145.jpg"
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
          duration: "OV6H",
          depart_hour: []
        },
        detail: {
          notice_title: null,
          notice_detail: null,
          highlight_title: "아우슈비츠-비르케나우 가이드 투어를 통해 20세기 유럽 역사에서 가장 어두운 장 중 하나였던 아우슈비츠를 탐험하세요. 가이드의 도움을 받아 강제 수용소의 원래 건물을 둘러보세요.",
          highlight_detail: "<ul><li>제2차 세계대전 당시 유럽의 어두운 역사 탐험하기</li><li>아우슈비츠와 비르케나우 강제 수용소를 가슴 아프게 둘러보세요.</li><li>나치가 잔학 행위를 저지른 장소를 확인하고 희생자들의 개인 유물을 살펴보세요.</li></ul>",
          highlights: [
            "아우슈비츠 제1 수용소 방문",
            "비르케나우 수용소 투어", 
            "전문 가이드 설명",
            "왕복 교통편 제공",
            "우선입장 티켓"
          ],
          event: "",
          description: "<p>크라쿠프를 출발하여 아우슈비츠-비르케나우 기념관 및 박물관으로 이동하여 나치에 의해 지어진 폴란드 최대의 강제 수용소를 둘러보세요. 전문 가이드와 함께 아우슈비츠 제1 수용소와 아우슈비츠 제2 수용소를 가슴 아프게 둘러보세요.<br><br>도착하자마자 점심을 먹으며 잠시 휴식을 취한 후 아우슈비츠 제1 수용소를 둘러보며 악명 높은 '노동의 대가' 표지판과 공포가 계획된 관리 건물을 둘러보세요.<br>나치가 끔찍한 대량 학살을 저지른 가스실 내부를 살펴보고, 수감자들을 추모하는 전시회에서 수감자들의 개인 유물을 관람하세요.<br><br>비르케나우 수용소로 이동하기 전 15분간의 짧은 휴식을 취한 후 1시간 동안 가이드 투어를 진행합니다. 수감자들이 수용소에 들어온 곳과 그들이 강제로 생활해야 했던 나무 막사를 둘러보세요.<br>크라쿠프로 돌아와 구시가지 또는 구 유대인 지구에서 원하는 장소에서 하차하세요.<p>",
          preparations: "",
          how_to_use: "",
          warnings: "",
          additional_info: "<ul><li>예약 시 제공된 이름과 입장 시 제시한 신분증의 이름이 일치하지 않을 경우 입장이 거부될 수 있습니다.</li><li>픽업 시간이 변경될 수 있습니다(투어 시작 시간은 오전 5:30부터 오후 1:30까지 가능)<br>일정을 계획할 때 이 점을 고려하시기 바랍니다<br>원하는 시간을 선택할 수 있지만, 해당 시간이 보장되지는 않습니다<br>예외적인 상황에서는 출발 시간이 언급된 시간보다 빠르거나 늦어질 수 있습니다.</li><li>투어 시간은 기념관 방문자 서비스에 의해 결정됩니다.</li><li>온라인으로 아우슈비츠 예약이 불가능한 경우, 티켓을 구매하기 위해 줄을 서서 기다려야 합니다<br>대기 시간은 방문객 수에 따라 다르며, 박물관 및 투어 운영사는 이에 대해 어떠한 영향력도 행사할 수 없습니다.</li><li>이 상품은 영어로 작성되어 있으며, 운영사는 다른 언어로의 번역에 대한 오류에 대해 책임을 지지 않습니다.</li><li>운영사의 통제 범위를 벗어난 사유로 투어가 취소될 수 있습니다<br>이 경우, 고객은 전액 환불을 받게 됩니다.</li></ul>",
          meeting_address: "",
          meeting_latitude: "",
          meeting_longitude: "",
          meeting_info: "",
          pickup_drop: "<p><ul><li><b>픽업</b><ul><li><b>미팅 포인트에서 픽업이 포함된 영어 투어</b><ul><li>투어 하루 전에 정확한 출발 시간을 안내해 드리겠습니다.</ul></li></ul></li><br><ul><li><b>미팅 포인트에서 픽업이 포함된 영어로 진행되는 막바지 투어</b><ul><li>가이드가 선택하신 미팅 포인트에서 픽업해 드립니다. 전날에 정확한 출발 시간과 버스 번호를 알려드립니다.</ul></li></ul></li><br><ul><li><b>프라이빗 호텔 교통편이 포함된 영어 가이드 그룹 투어</b><ul><li>크라쿠프에 있는 호텔이나 아파트에서 픽업 서비스를 받으세요.</ul></li></ul></li><br><ul><li><b>호텔 픽업 서비스가 포함된 프랑스어 가이드 투어</b><ul><li>오전 6시에서 오후 1시 30분 사이에 호텔에서 픽업 서비스를 받으실 수 있습니다.</ul></li></ul></li><br><ul><li><b>프라이빗 호텔 교통편이 포함 된 독일 가이드 그룹 투어</b><ul><li>크라쿠프 구시가지 또는 구 유대인 지구(카지미에츠)에 있는 호텔이나 아파트에서 픽업 서비스를 받으실 수 있습니다. 운전 기사가 해당 지역에 정차할 수 없는 경우 가능한 한 가까운 다른 장소로 이동합니다.</ul></li></ul></li><br><ul><li><b>프라이빗 호텔 교통편이 포함 된 프랑스 가이드 그룹 투어</b><ul><li>크라쿠프 구시가지 또는 구 유대인 지구(카지미에츠)에 있는 호텔이나 아파트에서 픽업 서비스를 받으실 수 있습니다. 운전 기사가 해당 지역에 정차할 수 없는 경우 가능한 한 가까운 다른 장소로 이동합니다.</ul></li></ul></li><br><ul><li><b>프라이빗 호텔 교통편이 포함 된 스페인어 가이드 그룹 투어</b><ul><li>크라쿠프 구시가지 또는 구 유대인 지구(카지미에츠)에 있는 호텔이나 아파트에서 픽업 서비스를 받으실 수 있습니다. 운전 기사가 해당 지역에 정차할 수 없는 경우 가능한 한 가까운 다른 장소로 이동합니다.</ul></li></ul></li></ul></li><p>",
          includes: "가이드\n호텔 또는 미팅 포인트에서 픽업 (선택한 옵션에 따라 다름)\n에어컨이 완비된 편안한 버스로 왕복 교통편 제공\n우선입장 티켓\n햄, 후무스, 치즈가 포함된 도시락(옵션 선택 시)",
          meeting_image: null,
          excludes: "",
          qnas: [],
          primary_image: {
            display_name: "1",
            file_url: "https://cdn.getyourguide.com/img/tour/63613fcaed711.jpeg/145.jpg",
            file_size: 100
          },
          images: [
            { display_name: "1", file_url: "https://cdn.getyourguide.com/img/tour/63613fcaed711.jpeg/145.jpg", file_size: 100 },
            { display_name: "2", file_url: "https://cdn.getyourguide.com/img/tour/636f83dbd45e4.jpeg/145.jpg", file_size: 100 },
            { display_name: "3", file_url: "https://cdn.getyourguide.com/img/tour/5b686bf34ff6e.jpeg/145.jpg", file_size: 100 },
            { display_name: "4", file_url: "https://cdn.getyourguide.com/img/tour/5b686bf3a279e.jpeg/145.jpg", file_size: 100 },
            { display_name: "5", file_url: "https://cdn.getyourguide.com/img/tour/5b686bf631d22.jpeg/145.jpg", file_size: 100 }
          ],
          itinerary: [
            {
              day: 1,
              title: "크라쿠프 출발",
              description: "크라쿠프에서 아우슈비츠로 이동합니다.",
              duration: "1시간 30분",
              activities: [
                "호텔 또는 미팅 포인트에서 픽업",
                "편안한 버스로 이동",
                "가이드의 사전 설명"
              ]
            },
            {
              day: 2,
              title: "아우슈비츠 제1 수용소",
              description: "아우슈비츠 제1 수용소를 둘러보며 역사적 의미를 되새깁니다.",
              duration: "2시간",
              activities: [
                "노동의 대가 표지판 관람",
                "관리 건물 방문",
                "가스실 내부 탐방",
                "수감자 유물 전시회 관람"
              ]
            },
            {
              day: 3,
              title: "비르케나우 수용소",
              description: "비르케나우 수용소에서 수감자들의 생활을 엿볼 수 있습니다.",
              duration: "1시간",
              activities: [
                "수용소 입구 방문",
                "나무 막사 관람",
                "기차 선로 탐방",
                "추모 공간 방문"
              ]
            },
            {
              day: 4,
              title: "크라쿠프 복귀",
              description: "투어를 마치고 크라쿠프로 돌아갑니다.",
              duration: "1시간 30분",
              activities: [
                "버스로 복귀",
                "구시가지 또는 유대인 지구 하차",
                "투어 마무리"
              ]
            }
          ],
          additional_fields: [
            {
              key: "meetingPoint",
              title: "미팅포인트",
              content: "<p><p>미팅 포인트는 예약한 옵션에 따라 다를 수 있습니다.</p><br><ul><li><b>선택한 미팅 포인트에서 출발하는 프랑스어 가이드 투어</b> <a href='https://maps.google.com/?q=50.0592719,19.9428865' target='_blank' >(구글맵 바로가기)</a></br><br>위엘로폴 2 (키스&라이드 정류장)</li></ul><p>"
            },
            {
              key: "notSuitable",
              title: "참가가 어려워요",
              content: "<li>만 12세 미만의 어린이</li>\n<li>휠체어 사용자</li>"
            },
            {
              key: "bringItem",
              title: "준비물",
              content: "<li>여권 또는 신분증</li>"
            },
            {
              key: "notAllowed",
              title: "허용되지 않아요",
              content: "<li>수하물 또는 큰 가방</li>"
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
        memo: "",
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
          per_min: 0,
          per_max: 5014,
          outer_id: null,
          booking_api_is: true,
          resell_is: null,
          options: [
            {
              code: "OPT3007126384",
              title: "미팅 포인트에서 영어 투어",
              description: "원하는 출발 시간과 미팅 장소를 선택하세요. 오전 6시에서 오후 1시 30분 사이에 출발이 가능합니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796701",
              sort_order: 0,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892595",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892593",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892594",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007126385",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892596",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892597",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892598",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007134203",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007126390",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007126391",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007773993",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007126392",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892599",
              title: "호텔 픽업 서비스 가이드 투어",
              description: "호텔과 원하는 출발 시간을 선택하세요. 오전 6시~오후 1시 30분 사이에 출발 가능합니다. 원하는 시간을 선택하실 수 있지만 보장되지 않습니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^316219",
              sort_order: 1,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892603",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892601",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892602",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892600",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892604",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892605",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892606",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892618",
              title: "선택한 미팅 포인트에서 출발하는 독일어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796702",
              sort_order: 2,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892619",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892620",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892621",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892622",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892623",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892624",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892625",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892626",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892627",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892628",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892629",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892630",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007676722",
              title: "미팅 포인트에서 이탈리아어 투어",
              description: "미팅 장소와 원하는 출발 시간을 선택하세요. 당사는 이를 보장할 수는 없지만 최선을 다해 조정합니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다. 오전 6시~오후 1시 30분 사이에 출발이 가능합니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796699",
              sort_order: 3,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007676723",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007676724",
                  title: "어린이(나이 5-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892613",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007676725",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007676726",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007676727",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892614",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007676728",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892615",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892616",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892617",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007676731",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892631",
              title: "선택한 미팅 포인트에서 출발하는 프랑스어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796700",
              sort_order: 4,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892632",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892633",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892634",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892635",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892636",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892637",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892638",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892639",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892640",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892641",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892642",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892643",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892644",
              title: "선택한 미팅 포인트에서 출발하는 스페인어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796703",
              sort_order: 5,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892645",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892646",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892647",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892648",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892649",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892650",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892651",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892652",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892653",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892654",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892655",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892656",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892657",
              title: "선택한 미팅 포인트에서 출발하는 포르투갈어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796704",
              sort_order: 6,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892658",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892659",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892660",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892661",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892662",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892663",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892664",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892665",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892666",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892667",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892668",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892669",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892670",
              title: "선택한 미팅 포인트에서 출발하는 러시아어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796705",
              sort_order: 7,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892671",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892672",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892673",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892674",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892675",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892676",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892677",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892678",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892679",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892680",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892681",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892682",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892683",
              title: "선택한 미팅 포인트에서 출발하는 일본어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796706",
              sort_order: 8,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892684",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892685",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892686",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892687",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892688",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892689",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892690",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892691",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892692",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892693",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892694",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892695",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892696",
              title: "선택한 미팅 포인트에서 출발하는 중국어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796707",
              sort_order: 9,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892697",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892698",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892699",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892700",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892701",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892702",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892703",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892704",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892705",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892706",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892707",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892708",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            },
            {
              code: "OPT3007892709",
              title: "선택한 미팅 포인트에서 출발하는 한국어 가이드 투어",
              description: "원하는 출발 시간과 크라쿠프 시내의 여러 미팅 포인트 중 하나를 선택하세요. 오전 6시부터 오후 1시 30분 사이에 출발하실 수 있습니다. 원하는 시간이 보장되는 것은 아닙니다. 투어 하루 전에 정확한 출발 시간을 알려드립니다.",
              per_min: 1,
              per_max: 5014,
              outer_id: "157299^796708",
              sort_order: 10,
              sale_start_date: null,
              sale_end_date: null,
              use_start_date: null,
              use_end_date: null,
              use_period: null,
              stock_quantity: null,
              labels: [
                {
                  code: "LAB3007892710",
                  title: "성인(나이 18-64)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: true,
                  outer_id: "ADULT;1;INDIVIDUALS",
                  sort_order: 0,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892711",
                  title: "어린이(나이 5-12)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "CHILD;3;INDIVIDUALS",
                  sort_order: 1,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892712",
                  title: "청소년(나이 13-17)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "YOUTH;2;INDIVIDUALS",
                  sort_order: 2,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892713",
                  title: "유아(나이 0-4)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "INFANT;4;INDIVIDUALS",
                  sort_order: 3,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892714",
                  title: "학생(나이 18-26)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "STUDENT;6;INDIVIDUALS",
                  sort_order: 4,
                  per_min: null,
                  per_max: 5014
                },
                {
                  code: "LAB3007892715",
                  title: "시니어(나이 65-99)",
                  net_price_currency: 0,
                  sale_price_currency: null,
                  normal_price_currency: null,
                  required: false,
                  outer_id: "SENIOR;5;INDIVIDUALS",
                  sort_order: 5,
                  per_min: null,
                  per_max: 5014
                }
              ],
              timeslots: [
                {
                  code: "TSL3007892716",
                  title: "06:00",
                  description: null,
                  outer_id: "06:00",
                  sort_order: 0
                },
                {
                  code: "TSL3007892717",
                  title: "07:00",
                  description: null,
                  outer_id: "07:00",
                  sort_order: 1
                },
                {
                  code: "TSL3007892718",
                  title: "08:00",
                  description: null,
                  outer_id: "08:00",
                  sort_order: 2
                },
                {
                  code: "TSL3007892719",
                  title: "09:00",
                  description: null,
                  outer_id: "09:00",
                  sort_order: 3
                },
                {
                  code: "TSL3007892720",
                  title: "10:00",
                  description: null,
                  outer_id: "10:00",
                  sort_order: 4
                },
                {
                  code: "TSL3007892721",
                  title: "11:00",
                  description: null,
                  outer_id: "11:00",
                  sort_order: 5
                }
              ],
              dynamic_price: false,
              attrs: null,
              resell_is: false
            }
          ]
        }
      }
    }
    
    // 기본 바티칸 투어 데이터 (기존 데이터)
    return {
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
      max_book_days: 365,
      min_participants: 1,
      max_participants: 20,
      duration: 240,
      duration_unit: "MINUTE",
      meeting_point: "크라운 투어스 사무실",
      meeting_point_address: "비아 모체니고 15번지, 로마",
      meeting_point_latitude: 41.9076077,
      meeting_point_longitude: 12.4516077,
      meeting_point_description: "바티칸 박물관에서 약 2분 거리",
      meeting_point_image: null,
      cancellation_policy: "CONDITIONAL",
      cancellation_hours: 24,
      cancellation_description: "조건부 취소 정책",
      instant_confirmation: true,
      mobile_voucher: true,
      print_voucher: false,
      languages: ["ENGLISH", "ETC"],
      included: [
        "바티칸 박물관 및 시스티나 성당 우선입장 티켓으로 입장 가능",
        "성 베드로 대성당 우선입장 티켓 스킵 (일부 옵션으로 이용 가능)",
        "열정적이고 전문적인 라이센스 투어 가이드",
        "가이드의 설명을 명확하게 들을 수 있는 오디오 시스템",
        "원활한 시작을위한 미팅 포인트에서의 지원",
        "미팅 포인트에서 무료 와이파이 제공",
        "크라운 투어 앱을 통한 독점 디지털 콘텐츠, 지도 및 팁 제공"
      ],
      excluded: [
        "개인 비용",
        "팁 (선택사항)",
        "식사"
      ],
      bring_items: [
        "편한 신발",
        "여권 또는 신분증(사본 허용)"
      ],
      not_allowed: [
        "반바지",
        "짧은 치마",
        "민소매 셔츠"
      ],
      not_suitable: [
        "휠체어 사용자"
      ],
      additional_info: "바티칸 박물관은 세계에서 가장 유명한 박물관 중 하나입니다. 미켈란젤로의 시스티나 성당과 라파엘로의 방들을 포함한 수많은 예술 작품을 감상할 수 있습니다.",
      images: [
        "https://cdn.getyourguide.com/img/tour/a05866aaf07a1c1a7bd66074b53bebd7877ab261eefc1efd7b57e6b6b3c64714.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/675fa45a06605bb1c4dfe1096eee6b986062f520547e174837bde2a6e1d4b417.jpeg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/66157649959eed06e162dfde8795eb1da315dd167ce40687236fcfa00a6d0059.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/54ed558038a28c8f406ff4c2b776cad0cab6fa38216609e74e76ee22c9a28609.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/feea8a72dc654be8bc092856bbfc79f576740dd313089cbb47546633ddda3934.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/401305c94a90ce53a34dab2ef67d492acaa162506066ab78532ddd7245df1af1.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/22d934a42f97cbcd1f56357d541eee3eeaab0217ac4c83ccfd235223597f48e1.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/0a8ba01596768332caa0af4b3cd49b706207eba316530a77a23b13e1ce6cbcd7.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/f6989f6c5df2f64b0e44aa90adff7cf8cc08ce9c9912b9cec1822659e1925dcf.jpg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/62465b897a49cd64.jpeg/145.jpg",
        "https://cdn.getyourguide.com/img/tour/55117b356dacbc34d60a5c9ccc10b0549b996bdf039ab084ea84a202e7859711.jpeg/145.jpg"
      ],
      reviews: [
        {
          id: 1,
          name: "K** M**-s*",
          rating: 5,
          date: "2025.06.09",
          comment: "정말 좋은 경험이었습니다. 가이드가 친절하고 시스티나 성당이 너무 아름다웠어요!",
          helpful: 31
        },
        {
          id: 2,
          name: "L** S**-y***",
          rating: 5,
          date: "2025.06.16",
          comment: "바티칸 박물관의 예술 작품들이 정말 인상적이었습니다. 우선입장으로 대기시간 없이 관람할 수 있어서 좋았어요.",
          helpful: 15
        },
        {
          id: 3,
          name: "C*** M**-j***",
          rating: 5,
          date: "2025.04.10",
          comment: "성 베드로 대성당까지 포함된 투어로 정말 알찬 하루였습니다. 추천합니다!",
          helpful: 8
        },
        {
          id: 4,
          name: "J*** H*-s***",
          rating: 5,
          date: "2025.03.18",
          comment: "소그룹으로 진행되어 더욱 집중해서 관람할 수 있었습니다. 가이드님이 역사적 배경도 잘 설명해주셨어요.",
          helpful: 12
        },
        {
          id: 5,
          name: "P*** J*-h***",
          rating: 4,
          date: "2025.05.22",
          comment: "가이드의 설명이 매우 상세했고, 미켈란젤로의 작품을 직접 볼 수 있어서 감동적이었습니다.",
          helpful: 12
        }
      ],
      price: 0,
      originalPrice: 0,
      discountRate: 0,
      currency: "EUR",
      available_dates: [
        "2024-09-01", "2024-09-02", "2024-09-03", "2024-09-04", "2024-09-05",
        "2024-09-06", "2024-09-07", "2024-09-08", "2024-09-09", "2024-09-10",
        "2024-09-11", "2024-09-12", "2024-09-13", "2024-09-14", "2024-09-15",
        "2024-09-16", "2024-09-17", "2024-09-18", "2024-09-19", "2024-09-20",
        "2024-09-21", "2024-09-22", "2024-09-23", "2024-09-24", "2024-09-25",
        "2024-09-26", "2024-09-27", "2024-09-28", "2024-09-29", "2024-09-30"
      ],
      timeslots: [
        {
          id: "morning",
          name: "오전 투어",
          start_time: "09:00",
          end_time: "13:00",
          price: 0,
          available: true
        },
        {
          id: "afternoon",
          name: "오후 투어",
          start_time: "14:00",
          end_time: "18:00",
          price: 0,
          available: true
        }
      ],
      working_date_type: "PROVIDER",
      latitude: "41.903111",
      longitude: "12.49576",
      timezone: null,
      sort_order: 100,
      booking_type: "AUTO",
      areas: [
        {
          code: "5418",
          name: "로마"
        },
        {
          code: "100104",
          name: "이탈리아"
        }
      ],
      categories: [
        {
          code: "CG04",
          name: "역사문화명소"
        },
        {
          code: "CG70",
          name: "일일투어"
        },
        {
          code: "CG28",
          name: "워킹투어"
        },
        {
          code: "CG03",
          name: "박물관/미술관/전시"
        },
        {
          code: "CG14",
          name: "요트/유람선"
        },
        {
          code: "CG37",
          name: "문화체험"
        },
        {
          code: "CG55",
          name: "보트/페리"
        }
      ]
    },
    detail: {
      notice_title: null,
      notice_detail: null,
      highlight_title: "바티칸 박물관과 시스티나 성당을 우선입장하고 성 베드로 대성당 방문을 선택하실 수 있습니다. 원하는 체험을 선택하고 스트레스 없이 바티칸의 걸작을 둘러보세요.",
      highlight_detail: "<ul><li>바티칸 박물관의 주요 명소를 우선 입장할 수 있습니다.</li><li>바티칸의 지도 갤러리, 거대한 타피스트리, 고대 로툰다 조각상을 감상하세요.</li><li>시스티나 성당에서 미켈란젤로의 걸작들을 감상하세요.</li><li>피에타와 베르니니의 발다키니를 포함한 성 베드로 대성당을 탐험하기 위해 업그레이드하세요.</li><li>전문가 안내로 진행되는 스토리텔링을 통해 바티칸의 예술과 역사가 생생하게 살아납니다.</li></ul>",
      event: "",
      description: "<p>바티칸은 매우 넓고, 솔직히 말해 혼자 탐험하기에는 압도적일 수 있습니다. 바로 이 때문에 저희 전문 가이드가 함께합니다. 주요 명소를 직접 안내해 드려 놓치는 것 없이 완벽한 경험을 선사합니다.<br><br>놀라운 바티칸 박물관에서 독점적인 우선입장 혜택을 누리며 세기의 예술, 역사, 숨막히는 천장 예술이 가득한 보물 창고를 탐험하세요. 함께 걸어갈 곳은:<br><br>벽걸이 갤러리: 거대한 복잡하게 엮인 걸작들이 놀라운 이야기를 전합니다.<br><br>다음으로 숨막히는 시스티나 성당으로 들어갑니다. 사진은 봤을지 몰라도, 미켈란젤로의 아이콘적인 프레스코화 아래 서 있는 것은 비교할 수 없습니다. \"아담의 창조\"와 \"최후의 심판\"을 올려다보며, 미켈란젤로가 모든 놀라운 세부 사항을 열심히 그렸을 모습을 상상해 보세요.<br><br>전체 체험을 선택하신 분들은 미켈란젤로의 감동적인 피에타와 베르니니의 화려한 청동 발다키노가 있는 위풍당당한 성 베드로 대성당으로 계속 진행하세요.<br><br>여행은 대성당 밖에서 마무리되며, 성 베드로 광장을 탐험하거나 근처의 카스텔 산탄젤로를 여유롭게 탐방할 수 있는 충분한 시간이 주어집니다.<p>",
      highlights: [
        "바티칸 박물관의 주요 명소를 우선 입장할 수 있습니다.",
        "바티칸의 지도 갤러리, 거대한 타피스트리, 고대 로툰다 조각상을 감상하세요.",
        "시스티나 성당에서 미켈란젤로의 걸작들을 감상하세요.",
        "피에타와 베르니니의 발다키니를 포함한 성 베드로 대성당을 탐험하기 위해 업그레이드하세요.",
        "전문가 안내로 진행되는 스토리텔링을 통해 바티칸의 예술과 역사가 생생하게 살아납니다."
      ],
      itinerary: [
        {
          day: 1,
          title: "바티칸 박물관 투어",
          description: "바티칸 박물관의 주요 전시실들을 순회하며 수많은 예술 작품을 감상합니다.",
          duration: "4시간",
          activities: [
            "09:00 - 미팅 포인트에서 만남",
            "09:30 - 바티칸 박물관 우선 입장",
            "11:00 - 시스티나 성당 관람",
            "12:30 - 투어 종료"
          ]
        }
      ],
      preparations: "",
      how_to_use: "",
      warnings: "",
      additional_info: "<ul><li>세데 바칸테 기간 동안 시스티나 성당은 교황 콘클라베(새 교황 선출)로 인해 사전 통지 없이 일반인에게 공개되지 않습니다<br>이는 바티칸에서 결정한 사항이므로 이 기간 동안 시스티나 성당에 대한 접근이 보장되지 않습니다<br>이러한 휴관 기간에는 환불이나 할인 혜택이 제공되지 않습니다.</li><li>성 베드로 대성당은 수요일 오전(오전 8시~오후 12시), 12월 24일, 12월 31일에 휴관합니다<br>희년 미사 중 종교 의식 또는 군중 통제로 인해 사전 통지 없이 성 베드로 대성당 우선입장이 제한될 수 있습니다.</li><li>오후 3시 이후에 시작하는 성 베드로 대성당을 포함한 투어의 경우, 대성당 방문은 셀프 가이드로 진행됩니다.</li><li>바티칸 박물관은 입장 시간이 엄격하게 정해져 있으므로 늦게 도착하면 입장이 보장되지 않습니다.</li><li>도착 시 보안 검색을 위해 사진이 부착된 유효한 신분증이 필요합니다.</li><li>복장 규정이 엄격하게 적용되며 어깨와 무릎을 가려야 합니다<br>민소매 상의, 로우컷 의상, 무릎 위 반바지, 미니스커트는 허용되지 않습니다.</li></ul>",
      meeting_address: "",
      meeting_latitude: "",
      meeting_longitude: "",
      meeting_info: "",
      pickup_drop: null,
      includes: "바티칸 박물관 및 시스티나 성당 우선입장 티켓으로 입장 가능\n성 베드로 대성당 우선입장 티켓 스킵 (일부 옵션으로 이용 가능)\n열정적이고 전문적인 라이센스 투어 가이드\n가이드의 설명을 명확하게 들을 수 있는 오디오 시스템\n원활한 시작을위한 미팅 포인트에서의 지원\n미팅 포인트에서 무료 와이파이 제공\n크라운 투어 앱을 통한 독점 디지털 콘텐츠, 지도 및 팁 제공",
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
        },
        {
          display_name: "6",
          file_url: "https://cdn.getyourguide.com/img/tour/401305c94a90ce53a34dab2ef67d492acaa162506066ab78532ddd7245df1af1.jpg/145.jpg",
          file_size: 100
        },
        {
          display_name: "7",
          file_url: "https://cdn.getyourguide.com/img/tour/22d934a42f97cbcd1f56357d541eee3eeaab0217ac4c83ccfd235223597f48e1.jpg/145.jpg",
          file_size: 100
        },
        {
          display_name: "8",
          file_url: "https://cdn.getyourguide.com/img/tour/0a8ba01596768332caa0af4b3cd49b706207eba316530a77a23b13e1ce6cbcd7.jpg/145.jpg",
          file_size: 100
        },
        {
          display_name: "9",
          file_url: "https://cdn.getyourguide.com/img/tour/f6989f6c5df2f64b0e44aa90adff7cf8cc08ce9c9912b9cec1822659e1925dcf.jpg/145.jpg",
          file_size: 100
        },
        {
          display_name: "10",
          file_url: "https://cdn.getyourguide.com/img/tour/62465b897a49cd64.jpeg/145.jpg",
          file_size: 100
        },
        {
          display_name: "11",
          file_url: "https://cdn.getyourguide.com/img/tour/55117b356dacbc34d60a5c9ccc10b0549b996bdf039ab084ea84a202e7859711.jpeg/145.jpg",
          file_size: 100
        }
      ],
      additional_fields: [
        {
          key: "meetingPoint",
          title: "미팅포인트",
          content: "<p><p>미팅 포인트는 예약한 옵션에 따라 다를 수 있습니다.</p><br><ul><li><b>영어 가이드 투어 2 곳 (바실리카 없음)</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li><br><li><b>3개 사이트 모두의 영어 가이드 투어</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li><br><li><b>프랑스어 가이드 투어 2 곳 (바실리카 없음)</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li><br><li><b>스페인어 가이드 투어 2 곳 (바실리카 없음)</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li><br><li><b>세 곳 모두 스페인어 가이드 투어</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li><br><li><b>3곳 모두 프랑스어 가이드 투어</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li><br><li><b>독일 가이드 투어 2 곳 (바실리카 없음)</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li><br><li><b>세 곳 모두의 독일어 가이드 투어</b> <a href='https://maps.google.com/?q=41.9076077,12.4516077' target='_blank' >(구글맵 바로가기)</a></br><br>크라운 투어스 사무실은 바티칸 박물관에서 약 2분 거리에 위치한 비아 모체니고 15번지에 있습니다. 바티칸 박물관의 큰 흰색 대리석 출구 맞은편에 있는 계단을 내려가세요. 계단을 내려가면 첫 번째 왼쪽으로 비아 세바스티아노 베니에로로 들어가세요. 길을 따라 직진하여 길 끝까지 가신 후 오른쪽으로 돌면 비아 모체니고에 도착합니다. 사무실 밖에는 보라색 '크라운 투어스' 깃발이 있습니다.</li></ul><p>"
        },
        {
          key: "notSuitable",
          title: "참가가 어려워요",
          content: "<li>휠체어 사용자</li>"
        },
        {
          key: "bringItem",
          title: "준비물",
          content: "<li>편한 신발</li>\n<li>여권 또는 신분증(사본 허용)</li>"
        },
        {
          key: "notAllowed",
          title: "허용되지 않아요",
          content: "<li>반바지</li>\n<li>짧은 치마</li>\n<li>민소매 셔츠</li>"
        }
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
      per_min: 0,
      per_max: 5230,
      outer_id: null,
      booking_api_is: true,
      resell_is: null,
      options: [
        {
          code: "OPT3007903808",
          title: "바티칸 박물관 & 시스티나 성당 영어 투어 (바실리카 없음)",
          description: "활기찬 그룹과 영어를 구사하는 전문 가이드와 함께 바티칸을 탐험하세요. 우선입장 혜택을 누리며 바티칸 박물관, 시스티나 성당, 라파엘 방을 재미있고 사교적인 분위기에서 둘러보세요.",
          per_min: 1,
          per_max: 5230,
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
              code: "LAB3007903809",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007903810",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007903811",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3007903812",
              title: "08:30",
              description: null,
              outer_id: "08:30",
              sort_order: 0
            },
            {
              code: "TSL3008517138",
              title: "09:00",
              description: null,
              outer_id: "09:00",
              sort_order: 1
            },
            {
              code: "TSL3007903813",
              title: "10:00",
              description: null,
              outer_id: "10:00",
              sort_order: 2
            },
            {
              code: "TSL3007903814",
              title: "11:00",
              description: null,
              outer_id: "11:00",
              sort_order: 3
            },
            {
              code: "TSL3008876912",
              title: "12:30",
              description: null,
              outer_id: "12:30",
              sort_order: 4
            },
            {
              code: "TSL3007903815",
              title: "13:30",
              description: null,
              outer_id: "13:30",
              sort_order: 5
            },
            {
              code: "TSL3008517141",
              title: "14:00",
              description: null,
              outer_id: "14:00",
              sort_order: 6
            },
            {
              code: "TSL3007903816",
              title: "14:30",
              description: null,
              outer_id: "14:30",
              sort_order: 7
            },
            {
              code: "TSL3007903817",
              title: "15:30",
              description: null,
              outer_id: "15:30",
              sort_order: 8
            },
            {
              code: "TSL3007903818",
              title: "16:00",
              description: null,
              outer_id: "16:00",
              sort_order: 9
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: "OPT3006933515",
          title: "성 베드로 대성당 특별 액세스가 포함된 영어 투어",
          description: "",
          per_min: 1,
          per_max: 5230,
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
              code: "LAB3006933516",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007518793",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007518794",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3007903819",
              title: "08:30",
              description: null,
              outer_id: "08:30",
              sort_order: 0
            },
            {
              code: "TSL3008517143",
              title: "09:00",
              description: null,
              outer_id: "09:00",
              sort_order: 1
            },
            {
              code: "TSL3007756354",
              title: "10:00",
              description: null,
              outer_id: "10:00",
              sort_order: 2
            },
            {
              code: "TSL3007493536",
              title: "11:00",
              description: null,
              outer_id: "11:00",
              sort_order: 3
            },
            {
              code: "TSL3008876913",
              title: "12:30",
              description: null,
              outer_id: "12:30",
              sort_order: 4
            },
            {
              code: "TSL3006933531",
              title: "13:30",
              description: null,
              outer_id: "13:30",
              sort_order: 5
            },
            {
              code: "TSL3008517146",
              title: "14:00",
              description: null,
              outer_id: "14:00",
              sort_order: 6
            },
            {
              code: "TSL3007903820",
              title: "14:30",
              description: null,
              outer_id: "14:30",
              sort_order: 7
            },
            {
              code: "TSL3007066331",
              title: "15:30",
              description: null,
              outer_id: "15:30",
              sort_order: 8
            },
            {
              code: "TSL3007066332",
              title: "16:00",
              description: null,
              outer_id: "16:00",
              sort_order: 9
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: "OPT3006933535",
          title: "성 베드로 대성당 특별 액세스가 포함된 스페인어 투어",
          description: "",
          per_min: 1,
          per_max: 5230,
          outer_id: "429439^781127",
          sort_order: 2,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: "LAB3006933536",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3006933537",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3006933538",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3006933543",
              title: "11:00",
              description: null,
              outer_id: "11:00",
              sort_order: 0
            },
            {
              code: "TSL3007483326",
              title: "14:30",
              description: null,
              outer_id: "14:30",
              sort_order: 1
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: "OPT3007903821",
          title: "바티칸 박물관 & 시스티나 성당 프랑스어 투어(바티칸 대성당 없음)",
          description: "활기찬 그룹과 프랑스어 전문 가이드와 함께 바티칸을 탐험하세요. 우선입장 혜택을 누리며 바티칸 박물관, 시스티나 성당, 라파엘 방을 재미있고 사교적인 분위기에서 둘러보세요.",
          per_min: 1,
          per_max: 5230,
          outer_id: "429439^1076320",
          sort_order: 3,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: "LAB3007903822",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007903823",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007903824",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3007903825",
              title: "09:00",
              description: null,
              outer_id: "09:00",
              sort_order: 0
            },
            {
              code: "TSL3007903827",
              title: "13:30",
              description: null,
              outer_id: "13:30",
              sort_order: 1
            },
            {
              code: "TSL3009046461",
              title: "13:00",
              description: null,
              outer_id: "13:00",
              sort_order: 2
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: "OPT3006933557",
          title: "성 베드로 대성당 특별 액세스가 포함된 프랑스어 투어",
          description: "",
          per_min: 1,
          per_max: 5230,
          outer_id: "429439^780825",
          sort_order: 4,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: "LAB3006933558",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007505310",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007505311",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3007662911",
              title: "09:00",
              description: null,
              outer_id: "09:00",
              sort_order: 0
            },
            {
              code: "TSL3007505312",
              title: "13:30",
              description: null,
              outer_id: "13:30",
              sort_order: 1
            },
            {
              code: "TSL3009046462",
              title: "13:00",
              description: null,
              outer_id: "13:00",
              sort_order: 2
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: "OPT3007903828",
          title: "바티칸 박물관 & 시스티나 성당 스페인어 투어(대성당 없음)",
          description: "활기찬 그룹과 스페인어를 구사하는 전문 가이드와 함께 바티칸을 탐험하세요. 우선입장 혜택을 누리며 바티칸 박물관, 시스티나 성당, 라파엘 방을 재미있고 사교적인 분위기에서 둘러보세요.",
          per_min: 1,
          per_max: 5230,
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
              code: "LAB3007903829",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007903830",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3007903831",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3007903832",
              title: "11:00",
              description: null,
              outer_id: "11:00",
              sort_order: 0
            },
            {
              code: "TSL3007903834",
              title: "14:30",
              description: null,
              outer_id: "14:30",
              sort_order: 1
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: "OPT3009046463",
          title: "독일 가이드 투어 2 곳 (바실리카 없음)",
          description: "독일어 가이드 투어로 바티칸 박물관과 시스티나 성당을 우선입장하여 하루를 알차게 보내세요.",
          per_min: 1,
          per_max: 5230,
          outer_id: "429439^1076293",
          sort_order: 6,
          sale_start_date: null,
          sale_end_date: null,
          use_start_date: null,
          use_end_date: null,
          use_period: null,
          stock_quantity: null,
          labels: [
            {
              code: "LAB3009046464",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3009046465",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3009046466",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3009046467",
              title: "13:00",
              description: null,
              outer_id: "13:00",
              sort_order: 0
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        },
        {
          code: "OPT3009046468",
          title: "세 곳 모두의 독일어 가이드 투어",
          description: "바티칸 시국이 제공하는 모든 것을 탐험해 보세요. 바티칸 박물관, 시스티나 성당, 성 베드로 대성당에 대한 우선입장권과 독일어 전문 가이드가 있어 대기 시간을 줄이고 바로 관람할 수 있습니다.",
          per_min: 1,
          per_max: 5230,
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
              code: "LAB3009046469",
              title: "성인(나이 18-99)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "ADULT;1;INDIVIDUALS",
              sort_order: 0,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3009046470",
              title: "어린이(나이 7-17)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "CHILD;3;INDIVIDUALS",
              sort_order: 1,
              per_min: null,
              per_max: 5230
            },
            {
              code: "LAB3009046471",
              title: "유아(나이 0-6)",
              net_price_currency: 0,
              sale_price_currency: null,
              normal_price_currency: null,
              required: false,
              outer_id: "INFANT;4;INDIVIDUALS",
              sort_order: 2,
              per_min: null,
              per_max: 5230
            }
          ],
          timeslots: [
            {
              code: "TSL3009046472",
              title: "13:00",
              description: null,
              outer_id: "13:00",
              sort_order: 0
            }
          ],
          dynamic_price: false,
          attrs: null,
          resell_is: false
        }
      ]
    }
  }
}

  // 라우트 파라미터로 전달된 상품 ID 사용
  const productId = decodeURIComponent(params.id)
  // mock 데이터 사용 중지: API 결과만으로 구성하기 위한 기본 스켈레톤
  let base: TourApiResponse = {
    basic: {
      code: null,
      provider_code: '',
      name: '',
      sub_name: '',
      calendar_type: '',
      price_scope: '',
      timeslot_is: false,
      inventory_scope: '',
      need_reservation: false,
      min_book_days: 0,
      max_book_days: 0,
      min_participants: 1,
      max_participants: 10,
      duration: 0,
      duration_unit: 'MINUTE',
      meeting_point: '',
      meeting_point_address: '',
      meeting_point_latitude: 0,
      meeting_point_longitude: 0,
      meeting_point_description: '',
      meeting_point_image: null,
      cancellation_policy: '',
      cancellation_hours: 0,
      cancellation_description: '',
      instant_confirmation: false,
      mobile_voucher: false,
      print_voucher: false,
      languages: [],
      included: [],
      excluded: [],
      bring_items: [],
      not_allowed: [],
      not_suitable: [],
      additional_info: '',
      images: [],
      reviews: [],
      price: 0,
      originalPrice: 0,
      discountRate: 0,
      currency: 'EUR',
      available_dates: [],
      available_date_states: {},
      timeslots: [],
      working_date_type: '',
      latitude: '',
      longitude: '',
      timezone: null,
      sort_order: 0,
      booking_type: '',
      areas: [],
      categories: [],
    },
    summary: { confirm_hour: '', voucher_type: '', customs: [], product_policies: [] },
    filter: { min_depart: null as any, language: [], duration: '', depart_hour: [] },
    detail: {
      notice_title: null,
      notice_detail: null,
      highlight_title: 'Tour Highlights',
      highlight_detail: '',
      event: '',
      description: '',
      highlights: [],
      itinerary: [],
      preparations: '',
      how_to_use: '',
      warnings: '',
      additional_info: '',
      meeting_address: '',
      meeting_latitude: '',
      meeting_longitude: '',
      meeting_info: '',
      pickup_drop: '',
      includes: '',
      meeting_image: null,
      excludes: '',
      qnas: [],
      primary_image: { display_name: '', file_url: '', file_size: 0 },
      images: [],
      additional_fields: [],
    },
    refund: { code: '', refund_type: '', cancel_type: '', cancel_time: '', cancel_info: '', provider_cancel_days: null, partial_cancel_is: null },
    memo: null,
    seo: {},
    voucher_info: { contact_point: '', remark: '', delivery_type: '', details: [] },
    attrs: {},
    course_groups: [],
    priority_provider_title: false,
    option: { per_min: 1, per_max: 10, outer_id: null, booking_api_is: false, resell_is: null, options: [] },
  }
  let tourData: TourApiResponse
  try {
    const [raw] = await Promise.all([
      getProductDetailV2Cached(productId, 300),
    ])
    // NOTE: 서버 API 스키마와 현 UI 스키마가 다를 수 있으므로 최소 매핑만 수행 (API 데이터만 사용)
    // 최소/확장 매핑 (안전 가드 포함)
    base.basic.code = raw?.code ?? base.basic.code ?? null
    base.basic.provider_code = String(raw?.provider_code ?? raw?.provider?.code ?? base.basic.provider_code ?? '')
    base.basic.name = String(raw?.name ?? base.basic.name)
    base.basic.sub_name = String(raw?.summaries?.display_name ?? raw?.sub_name ?? base.basic.sub_name)
    if (raw?.display_price) base.basic.display_price = {
      price1: raw.display_price.price1 ?? null,
      price2: raw.display_price.price2 ?? null,
      price3: raw.display_price.price3 ?? null,
      dc_rate: raw.display_price.dc_rate ?? null,
      dc_coupon: Boolean(raw.display_price.dc_coupon)
    }
    if (raw?.calendar_type) base.basic.calendar_type = String(raw.calendar_type)
    base.basic.price_scope = String(raw?.price_scope ?? base.basic.price_scope ?? '')
    base.basic.timeslot_is = Boolean(raw?.timeslot_is ?? base.basic.timeslot_is)
    base.basic.inventory_scope = String(raw?.inventory_scope ?? base.basic.inventory_scope ?? '')
    base.basic.need_reservation = Boolean(raw?.need_reservation ?? base.basic.need_reservation)
    base.basic.min_book_days = Number(raw?.min_book_days ?? base.basic.min_book_days ?? 0)
    base.basic.max_book_days = Number(raw?.max_book_days ?? base.basic.max_book_days ?? 0)
    base.basic.min_participants = Number(raw?.min_participants ?? base.basic.min_participants ?? 1)
    base.basic.max_participants = Number(raw?.max_participants ?? base.basic.max_participants ?? 10)
    base.basic.duration = Number(raw?.duration ?? base.basic.duration ?? 0)
    base.basic.duration_unit = String(raw?.duration_unit ?? base.basic.duration_unit ?? 'MINUTE')
    base.basic.meeting_point = String(raw?.meeting_point ?? base.basic.meeting_point ?? '')
    base.basic.meeting_point_address = String(raw?.meeting_point_address ?? base.basic.meeting_point_address ?? '')
    base.basic.meeting_point_latitude = Number(raw?.meeting_point_latitude ?? base.basic.meeting_point_latitude ?? 0)
    base.basic.meeting_point_longitude = Number(raw?.meeting_point_longitude ?? base.basic.meeting_point_longitude ?? 0)
    base.basic.meeting_point_description = String(raw?.meeting_point_description ?? base.basic.meeting_point_description ?? '')
    base.basic.meeting_point_image = raw?.meeting_point_image ?? base.basic.meeting_point_image ?? null
    base.basic.cancellation_policy = String(raw?.cancellation_policy ?? base.basic.cancellation_policy ?? '')
    base.basic.cancellation_hours = Number(raw?.cancellation_hours ?? base.basic.cancellation_hours ?? 0)
    base.basic.cancellation_description = String(raw?.cancellation_description ?? base.basic.cancellation_description ?? '')
    base.basic.instant_confirmation = Boolean(raw?.instant_confirmation ?? base.basic.instant_confirmation)
    base.basic.mobile_voucher = Boolean(raw?.mobile_voucher ?? base.basic.mobile_voucher)
    base.basic.print_voucher = Boolean(raw?.print_voucher ?? base.basic.print_voucher)
    base.basic.languages = Array.isArray(raw?.languages) ? raw.languages.map((x: any) => String(x)) : (base.basic.languages ?? [])
    base.basic.included = Array.isArray(raw?.included) ? raw.included.map((x: any) => String(x)) : (base.basic.included ?? [])
    base.basic.excluded = Array.isArray(raw?.excluded) ? raw.excluded.map((x: any) => String(x)) : (base.basic.excluded ?? [])
    base.basic.bring_items = Array.isArray(raw?.bring_items) ? raw.bring_items.map((x: any) => String(x)) : (base.basic.bring_items ?? [])
    base.basic.not_allowed = Array.isArray(raw?.not_allowed) ? raw.not_allowed.map((x: any) => String(x)) : (base.basic.not_allowed ?? [])
    base.basic.not_suitable = Array.isArray(raw?.not_suitable) ? raw.not_suitable.map((x: any) => String(x)) : (base.basic.not_suitable ?? [])
    base.basic.additional_info = String(raw?.additional_info ?? base.basic.additional_info ?? '')
    base.basic.currency = String(raw?.currency ?? base.basic.currency ?? 'EUR')
    base.basic.working_date_type = String(raw?.working_date_type ?? base.basic.working_date_type ?? '')
    base.basic.latitude = String(raw?.latitude ?? base.basic.latitude ?? '')
    base.basic.longitude = String(raw?.longitude ?? base.basic.longitude ?? '')
    base.basic.timezone = String(raw?.timezone ?? base.basic.timezone ?? '')
    base.basic.sort_order = Number(raw?.sort_order ?? base.basic.sort_order ?? 0)
    base.basic.booking_type = String(raw?.booking_type ?? base.basic.booking_type ?? '')
    // 가격 필드 동기화 (대표 가격이 우선)
    if (base.basic.display_price?.price2 != null) base.basic.price = Number(base.basic.display_price.price2)
    if (base.basic.display_price?.price1 != null) base.basic.originalPrice = Number(base.basic.display_price.price1)
    if (base.basic.display_price?.dc_rate != null) base.basic.discountRate = Number(base.basic.display_price.dc_rate)
    // 이미지 (가능 시 대체)
    const imgList: string[] = Array.isArray(raw?.images)
      ? raw.images.map((it: any) => String(it?.url || it?.file_url || it?.wide || it?.square || it?.origin || '')).filter(Boolean)
      : []
    if (imgList.length > 0) base.basic.images = imgList
    // 지역/카테고리
    const areas = Array.isArray(raw?.areas) ? raw.areas : (Array.isArray(raw?.region_list) ? raw.region_list : [])
    const extractParent = (p: any): any => {
      if (!p || typeof p !== 'object') return null
      return { name: String(p?.name ?? ''), parent: extractParent(p?.parent) }
    }
    ;(base.basic as any).areas = areas.map((a: any) => ({
      code: String(a?.code ?? a?.id ?? ''),
      name: String(a?.name ?? ''),
      parent: extractParent(a?.parent)
    }))
    const categories = Array.isArray(raw?.categories) ? raw.categories : (Array.isArray(raw?.category_list) ? raw.category_list : [])
    base.basic.categories = categories.map((c: any) => ({ code: String(c?.code ?? c?.id ?? ''), name: String(c?.name ?? '') }))
    // 리뷰 (있을 경우)
    const reviews = Array.isArray(raw?.reviews) ? raw.reviews : []
    if (reviews.length > 0) {
      base.basic.reviews = reviews.map((r: any, idx: number) => ({
        id: Number(r?.id ?? idx + 1),
        name: String(r?.name ?? 'User'),
        rating: Number(r?.rating ?? r?.score ?? 0),
        date: String(r?.date ?? ''),
        comment: String(r?.comment ?? r?.content ?? ''),
        helpful: Number(r?.helpful ?? 0)
      }))
    }
    // 상세 본문
    const rawDetail = raw?.detail || raw?.details || raw
    base.detail.description = String(rawDetail?.description ?? raw?.description ?? base.detail.description ?? '')
    base.detail.highlight_title = String(rawDetail?.highlight_title ?? raw?.highlight_title ?? base.detail.highlight_title ?? 'Tour Highlights')
    base.detail.highlight_detail = String(rawDetail?.highlight_detail ?? raw?.highlight_detail ?? base.detail.highlight_detail ?? '')
    if (Array.isArray(rawDetail?.highlights)) base.detail.highlights = rawDetail.highlights.map((x: any) => String(x))
    if (Array.isArray(rawDetail?.itinerary)) base.detail.itinerary = rawDetail.itinerary.map((it: any) => ({
      day: Number(it?.day ?? 0),
      title: String(it?.title ?? ''),
      description: String(it?.description ?? ''),
      duration: String(it?.duration ?? ''),
      activities: Array.isArray(it?.activities) ? it.activities.map((x: any) => String(x)) : []
    }))
    // includes/excludes 문자열 매핑 (UI에서 파싱하여 노출)
    base.detail.includes = String(rawDetail?.includes ?? (raw as any)?.includes ?? base.detail.includes ?? '')
    base.detail.excludes = String(rawDetail?.excludes ?? (raw as any)?.excludes ?? base.detail.excludes ?? '')

    // summaries 매핑 (confirm_hour, voucher_types, product_policies, languages, duration 등)
    const sumRaw = (raw as any)?.summary || (raw as any)?.summaries || {}
    base.summary.confirm_hour = String(sumRaw?.confirm_hour ?? base.summary.confirm_hour ?? '')
    const vTypes = Array.isArray(sumRaw?.voucher_types) ? sumRaw.voucher_types.map((s: any) => String(s)) : []
    ;(base.summary as any).voucher_types = vTypes
    if (typeof sumRaw?.voucher_type === 'string') base.summary.voucher_type = String(sumRaw.voucher_type)
    if (Array.isArray(sumRaw?.product_policies)) base.summary.product_policies = sumRaw.product_policies.map((s: any) => String(s))
    if (Array.isArray(sumRaw?.languages)) base.summary.languages = sumRaw.languages.map((s: any) => String(s)) as any
    base.summary.duration = String(sumRaw?.duration ?? base.summary.duration ?? '')
    if (Array.isArray(sumRaw?.depart_hours)) (base.summary as any).depart_hours = sumRaw.depart_hours
    if (typeof sumRaw?.min_depart !== 'undefined') (base.summary as any).min_depart = sumRaw.min_depart
    base.detail.pickup_drop = String(rawDetail?.pickup_drop ?? base.detail.pickup_drop ?? '')
    base.detail.additional_info = String(rawDetail?.additional_info ?? base.detail.additional_info ?? '')
    // 추가 필드: API의 additional_fields를 우선 흡수하고 미팅포인트를 보강
    const rf: any[] = Array.isArray((rawDetail as any)?.additional_fields)
      ? (rawDetail as any).additional_fields
      : (Array.isArray((raw as any)?.additional_fields) ? (raw as any).additional_fields : [])
    const additionalFields: any[] = Array.isArray(rf)
      ? rf.map((f: any) => ({ key: String(f?.key ?? ''), title: String(f?.title ?? ''), content: String(f?.content ?? '') }))
      : []
    const mpContent = base.basic.meeting_point_description || base.basic.meeting_point
    if (mpContent) {
      const exists = additionalFields.find((f) => f?.key === 'meetingPoint')
      if (!exists) additionalFields.push({ key: 'meetingPoint', title: 'Meeting Point', content: mpContent })
    }
    base.detail.additional_fields = additionalFields
    // 환불/취소 정책 매핑 (refund_detail → base.refund)
    const refundDetail = (raw as any)?.refund_detail || (rawDetail as any)?.refund_detail
    if (refundDetail && typeof refundDetail === 'object') {
      base.refund.refund_type = String(refundDetail?.refund_type ?? base.refund.refund_type ?? '')
      base.refund.cancel_type = String(refundDetail?.cancel_type ?? base.refund.cancel_type ?? '')
      base.refund.cancel_time = String(refundDetail?.cancel_time ?? base.refund.cancel_time ?? '')
      base.refund.cancel_info = String(refundDetail?.cancel_info ?? base.refund.cancel_info ?? '')
      ;(base.refund as any).partial_cancel_is = typeof refundDetail?.partial_cancelable === 'boolean' ? Boolean(refundDetail.partial_cancelable) : base.refund.partial_cancel_is
      ;(base.refund as any).provider_cancel_days = (refundDetail?.working_time?.days ?? null)
      ;(base.refund as any).working_days = String(refundDetail?.working_time?.days ?? '') || null
      ;(base.refund as any).work_on_korean_holiday = typeof refundDetail?.working_time?.work_on_korean_holiday === 'boolean' ? refundDetail.working_time.work_on_korean_holiday : null
      ;(base.refund as any).working_hour = String(refundDetail?.working_time?.hour ?? '') || null
      ;(base.refund as any).working_timezone = String(refundDetail?.working_time?.timezone ?? '') || null
      ;(base.refund as any).fee_rates = Array.isArray(refundDetail?.fee_rates)
        ? refundDetail.fee_rates.map((r: any) => ({ start: r?.start ?? null, end: r?.end ?? null, rate: Number(r?.rate ?? 0) }))
        : []
      ;(base.refund as any).free_cancel_due_date = String(refundDetail?.free_cancel_due_date ?? '') || null
      // base.basic.cancellation_description을 사람이 읽을 수 있는 규칙으로 구성
      try {
        const rates: any[] = Array.isArray(refundDetail?.fee_rates) ? refundDetail.fee_rates : []
        if (rates.length > 0) {
          const lines = rates.map((r) => {
            const start = r?.start == null ? 'N+∞' : `N-${Number(r.start)}`
            const end = r?.end == null ? 'N-0' : `N-${Number(r.end)}`
            const rate = `${Number(r?.rate ?? 0)}%`
            return `${start} ~ ${end}: ${rate}`
          })
          base.basic.cancellation_description = lines.join('\n')
        }
      } catch {}
    }

    // 예약 가능일 주입
    // 예약 가능일: today 기준 조회 + 상태 매핑
    try {
      const today = new Date().toISOString().slice(0, 10)
      const datesRes: any = await getProductDatesV2(productId, today)
      // 응답이 배열 or 객체일 수 있으므로 유연 처리
      if (Array.isArray(datesRes)) {
        if (datesRes.length > 0 && typeof datesRes[0] === 'object') {
          const list = datesRes as any[]
          const stateMap: Record<string, string> = {}
          base.basic.available_dates = list
            .map((it) => String(it?.start_date || it?.date || ''))
            .filter(Boolean)
          base.basic.available_dates.forEach((d) => { stateMap[d] = 'OPEN' })
          base.basic.available_date_states = stateMap
        } else {
          base.basic.available_dates = datesRes.map((d) => String(d))
        }
      } else if (datesRes && typeof datesRes === 'object') {
        // 예: { dates: [{ date: 'YYYY-MM-DD', state: 'OPEN' }, ...] }
        const list = Array.isArray(datesRes.dates) ? datesRes.dates : []
        base.basic.available_dates = list.map((it: any) => String(it?.date ?? '')).filter(Boolean)
        const stateMap: Record<string, string> = {}
        list.forEach((it: any) => {
          if (it?.date) stateMap[String(it.date)] = String(it.state ?? it.status ?? 'OPEN')
        })
        base.basic.available_date_states = stateMap
      } else {
        base.basic.available_dates = [today]
      }
    } catch {
      base.basic.available_dates = [new Date().toISOString().slice(0, 10)]
    }
    // courses / course_groups 매핑 (UI에서 Itinerary로 사용)
    const courseGroupsRaw: any[] = Array.isArray((raw as any)?.course_groups)
      ? (raw as any).course_groups
      : (Array.isArray((raw as any)?.courses) ? [{ courses: (raw as any).courses }] : [])
    ;(base as any).course_groups = courseGroupsRaw
    tourData = base
  } catch {
    // API 실패 시 간단한 에러 상태로 최소 필드만 채워서 렌더
    tourData = base
  }

  return <TourDetailClient tourData={tourData} tourId={productId} />
}