export interface DisplayRecentPurchaseInfo {
  display_type: 'count' | 'time';
  value: number;
}
export interface DisplayOrderLimit {
  name_messages: string[];
  weekly_messages: string[];
  active: boolean;
}
export interface DisplayArea {
  scope: 'continent' | 'nation' | 'state' | 'city' | 'unknown';
  id: string;
  name: string;
  nation_code: string;
  count: number;
  parent: DisplayArea[];
  children: DisplayArea[];
}
export interface DisplayCategory {
  id: string;
  name: string;
  count: number;
  parent: DisplayCategory[];
  children: DisplayCategory[];
}
export interface Images {
  origin: string; //리사이즈 없음
  big: string; //880 x 601
  square: string; //750 x 750
  wide: string; //750 x 424
  thum: string; //240 x 240
  og: string; //1200 x 630
  gallery: string; //850 x 0
}
export interface ProductPrice {
  disp: number;
  dc_type: 'RATE' | 'AMOUNT'; //정률 | 정액
  dc_value: number; //할인값 - 정률 또는 정액 값
  repr: number; //판매가격(할인가)
  active: boolean;
}
export interface DisplayPrice {
  price1: number; //전시가격
  price2: number; //판매가격
  price3: number; //최고 판매가격
  dc_rate: number; //할인율 (전시가격, 판매가격이 모두 존재하는 경우에 표시할 할인율)
  dc_coupon: boolean; //할인쿠폰 사용 여부
}
export interface DisplayPreDiscount {
  dc_rate: number; //선할인율
  dc_amount: number; //선할인 금액
  dc_rate_max_amount: number; //최대 할인 금액 (null: 금액 제한 없음)
}
export interface DisplayBillDiscount {
  dc_rate: number; //청구할인율
  dc_amount: number; //청구할인 금액
}
export interface DisplayPromotionBadge {
  freebie: boolean;
  coupon: boolean;
  one_plus_one: boolean;
  two_plus_one: boolean;
  three_plus_one: boolean;
  limited_time: boolean;
  first_com: string;
}
export interface Badge {
  instant_confirmation: boolean;
  today_usable: boolean;
  tomorrow_usable: boolean;
  deadline_near: boolean;
  freebie: boolean;
  one_plus_one: boolean;
  two_plus_one: boolean;
  three_plus_one: boolean;
  coupon: boolean;
}
export interface DisplayProductV2Promotion {
  id: string;
  type: 'FREEBIE' | 'PLUS_ONE' | 'COUPON' | 'NOTICE';
  title: string;
  badge: DisplayPromotionBadge;
  sold_out: boolean;
  images: Images;
  indefinite: boolean;
  start_date: string;
  end_date: string;
}
export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}
export interface DisplayProvider {
  id: string;
  company_name: string;
  business_reg_no: string;
  president: string;
  mail_order_no: string;
  phone: string;
  email: string;
  address: string;
}
export interface Coupon {
  id: string;
  name: string;
  dc_type: 'RATE' | 'AMOUNT';
  dc_value: number;
  dc_max_amount: number;
}
export interface Summaries {
  confirm_hour: 'IN0H' | 'IN24H' | 'IN48H' | 'IN72H' | 'IN1W' | 'IN1M' | 'IN3M';
  voucher_types: ('M_VOUCHER' | 'P_VOUCHER' | 'QR' | 'SMS' | 'ETC')[];
  customs: string[];
  product_policies: (
    | 'INSTANT_CONFIRMATION'
    | 'TODAY_USABLE'
    | 'TOMORROW_USABLE'
  )[];
  min_depart: number;
  languages: string[];
  duration: 'IN2H' | 'IN4H' | 'IN6H' | 'OV6H' | 'OV1D';
  depart_hours: (6 | 8 | 10 | 12 | 14 | 16 | 18)[];
  feature: string;
  display_name: string;
}

export interface AdditionalField {
  key: string;
  title: string;
  content: string;
}
export interface Qna {
  q: string;
  a: string;
}

export interface ChannelNoticeButton {
  name: string;
  url: string;
}
export interface ChannelNotice {
  notice_all: boolean;
  title: string;
  detail: string;
  buttons: ChannelNoticeButton[];
}

export interface TnaFile {
  display_name: string;
  file_url: string;
  file_size: number;
}

export interface OptionCompareTable {
  name: string;
  title: string;
  content: string;
  place: string[];
  file: TnaFile;
}
export interface OptionCompare {
  type: 'TABLE' | 'EDITOR';
  title: string;
  subtitle: string;
  option_compare_tables: OptionCompareTable[];
  content: string;
}
export interface Details {
  notice_title: string;
  notice_detail: string;
  highlight_title: string;
  highlight_detail: string;
  event: string;
  description: string;
  preparations: string;
  pickup_drop: string;
  how_to_use: string;
  warnings: string;
  additional_info: string;
  meeting_address: string;
  meeting_latitude: string;
  meeting_longitude: string;
  meeting_image: string;
  meeting_info: string;
  includes: string;
  excludes: string;
  additional_fields: AdditionalField[];
  qnas: Qna[];
  channel_notices: ChannelNotice[];
  option_compare: OptionCompare[];
}

export interface Course {
  title: string;
  content: string;
  image: string;
  coordinates: GeolocationCoordinates;
}

export interface ExtendCourseInfo {
  title: string;
  start_time: string;
  content: string;
  image: string;
  coordinates: GeolocationCoordinates;
}
export interface ExtendCourseDay {
  extend_course_infos: ExtendCourseInfo[];
}
export interface ExtendCourse {
  name: string;
  introduce: string;
  description: string;
  extend_course_days: ExtendCourseDay[];
}

