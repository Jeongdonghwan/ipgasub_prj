import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import SubNav from '../../components/common/AboutSubNav'
import { useToastStore } from '../../store/toastStore'
import { errorMessage } from '../../api/auth'
import type { CertificateRequest } from '../../types'

const CERT_LABELS: Record<string, string> = {
  membership: '정회원 증명서',
  career: '경력 증명서',
  award: '수상 증명서',
}
const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending: { label: '처리중', cls: 'bg-accent-light text-accent-dark' },
  issued: { label: '발급완료', cls: 'bg-primary-light text-primary' },
  rejected: { label: '반려', cls: 'bg-red-50 text-red-500' },
}

export default function Certificate() {
  const [certType, setCertType] = useState('membership')
  const [purpose, setPurpose] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<CertificateRequest[]>([])
  const toast = useToastStore()

  const load = () => {
    api.get('/api/requests/certificates/mine').then((r) => setItems(r.data.data.items))
  }
  useEffect(load, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/requests/certificates', { cert_type: certType, purpose })
      toast.show('success', '증명서 발급 신청이 접수되었습니다.')
      setPurpose('')
      load()
    } catch (err) {
      toast.show('error', errorMessage(err, '신청에 실패했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="증명서발급"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '회원안내', to: '/member/selection-guide' }, { label: '증명서발급' }]}
      />
      <SubNav />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4 mb-6">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">증명서 종류</label>
            <select className="input" value={certType} onChange={(e) => setCertType(e.target.value)}>
              {Object.entries(CERT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">발급 용도</label>
            <input className="input" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="예) 제출용, 증빙용" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? '신청 중...' : '증명서 발급 신청'}
          </button>
        </form>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">내 신청 내역</h3>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">종류</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">용도</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-24">신청일</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-24">상태</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />신청 내역이 없습니다.
                </td></tr>
              ) : (
                items.map((it) => {
                  const st = STATUS_LABELS[it.status]
                  return (
                    <tr key={it.id} className="border-t border-gray-50">
                      <td className="px-4 py-3 text-gray-700">{CERT_LABELS[it.cert_type] ?? it.cert_type}</td>
                      <td className="px-4 py-3 text-gray-500">{it.purpose || '-'}</td>
                      <td className="px-4 py-3 text-gray-400">{it.created_at}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
