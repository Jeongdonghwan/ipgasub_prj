import { Link } from 'react-router-dom'
import StaticPage from '../../components/common/StaticPage'

export default function Rules() {
  return (
    <StaticPage title="정회원 안내">
      <h2 className="text-lg font-bold text-gray-900 mb-5">정회원 안내</h2>

      {/* 연회비 */}
      <div className="rounded-xl bg-primary-light px-6 py-6 text-center mb-8">
        <div className="text-xs font-semibold text-primary/70 mb-1">연회비</div>
        <div className="text-3xl font-extrabold text-primary">5만 원</div>
        <div className="text-xs text-gray-500 mt-2">사단법인 대한민국골프&amp;파크기술협회 정회원</div>
      </div>

      <h3 className="text-sm font-bold text-gray-800 mb-3">정회원 규범</h3>
      <ol className="list-decimal pl-5 space-y-1.5 mb-6">
        <li>협회 정관 및 제 규정을 성실히 준수한다.</li>
        <li>협회의 핵심 가치인 <b className="text-primary">배려 · 나눔 · 매너 · 치유</b>를 실천한다.</li>
        <li>골프 규칙과 에티켓을 준수하며 스포츠맨십을 지킨다.</li>
        <li>협회의 품위를 손상하는 행위를 하지 않는다.</li>
        <li>연회비 및 제반 의무를 성실히 이행한다.</li>
      </ol>

      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 mt-6">
        <Link to="/member/register-form" className="btn-primary text-sm">회원 등록 신청하기</Link>
        <span className="text-xs text-gray-400">문의 : 062-945-9015</span>
      </div>
    </StaticPage>
  )
}
