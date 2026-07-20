# 국민산악회 홈페이지 — CLAUDE.md

> **Claude Code 진입점.** 이 파일을 먼저 읽고 TODO.md 순서대로 작업하면 된다.

---

## 프로젝트 개요

산악회 공식 홈페이지. 공지사항, 사진갤러리, 자유게시판, 회원가입/로그인 제공.

- **사이트명**: 국민산악회
- **스택**: Flask + React 18 + Vite + TypeScript + MariaDB + Tailwind CSS v3
- **개발사**: H.Co (에이치코)

---

## 디렉토리 구조

```
gukmin-sanakwi/
├── CLAUDE.md          ← 지금 읽는 파일
├── TODO.md            ← 작업 목록 (여기서 시작)
├── DESIGN.md          ← 디자인 시스템 상세
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── models/    ← user, notice, board, gallery
│   │   ├── routes/    ← auth, notice, board, gallery
│   │   └── utils/     ← auth_helpers, image_utils
│   ├── .env.example
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── api/axios.ts
│   │   ├── store/authStore.ts
│   │   ├── types/index.ts
│   │   ├── components/
│   │   │   ├── layout/   ← Header, Footer, Layout
│   │   │   └── common/   ← Pagination, PageHeader
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── about/    ← Greeting, History, Officers
│   │       ├── notice/   ← NoticeList, NoticeDetail
│   │       ├── gallery/  ← GalleryList, GalleryDetail
│   │       ├── board/    ← BoardList, BoardDetail, BoardWrite
│   │       └── auth/     ← Login, Register
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
└── nginx/
    └── gukmin-sanakwi.conf
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 + Pretendard 웹폰트 |
| 상태관리 | Zustand (인증) |
| Backend | Flask 3 + SQLAlchemy 2 |
| DB | MariaDB 10 (utf8mb4_unicode_ci) |
| 인증 | Flask-JWT-Extended (Access 1h + Refresh 30d) |
| 이미지 | Pillow (썸네일 400x300 자동생성) |
| 배포 | Nginx + Gunicorn + Let's Encrypt |

---

## 디자인 시스템

### 컬러 토큰 (tailwind.config.ts 기준)

```
primary.DEFAULT  #c0392b  메인 레드 — 네비/버튼/포인트
primary.dark     #922b21  어두운 레드 — 호버/서브바
primary.mid      #e74c3c  밝은 레드
primary.light    #fef5f5  연한 레드 — hover 배경
accent           #ffffff  화이트 액센트
surface          #f8f8f8  페이지 배경
```

### 홈 레이아웃 구조

```
[서브바]      검정(#1a1a1a) — 로그인/회원가입
[네비]        레드(#c0392b) — 로고 + 메뉴 4개
[히어로]      레드 그라디언트 — 타이틀 + CTA
[사진스트립]  검정(#111) — 카드 8장 왼쪽 무한 흘러가기  ← 핵심 섹션
[빠른링크]    흰배경 — 아이콘 4개
[위젯 3단]    공지사항 / 자유게시판 / 갤러리
[푸터]        검정(#1a1a1a)
```

### 사진 스트립 스펙 (Home.tsx 구현 필요)

```css
/* 래퍼 */
.photo-strip-wrap {
  background: #111;
  padding: 14px 0;
  overflow: hidden;
}
/* 좌우 페이드 마스크 */
.photo-strip-wrap::before,
.photo-strip-wrap::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 60px;
  background: linear-gradient(to right, #111, transparent);
  z-index: 2;
}
/* 트랙 — 원본 8장 + 복제 8장 = 16장 */
.photo-strip {
  display: flex;
  gap: 10px;
  width: max-content;
  animation: scrollLeft 20s linear infinite;
}
.photo-strip:hover { animation-play-state: paused; }
@keyframes scrollLeft {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }  /* 절반 = 원본 8장 너비 */
}
/* 카드 */
.photo-card {
  width: 200px;
  height: 130px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}
/* 실제 서비스에서는 색 배경 → <img src="..."> 교체 */
```

---

## 페이지 목록 (14개 라우트)

| 경로 | 컴포넌트 | 권한 |
|------|----------|------|
| `/` | Home | 전체 |
| `/about/greeting` | Greeting | 전체 |
| `/about/history` | History | 전체 |
| `/about/officers` | Officers | 전체 |
| `/notice` | NoticeList | 전체 |
| `/notice/:id` | NoticeDetail | 전체 |
| `/gallery` | GalleryList | 전체 |
| `/gallery/:id` | GalleryDetail | 전체 |
| `/board` | BoardList | 전체 |
| `/board/write` | BoardWrite | 로그인 |
| `/board/:id` | BoardDetail | 전체 |
| `/board/:id/edit` | BoardWrite | 본인/관리자 |
| `/auth/login` | Login | 비로그인 |
| `/auth/register` | Register | 비로그인 |

---

## API 엔드포인트

```
POST   /api/auth/register
POST   /api/auth/login           → { access_token, refresh_token, user }
POST   /api/auth/refresh
GET    /api/auth/me              [JWT]

GET    /api/notices/             ?page=1&category=general|event
GET    /api/notices/:id
POST   /api/notices/             [admin]
PUT    /api/notices/:id          [admin]
DELETE /api/notices/:id          [admin]

GET    /api/board/               ?page=1
GET    /api/board/:id
POST   /api/board/               [JWT]
PUT    /api/board/:id            [본인/admin]
DELETE /api/board/:id            [본인/admin]
POST   /api/board/:id/comments   [JWT]
DELETE /api/board/:id/comments/:cid  [본인/admin]

GET    /api/gallery/             ?page=1
GET    /api/gallery/:id
POST   /api/gallery/             [admin]
POST   /api/gallery/:id/photos   [admin] multipart/form-data
DELETE /api/gallery/:id          [admin]
```

---

## DB 스키마

```sql
-- 모든 테이블 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

users         (id, username UNIQUE, password, name, phone, role ENUM('admin','member'), is_active, created_at)
notices       (id, category ENUM('general','event'), title, content, author_id→users, is_pinned, views, created_at, updated_at)
board_posts   (id, title, content, author_id→users, views, created_at, updated_at)
board_comments(id, post_id→board_posts CASCADE, author_id→users, content, created_at)
gallery_albums(id, title, description, cover_image, author_id→users, created_at)
gallery_photos(id, album_id→gallery_albums CASCADE, original, thumbnail, caption, sort_order, created_at)
```

---

## API 응답 규칙

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "에러메시지" }
```

---

## 코딩 컨벤션

- Tailwind: `text-primary` / `bg-primary` / `hover:bg-primary-dark` 등 토큰 사용
- TypeScript: 모든 API 타입은 `src/types/index.ts`에 정의
- Flask: Blueprint 단위, `@jwt_required()` / `@admin_required` 데코레이터
- 날짜: `YYYY.MM.DD` 형식
- 페이지당: 공지/게시판 15개, 갤러리 12개
- 이미지: `uploads/YYYY/MM/` 폴더, 썸네일 prefix `thumb_`

---

## 로컬 개발 시작

```bash
# 1. DB 생성
mysql -u root -p -e "CREATE DATABASE sanakwi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Backend
cd backend
cp .env.example .env        # DB 비밀번호 수정
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
flask db init && flask db migrate && flask db upgrade
flask run --port=5000

# 3. Frontend (별도 터미널)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

---

## 환경변수

```bash
# backend/.env
FLASK_ENV=development
SECRET_KEY=여기에_변경하세요
JWT_SECRET_KEY=여기에_변경하세요
DATABASE_URL=mysql+pymysql://root:비밀번호@localhost:3306/sanakwi_db
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=10485760

# frontend/.env
VITE_API_BASE_URL=http://localhost:5000
```
