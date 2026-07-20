import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, X, Image } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import { useToastStore } from '../../store/toastStore'

export default function AdminGalleryUpload() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const toast = useToastStore()

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    const arr = Array.from(newFiles)
    setFiles((prev) => [...prev, ...arr])

    arr.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(f)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setProgress(0)

    const formData = new FormData()
    files.forEach((f) => formData.append('photos', f))

    try {
      await api.post(`/api/gallery/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      toast.show('success', '업로드가 완료되었습니다.')
      navigate('/admin/gallery')
    } catch {
      toast.show('error', '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="사진 업로드"
        breadcrumbs={[{ label: '관리자' }, { label: '갤러리 관리', to: '/admin/gallery' }, { label: '사진 업로드' }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 드래그 앤 드롭 영역 */}
        <div
          className="card border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center">
              <Image className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">사진을 드래그하거나 클릭하여 선택하세요</p>
            <p className="text-xs text-gray-400">JPG, PNG (최대 10MB)</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* 미리보기 */}
        {previews.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-2">
              선택된 파일: <span className="text-primary font-medium">{files.length}</span>개
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 진행 바 */}
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{progress}%</p>
          </div>
        )}

        {/* 버튼 */}
        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={() => navigate('/admin/gallery')} className="btn-ghost">취소</button>
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="btn-primary flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            {uploading ? '업로드 중...' : `${files.length}장 업로드`}
          </button>
        </div>
      </div>
    </div>
  )
}
