// GNB(메가메뉴) 단일 소스 — Header / SubNav / Footer 가 공유
export interface MenuChild {
  label: string
  to: string
}
export interface MenuGroup {
  label: string
  to: string          // 대메뉴 클릭 시 기본 이동 (첫 2Depth)
  children: MenuChild[]
}

export const MENU: MenuGroup[] = [
  {
    label: '협회소개',
    to: '/about/greeting',
    children: [
      { label: '방문 인사', to: '/about/greeting' },
      { label: '회장인사말', to: '/about/message' },
      { label: '연혁', to: '/about/history' },
      { label: '조직도', to: '/about/organization' },
      { label: '오시는 길', to: '/about/location' },
    ],
  },
  {
    label: '대회안내',
    to: '/tournament/info',
    children: [
      { label: '대회안내', to: '/tournament/info' },
      { label: '프로선수 선발', to: '/tournament/selection' },
    ],
  },
  {
    label: '회원안내',
    to: '/member/selection-guide',
    children: [
      { label: '선발안내', to: '/member/selection-guide' },
      { label: '교육안내', to: '/member/education' },
      { label: '회원혜택', to: '/member/benefits' },
      { label: '회원검색', to: '/member/search' },
      { label: '정회원규범', to: '/member/rules' },
      { label: '회원등록신청서', to: '/member/register-form' },
      { label: '증명서발급', to: '/member/certificate' },
    ],
  },
  {
    label: '미디어',
    to: '/board/ipga',
    children: [
      { label: '협회 게시판', to: '/board/ipga' },
      { label: '포토갤러리', to: '/gallery' },
    ],
  },
  {
    label: '커뮤니티',
    to: '/board/jobs',
    children: [
      { label: '구인구직', to: '/board/jobs' },
      { label: '매매', to: '/board/market' },
      { label: '골프투어', to: '/board/tour' },
      { label: '회원경조사', to: '/board/events' },
    ],
  },
]

/** 현재 경로가 속한 메뉴 그룹을 찾아 반환 (SubNav 용) */
export function findMenuGroup(pathname: string): MenuGroup | null {
  // 정확/접두 매칭: children.to 의 앞부분이 현재 경로와 일치하는 그룹
  for (const group of MENU) {
    if (group.children.some((c) => pathname === c.to || pathname.startsWith(c.to + '/'))) {
      return group
    }
  }
  return null
}
