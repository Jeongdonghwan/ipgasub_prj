import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import { useAuthStore } from './store/authStore'

// 협회소개
const Home = lazy(() => import('./pages/Home'))
const Greeting = lazy(() => import('./pages/about/Greeting'))
const Message = lazy(() => import('./pages/about/Message'))
const History = lazy(() => import('./pages/about/History'))
const Organization = lazy(() => import('./pages/about/Organization'))
const Location = lazy(() => import('./pages/about/Location'))

// 대회안내 (Notice 재사용)
const NoticeList = lazy(() => import('./pages/notice/NoticeList'))
const NoticeDetail = lazy(() => import('./pages/notice/NoticeDetail'))

// 회원안내
const SelectionGuide = lazy(() => import('./pages/member/SelectionGuide'))
const Education = lazy(() => import('./pages/member/Education'))
const Benefits = lazy(() => import('./pages/member/Benefits'))
const Rules = lazy(() => import('./pages/member/Rules'))
const MemberSearch = lazy(() => import('./pages/member/MemberSearch'))
const RegisterForm = lazy(() => import('./pages/member/RegisterForm'))
const Certificate = lazy(() => import('./pages/member/Certificate'))

// 미디어 / 커뮤니티
const GalleryList = lazy(() => import('./pages/gallery/GalleryList'))
const GalleryDetail = lazy(() => import('./pages/gallery/GalleryDetail'))
const BoardList = lazy(() => import('./pages/board/BoardList'))
const BoardDetail = lazy(() => import('./pages/board/BoardDetail'))
const BoardWrite = lazy(() => import('./pages/board/BoardWrite'))

// 인증
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const FindAccount = lazy(() => import('./pages/auth/FindAccount'))

// 관리자
const AdminMemberList = lazy(() => import('./pages/admin/AdminMemberList'))
const AdminNoticeList = lazy(() => import('./pages/admin/AdminNoticeList'))
const AdminNoticeWrite = lazy(() => import('./pages/admin/AdminNoticeWrite'))
const AdminGalleryList = lazy(() => import('./pages/admin/AdminGalleryList'))
const AdminGalleryUpload = lazy(() => import('./pages/admin/AdminGalleryUpload'))
const AdminRegistrationList = lazy(() => import('./pages/admin/AdminRegistrationList'))
const AdminCertificateList = lazy(() => import('./pages/admin/AdminCertificateList'))

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuthStore()
  return isLoggedIn() ? children : <Navigate to="/auth/login" replace />
}
function RequireAdmin({ children }: { children: JSX.Element }) {
  const { isAdmin } = useAuthStore()
  return isAdmin() ? children : <Navigate to="/" replace />
}
function GuestOnly({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuthStore()
  return !isLoggedIn() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400 text-sm">로딩 중...</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          {/* 협회소개 */}
          <Route path="/about/greeting" element={<Greeting />} />
          <Route path="/about/message" element={<Message />} />
          <Route path="/about/history" element={<History />} />
          <Route path="/about/organization" element={<Organization />} />
          <Route path="/about/location" element={<Location />} />

          {/* 대회안내 */}
          <Route path="/tournament/info" element={<NoticeList fixedCategory="general" title="대회안내" />} />
          <Route
            path="/tournament/selection"
            element={<NoticeList fixedCategory="event" title="프로선수 선발" />}
          />
          <Route path="/tournament/:id" element={<NoticeDetail />} />

          {/* 회원안내 */}
          <Route path="/member/selection-guide" element={<SelectionGuide />} />
          <Route path="/member/education" element={<Education />} />
          <Route path="/member/benefits" element={<Benefits />} />
          <Route path="/member/rules" element={<Rules />} />
          <Route path="/member/search" element={<MemberSearch />} />
          <Route path="/member/register-form" element={<RegisterForm />} />
          <Route path="/member/certificate" element={<RequireAuth><Certificate /></RequireAuth>} />

          {/* 미디어 - 갤러리 */}
          <Route path="/gallery" element={<GalleryList />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />

          {/* 게시판 (미디어/커뮤니티 통합) */}
          <Route path="/board/:type" element={<BoardList />} />
          <Route path="/board/:type/write" element={<RequireAuth><BoardWrite /></RequireAuth>} />
          <Route path="/board/:type/:id" element={<BoardDetail />} />
          <Route path="/board/:type/:id/edit" element={<RequireAuth><BoardWrite /></RequireAuth>} />

          {/* IA 경로 → 게시판 리다이렉트 */}
          <Route path="/media/board" element={<Navigate to="/board/ipga" replace />} />
          <Route path="/media/news" element={<Navigate to="/board/news" replace />} />
          <Route path="/media/gallery" element={<Navigate to="/gallery" replace />} />
          <Route path="/community/jobs" element={<Navigate to="/board/jobs" replace />} />
          <Route path="/community/market" element={<Navigate to="/board/market" replace />} />
          <Route path="/community/tour" element={<Navigate to="/board/tour" replace />} />
          <Route path="/community/events" element={<Navigate to="/board/events" replace />} />

          {/* 인증 */}
          <Route path="/auth/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/auth/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/auth/find" element={<FindAccount />} />

          {/* 관리자 */}
          <Route path="/admin/members" element={<RequireAdmin><AdminMemberList /></RequireAdmin>} />
          <Route path="/admin/notices" element={<RequireAdmin><AdminNoticeList /></RequireAdmin>} />
          <Route path="/admin/notices/write" element={<RequireAdmin><AdminNoticeWrite /></RequireAdmin>} />
          <Route path="/admin/notices/:id/edit" element={<RequireAdmin><AdminNoticeWrite /></RequireAdmin>} />
          <Route path="/admin/gallery" element={<RequireAdmin><AdminGalleryList /></RequireAdmin>} />
          <Route path="/admin/gallery/:id/upload" element={<RequireAdmin><AdminGalleryUpload /></RequireAdmin>} />
          <Route path="/admin/registrations" element={<RequireAdmin><AdminRegistrationList /></RequireAdmin>} />
          <Route path="/admin/certificates" element={<RequireAdmin><AdminCertificateList /></RequireAdmin>} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
