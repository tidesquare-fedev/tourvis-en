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
}
