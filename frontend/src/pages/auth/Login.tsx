import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock } from 'lucide-react'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import type { ApiResponse, LoginResponse } from '../../types'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', form)
      const { user, access_token, refresh_token } = res.data.data!
      setAuth(user, access_token, refresh_token)
      navigate('/')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error ?? '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[380px] animate-fade-in">
        {/* 로고 + 태그라인 */}
        <div className="flex flex-col items-center mb-9">
          <Link to="/">
            <img src="/logo.png" alt="국민산악회" className="h-16 w-auto mb-4" />
          </Link>
          <p className="text-sm text-gray-400">함께 걷는 길, 더 아름다운 산</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              className="input pl-10 py-3"
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="아이디"
              autoComplete="username"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              className="input pl-10 py-3"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="비밀번호"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-1 disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 안내 */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            아직 회원이 아니신가요?
          </p>
          <Link
            to="/auth/register"
            className="inline-block mt-2 text-sm font-semibold text-primary hover:underline"
          >
            회원가입 하기
          </Link>
          <p className="mt-3 text-xs text-gray-300">
            가입 후 관리자 승인이 완료되면 로그인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
