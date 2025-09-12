import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // 답변 목록 조회 (관리자 이름 포함)
    const { data: replies, error } = await supabaseAdmin
      .from('inquiry_replies')
      .select(`
        *,
        admin_users!inner(username)
      `)
      .eq('inquiry_id', params.id)
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json(replies || [])
  } catch (error) {
    console.error('답변 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: '답변 내용을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 문의 존재 확인
    const { data: inquiry, error: inquiryError } = await supabaseAdmin
      .from('inquiries')
      .select('id')
      .eq('id', params.id)
      .single()

    if (inquiryError || !inquiry) {
      return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 답변 생성
    const { data: reply, error } = await supabaseAdmin
      .from('inquiry_replies')
      .insert({
        inquiry_id: params.id,
        admin_id: admin.id,
        content: content.trim()
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // 문의 상태를 답변 완료로 업데이트
    await supabaseAdmin
      .from('inquiries')
      .update({ status: 'answered' })
      .eq('id', params.id)

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    console.error('답변 생성 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
