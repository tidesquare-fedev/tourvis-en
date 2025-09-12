# 관리자 대시보드 설정 가이드

## 개요
이 프로젝트는 관리자 전용 대시보드를 포함한 1:1 문의 시스템입니다. 관리자는 실시간으로 사용자 문의를 확인하고 답변할 수 있습니다.

## 주요 기능
- 관리자 인증 시스템 (JWT 기반)
- 실시간 문의 관리 (Supabase Realtime)
- 1:1 문의 답변 시스템
- 실시간 알림 및 자동 새로고침
- 보안 및 권한 관리

## 기술 스택
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Real-time**: Supabase Realtime

## 설정 방법

### 1. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT 시크릿
JWT_SECRET=your_jwt_secret_here

# 관리자 계정 (개발용)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 2. Supabase 데이터베이스 설정
1. Supabase 프로젝트를 생성합니다.
2. `database-schema.sql` 파일의 내용을 Supabase SQL 에디터에서 실행합니다.
3. Supabase 프로젝트 설정에서 Realtime을 활성화합니다.

### 3. 의존성 설치
```bash
npm install
```

### 4. 개발 서버 실행
```bash
npm run dev
```

## 사용 방법

### 관리자 로그인
1. 브라우저에서 `http://localhost:3000/en/admin/login`으로 이동
2. 기본 관리자 계정으로 로그인:
   - 사용자명: `admin`
   - 비밀번호: `admin123`

### 관리자 대시보드 기능
- **문의 목록**: 모든 사용자 문의를 실시간으로 확인
- **문의 상세**: 선택한 문의의 상세 내용 확인 및 답변 작성
- **상태 관리**: 문의 상태 (대기 중, 답변 완료, 종료) 변경
- **우선순위 관리**: 문의 우선순위 (낮음, 보통, 높음) 설정
- **실시간 업데이트**: 새로운 문의나 답변이 실시간으로 반영

### 사용자 문의 작성
1. 브라우저에서 `http://localhost:3000/en/inquiry`로 이동
2. 문의 양식을 작성하여 제출
   - Author (작성자명) - 필수, 2자 이상
   - Password (비밀번호) - 필수, 6자 이상
   - Name (이름) - 필수, 영어만
   - Email (이메일) - 필수, 형식 검증
   - Phone Number (전화번호) - 선택
   - Inquiry Type (문의 유형) - 필수
     - Reservation Inquiry (예약 문의)
     - Cancellation/Refund Inquiry (취소/환불 문의)
     - Reservation Change Inquiry (예약 변경 문의)
     - Product Inquiry (상품 문의)
     - Other Inquiry (기타 문의)
   - Subject (제목) - 필수, 3자 이상
   - Message (내용) - 필수, 10자 이상

## API 엔드포인트

### 관리자 인증
- `POST /api/admin/auth/login` - 관리자 로그인
- `POST /api/admin/auth/logout` - 관리자 로그아웃
- `GET /api/admin/auth/me` - 현재 관리자 정보

### 문의 관리
- `GET /api/admin/inquiries` - 문의 목록 조회
- `GET /api/admin/inquiries/[id]` - 특정 문의 조회
- `PATCH /api/admin/inquiries/[id]` - 문의 상태/우선순위 업데이트
- `DELETE /api/admin/inquiries/[id]` - 문의 삭제 (super_admin만)

### 답변 관리
- `GET /api/admin/inquiries/[id]/replies` - 답변 목록 조회
- `POST /api/admin/inquiries/[id]/replies` - 답변 작성

### 통계
- `GET /api/admin/stats` - 대시보드 통계

### 사용자 문의
- `POST /api/inquiries` - 문의 생성

## 보안 기능
- JWT 기반 인증
- 쿠키 기반 세션 관리
- 역할 기반 접근 제어 (admin, super_admin)
- RLS (Row Level Security) 적용
- 입력 데이터 검증

## 실시간 기능
- Supabase Realtime을 통한 실시간 데이터 동기화
- 새로운 문의 자동 감지
- 답변 작성 시 실시간 업데이트
- 연결 상태 표시

## 데이터베이스 스키마

### admin_users 테이블
- 관리자 계정 정보
- 역할 기반 권한 관리

### inquiries 테이블
- 사용자 문의 정보 (author, password, name, email, phone, category, subject, message)
- 상태 및 우선순위 관리
- 문의 유형 분류 (reservation, cancel, change, product, other)

### inquiry_replies 테이블
- 관리자 답변 정보
- 문의와 관리자 연결

## 문제 해결

### 실시간 연결이 안 될 때
1. Supabase 프로젝트에서 Realtime이 활성화되어 있는지 확인
2. 환경 변수가 올바르게 설정되어 있는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### 로그인이 안 될 때
1. 데이터베이스에 관리자 계정이 생성되어 있는지 확인
2. JWT_SECRET이 설정되어 있는지 확인
3. 쿠키 설정이 올바른지 확인

### 문의가 실시간으로 업데이트되지 않을 때
1. Supabase Realtime 설정 확인
2. 데이터베이스 RLS 정책 확인
3. 네트워크 연결 상태 확인

## 추가 개발 사항
- 이메일 알림 기능
- 파일 첨부 기능
- 문의 카테고리 분류
- 관리자 활동 로그
- 대시보드 차트 및 분석
