import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PenSquare, MessageCircle, FileText } from 'lucide-react'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import PageHeader from '../../components/common/PageHeader'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import { getBoardConfig } from '../../lib/boardConfig'
import type { BoardListResponse } from '../../types'

const MOCK_BOARD_LIST: BoardListResponse = {
  items: [
    { id: 1, board_type: 'ipga', title: '2026년 협회 정기총회 개최 안내', content: '', author_id: 1, author_name: '관리자', views: 56, comment_count: 3, created_at: '2026.03.22', updated_at: '2026.03.22' },
    { id: 2, board_type: 'ipga', title: '협회 사무국 이전 안내', content: '', author_id: 1, author_name: '관리자', views: 42, comment_count: 1, created_at: '2026.03.21', updated_at: '2026.03.21' },
  ],
  total: 2, pages: 1, page: 1,
}

export default function BoardList() {
  const { type } = useParams()
  const config = getBoardConfig(type)
  const [data, setData] = useState<BoardListResponse | null>(null)
  const [page, setPage] = useState(1)
  const { isLoggedIn, isAdmin } = useAuthStore()

  useEffect(() => {
    if (!config) return
    setPage(1)
  }, [type, config])

  useEffect(() => {
    if (!config) return
    api.get(`/api/board/?type=${config.slug}&page=${page}`)
      .then((r) => {
        const d = r.data.data
        setData(d && d.items?.length > 0 ? d : { ...MOCK_BOARD_LIST, items: [] })
      })
      .catch(() => setData({ ...MOCK_BOARD_LIST, items: [] }))
  }, [page, config])

  if (!config) return <Navigate to="/" replace />

  const canWrite = config.writeRole === 'admin' ? isAdmin() : isLoggedIn()

  return (
    <div>
      <PageHeader
        title={config.title}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: config.group, to: config.groupPath }, { label: config.title }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">
            총 <span className="text-primary font-medium">{data?.total ?? 0}</span>개의 게시글
          </p>
          {canWrite && (
            <Link to={`/board/${config.slug}/write`} className="btn-primary text-xs flex items-center gap-1.5">
              <PenSquare className="w-3.5 h-3.5" />
              글쓰기
            </Link>
          )}
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-16">번호</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">제목</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-24 hidden md:table-cell">작성자</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-24 hidden md:table-cell">날짜</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-16 hidden md:table-cell">조회</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={FileText} title="게시글이 없습니다." description={canWrite ? '첫 게시글을 작성해보세요.' : undefined} />
                  </td>
                </tr>
              )}
              {data?.items.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-primary-light transition-colors">
                  <td className="px-4 py-3 text-gray-400">{p.id}</td>
                  <td className="px-4 py-3">
                    <Link to={`/board/${config.slug}/${p.id}`} className="text-gray-700 hover:text-primary transition-colors">
                      {p.title}
                      {p.comment_count > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-primary ml-1.5">
                          <MessageCircle className="w-3 h-3" />{p.comment_count}
                        </span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.author_name}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.created_at}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{p.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && <Pagination page={data.page} pages={data.pages} onChange={setPage} />}
      </div>
    </div>
  )
}
