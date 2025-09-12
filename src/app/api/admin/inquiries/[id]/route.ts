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

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('문의 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const { status, priority } = body

    // 업데이트할 필드 구성
    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: '업데이트할 데이터가 없습니다.' }, { status: 400 })
    }

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('문의 업데이트 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // 관리자 권한 확인 (super_admin만 삭제 가능)
    if (admin.role !== 'super_admin') {
      return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('inquiries')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('문의 삭제 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
