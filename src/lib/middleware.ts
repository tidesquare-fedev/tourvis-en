import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
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

      // 요청에 관리자 정보 추가
      request.headers.set('x-admin-id', admin.id);
      request.headers.set('x-admin-username', admin.username);
      request.headers.set('x-admin-role', admin.role);

      return handler(request, ...args);
    } catch (error) {
      return NextResponse.json(
        { error: '인증 처리 중 오류가 발생했습니다.' },
        { status: 500 },
      );
    }
  };
}

export function withRole(requiredRole: string) {
  return function (handler: Function) {
    return withAuth(async (request: NextRequest, ...args: any[]) => {
      const adminRole = request.headers.get('x-admin-role');

      if (adminRole !== requiredRole && adminRole !== 'super_admin') {
        return NextResponse.json(
          { error: '권한이 없습니다.' },
          { status: 403 },
        );
      }

      return handler(request, ...args);
    });
  };
}

export function getAdminFromRequest(request: NextRequest) {
  return {
    id: request.headers.get('x-admin-id') || '',
    username: request.headers.get('x-admin-username') || '',
    role: request.headers.get('x-admin-role') || '',
  };
}
