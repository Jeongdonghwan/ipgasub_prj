import StaticPage from '../../components/common/StaticPage'

export default function Education() {
  return (
    <StaticPage title="교육안내">
      <h2 className="text-lg font-bold text-gray-800 mb-4">회원·지도자 교육 안내</h2>
      <div className="space-y-4">
        <p>협회는 프로 골퍼와 지도자의 역량 강화를 위한 다양한 교육 과정을 운영합니다.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>정회원 보수교육 (연 1회 필수)</li>
          <li>골프 지도자 자격 연수 과정</li>
          <li>경기 규칙 및 심판 교육</li>
          <li>골프 지도 실무 워크숍</li>
        </ul>
        <p className="text-gray-400 text-xs pt-2">※ 교육 일정 및 신청은 공지사항을 통해 안내됩니다.</p>
      </div>
    </StaticPage>
  )
}
