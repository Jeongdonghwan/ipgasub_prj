import StaticPage from '../../components/common/StaticPage'
import { Award, BadgeCheck, CreditCard } from 'lucide-react'

const BENEFITS = [
  { icon: Award, title: '지도자 자격증 발급', desc: '교육 과정 수료 후 협회 지도자 자격증을 발급합니다.' },
  { icon: BadgeCheck, title: '심판 자격증 발급', desc: '심판 교육 이수자에게 심판 자격증을 발급합니다.' },
  { icon: CreditCard, title: '자격증 카드 발급', desc: '휴대 가능한 자격증 카드를 발급해 드립니다.' },
]

export default function Benefits() {
  return (
    <StaticPage title="회원혜택">
      <h2 className="text-lg font-bold text-gray-900 mb-5">회원 혜택</h2>
      <p className="mb-6">협회 회원에게는 다음과 같은 혜택이 제공됩니다.</p>

      <div className="grid sm:grid-cols-3 gap-3">
        {BENEFITS.map((b) => {
          const Icon = b.icon
          return (
            <div key={b.title} className="rounded-xl border border-gray-100 bg-surface px-5 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-light mx-auto mb-3 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm font-bold text-gray-900 mb-1.5">{b.title}</div>
              <div className="text-xs text-gray-400 leading-relaxed">{b.desc}</div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        ※ 자격증 발급 절차 및 비용은 협회 사무국(062-945-9015)으로 문의해 주시기 바랍니다.
      </p>
    </StaticPage>
  )
}
