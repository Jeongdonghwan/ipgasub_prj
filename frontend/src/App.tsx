import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import { useAuthStore } from './store/authStore'

// Pages
const Home = lazy(() => import('./pages/Home'))
const Greeting = lazy(() => import('./pages/about/Greeting'))
const History = lazy(() => import('./pages/about/History'))
const Officers = lazy(() => import('./pages/about/Officers'))
const NoticeList = lazy(() => import('./pages/notice/NoticeList'))
const NoticeDetail = lazy(() => import('./pages/notice/NoticeDetail'))
const GalleryList = lazy(() => import('./pages/gallery/GalleryList'))
const GalleryDetail = lazy(() => import('./pages/gallery/GalleryDetail'))
const BoardList = lazy(() => import('./pages/board/BoardList'))
const BoardDetail = lazy(() => import('./pages/board/BoardDetail'))
const BoardWrite = lazy(() => import('./pages/board/BoardWrite'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))

// Admin pages
const AdminMemberList = lazy(() => import('./pages/admin/AdminMemberList'))
const AdminNoticeList = lazy(() => import('./pages/admin/AdminNoticeList'))
const AdminNoticeWrite = lazy(() => import('./pages/admin/AdminNoticeWrite'))
const AdminGalleryList = lazy(() => import('./pages/admin/AdminGalleryList'))
const AdminGalleryUpload = lazy(() => import('./pages/admin/AdminGalleryUpload'))

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
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-gray-400 text-sm">
          로딩 중...
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about/greeting" element={<Greeting />} />
          <Route path="/about/history" element={<History />} />
          <Route path="/about/officers" element={<Officers />} />
          <Route path="/notice" element={<NoticeList />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
          <Route path="/gallery" element={<GalleryList />} />
          <Route path="/gallery/:id" element={<GalleryDetail />} />
          <Route path="/board" element={<BoardList />} />
          <Route path="/board/write" element={<RequireAuth><BoardWrite /></RequireAuth>} />
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/board/:id/edit" element={<RequireAuth><BoardWrite /></RequireAuth>} />
          <Route path="/auth/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/auth/register" element={<GuestOnly><Register /></GuestOnly>} />

          {/* 관리자 라우트 */}
          <Route path="/admin/members" element={<RequireAdmin><AdminMemberList /></RequireAdmin>} />
          <Route path="/admin/notices" element={<RequireAdmin><AdminNoticeList /></RequireAdmin>} />
          <Route path="/admin/notices/write" element={<RequireAdmin><AdminNoticeWrite /></RequireAdmin>} />
          <Route path="/admin/notices/:id/edit" element={<RequireAdmin><AdminNoticeWrite /></RequireAdmin>} />
          <Route path="/admin/gallery" element={<RequireAdmin><AdminGalleryList /></RequireAdmin>} />
          <Route path="/admin/gallery/:id/upload" element={<RequireAdmin><AdminGalleryUpload /></RequireAdmin>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
