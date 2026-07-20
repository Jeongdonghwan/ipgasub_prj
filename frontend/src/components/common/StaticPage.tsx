import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import PageHeader from './PageHeader'
import SubNav from './AboutSubNav'
import { findMenuGroup } from '../../lib/menuConfig'

/** 정적 콘텐츠 페이지 공용 셸: 배너 + 서브내비 + 카드 본문 */
export default function StaticPage({
  title, image, children,
}: { title: string; image?: string; children: ReactNode }) {
  const { pathname } = useLocation()
  const group = findMenuGroup(pathname)
  const breadcrumbs = [
    { label: '홈', to: '/' },
    ...(group ? [{ label: group.label, to: group.to }] : []),
    { label: title },
  ]
  return (
    <div>
      <PageHeader title={title} image={image} breadcrumbs={breadcrumbs} />
      <SubNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card px-6 py-8 md:px-8 text-sm text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
