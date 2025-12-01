import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

// 특정 계정 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 },
      );
    }

    // super_admin이거나 자신의 계정인 경우만 조회 가능
    if (admin.role !== 'super_admin' && admin.id !== params.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    // 계정 조회
    const { data: account, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, role, created_at, updated_at')
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    if (!account) {
      return NextResponse.json(
        { error: '계정을 찾을 수 없습니다.' },
        { status: 404 },
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error('계정 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

// 계정 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { username, password, role } = body;

    // super_admin이거나 자신의 계정인 경우만 수정 가능
    if (admin.role !== 'super_admin' && admin.id !== params.id) {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    // 자신의 계정인 경우 역할 변경 불가
    if (admin.id === params.id && role && role !== admin.role) {
      return NextResponse.json(
        { error: '자신의 역할은 변경할 수 없습니다.' },
        { status: 400 },
      );
    }

    // super_admin이 아닌 경우 역할 변경 불가
    if (admin.role !== 'super_admin' && role) {
      return NextResponse.json(
        { error: '역할 변경 권한이 없습니다.' },
        { status: 403 },
      );
    }

    // 업데이트할 데이터 준비
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (username) {
      // 중복 사용자명 확인
      const { data: existingUser } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('username', username)
        .neq('id', params.id)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: '이미 존재하는 사용자명입니다.' },
          { status: 400 },
        );
      }
      updateData.username = username;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
          { status: 400 },
        );
      }
      updateData.password = bcrypt.hashSync(password, 10);
    }

    if (role && admin.role === 'super_admin') {
      if (!['admin', 'super_admin'].includes(role)) {
        return NextResponse.json(
          { error: '유효하지 않은 역할입니다.' },
          { status: 400 },
        );
      }
      updateData.role = role;
    }

    // 계정 수정
    const { data: updatedAccount, error } = await supabaseAdmin
      .from('admin_users')
      .update(updateData)
      .eq('id', params.id)
      .select('id, username, role, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error('계정 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

// 계정 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 인증 확인
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const admin = verifyToken(token);
    if (!admin) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 },
      );
    }

    // super_admin만 계정 삭제 가능
    if (admin.role !== 'super_admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }

    // 자신의 계정은 삭제 불가
    if (admin.id === params.id) {
      return NextResponse.json(
        { error: '자신의 계정은 삭제할 수 없습니다.' },
        { status: 400 },
      );
    }

    // 계정 삭제
    const { error } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: '계정이 삭제되었습니다.' });
  } catch (error) {
    console.error('계정 삭제 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
