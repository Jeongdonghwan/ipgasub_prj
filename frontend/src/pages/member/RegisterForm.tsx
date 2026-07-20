import { useState } from 'react'
import { CircleCheckBig } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import SubNav from '../../components/common/AboutSubNav'
import { errorMessage } from '../../api/auth'

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', birth: '', content: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.phone.trim()) {
      setError('이름과 연락처는 필수입니다.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/requests/registration', form)
      setDone(true)
    } catch (err) {
      setError(errorMessage(err, '신청에 실패했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="회원등록신청서"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '회원안내', to: '/member/selection-guide' }, { label: '회원등록신청서' }]}
      />
      <SubNav />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {done ? (
          <div className="card px-6 py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
              <CircleCheckBig className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">등록 신청이 접수되었습니다</h2>
            <p className="text-sm text-gray-500">협회에서 확인 후 기재해주신 연락처로 안내드리겠습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
            <p className="text-xs text-gray-400 mb-1">
              회원 등록을 원하시면 아래 정보를 입력해 주세요. 협회에서 확인 후 연락드립니다.
            </p>
            {error && (
              <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
            )}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">이름 <span className="text-primary">*</span></label>
              <input className="input" value={form.name} onChange={update('name')} placeholder="이름" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">연락처 <span className="text-primary">*</span></label>
              <input className="input" value={form.phone} onChange={update('phone')} placeholder="010-0000-0000" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">이메일</label>
              <input className="input" type="email" value={form.email} onChange={update('email')} placeholder="example@email.com" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">생년월일</label>
              <input className="input" value={form.birth} onChange={update('birth')} placeholder="예) 1990-01-01" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">신청 내용 / 경력</label>
              <textarea className="input min-h-[140px] resize-y" value={form.content} onChange={update('content')}
                placeholder="골프 경력, 지원 동기 등을 자유롭게 작성해 주세요." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? '접수 중...' : '등록 신청'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
