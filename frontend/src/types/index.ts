// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: number
  username: string
  name: string
  phone: string
  residence: string
  age_group: string
  gender: string
  role: 'admin' | 'member'
  is_active: boolean
  is_approved: boolean
  created_at: string
}

export interface MemberListResponse {
  items: User[]
  pending_count: number
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

// ─── Notice ─────────────────────────────────────────────────────────────────
export interface Notice {
  id: number
  category: 'general' | 'event'
  title: string
  content: string
  thumbnail?: string | null
  author_id: number
  author_name: string
  is_pinned: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface NoticeListResponse {
  items: Notice[]
  total: number
  pages: number
  page: number
}

// ─── Board ──────────────────────────────────────────────────────────────────
export interface BoardComment {
  id: number
  post_id: number
  author_id: number
  author_name: string
  parent_id?: number | null
  content: string
  created_at: string
  replies?: BoardComment[]
}

export interface BoardPost {
  id: number
  title: string
  content: string
  image?: string | null
  author_id: number
  author_name: string
  views: number
  comment_count: number
  comments?: BoardComment[]
  created_at: string
  updated_at: string
}

export interface BoardListResponse {
  items: BoardPost[]
  total: number
  pages: number
  page: number
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export interface GalleryPhoto {
  id: number
  album_id: number
  original: string
  thumbnail: string
  caption: string
  sort_order: number
  created_at: string
}

export interface GalleryAlbum {
  id: number
  title: string
  description: string
  cover_image: string | null
  author_id: number
  author_name: string
  photo_count: number
  photos?: GalleryPhoto[]
  created_at: string
}

export interface GalleryListResponse {
  items: GalleryAlbum[]
  total: number
  pages: number
  page: number
}

// ─── API 공통 래퍼 ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
