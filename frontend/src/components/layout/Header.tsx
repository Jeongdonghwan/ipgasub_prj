import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { MENU } from '../../lib/menuConfig'

const ADMIN_LINKS = [
  { label: '공지관리', to: '/admin/notices' },
  { label: '갤러리관리', to: '/admin/gallery' },
  { label: '회원관리', to: '/admin/members' },
  { label: '등록신청', to: '/admin/registrations' },
  { label: '증명서', to: '/admin/certificates' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const [openAcc, setOpenAcc] = useState<string | null>(null)
  const { user, isLoggedIn, isAdmin, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ① 유틸 바 */}
      <div className="bg-ink text-white/70 text-[11px]">
        <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-end gap-3">
          <Link to="/" className="hover:text-white transition-colors">HOME</Link>
          <span className="text-white/20">|</span>
          <Link to="/about/location" className="hover:text-white transition-colors">LOCATION</Link>
        </div>
      </div>

      {/* ② 로고 + 로그인 영역 */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-[76px] flex items-center justify-between gap-4">
          <Link to="/" className="shrink-0 leading-tight" aria-label="홈">
            <span className="block text-[10px] text-gray-400 tracking-wide">사단법인</span>
            <span className="block text-[18px] md:text-[20px] font-extrabold text-gray-900 tracking-tight">
              대한민국골프<span className="text-primary">&amp;</span>파크기술협회
            </span>
            <span className="block text-[10px] md:text-[11px] font-semibold text-primary mt-0.5">
              (2026-전남광주통합특별시-1호)
            </span>
          </Link>

          {/* 우측: 비로그인 = 버튼 / 로그인 = 사용자 */}
          {isLoggedIn() ? (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <span className="text-gray-700"><b className="text-primary">{user?.name}</b>님</span>
              <Link to="/member/certificate" className="text-gray-500 hover:text-primary transition-colors">마이페이지</Link>
              {isAdmin() && (
                <div className="flex items-center gap-2 pl-2 ml-1 border-l border-gray-200">
                  {ADMIN_LINKS.map((a) => (
                    <Link key={a.to} to={a.to} className="text-xs text-gray-400 hover:text-primary transition-colors">{a.label}</Link>
                  ))}
                </div>
              )}
              <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                <LogOut className="w-4 h-4" />로그아웃
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-sm">
              <Link to="/auth/login" className="btn-primary text-sm py-2 px-6">로그인</Link>
              <Link to="/auth/register" className="text-gray-600 hover:text-primary transition-colors">회원가입</Link>
              <Link to="/auth/find" className="text-xs text-gray-400 hover:text-primary transition-colors">ID·PW찾기</Link>
            </div>
          )}

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="메뉴"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ③ GNB 메가메뉴 (데스크톱) */}
      <div
        className="hidden md:block relative border-b border-gray-100"
        onMouseEnter={() => setMega(true)}
        onMouseLeave={() => setMega(false)}
      >
        <nav className="max-w-6xl mx-auto px-4">
          <ul className="flex items-center justify-center">
            {MENU.map((g) => (
              <li key={g.label} className="relative">
                <NavLink
                  to={g.to}
                  className="block px-8 py-4 text-[15px] font-semibold text-gray-700 hover:text-primary transition-colors"
                >
                  {g.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 풀다운 패널 — 전체 2Depth 한 번에 */}
        {mega && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-lg animate-slide-down">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-5 gap-4 py-6">
              {MENU.map((g) => (
                <div key={g.label}>
                  <div className="text-sm font-bold text-primary mb-3 pb-2 border-b border-gray-100">{g.label}</div>
                  <ul className="space-y-1.5">
                    {g.children.map((c) => (
                      <li key={c.to}>
                        <Link to={c.to} className="block text-[13px] text-gray-500 hover:text-primary hover:translate-x-0.5 transition-all">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down max-h-[80vh] overflow-y-auto">
          {/* 로그인/사용자 */}
          <div className="px-4 py-4 border-b border-gray-100">
            {isLoggedIn() ? (
              <div className="flex items-center justify-between text-sm">
                <span><b className="text-primary">{user?.name}</b>님</span>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500"><LogOut className="w-4 h-4" />로그아웃</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="btn-primary py-2 text-sm text-center">로그인</Link>
                <div className="flex justify-center gap-3 text-xs text-gray-400">
                  <Link to="/auth/register" onClick={() => setMenuOpen(false)}>회원가입</Link>
                  <Link to="/auth/find" onClick={() => setMenuOpen(false)}>ID·PW찾기</Link>
                </div>
              </div>
            )}
          </div>
          {/* 아코디언 메뉴 */}
          {MENU.map((g) => (
            <div key={g.label} className="border-b border-gray-50">
              <button
                onClick={() => setOpenAcc(openAcc === g.label ? null : g.label)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700"
              >
                {g.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${openAcc === g.label ? 'rotate-180' : ''}`} />
              </button>
              {openAcc === g.label && (
                <div className="bg-gray-50/60 pb-2">
                  {g.children.map((c) => (
                    <Link key={c.to} to={c.to} onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-[13px] text-gray-500 hover:text-primary">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isAdmin() && (
            <div className="px-4 py-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-gray-100">
              {ADMIN_LINKS.map((a) => (
                <Link key={a.to} to={a.to} onClick={() => setMenuOpen(false)} className="text-xs text-gray-400 hover:text-primary">{a.label}</Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
