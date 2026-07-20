import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, UserCheck, Megaphone, Image as ImageIcon } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const NAV_ITEMS = [
  { label: '산악회 소개', to: '/about/greeting' },
  { label: '공지사항', to: '/notice' },
  { label: '사진갤러리', to: '/gallery' },
  { label: '커뮤니티', to: '/board' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isLoggedIn, isAdmin, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50">
      {/* 단일 화이트 네비 바 */}
      <nav className="bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 flex items-center h-[64px] gap-4">
          {/* 로고 */}
          <Link to="/" className="flex items-center shrink-0" aria-label="국민산악회 홈">
            <img
              src="/logo.png"
              alt="국민산악회"
              className="h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* 데스크톱 메뉴 — 중앙 */}
          <ul className="hidden md:flex items-center gap-1 mx-auto">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative text-sm px-4 py-2 rounded-full transition-all duration-150 ${
                      isActive
                        ? 'text-primary font-semibold bg-primary-light'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* 우측 클러스터 — 데스크톱 */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isLoggedIn() ? (
              <>
                <span className="text-sm text-gray-600">{user?.name}님</span>
                {isAdmin() && (
                  <>
                    <Link
                      to="/admin/notices"
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      <Megaphone className="w-4 h-4" />
                      공지관리
                    </Link>
                    <Link
                      to="/admin/gallery"
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      갤러리관리
                    </Link>
                    <Link
                      to="/admin/members"
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      회원관리
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  로그인
                </Link>
                <Link to="/auth/register" className="btn-accent">
                  가입신청
                </Link>
              </>
            )}
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 모바일 드로어 */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block text-sm px-5 py-3 border-b border-gray-50 transition-colors ${
                    isActive
                      ? 'text-primary font-semibold bg-primary-light'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {/* 드로어 인증 영역 */}
            <div className="px-5 py-4 flex flex-col gap-3">
              {isLoggedIn() ? (
                <>
                  <span className="text-sm text-gray-600">{user?.name}님</span>
                  {isAdmin() && (
                    <>
                      <Link
                        to="/admin/notices"
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Megaphone className="w-4 h-4" />
                        공지관리
                      </Link>
                      <Link
                        to="/admin/gallery"
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ImageIcon className="w-4 h-4" />
                        갤러리관리
                      </Link>
                      <Link
                        to="/admin/members"
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <UserCheck className="w-4 h-4" />
                        회원관리
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors self-start"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/register"
                    className="btn-accent text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    가입신청
                  </Link>
                  <Link
                    to="/auth/login"
                    className="text-sm text-gray-600 hover:text-primary transition-colors text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    로그인
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
