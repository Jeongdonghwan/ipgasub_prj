import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Pin } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import Pagination from '../../components/common/Pagination'
import ConfirmModal from '../../components/common/ConfirmModal'
import type { NoticeListResponse } from '../../types'

export default function AdminNoticeList() {
  const [data, setData] = useState<NoticeListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = () => {
    api.get(`/api/notices/?page=${page}`).then((r) => setData(r.data.data))
  }

  useEffect(load, [page])

  const handleDelete = async () => {
    if (deleteId === null) return
    await api.delete(`/api/notices/${deleteId}`)
    setDeleteId(null)
    load()
  }

  return (
    <div>
      <PageHeader
        title="공지사항 관리"
        breadcrumbs={[{ label: '관리자' }, { label: '공지사항 관리' }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-end mb-4">
          <Link to="/admin/notices/write" className="btn-primary text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            새 공지 등록
          </Link>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-16">번호</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">제목</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-20">분류</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-16">고정</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-24">날짜</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-28">관리</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((n) => (
                <tr key={n.id} className="border-t border-gray-50 hover:bg-primary-light transition-colors">
                  <td className="px-4 py-3 text-gray-400">{n.id}</td>
                  <td className="px-4 py-3 text-gray-700">{n.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      n.category === 'event' ? 'bg-accent-light text-accent-dark' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {n.category === 'event' ? '행사' : '일반'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {n.is_pinned ? <Pin className="w-3.5 h-3.5 text-primary" /> : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{n.created_at}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/notices/${n.id}/edit`} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                        <Pencil className="w-3 h-3" />
                        수정
                      </Link>
                      <button onClick={() => setDeleteId(n.id)} className="text-xs text-red-500 hover:underline flex items-center gap-0.5">
                        <Trash2 className="w-3 h-3" />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && <Pagination page={data.page} pages={data.pages} onChange={setPage} />}
      </div>

      {deleteId !== null && (
        <ConfirmModal
          title="공지사항 삭제"
          message="정말 삭제하시겠습니까?"
          danger
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
