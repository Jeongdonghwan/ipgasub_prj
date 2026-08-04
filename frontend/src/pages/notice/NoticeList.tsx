import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, FileText, User, Eye } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import SubNav from '../../components/common/AboutSubNav'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import type { NoticeListResponse } from '../../types'

interface Props {
  fixedCategory?: 'general' | 'event'
  title?: string
  basePath?: string   // 상세 링크 베이스 (기본 /tournament)
  groupPath?: string  // 브레드크럼 그룹 링크
  groupLabel?: string
}

const MOCK_NOTICE_LIST: NoticeListResponse = {
  items: [
    { id: 1, category: 'general', title: '정회원선발 테스트대회 안내', content: '', author_id: 1, author_name: '관리자', is_pinned: true, views: 128, created_at: '2026.03.20', updated_at: '2026.03.20' },
    { id: 2, category: 'general', title: 'KGPTA 파크골프 대회', content: '', author_id: 1, author_name: '관리자', is_pinned: false, views: 89, created_at: '2026.03.10', updated_at: '2026.03.10' },
    { id: 3, category: 'event', title: '2026 프로선수 선발전 공고', content: '', author_id: 1, author_name: '관리자', is_pinned: true, views: 67, created_at: '2026.03.05', updated_at: '2026.03.05' },
  ],
  total: 3, pages: 1, page: 1,
}

export default function NoticeList({
  fixedCategory, title = '대회안내', basePath = '/tournament',
  groupPath = '/tournament/info', groupLabel = '대회안내',
}: Props) {
  const [data, setData] = useState<NoticeListResponse | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page) })
    if (fixedCategory) params.set('category', fixedCategory)
    api.get(`/api/notices/?${params}`)
      .then((r) => {
        const d = r.data.data
        setData(d && d.items?.length > 0 ? d
          : { ...MOCK_NOTICE_LIST, items: fixedCategory ? MOCK_NOTICE_LIST.items.filter((n) => n.category === fixedCategory) : MOCK_NOTICE_LIST.items })
      })
      .catch(() => setData(MOCK_NOTICE_LIST))
  }, [page, fixedCategory])

  return (
    <div>
      <PageHeader
        title={title}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: groupLabel, to: groupPath }, { label: title }]}
      />
      <SubNav />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {data?.items.length === 0 ? (
          <div className="card">
            <EmptyState icon={FileText} title="등록된 글이 없습니다." />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data?.items.map((n) => {
              const badge = n.is_pinned
                ? { label: '공지', cls: 'bg-primary text-white' }
                : n.category === 'event'
                ? { label: '선발', cls: 'bg-accent-light text-accent-dark' }
                : { label: '대회', cls: 'bg-gray-100 text-gray-500' }
              return (
                <Link
                  key={n.id}
                  to={`${basePath}/${n.id}`}
                  className="card relative pl-6 pr-5 py-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-4"
                >
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{n.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {n.author_name}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {n.created_at}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {n.views}</span>
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
