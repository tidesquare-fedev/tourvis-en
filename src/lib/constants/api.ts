/**
 * API 관련 상수 정의
 */

// API 기본 설정
export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 200,
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5분
  DEFAULT_GC_TIME: 10 * 60 * 1000, // 10분
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_BASE: 1000, // 1초
  RETRY_DELAY_MAX: 30000, // 30초
} as const;

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API 에러 코드
export const API_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  HTTP_ERROR: 'HTTP_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UPSTREAM_ERROR: 'UPSTREAM_ERROR',
} as const;

// 캐시 키 패턴
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product-detail',
  REVIEWS: 'reviews',
  REVIEW_COUNT: 'review-count',
  TNA_OPTIONS: 'tna-options',
  TNA_PRICE: 'tna-price',
  HOME_SECTIONS: 'home-sections',
} as const;

// 필드 선택 옵션
export const PRODUCT_FIELDS = {
  BASIC: ['product_id', 'name', 'summaries.display_name'],
  IMAGES: ['display_images.origin', 'primary_image.origin'],
  PRICING: [
    'display_price.price1',
    'display_price.price2',
    'display_price.dc_rate',
    'price.repr',
    'price.disp',
    'price.dc_value',
  ],
  REVIEWS: ['review.review_score', 'review.review_count'],
  LOCATION: ['areas.name', 'areas.scope'],
  CATEGORY: ['categories.name'],
  ALL: [
    'product_id',
    'name',
    'summaries.display_name',
    'display_images.origin',
    'primary_image.origin',
    'display_price.price1',
    'display_price.price2',
    'display_price.dc_rate',
    'price.repr',
    'price.disp',
    'price.dc_value',
    'review.review_score',
    'review.review_count',
    'areas.name',
    'areas.scope',
    'categories.name',
  ],
} as const;

// 디바운스 지연 시간
export const DEBOUNCE_DELAYS = {
  SEARCH: 500, // 검색 입력
  FILTER: 300, // 필터 변경
  SCROLL: 100, // 스크롤 이벤트
  RESIZE: 250, // 윈도우 리사이즈
} as const;

// 이미지 관련 설정
export const IMAGE_CONFIG = {
  PLACEHOLDER:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  FALLBACK:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==',
  MAX_IMAGES: 5,
  LAZY_LOAD_THRESHOLD: 0.1,
  LAZY_LOAD_ROOT_MARGIN: '50px',
} as const;

export type ENV = 'development' | 'stage' | 'production';
export const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development';
export const isStg = process.env.NEXT_PUBLIC_APP_ENV === 'stage';
export const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';

export interface UniversalEnv {
  name: ENV;
  apiBaseUrls: {
    tnt: string;
    common: string;
    common_fe: string;
  };
}

export const universalEnv: UniversalEnv = isProd
  ? {
      name: 'production',
      apiBaseUrls: {
        tnt: 'https://apollo-api.tidesquare.com/tna-api-v2/rest',
        common: 'https://edge.tourvis.com/tvcomm',
        common_fe: 'https://edge.tourvis.com/tvcomm/fe',
      },
    }
  : isStg
    ? {
        name: 'stage',
        apiBaseUrls: {
          tnt: 'https://stg-apollo-api.tidesquare.com/tna-api-v2/rest',
          common: 'https://stg-edge.tourvis.com/tvcomm',
          common_fe: 'https://stg-edge.tourvis.com/tvcomm/fe',
        },
      }
    : {
        name: 'development',
        apiBaseUrls: {
          tnt: 'https://dev-apollo-api.tidesquare.com/tna-api-v2/rest',
          common: 'https://dedge.tourvis.com/tvcomm',
          common_fe: 'https://dedge.tourvis.com/tvcomm/fe',
        },
      };
