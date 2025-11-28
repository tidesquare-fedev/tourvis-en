import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '인증 토큰이 없습니다.' },
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

    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
