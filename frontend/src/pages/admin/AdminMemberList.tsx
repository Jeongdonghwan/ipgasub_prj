import { useEffect, useState, useCallback } from 'react'
import { Check, Trash2, Clock } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToastStore } from '../../store/toastStore'
import type { User, MemberListResponse } from '../../types'

type Status = 'pending' | 'approved' | 'all'

const TABS: { key: Status; label: string }[] = [
  { key: 'pending', label: '승인대기' },
  { key: 'approved', label: '승인완료' },
  { key: 'all', label: '전체' },
]

export default function AdminMemberList() {
  const [status, setStatus] = useState<Status>('pending')
  const [members, setMembers] = useState<User[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const toast = useToastStore()

  const load = useCallback(() => {
    api.get(`/api/auth/members?status=${status}`).then((r) => {
      const data: MemberListResponse = r.data.data
      setMembers(data.items)
      setPendingCount(data.pending_count)
    })
  }, [status])

  useEffect(load, [load])

  const handleApprove = async (user: User) => {
    await api.post(`/api/auth/members/${user.id}/approve`)
    toast.show('success', `${user.name}님을 승인했습니다.`)
    load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await api.delete(`/api/auth/members/${deleteTarget.id}`)
    toast.show('success', `${deleteTarget.name}님을 삭제했습니다.`)
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <PageHeader
        title="회원 관리"
        breadcrumbs={[{ label: '관리자' }, { label: '회원 관리' }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 상태 탭 */}
        <div className="flex items-center gap-1 mb-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full transition-colors ${
                status === t.key
                  ? 'bg-primary text-white font-semibold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {t.label}
              {t.key === 'pending' && pendingCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  status === t.key ? 'bg-white/25 text-white' : 'bg-primary text-white'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">이름</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">아이디</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">전화번호</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">거주지(구)</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">나이대</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">성별</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">가입일</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">상태</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-32">관리</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                    해당하는 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="border-t border-gray-50 hover:bg-primary-light transition-colors">
                    <td className="px-4 py-3 text-gray-700 font-medium">{m.name}</td>
                    <td className="px-4 py-3 text-gray-500">{m.username}</td>
                    <td className="px-4 py-3 text-gray-500">{m.phone || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{m.residence || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{m.age_group || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{m.gender || '-'}</td>
                    <td className="px-4 py-3 text-gray-400">{m.created_at}</td>
                    <td className="px-4 py-3">
                      {m.is_approved ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                          승인완료
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[10px] px-2 py-0.5 rounded-full bg-accent-light text-accent-dark font-medium">
                          <Clock className="w-2.5 h-2.5" />
                          승인대기
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!m.is_approved && (
                          <button
                            onClick={() => handleApprove(m)}
                            className="text-xs text-primary hover:underline flex items-center gap-0.5"
                          >
                            <Check className="w-3 h-3" />
                            승인
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(m)}
                          className="text-xs text-red-500 hover:underline flex items-center gap-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="회원 삭제"
          message={`${deleteTarget.name}(${deleteTarget.username})님을 삭제하시겠습니까?`}
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
