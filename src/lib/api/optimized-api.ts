/**
 * 최적화된 API 클라이언트
 * 캐싱, 중복 제거, 에러 처리 등을 통합한 API 클라이언트
 */

import { queryClient, queryKeys, queryOptions } from '../query-client'
import { createError, ERROR_CODES, logError } from '../error-handling'
import { safeExecute } from '../error-handling'
import type { ApiResponse } from '@/types/review'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/en'

/**
 * API 요청 옵션
 */
interface ApiRequestOptions {
  /** 캐시 사용 여부 */
  useCache?: boolean
  /** 캐시 TTL (밀리초) */
  cacheTTL?: number
  /** 재시도 횟수 */
  retryCount?: number
  /** 타임아웃 (밀리초) */
  timeout?: number
  /** 요청 중복 제거 여부 */
  deduplicate?: boolean
  /** 에러 발생 시 로깅 여부 */
  logErrors?: boolean
}

/**
 * 기본 API 요청 옵션
 */
const defaultOptions: Required<ApiRequestOptions> = {
  useCache: true,
  cacheTTL: 5 * 60 * 1000, // 5분
  retryCount: 3,
  timeout: 10000, // 10초
  deduplicate: true,
  logErrors: true,
}

/**
 * HTTP 메서드 타입
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * API 요청 파라미터
 */
interface ApiRequestParams {
  url: string
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  options?: Partial<ApiRequestOptions>
}

/**
 * 중복 요청 관리 맵
 */
const pendingRequests = new Map<string, Promise<any>>()

/**
 * API 요청 실행 함수
 */
async function executeRequest<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
  const { url, method = 'GET', body, headers = {}, options = {} } = params
  const finalOptions = { ...defaultOptions, ...options }

  // 요청 키 생성 (중복 제거용)
  const requestKey = `${method}:${url}:${JSON.stringify(body || {})}`
  
  // 중복 요청 제거
  if (finalOptions.deduplicate && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!
  }

  const requestPromise = safeExecute(
    async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), finalOptions.timeout)

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
          // 캐시 전략 설정
          cache: finalOptions.useCache ? 'default' : 'no-store',
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw createError(
            ERROR_CODES.NETWORK_ERROR,
            `HTTP ${response.status}: ${response.statusText}`,
            { status: response.status, statusText: response.statusText },
            { component: 'ApiClient', action: 'executeRequest' }
          )
        }

        const data = await response.json()
        return data as ApiResponse<T>
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    },
    ERROR_CODES.NETWORK_ERROR,
    { component: 'ApiClient', action: 'executeRequest' }
  )

  // 중복 요청 제거를 위해 맵에 저장
  if (finalOptions.deduplicate) {
    pendingRequests.set(requestKey, requestPromise)
    
    // 요청 완료 후 맵에서 제거
    requestPromise.finally(() => {
      pendingRequests.delete(requestKey)
    })
  }

  const result = await requestPromise
  if (result.error) {
    throw result.error
  }

  return result.data!
}

/**
 * 최적화된 API 클라이언트
 */
export class OptimizedApiClient {
  /**
   * GET 요청
   */
  async get<T>(url: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return executeRequest<T>({ url, method: 'GET', options })
  }

  /**
   * POST 요청
   */
  async post<T>(url: string, body?: unknown, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return executeRequest<T>({ url, method: 'POST', body, options })
  }

  /**
   * PUT 요청
   */
  async put<T>(url: string, body?: unknown, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return executeRequest<T>({ url, method: 'PUT', body, options })
  }

  /**
   * DELETE 요청
   */
  async delete<T>(url: string, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return executeRequest<T>({ url, method: 'DELETE', options })
  }

  /**
   * PATCH 요청
   */
  async patch<T>(url: string, body?: unknown, options?: Partial<ApiRequestOptions>): Promise<ApiResponse<T>> {
    return executeRequest<T>({ url, method: 'PATCH', body, options })
  }
}

/**
 * 전역 API 클라이언트 인스턴스
 */
export const apiClient = new OptimizedApiClient()

/**
 * 특화된 API 클라이언트들
 */

/**
 * 홈 페이지 API 클라이언트
 */
export const homeApiClient = {
  /**
   * 섹션별 상품 조회
   */
  async getSectionProducts(params: {
    templateId: string
    title?: string
    index?: number
    limit?: number
  }) {
    const url = `${BASE_PATH}/api/home/section-products`
    return apiClient.post<{ items: any[] }>(url, params, {
      useCache: true,
      cacheTTL: 10 * 60 * 1000, // 10분
      deduplicate: true,
    })
  },

  /**
   * 홈 페이지 전체 데이터 조회
   */
  async getHomeData() {
    const url = `${BASE_PATH}/api/home`
    return apiClient.get<any>(url, {
      useCache: true,
      cacheTTL: 15 * 60 * 1000, // 15분
      deduplicate: true,
    })
  },
}

