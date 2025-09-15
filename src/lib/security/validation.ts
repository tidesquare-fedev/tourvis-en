/**
 * 보안 및 입력 검증 유틸리티
 */

import { z } from 'zod'

// XSS 방지를 위한 HTML 이스케이프
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// SQL 인젝션 방지를 위한 입력 정리
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // HTML 태그 제거
    .replace(/['";\\]/g, '') // SQL 특수 문자 제거
    .slice(0, 1000) // 길이 제한
}

// 이메일 검증
export const emailSchema = z.string().email('Invalid email format').max(255)

// 전화번호 검증 (한국 형식)
export const phoneSchema = z.string().regex(
  /^01[0-9]-\d{3,4}-\d{4}$/,
  'Invalid phone number format (010-1234-5678)'
)

// 비밀번호 검증 (최소 8자, 영문+숫자+특수문자)
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, 
    'Password must contain at least one letter, one number, and one special character')

// 이름 검증
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z가-힣\s]+$/, 'Name can only contain letters and spaces')

// 문의 내용 검증
export const inquiryContentSchema = z.string()
  .min(10, 'Message must be at least 10 characters')
  .max(2000, 'Message must be less than 2000 characters')

// 문의 제목 검증
export const inquirySubjectSchema = z.string()
  .min(5, 'Subject must be at least 5 characters')
  .max(200, 'Subject must be less than 200 characters')

// 문의 데이터 전체 검증 스키마
export const inquirySchema = z.object({
  author: z.string().min(1, 'Author is required').max(50),
  password: passwordSchema,
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  category: z.string().min(1, 'Category is required'),
  subject: inquirySubjectSchema,
  message: inquiryContentSchema,
})

// API 응답에서 민감한 정보 제거
export function sanitizeApiResponse(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeApiResponse)
  }

  const sanitized = { ...data }
  
  // 민감한 필드 제거 또는 마스킹
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth']
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]'
    }
  }

  // 중첩된 객체도 재귀적으로 처리
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeApiResponse(sanitized[key])
    }
  }

  return sanitized
}

// Rate limiting을 위한 간단한 구현
class RateLimiter {
  private attempts = new Map<string, { count: number; resetTime: number }>()
  private readonly maxAttempts: number
  private readonly windowMs: number

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const attempt = this.attempts.get(identifier)

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs })
      return true
    }

    if (attempt.count >= this.maxAttempts) {
      return false
    }

    attempt.count++
    return true
  }

  getRemainingAttempts(identifier: string): number {
    const attempt = this.attempts.get(identifier)
    if (!attempt) return this.maxAttempts
    return Math.max(0, this.maxAttempts - attempt.count)
  }

  getResetTime(identifier: string): number {
    const attempt = this.attempts.get(identifier)
    return attempt?.resetTime || 0
  }
}

export const rateLimiter = new RateLimiter()

// CSRF 토큰 생성 (간단한 구현)
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

// CSRF 토큰 검증
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length > 0
}