export interface WorkingTime {
  days: string;
  work_on_korean_holiday: boolean;
  hour: string;
  timezone: string;
}

export interface CancelFeeRate {
  start: number;
  end: number;
  rate: number;
}
export interface RefundDetail {
  partial_cancelable: boolean;
  refund_type: 'UNAVAILABLE' | 'AVAILABLE' | 'CONDITIONAL'; //환불불가, 환불가능, 조건부환불
  cancel_type: 'CONFIRM' | 'AUTO';
  cancel_time: 'PROVIDER' | 'KOREA' | 'NONE';
  working_time: WorkingTime;
  fee_rates: CancelFeeRate[];
  cancel_info: string;
  free_cancel_due_date: string;
  provider_direct_refund: boolean;
  provider_direct_refund_policy_description: string;
}

export interface SEO {
  main_keyword: string;
  meta_title: string;
  meta_keyword: string;
  meta_desc: string;
  canonical_url: string;
}

export interface DisplayProductReview {
  review_score: number;
  review_count: number;
  review_keywords: string[];
  best_review: string;
}

export interface DisplayProductContentsItemDto {
  id: number;
  parent_id: number;
  parent_name: string;
  type: 'AREA' | 'ATTRACTION';
  required: boolean;
  is_timeslot: boolean;
  group_key: 'GROUP_A' | 'GROUP_B' | 'GROUP_C';
  name: string;
  description: string;
  image_url: string;
  height: number;
  badge:
    | 'NONE'
    | 'NEW'
    | 'BEST'
    | 'THRILL_RUSH'
    | 'THRILL_HIGH'
    | 'THRILL_MIDDLE'
    | 'THRILL_LOW';
}
export interface DisplayOptionContents {
  id: number;
  name: string;
  description: string;
  image_url: string;
  badge: 'NONE' | 'NO1' | 'NO2' | 'NO3' | 'NO4';
  items: DisplayProductContentsItemDto;
  option_ids: string[];
}

export interface ProductOptionFilterItem {
  code: string;
  name: string;
}
export interface ProductOptionFilterProperty {
  code: string;
  name: string;
  items: ProductOptionFilterItem[];
}
export interface ProductOptionFilterDto {
  properties: ProductOptionFilterProperty[];
  active: boolean;
}

export interface ProductFilterMappingItem {
  property_code: string;
  property_name: string;
  item_code: string;
  item_name: string;
}

export interface ProductFilterLabelDto {
  label_code: string;
  label_name: string;
  mappings: ProductFilterMappingItem[];
}
export interface ProductFilterOptionDto {
  option_code: string;
  option_name: string;
  mappings: ProductFilterMappingItem[];
  labels: ProductFilterLabelDto[];
}
export interface ProductOptionFilterDetailDto {
  filter: ProductOptionFilterDto;
  options: ProductFilterOptionDto[];
  useableFront: boolean;
}
export interface ProductDetail {
  product_id: string;
  name: string;
  sub_name: string;
  sold_out: boolean;
  purchase_info: DisplayRecentPurchaseInfo;
  order_limit: DisplayOrderLimit;
  domestic: boolean;
  areas: DisplayArea[];
  categories: DisplayCategory[];
  primary_image: Images;
  description: string;
  image: Images;
  price: ProductPrice;
  display_price: DisplayPrice;
  display_price_range: boolean; //상품대표가 보다 더 비싼 라벨이 있는 경우 true
  pre_discount: DisplayPreDiscount;
  bill_discount: DisplayBillDiscount;
  product_notice: string; //상품 알림
  promotions: DisplayProductV2Promotion;
  tags: (
    | 'INSTANT_CONFIRMATION'
    | 'TODAY_USABLE'
    | 'TOMORROW_USABLE'
    | 'DEADLINE_NEAR'
  )[];
  badge: Badge;
  coordinates: GeolocationCoordinates;
  closed: boolean;
  provider: DisplayProvider;
  coupon: Coupon;
  calendar_type: 'DATE' | 'NONE'; //DATE: 날짜형, NONE: 기간형
  price_scope: 'LABEL' | 'DATE' | 'REALTIME'; //LABEL: 라벨형, DATE: 날짜형, REALTIME: 실시간형
  inventory_scope:
    | 'NONE'
    | 'OPTION'
    | 'LABEL'
    | 'OPTION_TIMESLOT'
    | 'LABEL_TIMESLOT'; //NONE: 재고관리 안함, OPTION: 옵션형, LABEL: 라벨형, OPTION_TIMESLOT: 옵션+회차형, LABEL_TIMESLOT: 라벨+회차형
  timeslot_is: boolean; //회차 존재 여부
  need_reservation: boolean; //구매 후 사전 예약이 필요한 상품인지 여부
  images: Images[];
  summaries: Summaries;
  details: Details;
  courses: Course[][];
  extend_courses: ExtendCourse[];
  refund_detail: RefundDetail;
  per_min: number;
  per_max: number;
  seo: SEO;
  recommend_active: boolean;
  review: DisplayProductReview;
  review_common_tag_ids: number[];
  created_at: string;
  updated_at: string;
  use_date_soldout: boolean;
  last_use_date: string;
  min_hook_days: number;
  notification_collect_sale: boolean;
  notification_collect_stock: boolean;
  payment_benefit: boolean;
  payment_benefit_start_time: string;
  payment_benefit_end_time: string;
  contents: DisplayOptionContents;
  option_filter: ProductOptionFilterDetailDto;
}

export interface DisplayProductItemDateV2Dto {
  product_id: string;
  start_date: string;
  price: number;
  highlight_style: boolean;
}
