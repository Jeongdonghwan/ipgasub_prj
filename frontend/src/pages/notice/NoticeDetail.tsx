import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Eye } from 'lucide-react'
import DOMPurify from 'dompurify'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import type { Notice } from '../../types'

const MOCK_NOTICES: Record<string, Notice> = {
  '1': { id: 1, category: 'general', title: '정회원선발 테스트대회 안내', content: '2026년 정회원 선발 테스트대회를 아래와 같이 개최합니다.\n\n■ 일시: 2026년 5월 10일(토)\n■ 장소: ○○컨트리클럽\n■ 접수: 홈페이지 회원등록신청서 제출\n\n많은 참여 바랍니다.', author_id: 1, author_name: '관리자', is_pinned: true, views: 128, created_at: '2026.03.20', updated_at: '2026.03.20' },
  '2': { id: 2, category: 'general', title: '전국 아마추어 골프대회', content: '전국 아마추어 골프대회 참가 접수를 받습니다.\n\n골프를 사랑하는 아마추어라면 누구나 참가 가능합니다.', author_id: 1, author_name: '관리자', is_pinned: false, views: 89, created_at: '2026.03.10', updated_at: '2026.03.10' },
  '3': { id: 3, category: 'event', title: '2026 프로선수 선발전 공고', content: '2026년 프로선수 선발전을 공고합니다.\n\n자격 요건 및 접수 방법은 회원안내 > 선발안내를 참고하세요.', author_id: 1, author_name: '관리자', is_pinned: true, views: 67, created_at: '2026.03.05', updated_at: '2026.03.05' },
}

export default function NoticeDetail() {
  const { id } = useParams()
  const [notice, setNotice] = useState<Notice | null>(null)

  useEffect(() => {
    api.get(`/api/notices/${id}`)
      .then((r) => setNotice(r.data.data ?? MOCK_NOTICES[id ?? '1'] ?? null))
      .catch(() => setNotice(MOCK_NOTICES[id ?? '1'] ?? null))
  }, [id])

  if (!notice) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <PageHeader
        title="대회안내"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '대회안내', to: '/tournament/info' }, { label: notice.title }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="card animate-fade-in">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {notice.category === 'event' && (
                <span className="text-[9px] bg-accent-light text-accent-dark px-1.5 py-0.5 rounded">선발</span>
              )}
              {notice.is_pinned && (
                <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded">공지</span>
              )}
            </div>
            <h1 className="text-base font-semibold text-gray-800">{notice.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{notice.author_name}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{notice.created_at}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{notice.views}</span>
            </div>
          </div>

          {notice.thumbnail && (
            <img src={`/uploads/${notice.thumbnail}`} alt={notice.title}
              className="w-full max-h-[420px] object-cover border-b border-gray-100" />
          )}

          <div
            className="px-5 py-6 text-sm text-gray-700 leading-relaxed min-h-[200px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notice.content) }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Link to="/tournament/info" className="btn-ghost flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}
