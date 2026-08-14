import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Upload, Trash2, Image, GripVertical, ChevronUp, ChevronDown } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import ConfirmModal from '../../components/common/ConfirmModal'
import EmptyState from '../../components/common/EmptyState'
import { useToastStore } from '../../store/toastStore'
import type { GalleryAlbum } from '../../types'

export default function AdminGalleryList() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const toast = useToastStore()

  const load = () => {
    api.get('/api/gallery/?page=1&per_page=100').then((r) => setAlbums(r.data.data?.items ?? []))
  }

  useEffect(load, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setCreating(true)
    try {
      await api.post('/api/gallery/', { title, description: desc })
      setTitle('')
      setDesc('')
      load()
    } catch {
      toast.show('error', '앨범 생성에 실패했습니다.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    try {
      await api.delete(`/api/gallery/${deleteId}`)
      toast.show('success', '앨범이 삭제되었습니다.')
      load()
    } catch {
      toast.show('error', '삭제에 실패했습니다.')
    } finally {
      setDeleteId(null)
    }
  }

  const saveOrder = async (next: GalleryAlbum[]) => {
    const prev = albums
    setAlbums(next)
    setSavingOrder(true)
    try {
      await api.patch('/api/gallery/albums/order', { order: next.map((a) => a.id) })
    } catch (err) {
      setAlbums(prev)
      toast.show('error', '순서 저장에 실패했습니다.')
      if ((err as { response?: { status?: number } })?.response?.status === 409) load()
    } finally {
      setSavingOrder(false)
    }
  }

  const handleReorderDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) return
    const next = [...albums]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(target, 0, moved)
    saveOrder(next)
  }

  const moveBy = (i: number, delta: number) => {
    const j = i + delta
    if (j < 0 || j >= albums.length) return
    const next = [...albums]
    ;[next[i], next[j]] = [next[j], next[i]]
    saveOrder(next)
  }

  return (
    <div>
      <PageHeader
        title="갤러리 관리"
        breadcrumbs={[{ label: '관리자' }, { label: '갤러리 관리' }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 새 앨범 생성 */}
        <form onSubmit={handleCreate} className="card p-4 mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">앨범 제목</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="새 앨범 제목" required />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">설명 (선택)</label>
            <input className="input" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="간단한 설명" />
          </div>
          <button type="submit" disabled={creating} className="btn-primary text-xs shrink-0 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {creating ? '생성 중...' : '앨범 생성'}
          </button>
        </form>

        {/* 앨범 목록 */}
        {albums.length > 0 && (
          <p className="text-xs text-gray-400 mb-2">행을 드래그하면 홈페이지에 노출되는 앨범 순서가 바뀝니다.</p>
        )}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-28">순서</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">제목</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-20">사진수</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-24">날짜</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-36">관리</th>
              </tr>
            </thead>
            <tbody>
              {albums.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={Image} title="앨범이 없습니다." description="새 앨범을 생성해보세요." />
                  </td>
                </tr>
              )}
              {albums.map((a, i) => (
                <tr
                  key={a.id}
                  draggable={!savingOrder}
                  onDragStart={(e) => { setDragIndex(i); e.dataTransfer.effectAllowed = 'move' }}
                  onDragOver={(e) => { e.preventDefault(); if (i !== overIndex) setOverIndex(i) }}
                  onDrop={(e) => { e.preventDefault(); handleReorderDrop(i); setDragIndex(null); setOverIndex(null) }}
                  onDragEnd={() => { setDragIndex(null); setOverIndex(null) }}
                  className={`border-t border-gray-50 cursor-grab transition-colors
                    ${dragIndex === i ? 'opacity-40' : 'hover:bg-primary-light'}
                    ${overIndex === i && dragIndex !== null && dragIndex !== i ? 'bg-primary-light shadow-[inset_0_2px_0_0_#2f7d4f]' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-400">
                      <GripVertical className="w-3.5 h-3.5 shrink-0" />
                      <span className="w-4 text-center">{i + 1}</span>
                      <button
                        onClick={() => moveBy(i, -1)}
                        disabled={savingOrder || i === 0}
                        aria-label="위로"
                        className="w-5 h-5 rounded hover:bg-gray-100 hover:text-primary flex items-center justify-center disabled:opacity-25"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveBy(i, 1)}
                        disabled={savingOrder || i === albums.length - 1}
                        aria-label="아래로"
                        className="w-5 h-5 rounded hover:bg-gray-100 hover:text-primary flex items-center justify-center disabled:opacity-25"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{a.title}</td>
                  <td className="px-4 py-3 text-gray-400">{a.photo_count}장</td>
                  <td className="px-4 py-3 text-gray-400">{a.created_at}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/gallery/${a.id}/upload`} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                        <Upload className="w-3 h-3" />
                        사진 관리
                      </Link>
                      <button onClick={() => setDeleteId(a.id)} className="text-xs text-red-500 hover:underline flex items-center gap-0.5">
                        <Trash2 className="w-3 h-3" />
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId !== null && (
        <ConfirmModal
          title="앨범 삭제"
          message="앨범과 모든 사진이 삭제됩니다. 계속하시겠습니까?"
          danger
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
