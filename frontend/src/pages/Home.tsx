import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, Search,
  ClipboardList, BookOpen, Gift, FileText,
} from 'lucide-react'
import api from '../api/axios'
import type { Notice, BoardPost, GalleryAlbum } from '../types'
import { SAMPLE_IMAGES } from '../lib/sampleImages'
import ImageCarousel from '../components/common/ImageCarousel'

// ① 히어로 슬라이드
const HERO_SLIDES = [
  { img: SAMPLE_IMAGES[0], badge: '사단법인 국제프로골프협회', title: '프로 골프의\n미래를 함께', sub: '공정한 선발 · 체계적 교육 · 건강한 골프 문화' },
  { img: SAMPLE_IMAGES[1], badge: '2026 정회원 선발', title: '정회원선발\n테스트대회', sub: '프로의 꿈을 향한 첫걸음, IPGA가 함께합니다' },
  { img: SAMPLE_IMAGES[2], badge: '회원 안내', title: 'IPGA와 함께\n성장하세요', sub: '대회 · 교육 · 다양한 회원 혜택' },
]

// ② 회원서비스 바로가기
const SERVICE_LINKS = [
  { label: '선발안내', to: '/member/selection-guide', icon: ClipboardList },
  { label: '교육안내', to: '/member/education', icon: BookOpen },
  { label: '회원혜택', to: '/member/benefits', icon: Gift },
  { label: '등록신청서', to: '/member/register-form', icon: FileText },
]

