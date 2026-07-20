import { useEffect, useState, useCallback } from 'react'
import { Check, X } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import { useToastStore } from '../../store/toastStore'
import type { RegistrationRequest } from '../../types'

type Status = 'pending' | 'done' | 'rejected' | 'all'
const TABS: { key: Status; label: string }[] = [
  { key: 'pending', label: '처리대기' },
  { key: 'done', label: '처리완료' },
  { key: 'rejected', label: '반려' },
  { key: 'all', label: '전체' },
]
const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: '대기', cls: 'bg-accent-light text-accent-dark' },
  done: { label: '완료', cls: 'bg-primary-light text-primary' },
  rejected: { label: '반려', cls: 'bg-red-50 text-red-500' },
}

export default function AdminRegistrationList() {
  const [status, setStatus] = useState<Status>('pending')
  const [items, setItems] = useState<RegistrationRequest[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const toast = useToastStore()

  const load = useCallback(() => {
    const q = status === 'all' ? '' : `?status=${status}`
    api.get(`/api/requests/registration${q}`).then((r) => {
      setItems(r.data.data.items)
      setPendingCount(r.data.data.pending_count)
    })
  }, [status])
  useEffect(load, [load])

  const setStatusOf = async (id: number, next: string, name: string) => {
    await api.patch(`/api/requests/registration/${id}`, { status: next })
    toast.show('success', `${name}님 신청을 ${next === 'done' ? '처리완료' : '반려'}했습니다.`)
    load()
  }

  return (
    <div>
      <PageHeader title="회원등록 신청 관리" breadcrumbs={[{ label: '관리자' }, { label: '회원등록 신청' }]} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-1 mb-4">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setStatus(t.key)}
              className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-colors ${
                status === t.key ? 'bg-primary text-white font-semibold' : 'text-gray-500 hover:bg-gray-100'}`}>
              {t.label}
              {t.key === 'pending' && pendingCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${status === t.key ? 'bg-white/25' : 'bg-primary text-white'}`}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">이름</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">연락처</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">이메일</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">생년월일</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">내용</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-24">신청일</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-16">상태</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-28">처리</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">해당하는 신청이 없습니다.</td></tr>
              ) : items.map((it) => (
                <tr key={it.id} className="border-t border-gray-50 hover:bg-primary-light transition-colors">
                  <td className="px-4 py-3 text-gray-700 font-medium">{it.name}</td>
                  <td className="px-4 py-3 text-gray-500">{it.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{it.email || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">{it.birth || '-'}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[240px] truncate" title={it.content}>{it.content || '-'}</td>
                  <td className="px-4 py-3 text-gray-400">{it.created_at}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[it.status].cls}`}>{STATUS_BADGE[it.status].label}</span>
                  </td>
                  <td className="px-4 py-3">
                    {it.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => setStatusOf(it.id, 'done', it.name)} className="text-xs text-primary hover:underline flex items-center gap-0.5"><Check className="w-3 h-3" />완료</button>
                        <button onClick={() => setStatusOf(it.id, 'rejected', it.name)} className="text-xs text-red-500 hover:underline flex items-center gap-0.5"><X className="w-3 h-3" />반려</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
