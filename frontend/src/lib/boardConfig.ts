// 게시판 설정 단일 소스 — BoardList/Detail/Write 가 slug 로 조회해서 재사용
export type BoardType = 'ipga' | 'news' | 'jobs' | 'market' | 'tour' | 'events'

export interface BoardConfig {
  slug: BoardType
  title: string
  group: '미디어' | '커뮤니티'
  groupPath: string            // 브레드크럼 그룹 링크
  writeRole: 'admin' | 'member'
}

export const BOARD_CONFIGS: Record<BoardType, BoardConfig> = {
  ipga:   { slug: 'ipga',   title: '협회 게시판', group: '미디어',   groupPath: '/board/ipga',    writeRole: 'admin' },
  news:   { slug: 'news',   title: '골프 뉴스',   group: '미디어',   groupPath: '/board/ipga',    writeRole: 'admin' },
  jobs:   { slug: 'jobs',   title: '구인구직',    group: '커뮤니티', groupPath: '/board/jobs',    writeRole: 'member' },
  market: { slug: 'market', title: '매매',        group: '커뮤니티', groupPath: '/board/jobs',    writeRole: 'member' },
  tour:   { slug: 'tour',   title: '골프투어',    group: '커뮤니티', groupPath: '/board/jobs',    writeRole: 'member' },
  events: { slug: 'events', title: '회원경조사',  group: '커뮤니티', groupPath: '/board/jobs',    writeRole: 'member' },
}

export function getBoardConfig(slug?: string): BoardConfig | null {
  if (slug && slug in BOARD_CONFIGS) return BOARD_CONFIGS[slug as BoardType]
  return null
}
