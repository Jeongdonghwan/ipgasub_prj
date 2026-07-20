import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, X, Image } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import type { GalleryAlbum, GalleryPhoto } from '../../types'

const MOCK_PHOTOS: GalleryPhoto[] = [
  { id: 1, album_id: 1, original: '', thumbnail: '', caption: '정상에서 바라본 풍경', sort_order: 1, created_at: '2026.03.20' },
  { id: 2, album_id: 1, original: '', thumbnail: '', caption: '산행 출발 전 단체사진', sort_order: 2, created_at: '2026.03.20' },
  { id: 3, album_id: 1, original: '', thumbnail: '', caption: '능선길 풍경', sort_order: 3, created_at: '2026.03.20' },
  { id: 4, album_id: 1, original: '', thumbnail: '', caption: '점심 식사 시간', sort_order: 4, created_at: '2026.03.20' },
  { id: 5, album_id: 1, original: '', thumbnail: '', caption: '하산길 계곡', sort_order: 5, created_at: '2026.03.20' },
  { id: 6, album_id: 1, original: '', thumbnail: '', caption: '일출 풍경', sort_order: 6, created_at: '2026.03.20' },
]

const MOCK_ALBUMS: Record<string, GalleryAlbum> = {
  '1': { id: 1, title: '설악산 대청봉 산행', description: '2026년 봄 정기산행 — 설악산 대청봉 코스. 오색약수터에서 출발하여 대청봉을 거쳐 백담사로 하산하는 코스.', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 6, photos: MOCK_PHOTOS, created_at: '2026.03.20' },
  '2': { id: 2, title: '지리산 2박3일 종주', description: '지리산 노고단~천왕봉 종주 사진 모음', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 4, photos: MOCK_PHOTOS.slice(0, 4), created_at: '2026.02.15' },
  '3': { id: 3, title: '북한산 봄꽃 산행', description: '북한산 백운대 봄꽃 산행 사진', cover_image: null, author_id: 2, author_name: '김철수', photo_count: 3, photos: MOCK_PHOTOS.slice(0, 3), created_at: '2026.01.28' },
  '4': { id: 4, title: '한라산 겨울 설경', description: '제주도 한라산 겨울 산행 사진', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 5, photos: MOCK_PHOTOS.slice(0, 5), created_at: '2025.12.20' },
}

export default function GalleryDetail() {
  const { id } = useParams()
  const [album, setAlbum] = useState<GalleryAlbum | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    api.get(`/api/gallery/${id}`)
      .then((r) => setAlbum(r.data.data ?? MOCK_ALBUMS[id ?? '1'] ?? null))
      .catch(() => setAlbum(MOCK_ALBUMS[id ?? '1'] ?? null))
  }, [id])

  if (!album) {
    return <LoadingSpinner />
  }

  const photos = album.photos ?? []
  const baseUrl = ''

  return (
    <div>
      <PageHeader
        title={album.title}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '사진갤러리', to: '/gallery' }, { label: album.title }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 앨범 정보 */}
        <div className="card px-5 py-4 mb-4 animate-fade-in">
          <h2 className="text-base font-semibold text-gray-800">{album.title}</h2>
          {album.description && (
            <p className="text-sm text-gray-500 mt-1">{album.description}</p>
          )}
          <div className="text-xs text-gray-400 mt-2">
            {album.photo_count}장 · {album.created_at} · {album.author_name}
          </div>
        </div>

        {/* 사진 그리드 */}
        {photos.length === 0 ? (
          <div className="card">
            <EmptyState icon={Image} title="사진이 없습니다." />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setLightbox(i)}
                className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 hover:opacity-90 transition-opacity group"
              >
                <img
                  src={`${baseUrl}/uploads/${p.thumbnail}`}
                  alt={p.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Link to="/gallery" className="btn-ghost flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            목록으로
          </Link>
        </div>
      </div>

      {/* 라이트박스 */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity"
            onClick={() => setLightbox(null)}
          >
            <X className="w-6 h-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((lightbox - 1 + photos.length) % photos.length)
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={`${baseUrl}/uploads/${photos[lightbox].original}`}
            alt={photos[lightbox].caption}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((lightbox + 1) % photos.length)
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm text-center">
            <div>{photos[lightbox].caption}</div>
            <div className="text-xs mt-1 text-white/50">
              {lightbox + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
