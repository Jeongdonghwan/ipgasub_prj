import StaticPage from '../../components/common/StaticPage'

export default function SelectionGuide() {
  return (
    <StaticPage title="선발안내">
      <h2 className="text-lg font-bold text-gray-800 mb-4">정회원 선발 안내</h2>
      <div className="space-y-4">
        <p>정회원은 협회가 주관하는 선발 테스트대회를 통해 선발됩니다.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>지원 자격: 만 18세 이상, 협회 정관에서 정한 요건 충족자</li>
          <li>선발 절차: 서류 접수 → 실기 테스트 → 최종 심사</li>
          <li>선발 일정: 연 2회(상·하반기), 세부 일정은 대회안내 공지 참고</li>
          <li>제출 서류: 회원등록신청서, 신분증 사본 등</li>
        </ul>
        <p className="text-gray-400 text-xs pt-2">※ 세부 기준은 협회 사정에 따라 변경될 수 있습니다.</p>
      </div>
    </StaticPage>
  )
}
