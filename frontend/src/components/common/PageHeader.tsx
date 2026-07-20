import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface PageHeaderProps {
  title: string
  breadcrumbs?: { label: string; to?: string }[]
  image?: string   // 지정 시 초록 산 이미지 배너로 렌더
}

export default function PageHeader({ title, breadcrumbs, image }: PageHeaderProps) {
  return (
    <div
      className={`relative overflow-hidden text-white ${
        image ? '' : 'bg-gradient-to-r from-primary to-primary-mid'
      }`}
    >
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          {/* 초록 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-darker/90 via-primary/75 to-primary-mid/45" />
        </>
      )}
      <div className={`relative max-w-6xl mx-auto px-5 ${image ? 'py-12 md:py-14' : 'py-7'}`}>
        {breadcrumbs && (
          <nav className="flex items-center gap-1 text-[11px] text-white/70 mb-1.5">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                {b.to ? (
                  <Link to={b.to} className="hover:text-white transition-colors">{b.label}</Link>
                ) : (
                  b.label
                )}
              </span>
            ))}
          </nav>
        )}
        <h2 className={image ? 'text-xl md:text-2xl font-bold tracking-tight' : 'text-[17px] font-semibold'}>
          {title}
        </h2>
      </div>
    </div>
  )
}
