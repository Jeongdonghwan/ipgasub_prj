import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import SubNav from '../../components/common/AboutSubNav'
import { errorMessage } from '../../api/auth'
import type { MemberSearchItem } from '../../types'

export default function MemberSearch() {
  const [params, setParams] = useSearchParams()
  const [name, setName] = useState(params.get('name') ?? '')
  const [results, setResults] = useState<MemberSearchItem[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const search = async (q: string) => {
    if (q.trim().length < 2) {
      setError('검색어를 2자 이상 입력하세요.')
      setResults(null)
      return
    }
    setError('')
    setLoading(true)
    try {
      const r = await api.get(`/api/auth/members/search?name=${encodeURIComponent(q.trim())}`)
      setResults(r.data.data.items)
    } catch (err) {
      setError(errorMessage(err, '검색에 실패했습니다.'))
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  // 쿼리스트링(name)으로 진입 시 자동 검색 (메인 검색바 연동)
  useEffect(() => {
    const q = params.get('name')
    if (q && q.trim().length >= 2) search(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setParams(name.trim() ? { name: name.trim() } : {})
    search(name)
  }

  return (
    <div>
      <PageHeader
        title="회원검색"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '회원안내', to: '/member/selection-guide' }, { label: '회원검색' }]}
      />
      <SubNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            className="input flex-1"
            placeholder="회원 이름을 입력하세요 (2자 이상)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-1.5 shrink-0">
            <Search className="w-4 h-4" />
            {loading ? '검색 중...' : '검색'}
          </button>
        </form>

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}

        {results && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium w-16">번호</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">이름</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium w-32">가입일</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-10 text-center text-gray-400">검색 결과가 없습니다.</td></tr>
                ) : (
                  results.map((m, i) => (
                    <tr key={m.id} className="border-t border-gray-50 hover:bg-primary-light transition-colors">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-gray-400">{m.created_at}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">※ 개인정보 보호를 위해 이름과 가입일만 표시됩니다.</p>
      </div>
    </div>
  )
}
