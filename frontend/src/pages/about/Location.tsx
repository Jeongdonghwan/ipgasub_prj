import { MapPin, Phone, Train, Car } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SubNav from '../../components/common/AboutSubNav'

export default function Location() {
  return (
    <div>
      <PageHeader
        title="오시는 길"
        breadcrumbs={[{ label: '홈', to: '/' }, { label: '협회소개', to: '/about/greeting' }, { label: '오시는 길' }]}
      />
      <SubNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 지도 placeholder */}
        <div className="card overflow-hidden mb-6">
          <div className="aspect-[16/8] bg-gray-100 flex flex-col items-center justify-center text-gray-400">
            <MapPin className="w-10 h-10 mb-2" />
            <p className="text-sm">지도 영역 (추후 지도 API 연동)</p>
          </div>
        </div>

        {/* 주소/교통 */}
        <div className="card px-6 py-6 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-800">주소</div>
              <div className="text-gray-500">전남광주통합특별시 광산구 상무대로 104 (도산동, 해송빌딩)</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-800">전화</div>
              <div className="text-gray-500">062-945-9015</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Train className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-800">대중교통</div>
              <div className="text-gray-500">광주 도시철도 1호선 도산역 인근 · 상무대로 경유 버스 이용</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-gray-800">주차</div>
              <div className="text-gray-500">건물 주차장 이용 가능</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
