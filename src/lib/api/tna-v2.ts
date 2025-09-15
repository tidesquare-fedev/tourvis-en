import { buildApiBase } from '@/features/activity/lib/searchApi'
import { tnaRateLimiter } from '../rate-limiter'
import { cache, createCacheKey } from '../cache'
import { retryWithBackoff } from '../retry'
import { requestDeduplicator, createRequestKey } from '../request-deduplication'
import { tnaCircuitBreaker } from '../circuit-breaker'
import { monitoredApiCall } from '../api-monitor'

type HeadersMap = Record<string, string>

const getHeaders = (): HeadersMap => {
  const headers: HeadersMap = { accept: 'application/json' }
  if (process.env.TNA_API_TOKEN) {
    const raw = process.env.TNA_API_TOKEN
    const normalized = raw.replace(/^Bearer\s+/i, '').replace(/^\s+|\s+$/g, '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '')
    headers.Authorization = `Bearer ${normalized}`
  }
  return headers
}

const apiBaseV2 = () => {
  // 올바른 API 베이스 URL 사용
  return 'https://dev-apollo-api.tidesquare.com/tna-api-v2/rest/v2'
}

export async function getProductDetailV2(productId: string) {
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}`
  const res = await fetch(url, { cache: 'no-store', headers: getHeaders() })
  if (!res.ok) throw new Error(`detail ${res.status}`)
  return res.json() as Promise<any>
}

export async function getProductDetailV2Cached(productId: string, revalidateSeconds = 300) {
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}`
  const res = await fetch(url, { next: { revalidate: revalidateSeconds }, headers: getHeaders() })
  if (!res.ok) throw new Error(`detail ${res.status}`)
  return res.json() as Promise<any>
}

export async function getProductDatesV2(productId: string, startDate?: string) {
  const url = new URL(`${apiBaseV2()}/product/${encodeURIComponent(productId)}/dates`)
  if (startDate) url.searchParams.set('start_date', startDate)
  const res = await fetch(url.toString(), { cache: 'no-store', headers: getHeaders() })
  if (!res.ok) throw new Error(`dates ${res.status}`)
  return res.json() as Promise<string[] | any>
}

