# TODO.md — 작업 큐

> Claude Code가 이 파일을 보고 순서대로 작업한다.
> 완료한 항목은 `- [x]`로 체크.

---

## Phase 1 — DB + 백엔드 초기화 ✅ (코드 완성, 실행 필요)

- [ ] `backend/.env` 생성 (`.env.example` 복사 후 DB 비밀번호 입력)
- [ ] MariaDB에 `sanakwi_db` 데이터베이스 생성
- [ ] `flask db init && flask db migrate && flask db upgrade` 실행
- [ ] 관리자 계정 시드 스크립트 작성 및 실행
  ```python
  # backend/seed_admin.py 생성 필요
  # username: admin / password: admin1234 / role: admin
  ```

---

## Phase 2 — 프론트엔드 색상 업데이트 🔴 (최우선)

현재 파일들은 초록색(`#1a5c35`) 기준으로 작성됨. **레드/화이트로 전면 교체** 필요.

- [ ] `frontend/tailwind.config.ts` — primary 컬러를 레드로 교체
  ```ts
  primary: {
    DEFAULT: '#c0392b',
    dark: '#922b21',
    mid: '#e74c3c',
    light: '#fef5f5',
  }
  ```
- [ ] `frontend/src/index.css` — `.btn-primary`, `.card` 등 컴포넌트 클래스 점검
- [ ] `frontend/src/components/layout/Header.tsx` — `bg-primary-dark`(서브바), `bg-primary`(네비) 확인
- [ ] `frontend/src/components/layout/Footer.tsx` — `bg-[#1a1a1a]` 검정 배경으로 변경
- [ ] `frontend/src/components/common/PageHeader.tsx` — `bg-primary` 레드 배경 확인
- [ ] 나머지 페이지 컴포넌트 전체 — 초록 하드코딩 색상 제거

---

## Phase 3 — Home.tsx 사진 스트립 섹션 추가 🔴 (핵심)

`frontend/src/pages/Home.tsx`에 히어로와 빠른링크 사이에 아래 섹션 삽입:

```tsx
{/* 사진 스트립 섹션 */}
<section style={{ background: '#111', padding: '14px 0', overflow: 'hidden', position: 'relative' }}>
  {/* 좌우 페이드 마스크는 index.css에 .photo-strip-wrap::before/after로 처리 */}
  <div className="photo-strip">
    {/* 앨범 8개 카드 — 실제 이미지는 /uploads/ 경로 */}
    {/* 무한루프를 위해 동일한 8장 한번 더 복제 */}
  </div>
</section>
```

- [ ] `frontend/src/index.css`에 `.photo-strip`, `.photo-strip-wrap`, `@keyframes scrollLeft` 추가
- [ ] `Home.tsx`에 PhotoStrip 섹션 구현 (API에서 갤러리 앨범 가져와서 렌더링)
- [ ] 카드 hover 시 `animation-play-state: paused` 동작 확인

---

## Phase 4 — 나머지 페이지 완성

### 4-1. 갤러리 페이지
- [ ] `GalleryList.tsx` — 좌측 목록 + 우측 대형 뷰어 레이아웃으로 변경
  - 좌: 앨범 리스트 (클릭 시 우측 뷰어에 표시)
  - 우: 선택된 앨범의 대표 이미지 + 제목/메타
  - 좌우 화살표로 앨범 전환

### 4-2. 게시판 에디터
- [ ] `BoardWrite.tsx` — 현재 `<textarea>` → **Toast UI Editor** 리치에디터로 교체
  ```bash
  npm install @toast-ui/react-editor @toast-ui/editor
  ```
- [ ] `BoardDetail.tsx` — HTML 본문 렌더링 확인 (XSS 방지: DOMPurify 적용)
  ```bash
  npm install dompurify @types/dompurify
  ```

### 4-3. 공지사항 에디터
- [ ] `NoticeDetail.tsx` — HTML 렌더링 동일하게 DOMPurify 적용

---

## Phase 5 — 관리자 기능

- [ ] `frontend/src/pages/admin/` 폴더 생성
- [ ] `AdminNoticeList.tsx` — 공지사항 목록 + 등록/수정/삭제 버튼
- [ ] `AdminNoticeWrite.tsx` — Toast UI Editor 포함 공지 작성 폼
- [ ] `AdminGalleryList.tsx` — 앨범 목록 + 앨범 생성
- [ ] `AdminGalleryUpload.tsx` — 사진 다중 업로드 (drag & drop)
- [ ] `App.tsx`에 `/admin/*` 라우트 추가 (관리자 전용 가드)
- [ ] `AdminGuard.tsx` — role === 'admin' 체크 래퍼 컴포넌트

---

## Phase 6 — 모바일 반응형 점검

- [ ] Header 햄버거 메뉴 동작 확인
- [ ] 갤러리 그리드 모바일 2열
- [ ] 게시판 테이블 모바일: 작성자/날짜 컬럼 숨김 확인
- [ ] 사진 스트립 모바일 카드 크기 조정 (`width: 160px; height: 110px`)
- [ ] 히어로 텍스트 줄바꿈 확인

---

## Phase 7 — 배포

- [ ] `frontend/` 빌드: `npm run build`
- [ ] `backend/` Gunicorn 설정
- [ ] Nginx 설정 적용 (`nginx/gukmin-sanakwi.conf`)
- [ ] Let's Encrypt SSL 발급
- [ ] `.env` 프로덕션 값으로 교체 (`FLASK_ENV=production`)
- [ ] 업로드 폴더 권한 설정: `chmod 755 backend/uploads`

---

## 메모 / 알려진 이슈

- `BoardDetail.tsx`의 `canEdit` 로직에서 `user?.id === post.author_name` 타입 불일치 버그 있음 → author_id 필드를 API 응답에 추가하거나 비교 로직 수정 필요
- Toast UI Editor는 SSR 환경에서 dynamic import 필요할 수 있음
- 갤러리 업로드 시 파일 크기 10MB 제한 (백엔드 `MAX_CONTENT_LENGTH` 설정값)
- MariaDB foreign key 이슈 발생 시: `SET FOREIGN_KEY_CHECKS=0;` 후 마이그레이션
