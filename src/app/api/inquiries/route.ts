import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('문의 API 호출 시작')
    const body = await request.json()
    console.log('받은 데이터:', body)
    
    const { author, password, name, email, phone, category, subject, message } = body

    // 필수 필드 검증
    if (!author || !password || !name || !email || !category || !subject || !message) {
      console.log('필수 필드 누락:', { author, password, name, email, category, subject, message })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('이메일 형식 오류:', email)
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // 문의 데이터를 데이터베이스에 저장
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert([
        {
          author,
          password, // 실제 운영에서는 해시화해야 함
          name,
          email,
          phone: phone || null,
          category,
          subject,
          message,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save inquiry', details: error.message },
        { status: 500 }
      )
    }

    console.log('문의 저장 성공:', data)
    return NextResponse.json(
      { 
        success: true, 
        message: 'Inquiry submitted successfully',
        data: data[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}