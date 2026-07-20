# DESIGN.md — 디자인 시스템 레퍼런스

---

## 컬러 팔레트

```
레드 계열
  #c0392b  primary          메인 — 네비게이션, 버튼, 포인트 컬러
  #922b21  primary-dark     어두운 레드 — 서브바 배경, 버튼 hover
  #e74c3c  primary-mid      밝은 레드 — 보조 강조
  #7b241c  primary-darker   가장 어두운 레드 — 히어로 그라디언트 시작점
  #fef5f5  primary-light    연한 레드 — 테이블 행 hover, 배지 배경

중성 계열
  #1a1a1a  서브바 배경, 푸터 배경
  #111111  사진 스트립 배경
  #f8f8f8  surface — 페이지 전체 배경
  #ffffff  카드/위젯 배경
  #e5e5e5  테두리
  #f5f5f5  구분선 (연한)
  #999999  보조 텍스트
  #bbbbbb  힌트 텍스트 (날짜, 조회수)
  #555555  본문 텍스트
  #1a1a1a  강조 텍스트
```

---

## 타이포그래피

```
폰트: Pretendard (CDN: cdn.jsdelivr.net/gh/orioncactus/pretendard)
폴백: system-ui, sans-serif

크기
  10px  뱃지, 보조 라벨
  11px  서브바, 날짜, 메타 정보, 브레드크럼
  12px  테이블 본문, 위젯 리스트, 버튼
  13px  일반 본문, 폼 입력
  14px  위젯 타이틀, 게시글 제목 (목록)
  15px  로그인 폼 타이틀
  16px  게시글 제목 (상세)
  17-18px 페이지 헤더 타이틀
  22px  히어로 메인 타이틀

굵기
  400 일반
  500 중간 강조
  600 제목, 버튼
  700 로고, 히어로 타이틀
```

---

## 컴포넌트 스펙

### 버튼

```css
/* Primary */
.btn-primary {
  background: #c0392b;
  color: white;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.btn-primary:hover { background: #922b21; }

/* Outline */
.btn-outline {
  border: 1.5px solid #c0392b;
  color: #c0392b;
  background: transparent;
}
.btn-outline:hover { background: #fef5f5; }

/* Ghost (취소 등) */
.btn-ghost {
  border: 1px solid #ddd;
  color: #666;
  background: none;
}
```

### 카드/위젯

```css
.card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}
.widget-head {
  display: flex;
  justify-content: space-between;
  padding: 11px 14px;
  border-bottom: 1px solid #f5f5f5;
}
.widget-accent {          /* 좌측 세로 강조선 */
  width: 3px;
  height: 15px;
  background: #c0392b;
  border-radius: 2px;
}
```

### 테이블 (게시판/공지)

```css
thead { background: #fafafa; }
th { color: #777; font-weight: 500; padding: 9px 12px; }
tbody tr:hover { background: #fef5f5; }
/* 고정 공지 행 */
.pinned-row { background: #fef5f5; }
.pinned-row .title { color: #c0392b; font-weight: 500; }
```

### 페이지 헤더 (서브페이지 상단)

```css
.page-header {
  background: #c0392b;
  color: white;
  padding: 20px;
}
.breadcrumb {
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 4px;
}
.page-header h2 { font-size: 17px; font-weight: 600; }
```

### 폼 인풋

```css
.form-input {
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  padding: 8px 11px;
  font-size: 13px;
}
.form-input:focus {
  border-color: #c0392b;
  box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.1);
}
```

### 페이지네이션

```css
.pg-btn {
  width: 28px; height: 28px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
}
.pg-btn.active {
  background: #c0392b;
  color: white;
  border-color: #c0392b;
}
```

---

## 레이아웃

### 헤더 구조

```
┌─────────────────────────────────────────────┐
│  서브바 (bg:#1a1a1a, h:30px)                 │
│  ☎ 031-000-0000          로그인 · 회원가입   │
├─────────────────────────────────────────────┤
│  네비 (bg:#c0392b, h:50px)                   │
│  ⛰ 국민산악회   소개  공지  갤러리  게시판   │
└─────────────────────────────────────────────┘
```

### 홈 섹션 순서

```
1. 히어로         bg:레드 그라디언트, 타이틀+CTA
2. 사진 스트립    bg:#111, 무한 흘러가기
3. 빠른 링크      bg:white, 4개 아이콘
4. 위젯 3단       공지 / 게시판 / 갤러리 슬라이더
5. 푸터           bg:#1a1a1a
```

### 갤러리 전체 페이지 레이아웃

```
┌──────────────┬──────────────────────────────┐
│ 앨범 목록    │                              │
│ (좌: 1fr)    │  선택된 앨범 대형 뷰어       │
│              │  (우: 2.4fr)                 │
│ 클릭 시      │                              │
│ 우측 교체    │  ← → 화살표로 앨범 전환      │
└──────────────┴──────────────────────────────┘
높이: 420px 고정
```

---

## 사진 스트립 상세 스펙

위치: 히어로 섹션 바로 아래, 공지사항 위젯 위

```
배경: #111
패딩: 14px 0
카드: width 200px, height 130px, border-radius 8px
카드 간격: gap 10px
속도: 20초에 전체 1순환 (linear infinite)
루프: 8장 원본 + 8장 복제 = 16장, translateX(-50%)로 무한루프
마스크: 좌우 60px fade (::before, ::after pseudo)
hover: animation-play-state: paused
카드 내부: 사진 하단에 제목/메타 오버레이 (그라디언트 70%→검정)
```

---

## 반응형 브레이크포인트 (Tailwind 기본값)

```
sm:  640px   모바일 가로
md:  768px   태블릿
lg:  1024px  데스크톱
xl:  1280px  대형 화면
```

### 모바일 주요 변경사항

- 헤더: 메뉴 → 햄버거 아이콘 (md 미만)
- 위젯 3단 → 1단 스택 (md 미만)
- 갤러리 그리드: 4열 → 2열 (sm 미만)
- 게시판 테이블: 작성자/날짜 컬럼 hidden (md 미만)
- 사진 스트립 카드: 200x130 → 160x110 (sm 미만)
