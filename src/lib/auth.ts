import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './supabase';
import { AdminUser } from '@/types/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AdminSession {
  id: string;
  username: string;
  role: string;
}

// JWT 토큰 생성
export function generateToken(admin: AdminSession): string {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: '24h' });
}

// JWT 토큰 검증
export function verifyToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminSession;
  } catch {
    return null;
  }
}

// 관리자 로그인
export async function authenticateAdmin(
  username: string,
  password: string,
): Promise<{
  success: boolean;
  admin?: AdminSession;
  token?: string;
  error?: string;
}> {
  try {
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !admin) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' };
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return { success: false, error: '비밀번호가 올바르지 않습니다.' };
    }

    const adminSession: AdminSession = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    };

    const token = generateToken(adminSession);

    return { success: true, admin: adminSession, token };
  } catch (error) {
    return { success: false, error: '로그인 중 오류가 발생했습니다.' };
  }
}

// 비밀번호 해시화
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// 관리자 계정 생성 (초기 설정용)
export async function createAdminUser(
  username: string,
  password: string,
  role: 'admin' | 'super_admin' = 'admin',
): Promise<{ success: boolean; error?: string }> {
  try {
    const hashedPassword = await hashPassword(password);

    const { error } = await supabaseAdmin.from('admin_users').insert({
      username,
      password: hashedPassword,
      role,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: '관리자 계정 생성 중 오류가 발생했습니다.',
    };
  }
}
