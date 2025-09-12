import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { author, password } = body

    // 필수 필드 검증
    if (!author || !password) {
      return NextResponse.json(
        { error: 'Author and password are required' },
        { status: 400 }
      )
    }

    // 데이터베이스에서 해당 author의 문의 조회
    const { data: inquiries, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('author', author)
      .eq('password', password) // 실제 운영에서는 해시화된 비밀번호로 비교해야 함
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to search inquiries' },
        { status: 500 }
      )
    }

    // 문의가 없으면 빈 배열 반환
    if (!inquiries || inquiries.length === 0) {
      return NextResponse.json({
        success: true,
        inquiries: [],
        message: 'No inquiries found for this author'
      })
    }

    return NextResponse.json({
      success: true,
      inquiries: inquiries,
      message: `Found ${inquiries.length} inquiry(ies)`
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
