/**
 * 데이터 검증 유틸리티
 * 입력 데이터의 유효성을 검사하고 표준화하는 함수들
 */

import { z } from 'zod'

/**
 * 기본 검증 스키마들
 */
export const validationSchemas = {
  // ID 검증 (문자열 또는 숫자)
  id: z.union([z.string(), z.number()]).transform(String),
  
  // 이메일 검증
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  
  // 전화번호 검증 (한국 형식)
  phone: z.string().regex(
    /^(\+82|0)[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}$/,
    '유효한 전화번호를 입력해주세요.'
  ),
  
  // URL 검증
  url: z.string().url('유효한 URL을 입력해주세요.'),
  
  // 이미지 URL 검증
  imageUrl: z.string().url('유효한 이미지 URL을 입력해주세요.'),
  
  // 가격 검증
  price: z.number().min(0, '가격은 0 이상이어야 합니다.'),
  
  // 할인율 검증
  discountRate: z.number().min(0).max(100, '할인율은 0-100 사이여야 합니다.'),
  
  // 평점 검증
  rating: z.number().min(0).max(5, '평점은 0-5 사이여야 합니다.'),
  
  // 페이지 번호 검증
  page: z.number().int().min(1, '페이지 번호는 1 이상이어야 합니다.'),
  
  // 페이지 크기 검증
  pageSize: z.number().int().min(1).max(100, '페이지 크기는 1-100 사이여야 합니다.'),
}

/**
 * 안전한 파싱 함수
 * @param schema - Zod 스키마
 * @param data - 검증할 데이터
 * @param defaultValue - 검증 실패 시 기본값
 * @returns 검증된 데이터 또는 기본값
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T {
  try {
    const result = schema.safeParse(data)
    return result.success ? result.data : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 문자열을 안전하게 숫자로 변환
 * @param value - 변환할 값
 * @param defaultValue - 변환 실패 시 기본값
 * @returns 변환된 숫자 또는 기본값
 */
export function safeParseNumber(value: unknown, defaultValue: number = 0): number {
  return safeParse(z.number(), value, defaultValue)
}

/**
 * 문자열을 안전하게 정수로 변환
 * @param value - 변환할 값
 * @param defaultValue - 변환 실패 시 기본값
 * @returns 변환된 정수 또는 기본값
 */
export function safeParseInt(value: unknown, defaultValue: number = 0): number {
  return safeParse(z.number().int(), value, defaultValue)
}

/**
 * 문자열을 안전하게 불린으로 변환
 * @param value - 변환할 값
 * @param defaultValue - 변환 실패 시 기본값
 * @returns 변환된 불린 또는 기본값
 */
export function safeParseBoolean(value: unknown, defaultValue: boolean = false): boolean {
  return safeParse(z.boolean(), value, defaultValue)
}

/**
 * 배열을 안전하게 검증
 * @param schema - 배열 요소의 스키마
 * @param data - 검증할 데이터
 * @param defaultValue - 검증 실패 시 기본값
 * @returns 검증된 배열 또는 기본값
 */
export function safeParseArray<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T[] = []
): T[] {
  return safeParse(z.array(schema), data, defaultValue)
}

/**
 * 객체를 안전하게 검증
 * @param schema - 객체 스키마
 * @param data - 검증할 데이터
 * @param defaultValue - 검증 실패 시 기본값
 * @returns 검증된 객체 또는 기본값
 */
export function safeParseObject<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T {
  return safeParse(schema, data, defaultValue)
}

/**
 * 제품 데이터 검증 스키마
 */
export const productSchema = z.object({
  id: validationSchemas.id,
  title: z.string().min(1, '제품명은 필수입니다.'),
  image: z.string().url('유효한 이미지 URL이 필요합니다.'),
  images: z.array(z.string().url()).optional(),
  price: validationSchemas.price,
  originalPrice: validationSchemas.price.optional(),
  discountRate: validationSchemas.discountRate.optional(),
  rating: validationSchemas.rating.optional(),
  reviewCount: z.number().int().min(0).optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  href: z.string().url().optional(),
})

/**
 * 배너 데이터 검증 스키마
 */
export const bannerSchema = z.object({
  id: validationSchemas.id,
  image: z.string().url('유효한 이미지 URL이 필요합니다.'),
  title: z.string().min(1, '배너 제목은 필수입니다.'),
  subtitle: z.string().optional(),
  href: z.string().url().optional(),
})

/**
 * 지역 데이터 검증 스키마
 */
export const regionSchema = z.object({
  id: validationSchemas.id,
  name: z.string().min(1, '지역명은 필수입니다.'),
  subtitle: z.string().optional(),
  image: z.string().url('유효한 이미지 URL이 필요합니다.'),
})

/**
 * 카테고리 데이터 검증 스키마
 */
export const categorySchema = z.object({
  title: z.string().min(1, '카테고리 제목은 필수입니다.'),
  items: z.array(productSchema).default([]),
})

/**
 * API 응답 검증 스키마
 */
export const apiResponseSchema = z.object({
  ok: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

/**
 * 페이지네이션 검증 스키마
 */
export const paginationSchema = z.object({
  page: validationSchemas.page,
  pageSize: validationSchemas.pageSize,
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
})

/**
 * 검색 파라미터 검증 스키마
 */
export const searchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: validationSchemas.price.optional(),
  maxPrice: validationSchemas.price.optional(),
  rating: validationSchemas.rating.optional(),
  sort: z.enum(['price', 'rating', 'newest', 'popular']).optional(),
  page: validationSchemas.page.optional(),
  pageSize: validationSchemas.pageSize.optional(),
})

/**
 * 폼 데이터 검증 스키마
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다.'),
  email: validationSchemas.email,
  phone: validationSchemas.phone.optional(),
  subject: z.string().min(1, '제목은 필수입니다.'),
  message: z.string().min(10, '메시지는 최소 10자 이상이어야 합니다.'),
  agreeToTerms: z.boolean().refine(val => val === true, '약관에 동의해야 합니다.'),
})

/**
 * 예약 데이터 검증 스키마
 */
export const reservationSchema = z.object({
  productId: validationSchemas.id,
  date: z.date(),
  quantity: z.number().int().min(1, '수량은 최소 1개 이상이어야 합니다.'),
  customerName: z.string().min(1, '고객명은 필수입니다.'),
  customerEmail: validationSchemas.email,
  customerPhone: validationSchemas.phone,
  specialRequests: z.string().optional(),
})

/**
 * 검증 결과 타입
 */
export interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: z.ZodError
}

/**
 * 데이터 검증 함수
 * @param schema - Zod 스키마
 * @param data - 검증할 데이터
 * @returns 검증 결과
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    }
  } else {
    return {
      success: false,
      errors: result.error,
    }
  }
}
