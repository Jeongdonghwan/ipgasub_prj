import StaticPage from '../../components/common/StaticPage'

export default function Benefits() {
  return (
    <StaticPage title="회원혜택">
      <h2 className="text-lg font-bold text-gray-800 mb-4">회원 혜택</h2>
      <div className="space-y-4">
        <p>협회 정회원에게는 다음과 같은 혜택이 제공됩니다.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>협회 주관 대회 참가 자격 부여</li>
          <li>정회원 증명서 및 경력 증명서 발급</li>
          <li>제휴 골프장·용품 할인 혜택</li>
          <li>교육 프로그램 우선·할인 참여</li>
          <li>협회 소식 및 구인·구직 정보 제공</li>
        </ul>
        <p className="text-gray-400 text-xs pt-2">※ 제휴 혜택은 시기에 따라 달라질 수 있습니다.</p>
      </div>
    </StaticPage>
  )
}
