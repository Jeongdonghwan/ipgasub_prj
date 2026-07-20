import { Mountain } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import AboutSubNav from '../../components/common/AboutSubNav'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'

export default function Greeting() {
  return (
    <div>
      <PageHeader
        title="인사말"
        image={SAMPLE_IMAGES[1]}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '산악회 소개' }, { label: '인사말' }]}
      />
      <AboutSubNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card px-6 py-8 relative overflow-hidden">
          <Mountain className="absolute right-4 top-4 w-20 h-20 text-primary/5" />
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            국민산악회에 오신 것을 환영합니다
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-4">
            <p>
              안녕하세요. 국민산악회 홈페이지를 방문해 주셔서 감사합니다.
            </p>
            <p>
              국민산악회는 산을 사랑하는 사람들이 모여 건강한 등산 문화를 만들어가는 동호회입니다.
              매월 정기산행을 통해 전국의 아름다운 명산을 함께 탐방하고,
              회원 간의 친목과 유대를 다지고 있습니다.
            </p>
            <p>
              초보자부터 숙련자까지 누구나 함께할 수 있으며,
              안전하고 즐거운 산행을 위해 항상 최선을 다하고 있습니다.
            </p>
            <p>
              자연 속에서 건강과 행복을 찾는 여정에 함께 하시길 바랍니다.
            </p>
            <p className="text-primary font-medium mt-6">
              국민산악회 회장 드림
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
