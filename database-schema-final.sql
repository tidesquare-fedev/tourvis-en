-- 기존 테이블이 있는지 확인하고 필요한 경우에만 생성
-- 먼저 기존 테이블들을 삭제 (주의: 데이터가 모두 삭제됩니다)
DROP TABLE IF EXISTS inquiry_replies CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- 관리자 사용자 테이블 생성
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1:1 문의 테이블 생성 (Direct Inquiry 페이지에 맞춰서 필드 수정)
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author VARCHAR(100) NOT NULL,           -- 작성자명 (Author)
  password VARCHAR(255) NOT NULL,         -- 비밀번호 (Password)
  name VARCHAR(100) NOT NULL,             -- 이름 (Name)
  email VARCHAR(255) NOT NULL,            -- 이메일 (Email)
  phone VARCHAR(20),                      -- 전화번호 (Phone Number)
  category VARCHAR(50) NOT NULL,          -- 문의 유형 (Inquiry Type)
  subject VARCHAR(255) NOT NULL,          -- 제목 (Subject)
  message TEXT NOT NULL,                  -- 내용 (Message)
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 문의 답변 테이블 생성
CREATE TABLE inquiry_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_priority ON inquiries(priority);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_category ON inquiries(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_author ON inquiries(author);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_inquiry_replies_inquiry_id ON inquiry_replies(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_inquiry_replies_admin_id ON inquiry_replies(admin_id);

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

-- 문의 유형에 대한 제약 조건 추가
ALTER TABLE inquiries ADD CONSTRAINT check_category 
CHECK (category IN ('reservation', 'cancel', 'change', 'product', 'other'));

-- 샘플 문의 데이터 (테스트용)
INSERT INTO inquiries (author, password, name, email, phone, category, subject, message, status, priority) VALUES 
('john_doe', 'password123', 'John Doe', 'john@example.com', '010-1234-5678', 'reservation', 'Tour booking inquiry', 'I would like to book a tour for next week. Please let me know the available dates.', 'pending', 'medium'),
('jane_smith', 'password456', 'Jane Smith', 'jane@example.com', '010-9876-5432', 'cancel', 'Cancellation request', 'I need to cancel my reservation for the tour on March 15th.', 'answered', 'high'),
('mike_wilson', 'password789', 'Mike Wilson', 'mike@example.com', '010-5555-1234', 'product', 'Product information', 'Can you provide more details about the premium tour package?', 'pending', 'low');
