import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera, ChevronRight, ChevronLeft, Calendar, Pin,
  MessageCircle, User, Eye, Mountain, Users, Heart, Flag,
} from 'lucide-react'
import api from '../api/axios'
import type { Notice, BoardPost, GalleryAlbum } from '../types'
import { SAMPLE_IMAGES } from '../lib/sampleImages'

// 히어로 슬라이드 (좌우 슬라이딩)
const HERO_SLIDES: { img: string; badge: string; title: string; sub: string }[] = [
  { img: SAMPLE_IMAGES[0], badge: '국민산악회 공식 홈페이지', title: '함께 걷는 길,\n더 아름다운 산', sub: '매월 정기산행 · 전국 명산 탐방 · 건강한 동행' },
  { img: SAMPLE_IMAGES[5], badge: '2026 봄 정기산행', title: '설악산 대청봉\n4월 정기산행 모집', sub: '오색약수터 출발 · 대청봉 종주 · 백담사 하산' },
  { img: SAMPLE_IMAGES[4], badge: '함께해요', title: '새로운 회원을\n기다립니다', sub: '초보부터 베테랑까지 · 안전하고 즐거운 동행' },
]

// 산행앨범 더미 데이터 (실제 서비스: API에서 갤러리 앨범 가져오기)
const ALBUM_ITEMS: { id: number; title: string; sub: string; img: string }[] = [
  { id: 1, title: '설악산 대청봉', sub: '2025.04 · 24장', img: SAMPLE_IMAGES[0] },
  { id: 2, title: '지리산 2박3일', sub: '2024.09 · 38장', img: SAMPLE_IMAGES[1] },
  { id: 3, title: '소백산 철쭉',   sub: '2024.04 · 16장', img: SAMPLE_IMAGES[2] },
  { id: 4, title: '설악산 단풍',   sub: '2023.10 · 31장', img: SAMPLE_IMAGES[3] },
  { id: 5, title: '한라산 하계',   sub: '2022.06 · 20장', img: SAMPLE_IMAGES[4] },
  { id: 6, title: '덕유산 설경',   sub: '2023.02 · 18장', img: SAMPLE_IMAGES[5] },
  { id: 7, title: '북한산 창립',   sub: '2020.04 · 12장', img: SAMPLE_IMAGES[6] },
  { id: 8, title: '관악산 송년',   sub: '2024.12 · 22장', img: SAMPLE_IMAGES[7] },
]

// 목업 데이터 (API 데이터 없을 때 레이아웃 확인용)
const MOCK_NOTICES: Notice[] = [
  { id: 1, category: 'general', title: '2026년 4월 정기산행 안내 — 설악산 대청봉 코스', content: '안녕하세요, 국민산악회 회원 여러분. 4월 정기산행은 설악산 대청봉 코스로 진행됩니다. 오색약수터에서 출발하여 대청봉을 거쳐 백담사로 하산하는 코스입니다. 참가 신청은 3월 31일까지 게시판에 댓글로 남겨주세요.', author_id: 1, author_name: '홍길동', is_pinned: true, views: 128, created_at: '2026.03.20', updated_at: '2026.03.20' },
  { id: 2, category: 'event', title: '봄맞이 회원 친목 행사 개최', content: '봄을 맞아 회원 친목 행사를 개최합니다.', author_id: 1, author_name: '홍길동', is_pinned: false, views: 67, created_at: '2026.03.18', updated_at: '2026.03.18' },
  { id: 3, category: 'general', title: '산행 안전 수칙 필독 안내', content: '안전한 산행을 위한 필독 수칙을 공지합니다.', author_id: 1, author_name: '김철수', is_pinned: false, views: 45, created_at: '2026.03.15', updated_at: '2026.03.15' },
  { id: 4, category: 'general', title: '회비 납부 안내 (2026년 상반기)', content: '2026년 상반기 회비 납부 안내드립니다.', author_id: 1, author_name: '이영희', is_pinned: false, views: 89, created_at: '2026.03.10', updated_at: '2026.03.10' },
  { id: 5, category: 'event', title: '신입 회원 환영 산행 (북한산)', content: '신입 회원 환영 산행을 진행합니다.', author_id: 1, author_name: '박민수', is_pinned: false, views: 34, created_at: '2026.03.05', updated_at: '2026.03.05' },
]

