import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '사용자명과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const result = await authenticateAdmin(username, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      admin: result.admin
    })

    // JWT 토큰을 쿠키에 저장
    response.cookies.set('admin_token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24시간
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
