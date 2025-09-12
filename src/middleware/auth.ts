import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

/**
 * 관리자 인증 미들웨어
 */
export function withAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const token = request.cookies.get('admin_token')?.value

      if (!token) {
        return NextResponse.json(
          { error: '인증이 필요합니다.' },
          { status: 401 }
        )
      }

      const admin = verifyToken(token)
      if (!admin) {
        return NextResponse.json(
          { error: '유효하지 않은 토큰입니다.' },
          { status: 401 }
        )
      }

      // 요청에 관리자 정보 추가
      request.headers.set('x-admin-id', admin.id)
      request.headers.set('x-admin-username', admin.username)
      request.headers.set('x-admin-role', admin.role)

      return handler(request)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: '인증 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }
  }
}

/**
 * 슈퍼 관리자 권한 확인
 */
export function withSuperAdmin(handler: (request: NextRequest) => Promise<NextResponse>) {
  return withAuth(async (request: NextRequest) => {
    const role = request.headers.get('x-admin-role')
    
    if (role !== 'super_admin') {
      return NextResponse.json(
        { error: '슈퍼 관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    return handler(request)
  })
}

/**
 * Rate Limiting 미들웨어
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: { maxRequests: number; windowMs: number } = { maxRequests: 100, windowMs: 60000 }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - options.windowMs

    // 오래된 엔트리 정리
    for (const [key, value] of Array.from(rateLimitMap.entries())) {
      if (value.resetTime < windowStart) {
        rateLimitMap.delete(key)
      }
    }

    const key = `${ip}:${request.nextUrl.pathname}`
    const current = rateLimitMap.get(key)

    if (!current) {
      rateLimitMap.set(key, { count: 1, resetTime: now })
    } else if (current.resetTime < windowStart) {
      rateLimitMap.set(key, { count: 1, resetTime: now })
    } else if (current.count >= options.maxRequests) {
      return NextResponse.json(
        { error: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      )
    } else {
      current.count++
    }

    return handler(request)
  }
}

/**
 * CORS 미들웨어
 */
export function withCORS(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const response = await handler(request)

    // CORS 헤더 추가
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_BASE_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')

    return response
  }
}

/**
 * 보안 헤더 미들웨어
 */
export function withSecurityHeaders(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const response = await handler(request)

    // 보안 헤더 추가
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
  }
}