export default function Home() {
  const navigate = useNavigate()
  const [heroIdx, setHeroIdx] = useState(0)
  const [ipgaPosts, setIpgaPosts] = useState<BoardPost[]>([])
  const [newsPosts, setNewsPosts] = useState<BoardPost[]>([])
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [notices, setNotices] = useState<Notice[]>([])
  const [memberQuery, setMemberQuery] = useState('')

  useEffect(() => {
    api.get('/api/board/?type=ipga&per_page=5').then((r) => setIpgaPosts(r.data.data?.items ?? [])).catch(() => {})
    api.get('/api/board/?type=news&per_page=10').then((r) => setNewsPosts(r.data.data?.items ?? [])).catch(() => {})
    api.get('/api/gallery/?page=1').then((r) => setAlbums((r.data.data?.items ?? []).slice(0, 4))).catch(() => {})
    api.get('/api/notices/?category=general').then((r) => setNotices((r.data.data?.items ?? []).slice(0, 10))).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const goHero = (dir: 'prev' | 'next') =>
    setHeroIdx((i) => dir === 'next' ? (i + 1) % HERO_SLIDES.length : (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)

  const handleMemberSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(memberQuery.trim() ? `/member/search?name=${encodeURIComponent(memberQuery.trim())}` : '/member/search')
  }

  return (
    <div>
      {/* ① 메인 비주얼 슬라이더 */}
      <section className="relative overflow-hidden h-[300px] md:h-[440px] group bg-ink">
        <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(-${heroIdx * 100}%)` }}>
          {HERO_SLIDES.map((s, i) => (
            <div key={i} className="relative w-full h-full shrink-0">
              <img src={s.img} alt={s.badge} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="relative max-w-6xl mx-auto h-full flex flex-col justify-center px-6 md:px-4">
                <span className="inline-block w-fit text-xs font-semibold px-3 py-1 rounded-full mb-4 bg-white/15 text-white backdrop-blur-sm">{s.badge}</span>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 text-white whitespace-pre-line tracking-tight">{s.title}</h1>
                <p className="text-sm md:text-base text-white/80">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => goHero('prev')} aria-label="이전"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => goHero('next')} aria-label="다음"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} aria-label={`슬라이드 ${i + 1}`}
              className={`rounded-full h-1.5 transition-all ${i === heroIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* ② 회원서비스 바 */}
      <section className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row items-center gap-4">
          <form onSubmit={handleMemberSearch} className="flex items-center gap-2 w-full lg:w-auto lg:flex-1">
            <span className="text-sm font-semibold shrink-0 hidden sm:block">회원검색</span>
            <input
              className="flex-1 lg:max-w-xs rounded-full px-4 py-2 text-sm text-gray-800 outline-none"
              placeholder="회원 이름 검색" value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)}
            />
            <button type="submit" className="bg-primary-darker rounded-full w-9 h-9 flex items-center justify-center hover:bg-ink transition-colors shrink-0">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="grid grid-cols-4 gap-2 w-full lg:w-auto">
            {SERVICE_LINKS.map((s) => {
              const Icon = s.icon
              return (
                <Link key={s.to} to={s.to}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-center">
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-medium whitespace-nowrap">{s.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ③ 대회안내 — 가로 슬라이드 */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <SectionHead title="대회안내" moreTo="/tournament/info" />
        <ImageCarousel items={notices.map((n, i) => ({
          key: n.id,
          title: n.title,
          sub: n.created_at,
          label: '대회안내',
          img: n.thumbnail ? `/uploads/${n.thumbnail}` : SAMPLE_IMAGES[i % SAMPLE_IMAGES.length],
          to: `/tournament/${n.id}`,
        }))} />
      </section>

      {/* ④ IPGA 게시판 + 골프 뉴스 — 좌우 대칭 2단 */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          <PostColumn title="IPGA 게시판" moreTo="/board/ipga" posts={ipgaPosts.slice(0, 5)} linkBase="/board/ipga" />
          <PostColumn title="골프 뉴스" moreTo="/board/news" posts={newsPosts.slice(0, 5)} linkBase="/board/news" />
        </div>
      </section>

      {/* ⑤ 포토갤러리 — 맨 하단 가로 슬라이드 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <SectionHead title="포토갤러리" moreTo="/gallery" />
        <ImageCarousel perView={3} ratio={0.72} items={(albums.length > 0 ? albums : PLACEHOLDER_ALBUMS).map((a, i) => ({
          key: a.id ? `a${a.id}` : `p${i}`,
          title: a.title,
          sub: a.photo_count ? `사진 ${a.photo_count}장` : undefined,
          label: '포토갤러리',
          img: a.cover_image ? `/uploads/${a.cover_image}` : SAMPLE_IMAGES[(i + 3) % SAMPLE_IMAGES.length],
          to: a.id ? `/gallery/${a.id}` : '/gallery',
        }))} />
      </section>
    </div>
  )
}

const PLACEHOLDER_ALBUMS: GalleryAlbum[] = [
  { id: 0, title: 'IPGA 대회 현장', description: '', cover_image: null, author_id: 0, author_name: '', photo_count: 0, created_at: '' },
  { id: 0, title: '정회원 선발전', description: '', cover_image: null, author_id: 0, author_name: '', photo_count: 0, created_at: '' },
  { id: 0, title: '골프 아카데미', description: '', cover_image: null, author_id: 0, author_name: '', photo_count: 0, created_at: '' },
  { id: 0, title: '친선 골프대회', description: '', cover_image: null, author_id: 0, author_name: '', photo_count: 0, created_at: '' },
]

function SectionHead({ title, moreTo }: { title: string; moreTo: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
        <span className="w-[3px] h-5 bg-primary rounded-full block" />{title}
      </h2>
      <Link to={moreTo} className="text-xs text-primary hover:underline flex items-center gap-0.5">
        더보기 <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  )
}

function PostColumn({ title, moreTo, posts, linkBase, rows = 5 }: {
  title: string; moreTo: string; posts: BoardPost[]; linkBase: string; rows?: number
}) {
  const list = posts.slice(0, rows)
  const fillers = Math.max(0, rows - list.length)
  return (
    <div>
      <SectionHead title={title} moreTo={moreTo} />
      <div className="card divide-y divide-gray-50 overflow-hidden">
        {list.map((p) => (
          <Link key={p.id} to={`${linkBase}/${p.id}`}
            className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-primary-light/60 transition-colors group">
            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors truncate">{p.title}</span>
            <span className="text-[11px] text-gray-400 shrink-0">{p.created_at}</span>
          </Link>
        ))}
        {/* 좌우 칸 수를 맞추기 위한 빈 행 */}
        {Array.from({ length: fillers }).map((_, i) => (
          <div key={`filler-${i}`} className="px-4 py-3.5 text-sm text-gray-300 select-none">
            {list.length === 0 && i === 0 ? '등록된 글이 없습니다.' : ' '}
          </div>
        ))}
      </div>
    </div>
  )
}
