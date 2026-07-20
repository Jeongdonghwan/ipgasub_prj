import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import type { Notice, BoardPost, GalleryAlbum } from '../types'

// 사진 스트립 더미 데이터 (실제 서비스: API에서 갤러리 앨범 가져오기)
const STRIP_ITEMS = [
  { id: 1, title: '설악산 대청봉', sub: '2025.04 · 24장', color: '#7b241c', icon: '🏔' },
  { id: 2, title: '지리산 2박3일', sub: '2024.09 · 38장', color: '#1a3a1a', icon: '🌲' },
  { id: 3, title: '소백산 철쭉',   sub: '2024.04 · 16장', color: '#2c1f3a', icon: '🌸' },
  { id: 4, title: '설악산 단풍',   sub: '2023.10 · 31장', color: '#3a1f1a', icon: '🍁' },
  { id: 5, title: '한라산 하계',   sub: '2022.06 · 20장', color: '#1a3a3a', icon: '🌊' },
  { id: 6, title: '덕유산 설경',   sub: '2023.02 · 18장', color: '#2a3020', icon: '❄️' },
  { id: 7, title: '북한산 창립',   sub: '2020.04 · 12장', color: '#922b21', icon: '⛺' },
  { id: 8, title: '관악산 송년',   sub: '2024.12 · 22장', color: '#154360', icon: '🌅' },
]