export async function getProductOptionsDateTypeV2(productId: string, date: string) {
  // 캐시 키 생성
  const cacheKey = createCacheKey('options-date', productId, date)
  
  // 캐시에서 먼저 확인
  const cached = cache.get(cacheKey)
  if (cached) {
    if (process.env.NODE_ENV === 'development') console.log('캐시에서 옵션 데이터 반환:', cacheKey)
    return cached
  }

  // 중복 요청 방지 키 생성
  const requestKey = createRequestKey('options-date', productId, date)
  
  // 중복 요청 방지 및 서킷 브레이커 적용
  return requestDeduplicator.deduplicate(requestKey, async () => {
    return monitoredApiCall('TNA-OPTIONS-DATE', async () => {
      // Rate Limiting 확인
      if (!tnaRateLimiter.isAllowed('tna-api')) {
        const remainingTime = tnaRateLimiter.getRemainingTime('tna-api')
        throw new Error(`API 요청 한도 초과. ${Math.ceil(remainingTime / 1000)}초 후 다시 시도해주세요.`)
      }

      // 서킷 브레이커로 실행
      return tnaCircuitBreaker.execute(async () => {
        // 날짜형: /product/{productId}/{date}/options
        const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}/${encodeURIComponent(date)}/options`
        if (process.env.NODE_ENV === 'development') console.log('TNA API 호출 URL (날짜형 옵션):', url)
        
        try {
          const result = await retryWithBackoff(async () => {
            const res = await fetch(url, { cache: 'no-store', headers: getHeaders() })
            if (process.env.NODE_ENV === 'development') console.log('TNA API 응답 상태 (날짜형 옵션):', res.status)
            if (process.env.NODE_ENV === 'development') console.log('TNA API 응답 헤더:', Object.fromEntries(res.headers.entries()))
            
            if (!res.ok) {
              const errorText = await res.text().catch(() => '')
              if (process.env.NODE_ENV === 'development') console.log('TNA API 에러 응답:', errorText)
              if (res.status === 503) {
                throw new Error('TNA API 서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.')
              }
              throw new Error(`options-date ${res.status}: ${errorText}`)
            }
            const jsonResult = await res.json()
            if (process.env.NODE_ENV === 'development') console.log('TNA API 성공 응답:', jsonResult)
            return jsonResult
          })

          // 성공 시 캐시에 저장 (5분 TTL)
          cache.set(cacheKey, result, 5 * 60 * 1000)
          return result
        } catch (error) {
          if (process.env.NODE_ENV === 'development') console.error('TNA API 옵션 조회 실패:', error)
          throw error
        }
      })
    })
  })
}

export async function getProductOptionsPeriodTypeV2(productId: string) {
  // 캐시 키 생성
  const cacheKey = createCacheKey('options-period', productId)
  
  // 캐시에서 먼저 확인
  const cached = cache.get(cacheKey)
  if (cached) {
    if (process.env.NODE_ENV === 'development') console.log('캐시에서 옵션 데이터 반환:', cacheKey)
    return cached
  }

  // Rate Limiting 확인
  if (!tnaRateLimiter.isAllowed('tna-api')) {
    const remainingTime = tnaRateLimiter.getRemainingTime('tna-api')
    throw new Error(`API 요청 한도 초과. ${Math.ceil(remainingTime / 1000)}초 후 다시 시도해주세요.`)
  }

  // 기간형: /product/{productId}/options
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}/options`
  if (process.env.NODE_ENV === 'development') console.log('TNA API 호출 URL (기간형 옵션):', url)
  
  try {
    const result = await retryWithBackoff(async () => {
      const res = await fetch(url, { cache: 'no-store', headers: getHeaders() })
      if (process.env.NODE_ENV === 'development') console.log('TNA API 응답 상태 (기간형 옵션):', res.status)
      
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error('TNA API 서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
        throw new Error(`options-period ${res.status}`)
      }
      return res.json() as Promise<any>
    })

    // 성공 시 캐시에 저장 (10분 TTL - 기간형은 더 오래 캐시)
    cache.set(cacheKey, result, 10 * 60 * 1000)
    return result
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('TNA API 옵션 조회 실패:', error)
    throw error
  }
}

export async function getProductPriceDateTypeV2(productId: string, body: unknown) {
  const anyBody: any = body || {}
  
  // 캐시 키 생성 (가격은 더 짧은 TTL)
  const cacheKey = createCacheKey('price-date', productId, anyBody.product_option_code, anyBody.start_date, anyBody.end_date)
  
  // 캐시에서 먼저 확인
  const cached = cache.get(cacheKey)
  if (cached) {
    if (process.env.NODE_ENV === 'development') console.log('캐시에서 가격 데이터 반환:', cacheKey)
    return cached
  }

  // Rate Limiting 확인
  if (!tnaRateLimiter.isAllowed('tna-api')) {
    const remainingTime = tnaRateLimiter.getRemainingTime('tna-api')
    throw new Error(`API 요청 한도 초과. ${Math.ceil(remainingTime / 1000)}초 후 다시 시도해주세요.`)
  }

  // 날짜형 가격: /product/{productId}/price/date-type?product_option_code=xxx&start_date=xxx&end_date=xxx
  const url = new URL(`${apiBaseV2()}/product/${encodeURIComponent(productId)}/price/date-type`)
  
  if (anyBody?.product_option_code) url.searchParams.set('product_option_code', String(anyBody.product_option_code))
  if (anyBody?.start_date) url.searchParams.set('start_date', String(anyBody.start_date))
  if (anyBody?.end_date) url.searchParams.set('end_date', String(anyBody.end_date))
  
  if (process.env.NODE_ENV === 'development') console.log('TNA API 호출 URL (날짜형):', url.toString())
  if (process.env.NODE_ENV === 'development') console.log('요청 데이터:', anyBody)
  
  try {
    const result = await retryWithBackoff(async () => {
      const res = await fetch(url.toString(), { cache: 'no-store', headers: getHeaders() })
      if (process.env.NODE_ENV === 'development') console.log('TNA API 응답 상태:', res.status)
      
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error('TNA API 서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
        throw new Error(`price-date ${res.status}`)
      }
      return res.json() as Promise<any>
    })

    // 성공 시 캐시에 저장 (2분 TTL - 가격은 자주 변할 수 있음)
    cache.set(cacheKey, result, 2 * 60 * 1000)
    return result
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('TNA API 가격 조회 실패:', error)
    throw error
  }
}

export async function getProductPricePeriodTypeV2(productId: string, body: unknown) {
  const anyBody: any = body || {}
  
  // 캐시 키 생성
  const cacheKey = createCacheKey('price-period', productId, anyBody.product_option_code)
  
  // 캐시에서 먼저 확인
  const cached = cache.get(cacheKey)
  if (cached) {
    if (process.env.NODE_ENV === 'development') console.log('캐시에서 가격 데이터 반환:', cacheKey)
    return cached
  }

  // Rate Limiting 확인
  if (!tnaRateLimiter.isAllowed('tna-api')) {
    const remainingTime = tnaRateLimiter.getRemainingTime('tna-api')
    throw new Error(`API 요청 한도 초과. ${Math.ceil(remainingTime / 1000)}초 후 다시 시도해주세요.`)
  }

  // 기간형 가격: /product/{productId}/price/period-type?product_option_code=xxx
  const url = new URL(`${apiBaseV2()}/product/${encodeURIComponent(productId)}/price/period-type`)
  
  if (anyBody?.product_option_code) url.searchParams.set('product_option_code', String(anyBody.product_option_code))
  
  if (process.env.NODE_ENV === 'development') console.log('TNA API 호출 URL (기간형):', url.toString())
  if (process.env.NODE_ENV === 'development') console.log('요청 데이터:', anyBody)
  
  try {
    const result = await retryWithBackoff(async () => {
      const res = await fetch(url.toString(), { cache: 'no-store', headers: getHeaders() })
      if (process.env.NODE_ENV === 'development') console.log('TNA API 응답 상태:', res.status)
      
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error('TNA API 서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
        throw new Error(`price-period ${res.status}`)
      }
      return res.json() as Promise<any>
    })

    // 성공 시 캐시에 저장 (3분 TTL)
    cache.set(cacheKey, result, 3 * 60 * 1000)
    return result
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('TNA API 가격 조회 실패:', error)
    throw error
  }
}

export async function getProductDynamicPriceV2(productId: string, optionId: string, body: {
  selected_date: string
  labels: Array<{ id: string; quantity: number }>
  timeslot: { id: string }
}) {
  if (process.env.NODE_ENV === 'development') console.log('getProductDynamicPriceV2 시작:', { productId, optionId, body })
  
  // Rate Limiting 확인
  if (!tnaRateLimiter.isAllowed('tna-api')) {
    const remainingTime = tnaRateLimiter.getRemainingTime('tna-api')
    throw new Error(`API 요청 한도 초과. ${Math.ceil(remainingTime / 1000)}초 후 다시 시도해주세요.`)
  }

  // 동적 가격: /product/{productId}/options/{optionId}/dynamic-price
  const url = `${apiBaseV2()}/product/${encodeURIComponent(productId)}/options/${encodeURIComponent(optionId)}/dynamic-price`
  
  if (process.env.NODE_ENV === 'development') console.log('TNA API 호출 URL (동적 가격):', url)
  if (process.env.NODE_ENV === 'development') console.log('요청 데이터:', body)
  if (process.env.NODE_ENV === 'development') console.log('요청 헤더:', getHeaders())
  
  try {
    const result = await retryWithBackoff(async () => {
      if (process.env.NODE_ENV === 'development') console.log('fetch 요청 시작...')
      const res = await fetch(url, { 
        method: 'POST',
        cache: 'no-store', 
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      if (process.env.NODE_ENV === 'development') console.log('TNA API 응답 상태 (동적 가격):', res.status)
      if (process.env.NODE_ENV === 'development') console.log('TNA API 응답 헤더:', Object.fromEntries(res.headers.entries()))
      
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error('TNA API 서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.')
        }
        const errorText = await res.text().catch(() => '')
        if (process.env.NODE_ENV === 'development') console.error('TNA API 에러 응답:', errorText)
        throw new Error(`dynamic-price ${res.status}: ${errorText}`)
      }
      
      const jsonResult = await res.json()
      if (process.env.NODE_ENV === 'development') console.log('TNA API JSON 파싱 성공:', jsonResult)
      return jsonResult
    })

    if (process.env.NODE_ENV === 'development') console.log('TNA API 동적 가격 응답:', result)
    return result
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('TNA API 동적 가격 조회 실패 상세:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    throw error
  }
}


