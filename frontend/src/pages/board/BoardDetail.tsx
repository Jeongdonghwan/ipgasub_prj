import { useEffect, useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Send, User, Calendar, Eye, Reply, CornerDownRight } from 'lucide-react'
import DOMPurify from 'dompurify'
import api from '../../api/axios'
import { useAuthStore } from '../../store/authStore'
import PageHeader from '../../components/common/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmModal from '../../components/common/ConfirmModal'
import { getBoardConfig } from '../../lib/boardConfig'
import type { BoardPost } from '../../types'

const MOCK_POSTS: Record<string, BoardPost> = {
  '1': { id: 1, title: '지리산 종주 후기 공유합니다', content: '지난 주말 지리산 종주를 다녀왔습니다.\n\n노고단에서 출발해서 천왕봉까지 2박 3일 코스로 진행했는데, 날씨가 정말 좋아서 최고의 산행이었습니다.\n\n첫째 날은 노고단에서 벽소령까지, 둘째 날은 벽소령에서 장터목까지, 마지막 날 천왕봉을 찍고 중산리로 하산했습니다.\n\n능선 위에서 보는 일출이 정말 감동적이었어요. 다음에 같이 가실 분 모집합니다!', author_id: 2, author_name: '김철수', views: 56, comment_count: 3, comments: [
    { id: 1, post_id: 1, author_id: 1, author_name: '홍길동', content: '우와 부럽습니다! 다음에 꼭 같이 가고 싶네요.', created_at: '2026.03.22' },
    { id: 2, post_id: 1, author_id: 3, author_name: '이영희', content: '사진도 공유해주세요~', created_at: '2026.03.22' },
    { id: 3, post_id: 1, author_id: 4, author_name: '정수연', content: '종주 코스 난이도가 어느 정도인가요?', created_at: '2026.03.23' },
  ], created_at: '2026.03.22', updated_at: '2026.03.22' },
  '2': { id: 2, title: '등산화 추천 부탁드려요', content: '등산을 시작한지 얼마 안 된 초보입니다.\n\n현재 운동화로 다니고 있는데 발이 너무 아파서 등산화를 구매하려고 합니다.\n\n예산 15만원 정도로 초보자에게 맞는 등산화 추천 부탁드립니다.\n\n주로 수도권 근교 산을 다닐 예정입니다.', author_id: 3, author_name: '이영희', views: 42, comment_count: 7, comments: [
    { id: 4, post_id: 2, author_id: 2, author_name: '김철수', content: '살로몬 X Ultra 추천합니다. 가성비 좋아요.', created_at: '2026.03.21' },
    { id: 5, post_id: 2, author_id: 5, author_name: '박민수', content: '블랙야크 입문용도 괜찮습니다!', created_at: '2026.03.21' },
  ], created_at: '2026.03.21', updated_at: '2026.03.21' },
  '3': { id: 3, title: '주말 가벼운 트레킹 같이 하실 분?', content: '이번 주말 토요일 오전에 북한산 둘레길 트레킹 같이 하실 분 구합니다.\n\n구파발역에서 오전 9시에 만나서 가볍게 2~3시간 정도 걸을 예정입니다.\n\n관심 있으신 분은 댓글 남겨주세요!', author_id: 4, author_name: '정수연', views: 31, comment_count: 2, comments: [
    { id: 6, post_id: 3, author_id: 7, author_name: '한지민', content: '저도 참여하고 싶어요!', created_at: '2026.03.20' },
  ], created_at: '2026.03.19', updated_at: '2026.03.19' },
  '4': { id: 4, title: '관악산 야간산행 후기', content: '어제 관악산 야간산행을 다녀왔습니다.\n\n서울대입구역에서 출발해서 관악산 정상까지 다녀왔는데, 야경이 정말 멋졌습니다.\n\n헤드랜턴 필수이고, 생각보다 사람이 많아서 안전하게 다녀올 수 있었습니다.', author_id: 5, author_name: '박민수', views: 28, comment_count: 0, comments: [], created_at: '2026.03.17', updated_at: '2026.03.17' },
}

