import StaticPage from '../../components/common/StaticPage'
import { SAMPLE_IMAGES } from '../../lib/sampleImages'

const VICE_PRESIDENTS = ['정순권', '류기덕', '이윤창']

export default function Organization() {
  return (
    <StaticPage title="조직도" image={SAMPLE_IMAGES[4]}>
      <div className="flex flex-col items-center">
        {/* 협회장 */}
        <div className="w-full max-w-xs rounded-xl bg-primary text-white px-6 py-5 text-center shadow-sm">
          <div className="text-[11px] tracking-wide text-white/70">협회장</div>
          <div className="text-lg font-extrabold mt-0.5">김광만</div>
        </div>

        {/* 연결선 */}
        <div className="w-px h-6 bg-gray-200" />

        {/* 부회장 */}
        <div className="w-full">
          <div className="text-center text-xs font-bold text-gray-400 mb-3">부회장</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {VICE_PRESIDENTS.map((name) => (
              <div key={name} className="rounded-xl border border-gray-100 bg-surface px-4 py-5 text-center">
                <div className="text-[11px] text-gray-400">부회장</div>
                <div className="text-base font-bold text-gray-900 mt-0.5">{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 연결선 */}
        <div className="w-px h-6 bg-gray-200" />

        {/* 감사 */}
        <div className="w-full max-w-xs rounded-xl border border-gray-100 bg-surface px-6 py-5 text-center">
          <div className="text-[11px] text-gray-400">감사</div>
          <div className="text-base font-bold text-gray-900 mt-0.5">고춘희</div>
        </div>
      </div>
    </StaticPage>
  )
}
