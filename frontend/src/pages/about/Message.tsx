import StaticPage from '../../components/common/StaticPage'

export default function Message() {
  return (
    <StaticPage title="회장 인사말">
      <h2 className="text-lg font-bold text-gray-800 mb-4">회원 여러분, 반갑습니다.</h2>
      <div className="space-y-4">
        <p>
          사단법인 국제프로골프협회 회장으로서 홈페이지를 통해 회원 여러분과 소통할 수 있게 되어
          매우 기쁘게 생각합니다.
        </p>
        <p>
          골프는 단순한 스포츠를 넘어 자기 관리와 예의, 그리고 사람과 사람을 잇는 소중한 문화입니다.
          우리 협회는 정정당당한 경쟁과 공정한 선발, 체계적인 교육을 통해 대한민국 프로 골프의
          수준을 한층 끌어올리겠습니다.
        </p>
        <p>
          회원 여러분 한 분 한 분이 협회의 주인입니다. 여러분의 목소리에 귀 기울이고,
          더 나은 환경을 만들기 위해 끊임없이 노력하겠습니다.
        </p>
        <p className="text-primary font-medium pt-4">사단법인 국제프로골프협회 회장 ○○○</p>
      </div>
    </StaticPage>
  )
}
