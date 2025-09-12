import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const admin = verifyToken(token)
    if (!admin) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
    }

    // 쿼리 파라미터
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // 문의 목록 조회
    let query = supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority)
    }

    const { data: inquiries, error } = await query
      .range((page - 1) * limit, page * limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json(inquiries || [])
  } catch (error) {
    console.error('문의 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const admin = verifyToken(token)
    if (!admin) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 })
    }

    const body = await request.json()
    const { user_name, user_email, user_phone, subject, content, priority = 'medium' } = body

    // 필수 필드 검증
    if (!user_name || !user_email || !subject || !content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 문의 생성
    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        user_name,
        user_email,
        user_phone,
        subject,
        content,
        priority,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    console.error('문의 생성 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
