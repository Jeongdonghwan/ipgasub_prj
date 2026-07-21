import StaticPage from '../../components/common/StaticPage'
import { Calendar, Clock, GraduationCap } from 'lucide-react'

const INFO = [
  { icon: Calendar, label: '교육 기간', value: '8주 과정' },
  { icon: Clock, label: '교육 횟수', value: '주 1회' },
  { icon: GraduationCap, label: '수료 후', value: '지도자 · 심판 자격증 발급' },
]

export default function Education() {
  return (
    <StaticPage title="교육안내">
      <h2 className="text-lg font-bold text-gray-900 mb-5">교육 안내</h2>
      <p className="mb-6">
        협회는 골프와 파크골프의 올바른 기술 보급과 전문 지도자·심판 양성을 위해
        체계적인 교육 과정을 운영합니다.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {INFO.map((it) => {
          const Icon = it.icon
          return (
            <div key={it.label} className="rounded-xl border border-gray-100 bg-surface px-4 py-5 text-center">
              <div className="w-10 h-10 rounded-full bg-primary-light mx-auto mb-2.5 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-[11px] text-gray-400">{it.label}</div>
              <div className="text-sm font-bold text-gray-900 mt-0.5">{it.value}</div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl bg-primary-light px-5 py-4">
        <div className="text-sm font-bold text-primary mb-1">교육 과정 : 8주 과정 (주 1회)</div>
        <p className="text-xs text-gray-500">
          교육 일정 및 신청 방법은 공지사항 또는 협회 사무국(062-945-9015)으로 문의해 주시기 바랍니다.
        </p>
      </div>
    </StaticPage>
  )
}
