import StaticPage from '../../components/common/StaticPage'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'

const CORE_VALUES = ['배려', '나눔', '매너', '치유']

export default function Greeting() {
  return (
    <StaticPage title="방문 인사" image={SAMPLE_IMAGES[0]}>
      <h2 className="text-xl font-bold text-gray-900 mb-5">
        사단법인 대한민국골프&amp;파크기술협회를<br className="hidden sm:block" />
        찾아주신 여러분을 진심으로 환영합니다.
      </h2>

      <div className="space-y-4">
        <p>
          우리 협회는 골프와 파크골프의 올바른 기술 보급과 건전한 스포츠 문화 조성,
          전문 지도자 및 심판 양성을 통해 국민의 건강 증진과 삶의 질 향상에 기여하고자
          설립되었습니다.
        </p>
        <p>
          또한 <b className="text-primary">「배려 · 나눔 · 매너 · 치유」</b>를 핵심 가치로 삼아
          서로를 존중하고 함께 성장하는 아름다운 공동체를 만들어 가고 있습니다.
        </p>
        <p>
          이 책자가 협회를 이해하는 데 도움이 되기를 바라며,
          앞으로도 여러분의 아낌없는 관심과 성원을 부탁드립니다.
        </p>
        <p className="font-medium text-gray-700">감사합니다.</p>
      </div>

      {/* 핵심 가치 */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <div className="text-xs font-bold text-gray-400 tracking-wide mb-4">핵심 가치</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CORE_VALUES.map((v) => (
            <div key={v} className="rounded-xl bg-primary-light py-6 text-center">
              <span className="text-lg font-extrabold text-primary">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-right text-sm font-semibold text-gray-700 mt-8">
        사단법인 대한민국골프&amp;파크기술협회
      </p>
    </StaticPage>
  )
}
