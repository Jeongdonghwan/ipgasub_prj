import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Image, Camera } from 'lucide-react'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'
import type { GalleryAlbum } from '../../types'

const MOCK_ALBUMS: GalleryAlbum[] = [
  { id: 1, title: '설악산 대청봉 산행', description: '2026년 봄 정기산행 — 설악산 대청봉 코스', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 24, created_at: '2026.03.20' },
  { id: 2, title: '지리산 2박3일 종주', description: '지리산 노고단~천왕봉 종주 사진', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 38, created_at: '2026.02.15' },
  { id: 3, title: '북한산 봄꽃 산행', description: '북한산 백운대 봄꽃 산행', cover_image: null, author_id: 2, author_name: '김철수', photo_count: 16, created_at: '2026.01.28' },
  { id: 4, title: '한라산 겨울 설경', description: '제주도 한라산 겨울 산행', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 20, created_at: '2025.12.20' },
  { id: 5, title: '관악산 단풍 산행', description: '서울 관악산 가을 단풍', cover_image: null, author_id: 4, author_name: '박민수', photo_count: 15, created_at: '2025.11.05' },
  { id: 6, title: '덕유산 설경', description: '덕유산 향적봉 겨울 산행', cover_image: null, author_id: 1, author_name: '홍길동', photo_count: 18, created_at: '2025.02.10' },
]

export default function GalleryList() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([])

  useEffect(() => {
    api.get('/api/gallery/?page=1')
      .then((r) => {
        const items = r.data.data?.items ?? []
        setAlbums(items.length > 0 ? items : MOCK_ALBUMS)
      })
      .catch(() => setAlbums(MOCK_ALBUMS))
  }, [])

  return (
    <div>
      <PageHeader
        title="사진갤러리"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '사진갤러리' }]}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {albums.length === 0 ? (
          <div className="card">
            <EmptyState icon={Image} title="앨범이 없습니다." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {albums.map((a, i) => (
              <Link
                key={a.id}
                to={`/gallery/${a.id}`}
                className="card overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* 썸네일 */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={a.cover_image
                      ? `/uploads/${a.cover_image}`
                      : SAMPLE_IMAGES[i % SAMPLE_IMAGES.length]}
                    alt={a.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* 정보 */}
                <div className="px-4 py-3.5">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-400">
                    <Camera className="w-3 h-3" />
                    {a.photo_count}장 · {a.created_at}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
