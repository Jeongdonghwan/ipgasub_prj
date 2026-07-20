import PageHeader from '../../components/common/PageHeader'
import AboutSubNav from '../../components/common/AboutSubNav'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'

const HISTORY = [
  { year: '2024', events: ['정기산행 12회 실시', '회원 100명 돌파'] },
  { year: '2023', events: ['전국 명산 탐방 프로그램 시작', '공식 홈페이지 개설'] },
  { year: '2022', events: ['산악 안전 교육 프로그램 도입', '가을 단풍 특별산행'] },
  { year: '2021', events: ['회원 50명 달성', '월례 산행 정례화'] },
  { year: '2020', events: ['국민산악회 창립', '북한산 첫 정기산행'] },
]

export default function History() {
  return (
    <div>
      <PageHeader
        title="연혁"
        image={SAMPLE_IMAGES[0]}
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '산악회 소개' }, { label: '연혁' }]}
      />
      <AboutSubNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card px-6 py-8">
          <div className="space-y-6">
            {HISTORY.map((h) => (
              <div key={h.year} className="flex gap-6">
                <div className="shrink-0 w-16 text-right">
                  <span className="text-lg font-bold text-primary">{h.year}</span>
                </div>
                <div className="relative pl-6 border-l-2 border-primary/20 pb-2">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-primary" />
                  <ul className="space-y-1.5">
                    {h.events.map((e, i) => (
                      <li key={i} className="text-sm text-gray-600">{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
