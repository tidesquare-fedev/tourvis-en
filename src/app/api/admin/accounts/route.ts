import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// 모든 계정 조회
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

    // super_admin만 모든 계정 조회 가능
    if (admin.role !== 'super_admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    // 모든 관리자 계정 조회
    const { data: accounts, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, role, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(accounts || [])
  } catch (error) {
    console.error('계정 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 새 계정 생성
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

    // super_admin만 계정 생성 가능
    if (admin.role !== 'super_admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })
    }

    const body = await request.json()
    const { username, password, role } = body

    // 입력 검증
    if (!username || !password || !role) {
      return NextResponse.json(
        { error: '사용자명, 비밀번호, 역할을 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    if (!['admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { error: '유효하지 않은 역할입니다.' },
        { status: 400 }
      )
    }

    // 중복 사용자명 확인
    const { data: existingUser } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 사용자명입니다.' },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = bcrypt.hashSync(password, 10)

    // 새 계정 생성
    const { data: newAccount, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        username,
        password: hashedPassword,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, username, role, created_at, updated_at')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(newAccount, { status: 201 })
  } catch (error) {
    console.error('계정 생성 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
