import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // 통계 데이터 조회
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // 전체 문의 수
    const { count: totalInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true });

    // 대기 중인 문의 수
    const { count: pendingInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 답변 완료된 문의 수
    const { count: answeredInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'answered');

    // 종료된 문의 수
    const { count: closedInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'closed');

    // 오늘 문의 수
    const { count: todayInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayISO);

    return NextResponse.json({
      total_inquiries: totalInquiries || 0,
      pending_inquiries: pendingInquiries || 0,
      answered_inquiries: answeredInquiries || 0,
      closed_inquiries: closedInquiries || 0,
      today_inquiries: todayInquiries || 0,
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
