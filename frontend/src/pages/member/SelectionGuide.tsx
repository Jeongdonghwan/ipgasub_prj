import { Link } from 'react-router-dom'
import StaticPage from '../../components/common/StaticPage'

const STEPS = [
  { no: '01', title: '회원 등록 신청', desc: '회원 등록 신청서를 작성해 제출합니다.' },
  { no: '02', title: '교육 이수', desc: '8주 과정(주 1회) 교육을 이수합니다.' },
  { no: '03', title: '자격 심사', desc: '협회 기준에 따라 심사를 진행합니다.' },
  { no: '04', title: '자격증 발급', desc: '지도자 · 심판 자격증 및 카드를 발급합니다.' },
]

export default function SelectionGuide() {
  return (
    <StaticPage title="선발안내">
      <h2 className="text-lg font-bold text-gray-900 mb-5">회원 선발 안내</h2>
      <p className="mb-6">
        협회는 골프와 파크골프의 올바른 기술 보급과 전문 지도자·심판 양성을 위해
        다음 절차에 따라 회원을 선발합니다.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {STEPS.map((s) => (
          <div key={s.no} className="rounded-xl border border-gray-100 bg-surface px-5 py-4 flex gap-4">
            <span className="text-xl font-extrabold text-primary/30 shrink-0">{s.no}</span>
            <div>
              <div className="text-sm font-bold text-gray-900">{s.title}</div>
              <div className="text-xs text-gray-400 mt-1 leading-relaxed">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-100">
        <Link to="/member/register-form" className="btn-primary text-sm">회원 등록 신청하기</Link>
        <span className="text-xs text-gray-400">
          세부 일정 문의 : 062-945-9015
        </span>
      </div>
    </StaticPage>
  )
}
