import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Save, Image as ImageIcon, X } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import { useToastStore } from '../../store/toastStore'
import { getBoardConfig } from '../../lib/boardConfig'

export default function BoardWrite() {
  const { type, id } = useParams()
  const config = getBoardConfig(type)
  const location = useLocation()
  const navigate = useNavigate()
  const isEdit = !!id && location.pathname.includes('/edit')
  const toast = useToastStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  // 첨부 이미지
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/api/board/${id}`).then((r) => {
        const post = r.data.data
        setTitle(post.title)
        setContent(post.content)
        if (post.image) setImgPreview(`/uploads/${post.image}`)
      })
    }
  }, [id, isEdit])

  const pickFile = (f: File | null) => {
    if (!f) return
    setImgFile(f)
    setRemoveImage(false)
    const reader = new FileReader()
    reader.onload = (e) => setImgPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const clearImage = () => {
    setImgFile(null)
    setImgPreview(null)
    setRemoveImage(true)
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
      if (!isEdit && config) fd.append('board_type', config.slug)
      if (imgFile) fd.append('image', imgFile)
      if (removeImage) fd.append('remove_image', 'true')
      const cfg = { headers: { 'Content-Type': 'multipart/form-data' } }

      if (isEdit) {
        await api.put(`/api/board/${id}`, fd, cfg)
        navigate(`/board/${type}/${id}`)
      } else {
        const res = await api.post('/api/board/', fd, cfg)
        navigate(`/board/${type}/${res.data.data.id}`)
      }
    } catch {
      toast.show('error', '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!config) return <Navigate to="/" replace />

  return (
    <div>
      <PageHeader
        title={isEdit ? `${config.title} 수정` : `${config.title} 작성`}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: config.title, to: `/board/${config.slug}` }, { label: isEdit ? '수정' : '작성' }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="card p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">제목</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
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

          {/* 이미지 첨부 */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              이미지 첨부 <span className="text-gray-300">(선택)</span>
            </label>
            {imgPreview ? (
              <div className="relative w-64 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <img src={imgPreview} alt="첨부 미리보기" className="w-full max-h-64 object-contain" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  aria-label="이미지 제거"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                className="w-64 h-40 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-gray-400"
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

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">취소</button>
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
