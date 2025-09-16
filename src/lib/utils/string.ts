/**
 * 문자열 관련 유틸리티 함수들
 * 이모지 처리 및 문자열 변환 로직을 통합
 */

/**
 * 이모지에서 서로게이트 페어를 제거하여 텍스트만 추출
 * @param text - 처리할 텍스트
 * @returns 이모지가 제거된 텍스트
 */
export function stripEmoji(text: string): string {
  const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  const variationSel = /\uFE0F/g
  return text.replace(surrogatePair, '').replace(variationSel, '').trim()
}

/**
 * 텍스트에서 첫 번째 이모지(서로게이트 페어)를 추출
 * @param text - 처리할 텍스트
 * @returns 추출된 이모지 또는 빈 문자열
 */
export function extractFirstEmoji(text: string): string {
  const surrogatePairOne = /[\uD800-\uDBFF][\uDC00-\uDFFF]/
  const match = text.match(surrogatePairOne)
  return match ? match[0] : ''
}

/**
 * 문자열을 안전하게 숫자로 변환
 * @param value - 변환할 값
 * @param defaultValue - 변환 실패 시 기본값
 * @returns 변환된 숫자 또는 기본값
 */
export function safeParseNumber(value: any, defaultValue: number = 0): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return isNaN(parsed) ? defaultValue : parsed
  }
  return defaultValue
}

/**
 * 문자열을 안전하게 정수로 변환
 * @param value - 변환할 값
 * @param defaultValue - 변환 실패 시 기본값
 * @returns 변환된 정수 또는 기본값
 */
export function safeParseInt(value: any, defaultValue: number = 0): number {
  if (typeof value === 'number') return Math.floor(value)
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? defaultValue : parsed
  }
  return defaultValue
}

/**
 * 문자열을 안전하게 불린으로 변환
 * @param value - 변환할 값
 * @param defaultValue - 변환 실패 시 기본값
 * @returns 변환된 불린 또는 기본값
 */
export function safeParseBoolean(value: any, defaultValue: boolean = false): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase()
    return lower === 'true' || lower === '1' || lower === 'yes'
  }
  if (typeof value === 'number') return value !== 0
  return defaultValue
}

/**
 * 문자열이 유효한지 확인 (null, undefined, 빈 문자열이 아닌지)
 * @param value - 확인할 값
 * @returns 유효한 문자열인지 여부
 */
export function isValidString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * 문자열을 안전하게 변환 (null/undefined 처리)
 * @param value - 변환할 값
 * @param defaultValue - 기본값
 * @returns 변환된 문자열
 */
export function safeString(value: any, defaultValue: string = ''): string {
  if (isValidString(value)) return value
  return defaultValue
}
