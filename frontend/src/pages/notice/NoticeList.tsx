import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { List, Megaphone, Calendar, FileText, User, Eye } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import type { NoticeListResponse } from '../../types'

const MOCK_NOTICE_LIST: NoticeListResponse = {
  items: [
    { id: 1, category: 'general', title: '2026년 4월 정기산행 안내 — 설악산 대청봉 코스', content: '', author_id: 1, author_name: '홍길동', is_pinned: true, views: 128, created_at: '2026.03.20', updated_at: '2026.03.20' },
    { id: 2, category: 'event', title: '봄맞이 회원 친목 행사 개최', content: '', author_id: 1, author_name: '홍길동', is_pinned: false, views: 67, created_at: '2026.03.18', updated_at: '2026.03.18' },
    { id: 3, category: 'general', title: '산행 안전 수칙 필독 안내', content: '', author_id: 2, author_name: '김철수', is_pinned: false, views: 45, created_at: '2026.03.15', updated_at: '2026.03.15' },
    { id: 4, category: 'general', title: '회비 납부 안내 (2026년 상반기)', content: '', author_id: 3, author_name: '이영희', is_pinned: false, views: 89, created_at: '2026.03.10', updated_at: '2026.03.10' },
    { id: 5, category: 'event', title: '신입 회원 환영 산행 (북한산)', content: '', author_id: 4, author_name: '박민수', is_pinned: false, views: 34, created_at: '2026.03.05', updated_at: '2026.03.05' },
    { id: 6, category: 'general', title: '3월 정기산행 후기 및 사진 공유', content: '', author_id: 1, author_name: '홍길동', is_pinned: false, views: 56, created_at: '2026.03.01', updated_at: '2026.03.01' },
    { id: 7, category: 'general', title: '2026년 연간 산행 일정 안내', content: '', author_id: 1, author_name: '홍길동', is_pinned: false, views: 112, created_at: '2026.02.20', updated_at: '2026.02.20' },
    { id: 8, category: 'event', title: '설날 특별 산행 (관악산)', content: '', author_id: 2, author_name: '김철수', is_pinned: false, views: 78, created_at: '2026.02.10', updated_at: '2026.02.10' },
  ],
  total: 8, pages: 1, page: 1,
}

const CATEGORIES = [
  { key: 'all', label: '전체', icon: List },
  { key: 'general', label: '일반', icon: Megaphone },
  { key: 'event', label: '행사', icon: Calendar },
] as const

export default function NoticeList() {
  const [data, setData] = useState<NoticeListResponse | null>(null)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<string>('all')

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page) })
    if (category !== 'all') params.set('category', category)
    api.get(`/api/notices/?${params}`)
      .then((r) => {
        const d = r.data.data
        setData(d && d.items?.length > 0 ? d : MOCK_NOTICE_LIST)
      })
      .catch(() => setData(MOCK_NOTICE_LIST))
  }, [page, category])

  return (
    <div>
      <PageHeader
        title="공지사항"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '공지사항' }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 카테고리 탭 */}
        <div className="flex gap-1.5 mb-5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon
            return (
              <button
                key={c.key}
                onClick={() => { setCategory(c.key); setPage(1) }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full transition-all ${
                  category === c.key
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {c.label}
              </button>
            )
          })}
        </div>

        {/* 카드 리스트 */}
        {data?.items.length === 0 ? (
          <div className="card">
            <EmptyState icon={FileText} title="공지사항이 없습니다." />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data?.items.map((n) => {
              const badge = n.is_pinned
                ? { label: '공지', cls: 'bg-primary text-white' }
                : n.category === 'event'
                ? { label: '행사', cls: 'bg-accent-light text-accent-dark' }
                : { label: '일반', cls: 'bg-gray-100 text-gray-500' }
              return (
                <Link
                  key={n.id}
                  to={`/notice/${n.id}`}
                  className="card relative pl-6 pr-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-4"
                >
                  {/* 좌측 액센트 바 */}
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {n.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {n.author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {n.created_at}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {n.views}
                    </span>
                  </div>
                  </div>
                  {n.thumbnail && (
                    <div className="w-24 h-[68px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img src={`/uploads/${n.thumbnail}`} alt={n.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {data && <Pagination page={data.page} pages={data.pages} onChange={setPage} />}
      </div>
    </div>
  )
}