export default function BoardDetail() {
  const { type, id } = useParams()
  const config = getBoardConfig(type)
  const navigate = useNavigate()
  const { user, isLoggedIn, isAdmin } = useAuthStore()
  const [post, setPost] = useState<BoardPost | null>(null)
  const [comment, setComment] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [confirmTarget, setConfirmTarget] = useState<{ type: 'post' | 'comment'; id?: number } | null>(null)

  useEffect(() => {
    api.get(`/api/board/${id}`)
      .then((r) => setPost(r.data.data ?? MOCK_POSTS[id ?? '1'] ?? null))
      .catch(() => setPost(MOCK_POSTS[id ?? '1'] ?? null))
  }, [id])

  if (!config) return <Navigate to="/" replace />
  if (!post) {
    return <LoadingSpinner />
  }

  const canEdit = isAdmin() || user?.id === post.author_id

  const apiError = (e: unknown) =>
    (e as { response?: { data?: { error?: string; msg?: string } } })?.response?.data?.error
    ?? (e as { response?: { data?: { msg?: string } } })?.response?.data?.msg
    ?? '요청에 실패했습니다. 다시 로그인 후 시도해 주세요.'

  const handleDelete = async () => {
    try {
      await api.delete(`/api/board/${id}`)
      navigate(`/board/${config.slug}`)
    } catch (e) {
      alert(apiError(e))
    }
  }

  const reload = async () => {
    const r = await api.get(`/api/board/${id}`)
    setPost(r.data.data)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      await api.post(`/api/board/${id}/comments`, { content: comment })
      setComment('')
      reload()
    } catch (err) {
      alert(apiError(err))
    }
  }

  const handleReply = async (parentId: number) => {
    if (!replyText.trim()) return
    try {
      await api.post(`/api/board/${id}/comments`, { content: replyText, parent_id: parentId })
      setReplyText('')
      setReplyTo(null)
      reload()
    } catch (err) {
      alert(apiError(err))
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await api.delete(`/api/board/${id}/comments/${commentId}`)
      reload()
    } catch (err) {
      alert(apiError(err))
    }
  }

  return (
    <div>
      <PageHeader
        title={config.title}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: config.title, to: `/board/${config.slug}` }, { label: post.title }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="card animate-fade-in">
          {/* 헤더 */}
          <div className="px-5 py-4 border-b border-gray-100">
            <h1 className="text-base font-semibold text-gray-800">{post.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author_name}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.created_at}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views}</span>
            </div>
          </div>

          {/* 첨부 이미지 */}
          {post.image && (
            <div className="px-5 pt-5">
              <img
                src={`/uploads/${post.image}`}
                alt={post.title}
                className="max-w-full rounded-lg border border-gray-100"
              />
            </div>
          )}

          {/* 본문 */}
          <div
            className="px-5 py-6 text-sm text-gray-700 leading-relaxed min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* 액션 버튼 */}
          {canEdit && (
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2 justify-end">
              <Link to={`/board/${config.slug}/${id}/edit`} className="btn-outline text-xs flex items-center gap-1">
                <Pencil className="w-3 h-3" />
                수정
              </Link>
              <button
                onClick={() => setConfirmTarget({ type: 'post' })}
                className="btn-ghost text-xs text-red-500 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        <div className="card mt-4">
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              댓글 <span className="text-primary">{post.comment_count}</span>
            </h3>
          </div>

          {/* 댓글 목록 */}
          {post.comments?.map((c) => (
            <div key={c.id}>
              {/* 최상위 댓글 */}
              <div className="px-5 py-3 border-b border-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-gray-700">{c.author_name}</span>
                    <span className="text-gray-400">{c.created_at}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLoggedIn() && (
                      <button
                        onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText('') }}
                        className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-0.5"
                      >
                        <Reply className="w-3 h-3" />
                        답글
                      </button>
                    )}
                    {(isAdmin() || user?.id === c.author_id) && (
                      <button
                        onClick={() => setConfirmTarget({ type: 'comment', id: c.id })}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        삭제
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{c.content}</p>
              </div>

              {/* 답글 목록 */}
              {c.replies?.map((r) => (
                <div key={r.id} className="px-5 py-3 pl-11 bg-gray-50/60 border-b border-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <CornerDownRight className="w-3 h-3 text-gray-300" />
                      <span className="font-medium text-gray-700">{r.author_name}</span>
                      <span className="text-gray-400">{r.created_at}</span>
                    </div>
                    {(isAdmin() || user?.id === r.author_id) && (
                      <button
                        onClick={() => setConfirmTarget({ type: 'comment', id: r.id })}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                        삭제
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{r.content}</p>
                </div>
              ))}

              {/* 답글 입력 */}
              {replyTo === c.id && isLoggedIn() && (
                <form
                  onSubmit={(e) => { e.preventDefault(); handleReply(c.id) }}
                  className="px-5 py-3 pl-11 bg-gray-50/60 border-b border-gray-50 flex gap-2"
                >
                  <input
                    className="input flex-1"
                    placeholder={`${c.author_name}님에게 답글 작성`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn-primary text-xs shrink-0 flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    등록
                  </button>
                </form>
              )}
            </div>
          ))}

          {/* 댓글 입력 */}
          {isLoggedIn() ? (
            <form onSubmit={handleComment} className="px-5 py-3 flex gap-2">
              <input
                className="input flex-1"
                placeholder="댓글을 입력하세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn-primary text-xs shrink-0 flex items-center gap-1">
                <Send className="w-3 h-3" />
                등록
              </button>
            </form>
          ) : (
            <div className="px-5 py-4 text-center text-xs text-gray-400">
              <Link to="/auth/login" className="text-primary hover:underline">로그인</Link> 후 댓글을 작성할 수 있습니다.
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Link to={`/board/${config.slug}`} className="btn-ghost flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            목록으로
          </Link>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {confirmTarget && (
        <ConfirmModal
          title={confirmTarget.type === 'post' ? '게시글 삭제' : '댓글 삭제'}
          message={confirmTarget.type === 'post' ? '정말 삭제하시겠습니까?' : '댓글을 삭제하시겠습니까?'}
          danger
          onCancel={() => setConfirmTarget(null)}
          onConfirm={() => {
            if (confirmTarget.type === 'post') {
              handleDelete()
            } else if (confirmTarget.id) {
              handleDeleteComment(confirmTarget.id)
            }
            setConfirmTarget(null)
          }}
        />
      )}
    </div>
  )
}
