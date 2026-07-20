import StaticPage from '../../components/common/StaticPage'

export default function Greeting() {
  return (
    <StaticPage title="방문 인사">
      <h2 className="text-lg font-bold text-gray-800 mb-4">IPGA 홈페이지 방문을 환영합니다</h2>
      <div className="space-y-4">
        <p>사단법인 국제프로골프협회(IPGA) 홈페이지를 찾아주셔서 진심으로 감사드립니다.</p>
        <p>
          본 협회는 프로 골프의 저변 확대와 건강한 골프 문화 정착, 그리고 회원의 권익 향상을 위해
          다양한 대회와 교육 프로그램을 운영하고 있습니다.
        </p>
        <p>
          앞으로도 회원 여러분과 골프를 사랑하는 모든 분들께 신뢰받는 협회가 되도록 최선을 다하겠습니다.
          많은 관심과 성원 부탁드립니다.
        </p>
        <p className="text-primary font-medium pt-4">사단법인 국제프로골프협회 임직원 일동</p>
      </div>
    </StaticPage>
  )
}