/**
 * 활동/상품 API 클라이언트
 */
export const activityApiClient = {
  /**
   * 상품 검색
   */
  async searchProducts(params: {
    providerIds: string
    keyword?: string
    count?: number
    offset?: number
  }) {
    const url = `${BASE_PATH}/api/activity/products`
    return apiClient.post<{ items: any[] }>(url, params, {
      useCache: true,
      cacheTTL: 5 * 60 * 1000, // 5분
      deduplicate: true,
    })
  },

  /**
   * 상품 상세 조회
   */
  async getProductDetail(productId: string) {
    const url = `${BASE_PATH}/api/activity/products/${productId}`
    return apiClient.get<any>(url, {
      useCache: true,
      cacheTTL: 30 * 60 * 1000, // 30분
      deduplicate: true,
    })
  },
}

/**
 * 리뷰 API 클라이언트
 */
export const reviewApiClient = {
  /**
   * 리뷰 개수 조회
   */
  async getReviewCount(params: {
    brand: string
    prodCat: string
    prodCd: string
  }) {
    const url = `${BASE_PATH}/api/review/reviewCount`
    return apiClient.post<{ count: number }>(url, params, {
      useCache: true,
      cacheTTL: 10 * 60 * 1000, // 10분
      deduplicate: true,
    })
  },

  /**
   * 리뷰 목록 조회
   */
  async getReviews(params: {
    brand: string
    prodCat: string
    prodCd: string
    limit?: number
  }) {
    const url = `${BASE_PATH}/api/review/reviewList`
    return apiClient.post<{ items: any[] }>(url, params, {
      useCache: true,
      cacheTTL: 5 * 60 * 1000, // 5분
      deduplicate: true,
    })
  },
}

/**
 * TNA API 클라이언트 (가격, 옵션 등)
 */
export const tnaApiClient = {
  /**
   * 상품 옵션 조회 (날짜형)
   */
  async getProductOptionsDateType(productId: string, date: string) {
    const url = `https://dev-apollo-api.tidesquare.com/tna-api-v2/rest/v2/product/${encodeURIComponent(productId)}/${encodeURIComponent(date)}/options`
    return apiClient.get<any>(url, {
      useCache: true,
      cacheTTL: 5 * 60 * 1000, // 5분
      deduplicate: true,
      timeout: 15000, // 15초
    })
  },

  /**
   * 상품 옵션 조회 (기간형)
   */
  async getProductOptionsPeriodType(productId: string) {
    const url = `https://dev-apollo-api.tidesquare.com/tna-api-v2/rest/v2/product/${encodeURIComponent(productId)}/options`
    return apiClient.get<any>(url, {
      useCache: true,
      cacheTTL: 10 * 60 * 1000, // 10분
      deduplicate: true,
      timeout: 15000, // 15초
    })
  },

  /**
   * 동적 가격 조회
   */
  async getDynamicPrice(productId: string, optionId: string, params: {
    selected_date: string
    labels: Array<{ id: string; quantity: number }>
    timeslot: { id: string }
  }) {
    const url = `https://dev-apollo-api.tidesquare.com/tna-api-v2/rest/v2/product/${encodeURIComponent(productId)}/options/${encodeURIComponent(optionId)}/dynamic-price`
    return apiClient.post<any>(url, params, {
      useCache: false, // 가격은 실시간이므로 캐시하지 않음
      deduplicate: true,
      timeout: 20000, // 20초
    })
  },
}

/**
 * 배치 요청 헬퍼
 * 여러 API 요청을 한 번에 처리
 */
export class BatchApiClient {
  private requests: Array<() => Promise<any>> = []

  /**
   * 요청 추가
   */
  add<T>(request: () => Promise<T>): this {
    this.requests.push(request)
    return this
  }

  /**
   * 모든 요청 실행
   */
  async execute(): Promise<any[]> {
    const results = await Promise.allSettled(this.requests.map(request => request()))
    
    // 요청 목록 초기화
    this.requests = []
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : result.reason
    )
  }

  /**
   * 요청 개수
   */
  get count(): number {
    return this.requests.length
  }
}

/**
 * 배치 API 클라이언트 인스턴스
 */
export const batchApiClient = new BatchApiClient()
