import StaticPage from '../../components/common/StaticPage'

export default function Rules() {
  return (
    <StaticPage title="정회원규범">
      <h2 className="text-lg font-bold text-gray-800 mb-4">정회원 규범</h2>
      <div className="space-y-4">
        <p>정회원은 협회의 명예를 존중하고 아래 규범을 준수해야 합니다.</p>
        <ol className="list-decimal pl-5 space-y-1.5">
          <li>협회 정관 및 제 규정을 성실히 준수한다.</li>
          <li>정정당당하게 경기에 임하며 스포츠맨십을 지킨다.</li>
          <li>골프 규칙과 에티켓을 준수한다.</li>
          <li>협회의 품위를 손상하는 행위를 하지 않는다.</li>
          <li>회비 및 제반 의무를 성실히 이행한다.</li>
        </ol>
        <p className="text-gray-400 text-xs pt-2">※ 규범 위반 시 정관에 따라 징계될 수 있습니다.</p>
      </div>
    </StaticPage>
  )
}
