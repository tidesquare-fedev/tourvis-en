// 관리자 인증 관련 타입
export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: string;
  username: string;
  role: string;
}

// 1:1 문의 관련 타입
export interface Inquiry {
  id: string;
  author: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
  category: string;
  subject: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

// 문의 답변 관련 타입
export interface InquiryReply {
  id: string;
  inquiry_id: string;
  admin_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// 관리자 이름이 포함된 문의 답변 타입
export interface InquiryReplyWithAdmin extends InquiryReply {
  admin_users: {
    username: string;
  };
}

// 관리자 대시보드 통계 타입
export interface DashboardStats {
  total_inquiries: number;
  pending_inquiries: number;
  answered_inquiries: number;
  closed_inquiries: number;
  today_inquiries: number;
}

// 실시간 알림 타입
export interface RealtimeNotification {
  type: 'new_inquiry' | 'inquiry_updated' | 'inquiry_replied';
  data: unknown;
  timestamp: string;
}
