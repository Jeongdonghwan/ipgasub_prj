import StaticPage from '../../components/common/StaticPage'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'

export default function Message() {
  return (
    <StaticPage title="회장 인사말" image={SAMPLE_IMAGES[1]}>
      <h2 className="text-xl font-bold text-gray-900 mb-5">안녕하십니까.</h2>

      <div className="space-y-4">
        <p>
          사단법인 대한민국골프&amp;파크기술협회 협회장 <b className="text-gray-800">김광만</b>입니다.
        </p>
        <p>
          먼저 우리 협회에 깊은 관심과 성원을 보내주시는 모든 분들께
          진심으로 감사의 말씀을 드립니다.
        </p>
        <p>
          우리 협회는 골프와 파크골프의 체계적인 교육과 기술 발전은 물론,
          전문 지도자와 심판을 양성하여 건강한 스포츠 문화를 선도하고자
          <b className="text-gray-800"> 2026년 7월 9일</b> 창립되었습니다.
        </p>
        <p>
          특히 협회의 운영 철학인 <b className="text-primary">「배려 · 나눔 · 매너 · 치유」</b>는
          단순한 구호가 아니라 우리 모두가 실천해야 할 기본 가치입니다.
          상대를 존중하는 <b>배려</b>, 함께하는 <b>나눔</b>, 품격 있는 <b>매너</b>,
          그리고 스포츠를 통한 <b>치유</b>가 우리 협회의 미래를 만들어 갈 것입니다.
        </p>
        <p>
          앞으로도 전문성과 공정성을 바탕으로 신뢰받는 협회가 될 수 있도록 최선을 다하겠습니다.
          여러분의 지속적인 관심과 참여를 부탁드리며,
          항상 건강과 행복이 함께하시기를 기원합니다.
        </p>
        <p className="font-medium text-gray-700">감사합니다.</p>
      </div>

      {/* 서명 */}
      <div className="mt-10 pt-6 border-t border-gray-100 text-right">
        <div className="text-sm text-gray-500">사단법인 대한민국골프&amp;파크기술협회</div>
        <div className="mt-1 text-base font-bold text-gray-900">
          협회장 <span className="text-primary">海松</span> 김광만
        </div>
      </div>
    </StaticPage>
  )
}
