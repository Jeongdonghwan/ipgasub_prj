import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Calendar, Eye } from 'lucide-react'
import DOMPurify from 'dompurify'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import type { Notice } from '../../types'

const MOCK_NOTICES: Record<string, Notice> = {
  '1': { id: 1, category: 'general', title: '2026년 4월 정기산행 안내 — 설악산 대청봉 코스', content: '안녕하세요, 국민산악회 회원 여러분.\n\n4월 정기산행은 설악산 대청봉 코스로 진행됩니다.\n\n■ 일시: 2026년 4월 12일(일) 오전 6시 출발\n■ 코스: 오색약수터 → 대청봉 → 백담사 (약 16km)\n■ 난이도: 중상\n■ 준비물: 등산화, 스틱, 우의, 간식, 물 2L 이상\n■ 참가비: 30,000원 (교통비 포함)\n\n참가 신청은 3월 31일까지 게시판에 댓글로 남겨주세요.\n\n안전한 산행을 위해 체력 관리에 유의하시기 바랍니다.\n\n감사합니다.', author_id: 1, author_name: '홍길동', is_pinned: true, views: 128, created_at: '2026.03.20', updated_at: '2026.03.20' },
  '2': { id: 2, category: 'event', title: '봄맞이 회원 친목 행사 개최', content: '봄을 맞아 회원 친목 행사를 개최합니다.\n\n■ 일시: 2026년 4월 5일(토) 오후 12시\n■ 장소: 서울숲 잔디광장\n■ 내용: 바베큐 파티 + 레크리에이션\n■ 참가비: 15,000원\n\n가족 동반 가능하며, 소정의 기념품도 준비되어 있습니다.\n많은 참여 부탁드립니다!', author_id: 1, author_name: '홍길동', is_pinned: false, views: 67, created_at: '2026.03.18', updated_at: '2026.03.18' },
  '3': { id: 3, category: 'general', title: '산행 안전 수칙 필독 안내', content: '안전한 산행을 위한 필수 수칙을 안내드립니다.\n\n1. 반드시 등산화를 착용하세요.\n2. 기상 상황을 사전에 확인하세요.\n3. 단독 산행은 자제하세요.\n4. 충분한 물과 간식을 준비하세요.\n5. 산행 중 쓰레기는 되가져오세요.\n6. 일몰 2시간 전에는 하산을 시작하세요.\n7. 긴급 시 119에 연락하세요.', author_id: 2, author_name: '김철수', is_pinned: false, views: 45, created_at: '2026.03.15', updated_at: '2026.03.15' },
  '4': { id: 4, category: 'general', title: '회비 납부 안내 (2026년 상반기)', content: '2026년 상반기 회비 납부 안내입니다.\n\n■ 금액: 연회비 50,000원\n■ 납부 기한: 2026년 3월 31일\n■ 계좌: 국민은행 000-000-000000 (국민산악회)\n\n납부 후 게시판에 입금 확인 댓글을 남겨주세요.', author_id: 3, author_name: '이영희', is_pinned: false, views: 89, created_at: '2026.03.10', updated_at: '2026.03.10' },
  '5': { id: 5, category: 'event', title: '신입 회원 환영 산행 (북한산)', content: '신입 회원을 위한 환영 산행을 진행합니다.\n\n■ 일시: 2026년 3월 22일(토)\n■ 코스: 북한산 백운대 (초급 코스)\n■ 집합: 북한산성 입구 오전 9시\n\n새로 가입하신 분들의 많은 참여 바랍니다.', author_id: 4, author_name: '박민수', is_pinned: false, views: 34, created_at: '2026.03.05', updated_at: '2026.03.05' },
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
        title="공지사항"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '공지사항', to: '/notice' }, { label: notice.title }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="card animate-fade-in">
          {/* 헤더 */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              {notice.category === 'event' && (
                <span className="text-[9px] bg-accent-light text-accent-dark px-1.5 py-0.5 rounded">행사</span>
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

          {/* 대표 이미지 */}
          {notice.thumbnail && (
            <img
              src={`/uploads/${notice.thumbnail}`}
              alt={notice.title}
              className="w-full max-h-[420px] object-cover border-b border-gray-100"
            />
          )}

          {/* 본문 */}
          <div
            className="px-5 py-6 text-sm text-gray-700 leading-relaxed min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notice.content) }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Link to="/notice" className="btn-ghost flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            목록으로
          </Link>
        </div>
      </div>
    </div>
  )
}
