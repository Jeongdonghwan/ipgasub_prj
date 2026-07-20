import { UserCircle } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import AboutSubNav from '../../components/common/AboutSubNav'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'

export default function Officers() {
  return (
    <div>
      <PageHeader
        title="임원진 소개"
        image={SAMPLE_IMAGES[4]}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '산악회 소개' }, { label: '임원진' }]}
      />
      <AboutSubNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-light mx-auto mb-4 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-primary/40" />
          </div>
          <h2 className="text-base font-semibold text-gray-700 mb-1.5">임원진 정보 준비 중</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            임원진 소개는 곧 업데이트될 예정입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
