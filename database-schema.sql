-- 관리자 사용자 테이블
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1:1 문의 테이블
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 문의 답변 테이블
CREATE TABLE inquiry_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_priority ON inquiries(priority);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX idx_inquiry_replies_inquiry_id ON inquiry_replies(inquiry_id);
CREATE INDEX idx_inquiry_replies_admin_id ON inquiry_replies(admin_id);

-- RLS (Row Level Security) 정책
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_replies ENABLE ROW LEVEL SECURITY;

-- 관리자만 모든 데이터에 접근 가능
CREATE POLICY "Admin access to admin_users" ON admin_users
  FOR ALL USING (true);

CREATE POLICY "Admin access to inquiries" ON inquiries
  FOR ALL USING (true);

CREATE POLICY "Admin access to inquiry_replies" ON inquiry_replies
  FOR ALL USING (true);

-- 실시간 구독을 위한 발행 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE inquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE inquiry_replies;

-- 초기 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO admin_users (username, password, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');
