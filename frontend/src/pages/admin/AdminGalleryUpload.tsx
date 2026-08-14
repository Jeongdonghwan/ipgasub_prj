import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, X, Image, Trash2, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToastStore } from '../../store/toastStore'
import type { GalleryPhoto } from '../../types'

export default function AdminGalleryUpload() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [albumTitle, setAlbumTitle] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<GalleryPhoto | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const toast = useToastStore()

  const fetchPhotos = async () => {
    try {
      const r = await api.get(`/api/gallery/${id}`)
      setPhotos(r.data.data?.photos ?? [])
      setAlbumTitle(r.data.data?.title ?? '')
    } catch {
      toast.show('error', '앨범 정보를 불러오지 못했습니다.')
    }
  }

  useEffect(() => { fetchPhotos() }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

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
      setFiles([])
      setPreviews([])
      fetchPhotos()
    } catch {
      toast.show('error', '업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/api/gallery/${id}/photos/${deleteTarget.id}`)
      setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      toast.show('success', '사진이 삭제되었습니다.')
    } catch {
      toast.show('error', '삭제에 실패했습니다.')
    } finally {
      setDeleteTarget(null)
    }
  }

  const saveOrder = async (next: GalleryPhoto[]) => {
    const prev = photos
    setPhotos(next)
    setSavingOrder(true)
    try {
      await api.patch(`/api/gallery/${id}/photos/order`, { order: next.map((p) => p.id) })
    } catch (err) {
      setPhotos(prev)
      toast.show('error', '순서 저장에 실패했습니다.')
      if ((err as { response?: { status?: number } })?.response?.status === 409) fetchPhotos()
    } finally {
      setSavingOrder(false)
    }
  }

  const handleReorderDrop = (target: number) => {
    // OS 파일 드래그는 dragIndex 가 없으므로 무시
    if (dragIndex === null || dragIndex === target) return
    const next = [...photos]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(target, 0, moved)
    saveOrder(next)
  }

  const moveBy = (i: number, delta: number) => {
    const j = i + delta
    if (j < 0 || j >= photos.length) return
    const next = [...photos]
    ;[next[i], next[j]] = [next[j], next[i]]
    saveOrder(next)
  }

  return (
    <div>
      <PageHeader
        title="사진 관리"
        breadcrumbs={[{ label: '관리자' }, { label: '갤러리 관리', to: '/admin/gallery' }, { label: albumTitle || '사진 관리' }]}
      />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 등록된 사진 — 드래그로 순서 변경 / 개별 삭제 */}
        {photos.length > 0 && (
          <div className="card px-5 py-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                등록된 사진 <span className="text-primary">{photos.length}</span>장
              </h3>
              <span className="text-xs text-gray-400">드래그하여 순서 변경 · 첫 번째 사진 순으로 노출</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {photos.map((p, i) => (
                <div
                  key={p.id}
                  draggable={!savingOrder}
                  onDragStart={(e) => { setDragIndex(i); e.dataTransfer.effectAllowed = 'move' }}
                  onDragOver={(e) => { e.preventDefault(); if (i !== overIndex) setOverIndex(i) }}
                  onDrop={(e) => { e.preventDefault(); handleReorderDrop(i); setDragIndex(null); setOverIndex(null) }}
                  onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-grab group
                    ${dragIndex === i ? 'opacity-40' : ''}
                    ${overIndex === i && dragIndex !== null && dragIndex !== i ? 'ring-2 ring-primary' : ''}`}
                >
                  <img src={`/uploads/${p.thumbnail}`} alt={p.caption} draggable={false} className="w-full h-full object-cover select-none" />
                  <span className="absolute top-1 left-1 w-5 h-5 rounded bg-black/40 text-white flex items-center justify-center">
                    <GripVertical className="w-3 h-3" />
                  </span>
                  <button
                    onClick={() => setDeleteTarget(p)}
                    aria-label="사진 삭제"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {/* 터치 기기용 순서 이동 버튼 */}
                  <div className="absolute bottom-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveBy(i, -1)}
                      disabled={savingOrder || i === 0}
                      aria-label="앞으로"
                      className="w-5 h-5 rounded bg-black/40 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/60"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveBy(i, 1)}
                      disabled={savingOrder || i === photos.length - 1}
                      aria-label="뒤로"
                      className="w-5 h-5 rounded bg-black/40 text-white flex items-center justify-center disabled:opacity-30 hover:bg-black/60"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 드래그 앤 드롭 업로드 영역 */}
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
          <button onClick={() => navigate('/admin/gallery')} className="btn-ghost">목록으로</button>
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

      {/* 사진 삭제 확인 */}
      {deleteTarget && (
        <ConfirmModal
          title="사진 삭제"
          message="이 사진을 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다."
          danger
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}
