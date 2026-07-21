import StaticPage from '../../components/common/StaticPage'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'

type HistoryYear = { year: string; events: { date: string; text: string; note?: string }[] }

const HISTORY: HistoryYear[] = [
  {
    year: '2026',
    events: [
      { date: '7. 9.', text: '사단법인 대한민국골프&파크기술협회 창립(허가)', note: '제2026-전남광주통합특별시-1호' },
    ],
  },
  {
    year: '2002',
    events: [
      { date: '11. 25.', text: '애경골프 개업' },
    ],
  },
]

export default function History() {
  return (
    <StaticPage title="연혁" image={SAMPLE_IMAGES[2]}>
      <div className="space-y-8">
        {HISTORY.map((h) => (
          <div key={h.year} className="flex gap-5 sm:gap-6">
            <div className="shrink-0 w-14 sm:w-16 text-right">
              <span className="text-xl font-extrabold text-primary">{h.year}</span>
            </div>
            <div className="relative pl-6 border-l-2 border-primary/20 pb-2 flex-1">
              <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-primary" />
              <ul className="space-y-3">
                {h.events.map((e, i) => (
                  <li key={i}>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-gray-400 shrink-0">{e.date}</span>
                      <span className="text-sm font-medium text-gray-800">{e.text}</span>
                    </div>
                    {e.note && (
                      <div className="mt-1 inline-block text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded px-2 py-0.5">
                        {e.note}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  )
}
