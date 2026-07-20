import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Upload, Trash2, Image } from 'lucide-react'
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
  const toast = useToastStore()

  const load = () => {
    api.get('/api/gallery/?page=1').then((r) => setAlbums(r.data.data?.items ?? []))
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
    await api.delete(`/api/gallery/${deleteId}`)
    setDeleteId(null)
    load()
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
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium w-16">번호</th>
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
              {albums.map((a) => (
                <tr key={a.id} className="border-t border-gray-50 hover:bg-primary-light transition-colors">
                  <td className="px-4 py-3 text-gray-400">{a.id}</td>
                  <td className="px-4 py-3 text-gray-700">{a.title}</td>
                  <td className="px-4 py-3 text-gray-400">{a.photo_count}장</td>
                  <td className="px-4 py-3 text-gray-400">{a.created_at}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/admin/gallery/${a.id}/upload`} className="text-xs text-primary hover:underline flex items-center gap-0.5">
                        <Upload className="w-3 h-3" />
                        사진 업로드
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
