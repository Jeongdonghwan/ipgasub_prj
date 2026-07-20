import StaticPage from '../../components/common/StaticPage'

const ORG = [
  { dept: '회장', desc: '협회 대표 및 총괄' },
  { dept: '부회장', desc: '회장 보좌 및 주요 사업 총괄' },
  { dept: '이사회', desc: '주요 안건 심의·의결' },
  { dept: '사무국', desc: '행정·회원·재무 관리' },
  { dept: '대회위원회', desc: '대회 기획 및 운영' },
  { dept: '교육위원회', desc: '지도자·회원 교육 운영' },
]

export default function Organization() {
  return (
    <StaticPage title="조직도">
      <p className="mb-6">사단법인 국제프로골프협회의 조직 구성입니다. (세부 조직도는 준비 중입니다.)</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ORG.map((o) => (
          <div key={o.dept} className="rounded-lg border border-gray-100 bg-surface px-4 py-4 text-center">
            <div className="text-sm font-bold text-primary mb-1">{o.dept}</div>
            <div className="text-xs text-gray-400">{o.desc}</div>
          </div>
        ))}
      </div>
    </StaticPage>
  )
}
