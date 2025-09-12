import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { author, password, name, email, phone, category, subject, message, priority = 'medium' } = body

    // 필수 필드 검증
    if (!author || !password || !name || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      )
    }

    // 문의 유형 검증
    const validCategories = ['reservation', 'cancel', 'change', 'product', 'other']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: '올바른 문의 유형을 선택해주세요.' },
        { status: 400 }
      )
    }

    // 문의 생성
    const { data: inquiry, error } = await supabase
      .from('inquiries')
      .insert({
        author,
        password,
        name,
        email,
        phone,
        category,
        subject,
        message,
        priority,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('문의 생성 오류:', error)
      return NextResponse.json(
        { error: '문의 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      )
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
