/**
 * React Query 클라이언트 설정
 * 전역 캐싱 전략과 기본 옵션을 정의
 */

import { QueryClient } from '@tanstack/react-query'

/**
 * 기본 쿼리 옵션
 */
const defaultQueryOptions = {
  // 기본 staleTime: 5분 (데이터가 신선하다고 간주되는 시간)
  staleTime: 5 * 60 * 1000,
  // 기본 gcTime: 30분 (캐시에서 제거되는 시간)
  gcTime: 30 * 60 * 1000,
  // 윈도우 포커스 시 자동 리페치 비활성화
  refetchOnWindowFocus: false,
  // 네트워크 재연결 시 자동 리페치 비활성화
  refetchOnReconnect: false,
  // 마운트 시 자동 리페치 비활성화 (캐시된 데이터 우선 사용)
  refetchOnMount: false,
  // 재시도 횟수
  retry: 3,
  // 재시도 간격 (지수 백오프)
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
}

/**
 * 전역 QueryClient 인스턴스
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: defaultQueryOptions,
    mutations: {
      // 뮤테이션 재시도 횟수
      retry: 1,
      // 뮤테이션 재시도 간격
      retryDelay: 1000,
    },
  },
})

/**
 * 쿼리 키 팩토리
 * 일관된 쿼리 키 생성을 위한 헬퍼 함수들
 */
export const queryKeys = {
  // 홈 페이지 관련
  home: {
    all: ['home'] as const,
    banners: () => [...queryKeys.home.all, 'banners'] as const,
    regions: () => [...queryKeys.home.all, 'regions'] as const,
    categories: () => [...queryKeys.home.all, 'categories'] as const,
    sections: () => [...queryKeys.home.all, 'sections'] as const,
    sectionProducts: (templateId: string, title?: string, index?: number, limit?: number) => 
      [...queryKeys.home.sections(), templateId, title ?? '', index ?? -1, limit ?? 0] as const,
  },
  
  // 활동/상품 관련
  activity: {
    all: ['activity'] as const,
    products: (providerIds: string, keyword?: string) => 
      [...queryKeys.activity.all, 'products', providerIds, keyword ?? ''] as const,
    product: (id: string) => [...queryKeys.activity.all, 'product', id] as const,
    search: (params: Record<string, any>) => 
      [...queryKeys.activity.all, 'search', params] as const,
  },
  
  // 리뷰 관련
  review: {
    all: ['review'] as const,
    count: (prodCd: string, brand?: string, prodCat?: string) => 
      [...queryKeys.review.all, 'count', prodCd, brand ?? '', prodCat ?? ''] as const,
    list: (prodCd: string, brand?: string, prodCat?: string, limit?: number) => 
      [...queryKeys.review.all, 'list', prodCd, brand ?? '', prodCat ?? '', limit ?? 0] as const,
  },
  
  // TNA API 관련
  tna: {
    all: ['tna'] as const,
    productDetail: (productId: string) => [...queryKeys.tna.all, 'productDetail', productId] as const,
    productDates: (productId: string, startDate?: string) => 
      [...queryKeys.tna.all, 'productDates', productId, startDate ?? ''] as const,
    options: {
      dateType: (productId: string, date: string) => 
        [...queryKeys.tna.all, 'options', 'dateType', productId, date] as const,
      periodType: (productId: string) => 
        [...queryKeys.tna.all, 'options', 'periodType', productId] as const,
    },
    price: {
      dateType: (productId: string, productOptionCode: string, startDate: string, endDate: string) => 
        [...queryKeys.tna.all, 'price', 'dateType', productId, productOptionCode, startDate, endDate] as const,
      periodType: (productId: string, productOptionCode: string) => 
        [...queryKeys.tna.all, 'price', 'periodType', productId, productOptionCode] as const,
      dynamic: (productId: string, optionId: string, params: Record<string, any>) => 
        [...queryKeys.tna.all, 'price', 'dynamic', productId, optionId, params] as const,
    },
  },
  
  // 문의 관련
  inquiry: {
    all: ['inquiry'] as const,
    list: (params: Record<string, any>) => [...queryKeys.inquiry.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.inquiry.all, 'detail', id] as const,
  },
} as const

/**
 * 캐시 무효화 헬퍼 함수들
 */
export const cacheUtils = {
  /**
   * 홈 페이지 관련 모든 캐시 무효화
   */
  invalidateHome: () => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.home.all })
  },
  
  /**
   * 특정 상품 관련 캐시 무효화
   */
  invalidateProduct: (productId: string) => {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.product(productId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.tna.productDetail(productId) }),
      queryClient.invalidateQueries({ queryKey: [...queryKeys.tna.all, 'options'] }),
      queryClient.invalidateQueries({ queryKey: [...queryKeys.tna.all, 'price'] }),
    ])
  },
  
  /**
   * 리뷰 관련 캐시 무효화
   */
  invalidateReviews: (prodCd: string) => {
    return queryClient.invalidateQueries({ 
      queryKey: [...queryKeys.review.all, prodCd] 
    })
  },
  
  /**
   * 모든 캐시 무효화
   */
  invalidateAll: () => {
    return queryClient.invalidateQueries()
  },
  
  /**
   * 특정 쿼리 키 패턴으로 캐시 무효화
   */
  invalidateByPattern: (pattern: string[]) => {
    return queryClient.invalidateQueries({ queryKey: pattern })
  },
}

/**
 * 프리페치 헬퍼 함수들
 */
export const prefetchUtils = {
  /**
   * 홈 페이지 데이터 프리페치
   */
  prefetchHomeData: async () => {
    // 홈 페이지에서 자주 사용되는 데이터들을 미리 로드
    await Promise.allSettled([
      // 홈 페이지 API 호출은 서버에서 이미 처리되므로 클라이언트에서는 생략
      // 필요시 추가 프리페치 로직 구현
    ])
  },
  
  /**
   * 상품 상세 페이지 데이터 프리페치
   */
  prefetchProductDetail: async (productId: string) => {
    await Promise.allSettled([
      // 상품 기본 정보는 서버에서 이미 로드되므로 생략
      // 리뷰 데이터는 사용자가 스크롤할 때 로드하므로 프리페치하지 않음
    ])
  },
  
  /**
   * 검색 결과 프리페치
   */
  prefetchSearchResults: async (searchParams: Record<string, any>) => {
    // 검색 결과는 사용자 입력에 따라 달라지므로 프리페치하지 않음
    // 대신 인기 검색어나 추천 상품을 프리페치할 수 있음
  },
}

/**
 * 쿼리 옵션 팩토리
 * 데이터 타입별로 최적화된 쿼리 옵션을 제공
 */
export const queryOptions = {
  // 정적 데이터 (자주 변경되지 않는 데이터)
  static: {
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
  },
  
  // 동적 데이터 (자주 변경되는 데이터)
  dynamic: {
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
  },
  
  // 실시간 데이터 (가격 등 즉시 반영되어야 하는 데이터)
  realtime: {
    staleTime: 0, // 즉시 stale
    gcTime: 5 * 60 * 1000, // 5분
    refetchInterval: 30 * 1000, // 30초마다 자동 리페치
  },
  
  // 사용자 입력 기반 데이터 (검색 등)
  userInput: {
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
    enabled: false, // 수동으로 활성화
  },
} as const
