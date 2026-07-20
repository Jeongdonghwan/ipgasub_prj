import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PenSquare, MessageCircle, FileText, Lock } from 'lucide-react'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import PageHeader from '../../components/common/PageHeader'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import type { BoardListResponse } from '../../types'

const MOCK_BOARD_LIST: BoardListResponse = {
  items: [
    { id: 1, title: '지리산 종주 후기 공유합니다', content: '', author_id: 2, author_name: '김철수', views: 56, comment_count: 3, created_at: '2026.03.22', updated_at: '2026.03.22' },
    { id: 2, title: '등산화 추천 부탁드려요', content: '', author_id: 3, author_name: '이영희', views: 42, comment_count: 7, created_at: '2026.03.21', updated_at: '2026.03.21' },
    { id: 3, title: '주말 가벼운 트레킹 같이 하실 분?', content: '', author_id: 4, author_name: '정수연', views: 31, comment_count: 2, created_at: '2026.03.19', updated_at: '2026.03.19' },
    { id: 4, title: '관악산 야간산행 후기', content: '', author_id: 5, author_name: '박민수', views: 28, comment_count: 0, created_at: '2026.03.17', updated_at: '2026.03.17' },
    { id: 5, title: '봄 산행 준비물 체크리스트', content: '', author_id: 2, author_name: '김철수', views: 65, comment_count: 4, created_at: '2026.03.14', updated_at: '2026.03.14' },
    { id: 6, title: '등산 후 무릎 통증 관리법', content: '', author_id: 6, author_name: '최동욱', views: 88, comment_count: 11, created_at: '2026.03.12', updated_at: '2026.03.12' },
    { id: 7, title: '3월 정기산행 사진 올립니다', content: '', author_id: 1, author_name: '홍길동', views: 47, comment_count: 5, created_at: '2026.03.10', updated_at: '2026.03.10' },
    { id: 8, title: '신입회원 인사드립니다!', content: '', author_id: 7, author_name: '한지민', views: 36, comment_count: 8, created_at: '2026.03.08', updated_at: '2026.03.08' },
  ],
  total: 8, pages: 1, page: 1,
}

export default function BoardList() {
  const [data, setData] = useState<BoardListResponse | null>(null)
  const [page, setPage] = useState(1)
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    api.get(`/api/board/?page=${page}`)
      .then((r) => {
        const d = r.data.data
        setData(d && d.items?.length > 0 ? d : MOCK_BOARD_LIST)
      })
      .catch(() => setData(MOCK_BOARD_LIST))
  }, [page])

  return (
    <div>
      <PageHeader
        title="커뮤니티"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '커뮤니티' }]}
      />

      {/* 회원 전용 잠금 화면 */}
      {!isLoggedIn() ? (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="card max-w-md mx-auto text-center px-6 py-12">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">회원 전용 커뮤니티입니다</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              커뮤니티는 국민산악회 회원만 이용할 수 있습니다.<br />
              가입 후 다양한 산행 이야기를 나눠보세요.
            </p>
            <Link to="/auth/register" className="btn-accent w-full block mb-3">가입 신청하기</Link>
            <p className="text-xs text-gray-400">
              이미 회원이신가요?{' '}
              <Link to="/auth/login" className="text-primary font-medium hover:underline">로그인</Link>
            </p>
          </div>
        </div>
      ) : (
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 상단 바 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">
            총 <span className="text-primary font-medium">{data?.total ?? 0}</span>개의 게시글
          </p>
          {isLoggedIn() && (
            <Link to="/board/write" className="btn-primary text-xs flex items-center gap-1.5">
              <PenSquare className="w-3.5 h-3.5" />
              글쓰기
            </Link>
          )}
        </div>

        {/* 테이블 */}
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
                    <EmptyState icon={FileText} title="게시글이 없습니다." description="첫 게시글을 작성해보세요." />
                  </td>
                </tr>
              )}
              {data?.items.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-primary-light transition-colors">
                  <td className="px-4 py-3 text-gray-400">{p.id}</td>
                  <td className="px-4 py-3">
                    <Link to={`/board/${p.id}`} className="text-gray-700 hover:text-primary transition-colors">
                      {p.title}
                      {p.comment_count > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-primary ml-1.5">
                          <MessageCircle className="w-3 h-3" />
                          {p.comment_count}
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
      )}
    </div>
  )
}
