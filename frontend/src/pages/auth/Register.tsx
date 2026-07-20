import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Lock, UserCircle, Phone, MapPin, Calendar, Users, CircleCheckBig } from 'lucide-react'
import api from '../../api/axios'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    residence: '',
    age_group: '',
    gender: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (form.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    try {
      await api.post('/api/auth/register', {
        username: form.username,
        password: form.password,
        name: form.name,
        phone: form.phone,
        residence: form.residence,
        age_group: form.age_group,
        gender: form.gender,
      })
      setSubmitted(true)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      setError(axiosErr.response?.data?.error ?? '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  type Field = {
    key: string; label: string; icon: typeof User; type: 'text' | 'password' | 'select'
    required: boolean; placeholder?: string; options?: string[]
  }
  const fields: Field[] = [
    { key: 'username', label: '아이디', icon: User, type: 'text', required: true, placeholder: '아이디를 입력하세요' },
    { key: 'password', label: '비밀번호', icon: Lock, type: 'password', required: true, placeholder: '4자 이상' },
    { key: 'passwordConfirm', label: '비밀번호 확인', icon: Lock, type: 'password', required: true, placeholder: '비밀번호 재입력' },
    { key: 'name', label: '이름', icon: UserCircle, type: 'text', required: true, placeholder: '이름을 입력하세요' },
    { key: 'phone', label: '전화번호', icon: Phone, type: 'text', required: true, placeholder: '010-0000-0000' },
    { key: 'residence', label: '거주지(구)', icon: MapPin, type: 'text', required: true, placeholder: '예) 강남구' },
    { key: 'age_group', label: '나이대', icon: Calendar, type: 'select', required: true,
      options: ['10대', '20대', '30대', '40대', '50대', '60대', '70대 이상'] },
    { key: 'gender', label: '성별', icon: Users, type: 'select', required: true, options: ['남성', '여성'] },
  ]

  // 가입 완료 화면
  if (submitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
            <CircleCheckBig className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-3">회원가입이 완료되었습니다</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            가입 신청이 정상적으로 접수되었습니다.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            <span className="text-primary font-medium">관리자 승인</span> 후 로그인하여 활동하실 수 있습니다.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link to="/auth/login" className="btn-primary w-full py-3">
              로그인 페이지로
            </Link>
            <Link to="/" className="btn-ghost w-full py-3 text-center">
              홈으로
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] animate-fade-in">
        {/* 로고 + 안내 */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="국민산악회" className="h-16 w-auto mb-4" />
          </Link>
          <h1 className="text-lg font-bold text-gray-800">회원가입</h1>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            가입 신청 후 <span className="text-primary font-medium">관리자 승인</span>이 완료되어야<br />
            로그인할 수 있습니다.
          </p>
        </div>
        {error && (
          <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {fields.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {f.label} {f.required && <span className="text-primary">*</span>}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 z-10" />
                    {f.type === 'select' ? (
                      <select
                        className="input pl-9 appearance-none bg-white"
                        value={form[f.key as keyof typeof form]}
                        onChange={update(f.key)}
                        required={f.required}
                      >
                        <option value="" disabled>선택하세요</option>
                        {f.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="input pl-9"
                        type={f.type}
                        value={form[f.key as keyof typeof form]}
                        onChange={update(f.key)}
                        placeholder={f.placeholder}
                        required={f.required}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-60">
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">이미 계정이 있으신가요?</p>
          <Link to="/auth/login" className="inline-block mt-2 text-sm font-semibold text-primary hover:underline">
            로그인 하기
          </Link>
        </div>
      </div>
    </div>
  )
}
