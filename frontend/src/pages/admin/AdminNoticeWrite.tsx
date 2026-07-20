import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Image as ImageIcon, X } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import { useToastStore } from '../../store/toastStore'

export default function AdminNoticeWrite() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const toast = useToastStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<'general' | 'event'>('general')
  const [isPinned, setIsPinned] = useState(false)
  const [loading, setLoading] = useState(false)

  // 대표 썸네일
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [removeThumb, setRemoveThumb] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/api/notices/${id}`).then((r) => {
        const notice = r.data.data
        setTitle(notice.title)
        setContent(notice.content)
        setCategory(notice.category)
        setIsPinned(notice.is_pinned)
        if (notice.thumbnail) setThumbPreview(`/uploads/${notice.thumbnail}`)
      })
    }
  }, [id, isEdit])

  const pickFile = (f: File | null) => {
    if (!f) return
    setThumbFile(f)
    setRemoveThumb(false)
    const reader = new FileReader()
    reader.onload = (e) => setThumbPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const clearThumb = () => {
    setThumbFile(null)
    setThumbPreview(null)
    setRemoveThumb(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.show('error', '제목과 내용을 입력하세요.')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('content', content)
      fd.append('category', category)
      fd.append('is_pinned', String(isPinned))
      if (thumbFile) fd.append('thumbnail', thumbFile)
      if (removeThumb) fd.append('remove_thumbnail', 'true')

      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }
      if (isEdit) {
        await api.put(`/api/notices/${id}`, fd, cfg)
      } else {
        await api.post('/api/notices/', fd, cfg)
      }
      navigate('/admin/notices')
    } catch {
      toast.show('error', '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? '대회안내 수정' : '대회안내 등록'}
        breadcrumbs={[{ label: '관리자' }, { label: '대회안내 관리', to: '/admin/notices' }, { label: isEdit ? '수정' : '등록' }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">제목</label>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="대회/선발 제목"
                required
              />
            </div>
            <div className="w-28">
              <label className="text-xs text-gray-500 mb-1 block">분류</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value as 'general' | 'event')}
              >
                <option value="general">대회</option>
                <option value="event">선발</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="accent-primary"
            />
            상단 고정
          </label>

          {/* 대표 이미지 (썸네일) */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              대표 이미지 <span className="text-gray-300">(선택 · 목록/홈 썸네일로 표시)</span>
            </label>
            {thumbPreview ? (
              <div className="relative w-56 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={thumbPreview} alt="대표 이미지 미리보기" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={clearThumb}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  aria-label="이미지 제거"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                className="w-56 aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-400"
                onClick={() => fileRef.current?.click()}
              >
                <ImageIcon className="w-6 h-6 mb-1" />
                <span className="text-xs">클릭하여 이미지 선택</span>
                <span className="text-[10px] mt-0.5 text-gray-300">JPG, PNG</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">내용</label>
            <textarea
              className="input min-h-[300px] resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => navigate('/admin/notices')} className="btn-ghost">취소</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" />
              {loading ? '저장 중...' : isEdit ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