export default function Home() {
  const [notices, setNotices]   = useState<Notice[]>([])
  const [posts, setPosts]       = useState<BoardPost[]>([])
  const [albums, setAlbums]     = useState<GalleryAlbum[]>([])
  const [galIdx, setGalIdx]     = useState(0)

  useEffect(() => {
    api.get('/api/notices/?page=1').then((r) => setNotices(r.data.data?.items?.slice(0, 4) ?? []))
    api.get('/api/board/?page=1').then((r)   => setPosts(r.data.data?.items?.slice(0, 4) ?? []))
    api.get('/api/gallery/?page=1').then((r) => setAlbums(r.data.data?.items?.slice(0, 5) ?? []))
  }, [])

  // 갤러리 위젯 자동 슬라이드
  useEffect(() => {
    if (albums.length === 0) return
    const timer = setInterval(() => setGalIdx((i) => (i + 1) % albums.length), 3500)
    return () => clearInterval(timer)
  }, [albums.length])

  // 무한루프용 복제 (원본 + 복제)
  const stripItems = [...STRIP_ITEMS, ...STRIP_ITEMS]

  return (
    <div>
      {/* 히어로 */}
      <section
        className="relative overflow-hidden text-white py-10 px-5"
        style={{ background: 'linear-gradient(135deg, #7b241c 0%, #c0392b 100%)' }}
      >
        <div className="absolute right-0 bottom-0 text-[120px] leading-none opacity-10 pointer-events-none select-none">⛰</div>
        <div className="relative max-w-xl">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                style={{ background: 'rgba(255,255,255,0.18)' }}>
            국민산악회 공식 홈페이지
          </span>
          <h1 className="text-2xl font-bold leading-tight mb-2 tracking-tight">
            함께 걷는 길,<br />더 아름다운 산
          </h1>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.8 }}>
            매월 정기산행 · 전국 명산 탐방 · 건강한 동행
          </p>
          <div className="flex gap-2 flex-wrap">
            <Link to="/about/greeting" className="btn-primary" style={{ background: '#fff', color: '#c0392b' }}>
              산악회 소개
            </Link>
            <Link to="/auth/register"
              className="text-sm font-medium px-5 py-2.5 rounded"
              style={{ border: '1.5px solid rgba(255,255,255,0.5)', color: '#fff' }}>
              회원가입
            </Link>
          </div>
        </div>
      </section>

      {/* 사진 스트립 */}
      <div className="photo-strip-wrap">
        <div className="photo-strip">
          {stripItems.map((item, i) => (
            <Link key={i} to="/gallery" className="photo-card" style={{ background: item.color }}>
              <div className="w-full h-full flex items-center justify-center text-4xl"
                   style={{ color: 'rgba(255,255,255,0.22)' }}>
                {item.icon}
              </div>
              <div className="photo-card-overlay">
                <div className="photo-card-title">{item.title}</div>
                <div className="photo-card-sub">{item.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 빠른 링크 */}
      <nav className="bg-white border-b border-gray-100 grid grid-cols-4">
        {[
          { icon: '📢', label: '공지사항', to: '/notice' },
          { icon: '📷', label: '사진갤러리', to: '/gallery' },
          { icon: '💬', label: '자유게시판', to: '/board' },
          { icon: '👤', label: '회원가입', to: '/auth/register' },
        ].map((item) => (
          <Link key={item.to} to={item.to}
            className="flex flex-col items-center gap-1.5 py-3.5 text-xs text-gray-500
                       border-r border-gray-100 last:border-0
                       hover:bg-primary-light hover:text-primary transition-colors">
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* 3단 위젯 */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-5">

          {/* 공지사항 */}
          <div className="card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-[3px] h-4 bg-primary rounded-full block" />
                공지사항
              </h2>
              <Link to="/notice" className="text-xs text-primary hover:underline">더보기 ›</Link>
            </div>
            <ul className="px-4 py-1">
              {notices.length === 0
                ? <li className="py-4 text-sm text-gray-400 text-center">공지사항이 없습니다.</li>
                : notices.map((n) => (
                  <li key={n.id}>
                    <Link to={`/notice/${n.id}`}
                      className="flex items-center justify-between py-2.5 border-b border-gray-50
                                 last:border-0 hover:text-primary transition-colors group">
                      <span className="text-sm text-gray-700 truncate group-hover:text-primary flex items-center gap-1.5">
                        {n.is_pinned && (
                          <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded shrink-0">공지</span>
                        )}
                        {n.title}
                      </span>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">{n.created_at}</span>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* 자유게시판 */}
          <div className="card">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-[3px] h-4 bg-primary rounded-full block" />
                자유게시판
              </h2>
              <Link to="/board" className="text-xs text-primary hover:underline">더보기 ›</Link>
            </div>
            <ul className="px-4 py-1">
              {posts.length === 0
                ? <li className="py-4 text-sm text-gray-400 text-center">게시글이 없습니다.</li>
                : posts.map((p) => (
                  <li key={p.id}>
                    <Link to={`/board/${p.id}`}
                      className="flex items-center justify-between py-2.5 border-b border-gray-50
                                 last:border-0 hover:text-primary transition-colors group">
                      <span className="text-sm text-gray-700 truncate group-hover:text-primary">
                        {p.title}
                        {p.comment_count > 0 && (
                          <span className="text-xs text-primary ml-1">[{p.comment_count}]</span>
                        )}
                      </span>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">{p.created_at}</span>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* 갤러리 슬라이더 */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-[3px] h-4 bg-primary rounded-full block" />
                사진 갤러리
              </h2>
              <Link to="/gallery" className="text-xs text-primary hover:underline">더보기 ›</Link>
            </div>
            {albums.length === 0
              ? <div className="py-8 text-center text-gray-400 text-sm">앨범이 없습니다.</div>
              : <div className="relative" style={{ aspectRatio: '16/10' }}>
                  {albums.map((a, i) => (
                    <Link key={a.id} to={`/gallery/${a.id}`}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: i === galIdx ? 1 : 0,
                        transition: 'opacity 0.5s',
                        background: '#922b21',
                        color: 'rgba(255,255,255,0.22)',
                        fontSize: 48,
                      }}>
                      📷
                      {a.cover_image && (
                        <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${a.cover_image}`}
                             alt={a.title}
                             className="absolute inset-0 w-full h-full object-cover" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 px-3 py-2"
                           style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                        <div className="text-xs font-semibold text-white">{a.title}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          {a.photo_count}장 · {a.created_at}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {/* 도트 */}
                  <div className="absolute bottom-8 right-2 flex gap-1">
                    {albums.map((_, i) => (
                      <button key={i} onClick={() => setGalIdx(i)}
                        className="rounded-full transition-all"
                        style={{
                          width: i === galIdx ? 10 : 4,
                          height: 4,
                          background: i === galIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                          borderRadius: 2,
                        }} />
                    ))}
                  </div>
                </div>
            }
          </div>

        </div>
      </section>
    </div>
  )
}
