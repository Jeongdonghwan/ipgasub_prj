import StaticPage from '../../components/common/StaticPage'

const HISTORY = [
  { year: '2025', events: ['국제 교류 대회 개최', '회원 1,000명 돌파'] },
  { year: '2024', events: ['정회원 선발 테스트대회 정례화', '골프 지도자 교육원 개설'] },
  { year: '2023', events: ['공식 홈페이지 개편', '전문인 골프대회 신설'] },
  { year: '2022', events: ['사단법인 설립 인가', 'IPGA배 아마추어 골프대회 창설'] },
  { year: '2021', events: ['국제프로골프협회 창립 발기인 총회'] },
]

export default function History() {
  return (
    <StaticPage title="연혁">
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
    </StaticPage>
  )
}