const MOCK_POSTS: BoardPost[] = [
  { id: 1, title: '지리산 종주 후기 공유합니다', content: '', author_id: 2, author_name: '김철수', views: 56, comment_count: 3, created_at: '2026.03.22', updated_at: '2026.03.22' },
  { id: 2, title: '등산화 추천 부탁드려요', content: '', author_id: 3, author_name: '이영희', views: 42, comment_count: 7, created_at: '2026.03.21', updated_at: '2026.03.21' },
  { id: 3, title: '주말 가벼운 트레킹 같이 하실 분?', content: '', author_id: 4, author_name: '정수연', views: 31, comment_count: 2, created_at: '2026.03.19', updated_at: '2026.03.19' },
  { id: 4, title: '관악산 야간산행 후기', content: '', author_id: 5, author_name: '박민수', views: 28, comment_count: 0, created_at: '2026.03.17', updated_at: '2026.03.17' },
  { id: 5, title: '겨울 산행 보온 팁 정리해봤어요', content: '', author_id: 2, author_name: '김철수', views: 73, comment_count: 5, created_at: '2026.03.16', updated_at: '2026.03.16' },
  { id: 6, title: '북한산 단풍 사진 같이 봐요', content: '', author_id: 3, author_name: '이영희', views: 64, comment_count: 4, created_at: '2026.03.14', updated_at: '2026.03.14' },
  { id: 7, title: '초보 등산 모임 어디가 좋을까요?', content: '', author_id: 4, author_name: '정수연', views: 38, comment_count: 6, created_at: '2026.03.12', updated_at: '2026.03.12' },
  { id: 8, title: '스틱 사용법 질문 있습니다', content: '', author_id: 5, author_name: '박민수', views: 22, comment_count: 1, created_at: '2026.03.11', updated_at: '2026.03.11' },
]

const MOCK_ALBUMS: GalleryAlbum[] = [
  { id: 1, title: '설악산 대청봉 산행', description: '', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 24, created_at: '2026.03.20' },
  { id: 2, title: '지리산 2박3일 종주', description: '', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 38, created_at: '2026.02.15' },
  { id: 3, title: '북한산 봄꽃 산행', description: '', cover_image: null, author_id: 2, author_name: '김철수', photo_count: 16, created_at: '2026.01.28' },
  { id: 4, title: '한라산 겨울 설경', description: '', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 20, created_at: '2025.12.20' },
]

// 산악회 가치 4단 (하단 띠) — 색상은 로고 4색(초록/파랑/빨강/노랑)에서 차용
const FEATURES = [
  { icon: Mountain, title: '자연과 함께',   desc: '아름다운 자연 속에서\n건강을 챙기고 힐링하세요.',   color: '#3f8f57', tint: '#eaf4ee' },
  { icon: Users,    title: '함께하는 산행', desc: '회원들과 함께\n즐거운 추억을 만드세요.',           color: '#2f6aa0', tint: '#e9f1f8' },
  { icon: Heart,    title: '나눔과 배려',   desc: '서로 배려하고 돕는\n따뜻한 산악회가 되어요.',        color: '#c0392b', tint: '#fbeae8' },
  { icon: Flag,     title: '안전한 산행',   desc: '안전을 최우선으로\n즐거운 산행을 지향합니다.',        color: '#cf971f', tint: '#f7eed5' },
]

function useVisibleCount() {
  const [count, setCount] = useState(4)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth
      if (w >= 1024) setCount(4)
      else if (w >= 768) setCount(3)
      else setCount(1.5)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return count
}

export default function Home() {
  const [notices, setNotices]   = useState<Notice[]>([])
  const [posts, setPosts]       = useState<BoardPost[]>([])
  const [albums, setAlbums]     = useState<GalleryAlbum[]>([])

  // 히어로 슬라이더 state
  const [heroIdx, setHeroIdx] = useState(0)

  // 캐러셀 state
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const visibleCount = useVisibleCount()
  const trackRef = useRef<HTMLDivElement>(null)

  const totalItems = ALBUM_ITEMS.length
  const maxIndex = Math.max(0, totalItems - Math.floor(visibleCount))

  useEffect(() => {
    api.get('/api/notices/?page=1')
      .then((r) => {
        const items = r.data.data?.items?.slice(0, 5) ?? []
        setNotices(items.length > 0 ? items : MOCK_NOTICES)
      })
      .catch(() => setNotices(MOCK_NOTICES))
    api.get('/api/board/?page=1')
      .then((r) => {
        const items = r.data.data?.items?.slice(0, 6) ?? []
        setPosts(items.length > 0 ? items : MOCK_POSTS)
      })
      .catch(() => setPosts(MOCK_POSTS))
    api.get('/api/gallery/?page=1')
      .then((r) => {
        const items = r.data.data?.items?.slice(0, 5) ?? []
        setAlbums(items.length > 0 ? items : MOCK_ALBUMS)
      })
      .catch(() => setAlbums(MOCK_ALBUMS))
  }, [])

  // 히어로 자동 슬라이드 (5초)
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIdx((i) => (i + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const goHero = (dir: 'prev' | 'next') => {
    setHeroIdx((i) =>
      dir === 'next'
        ? (i + 1) % HERO_SLIDES.length
        : (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    )
  }

  // 캐러셀 자동 슬라이드 (4초)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused, maxIndex])

  const goCarousel = useCallback((dir: 'prev' | 'next') => {
    setCarouselIdx((prev) => {
      if (dir === 'next') return prev >= maxIndex ? 0 : prev + 1
      return prev <= 0 ? maxIndex : prev - 1
    })
  }, [maxIndex])

  // 캐러셀 카드 너비 계산
  const getCardWidth = () => {
    if (!trackRef.current) return 280
    const gap = 16
    const containerWidth = trackRef.current.parentElement?.clientWidth ?? 1152
    return (containerWidth - gap * (Math.floor(visibleCount) - 1)) / visibleCount
  }

  const cardWidth = getCardWidth()
  const translateX = carouselIdx * (cardWidth + 16)

  // 도트 개수
  const dotCount = maxIndex + 1

  // 공지사항 featured 2개 + rest 분리
  const featuredNotices = notices.slice(0, 2)
  const restNotices = notices.slice(2)

  return (
    <div>
      {/* 히어로 슬라이딩 배너 */}
      <section className="max-w-6xl mx-auto px-4 pt-6 animate-fade-in">
        <div className="relative rounded-2xl overflow-hidden h-[260px] md:h-[420px] group">
          {/* 슬라이드 트랙 */}
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${heroIdx * 100}%)` }}
          >
            {HERO_SLIDES.map((s, i) => (
              <div key={i} className="relative w-full h-full shrink-0">
                <img
                  src={s.img}
                  alt={s.badge}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
                <div className="relative h-full flex flex-col justify-center px-6 md:px-12">
                  <span className="inline-block w-fit text-xs font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm bg-white/15 text-white">
                    {s.badge}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 tracking-tight text-white whitespace-pre-line">
                    {s.title}
                  </h1>
                  <p className="text-sm md:text-base mb-6 text-white/80 leading-relaxed">
                    {s.sub}
                  </p>
                  <div className="flex gap-2.5 flex-wrap">
                    <Link
                      to="/about/greeting"
                      className="bg-white text-gray-800 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-50 active:scale-[0.97] transition-all"
                    >
                      산악회 소개
                    </Link>
                    <Link to="/auth/register" className="btn-accent shadow-lg">
                      가입신청
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 좌우 화살표 */}
          <button
            onClick={() => goHero('prev')}
            aria-label="이전 슬라이드"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => goHero('next')}
            aria-label="다음 슬라이드"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-all z-10 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 도트 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                aria-label={`슬라이드 ${i + 1}`}
                className={`rounded-full h-1.5 transition-all duration-300 ${
                  i === heroIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 산행앨범 캐러셀 */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-[3px] h-5 bg-primary rounded-full block" />
            산행앨범
          </h2>
          <Link to="/gallery" className="text-xs text-primary hover:underline flex items-center gap-0.5">
            더보기 <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* 트랙 */}
          <div className="overflow-hidden" ref={trackRef}>
            <div
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${translateX}px)` }}
            >
              {ALBUM_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  to="/gallery"
                  className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                  style={{ width: `${cardWidth}px`, height: `${Math.round(cardWidth * 0.75)}px` }}
                >
                  <div className="relative w-full h-full bg-gray-100">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="text-xs font-semibold text-white">{item.title}</div>
                      <div className="text-[10px] mt-0.5 text-white/65">{item.sub}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 좌우 화살표 */}
          <button
            onClick={() => goCarousel('prev')}
            className="absolute left-[-12px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all z-10"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => goCarousel('next')}
            className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-all z-10"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* 도트 인디케이터 */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIdx(i)}
              className={`rounded-full h-1.5 transition-all duration-300 ${
                i === carouselIdx ? 'w-5 bg-primary' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 공지사항 — Featured 카드 + 사이드 리스트 */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-[3px] h-5 bg-primary rounded-full block" />
            공지사항
          </h2>
          <Link to="/notice" className="text-xs text-primary hover:underline flex items-center gap-0.5">
            더보기 <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {notices.length === 0
          ? <div className="card px-4 py-10 text-center text-sm text-gray-400">공지사항이 없습니다.</div>
          : <div className="grid md:grid-cols-5 gap-4">
              {/* Featured 카드 2개 (왼쪽 3/5) */}
              <div className="md:col-span-3 flex flex-col gap-4">
                {featuredNotices.map((n) => (
                  <Link
                    key={n.id}
                    to={`/notice/${n.id}`}
                    className="card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col sm:flex-row"
                  >
                    {/* 썸네일 (원본 4:3, 카드 높이에 맞춰 object-cover) */}
                    <div className="relative w-full sm:w-2/5 shrink-0 aspect-[4/3] sm:aspect-auto bg-gray-100">
                      <img
                        src={n.thumbnail ? `/uploads/${n.thumbnail}` : SAMPLE_IMAGES[n.id % SAMPLE_IMAGES.length]}
                        alt={n.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            n.category === 'event' ? 'bg-accent-light text-accent-dark' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {n.category === 'event' ? '행사' : '일반'}
                          </span>
                          {n.is_pinned && (
                            <span className="flex items-center gap-0.5 text-[10px] text-primary font-medium">
                              <Pin className="w-3 h-3" />
                              고정
                            </span>
                          )}
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1.5 leading-snug line-clamp-2">
                          {n.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {n.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {n.created_at}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {n.views}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 사이드 리스트 (오른쪽 2/5) — 컬럼 높이 채움 */}
              <div className="md:col-span-2 flex flex-col gap-2">
                {restNotices.length === 0
                  ? <div className="card px-4 py-6 text-center text-sm text-gray-400 flex-1 flex items-center justify-center">다른 공지가 없습니다.</div>
                  : restNotices.map((n) => (
                    <Link
                      key={n.id}
                      to={`/notice/${n.id}`}
                      className="card px-4 py-3 flex-1 flex flex-col justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                          n.category === 'event' ? 'bg-accent-light text-accent-dark' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {n.category === 'event' ? '행사' : '일반'}
                        </span>
                        {n.is_pinned && <Pin className="w-2.5 h-2.5 text-primary" />}
                      </div>
                      <div className="text-sm font-medium text-gray-800 truncate group-hover:text-primary transition-colors">
                        {n.title}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {n.created_at}
                      </div>
                    </Link>
                  ))
                }
              </div>
            </div>
        }
      </section>

      {/* 커뮤니티 + 사진 갤러리 2단 */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid md:grid-cols-2 gap-8">

          {/* 커뮤니티 */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-[3px] h-5 bg-primary rounded-full block" />
                커뮤니티
              </h2>
              <Link to="/board" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                더보기 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {posts.length === 0
              ? <div className="card px-4 py-8 text-center text-sm text-gray-400">게시글이 없습니다.</div>
              : <div className="card divide-y divide-gray-50 overflow-hidden flex-1 flex flex-col">
                  {posts.slice(0, 6).map((p) => (
                    <Link key={p.id} to={`/board/${p.id}`}
                      className="flex flex-1 items-center justify-between gap-3 px-4 py-3 hover:bg-primary-light/60 transition-colors group">
                      <div className="min-w-0">
                        <div className="text-[15px] font-medium text-gray-800 truncate group-hover:text-primary transition-colors">
                          {p.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                          <span className="flex items-center gap-0.5">
                            <User className="w-3 h-3" />
                            {p.author_name}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span className="flex items-center gap-0.5">
                            <Calendar className="w-3 h-3" />
                            {p.created_at}
                          </span>
                        </div>
                      </div>
                      {p.comment_count > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-medium text-primary shrink-0">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {p.comment_count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
            }
          </div>

          {/* 사진 갤러리 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-[3px] h-5 bg-primary rounded-full block" />
                사진 갤러리
              </h2>
              <Link to="/gallery" className="text-xs text-primary hover:underline flex items-center gap-0.5">
                더보기 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {albums.length === 0
              ? <div className="card px-4 py-8 text-center text-sm text-gray-400">앨범이 없습니다.</div>
              : <div className="grid grid-cols-2 gap-3">
                  {albums.slice(0, 4).map((a, i) => (
                    <Link key={a.id} to={`/gallery/${a.id}`}
                      className="card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <img
                          src={a.cover_image
                            ? `/uploads/${a.cover_image}`
                            : SAMPLE_IMAGES[i % SAMPLE_IMAGES.length]}
                          alt={a.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 bg-gradient-to-t from-black/70 to-transparent">
                          <div className="text-[11px] font-semibold text-white truncate">{a.title}</div>
                        </div>
                      </div>
                      <div className="px-3 py-2 flex items-center gap-1 text-[11px] text-gray-400">
                        <Camera className="w-3 h-3" />
                        {a.photo_count}장 · {a.created_at}
                      </div>
                    </Link>
                  ))}
                </div>
            }
          </div>

        </div>
      </section>

      {/* 산악회 가치 4단 */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-[3px] h-5 bg-primary rounded-full block" />
          <h2 className="text-base font-semibold text-gray-800">우리가 추구하는 가치</h2>
        </div>
        <div className="card grid grid-cols-2 md:grid-cols-4 md:divide-x divide-gray-100 overflow-hidden">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="flex flex-col items-center text-center gap-3 px-6 py-9 transition-colors hover:bg-gray-50/70"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: f.tint }}
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={1.75} style={{ color: f.color }} />
                </div>
                <h3 className="text-sm font-bold text-gray-800">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
