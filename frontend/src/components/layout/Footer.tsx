import { Link } from 'react-router-dom'
// 브랜드 아이콘(Youtube/Instagram)은 이 lucide 버전에 없어 일반 아이콘으로 대체. TODO: 실제 SNS 아이콘으로 교체
import { Phone, Mail, MapPin, Video, Camera } from 'lucide-react'

const NAV_ITEMS = [
  { label: '산악회 소개', to: '/about/greeting' },
  { label: '공지사항', to: '/notice' },
  { label: '사진갤러리', to: '/gallery' },
  { label: '커뮤니티', to: '/board' },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-gray-100 text-gray-600 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {/* 브랜드 */}
        <div>
          <img
            src="/logo.png"
            alt="국민산악회"
            className="h-14 w-auto object-contain mb-3"
          />
          <p className="text-sm text-gray-500 leading-relaxed">
            함께 걷는 길, 더 아름다운 산<br />
            매월 정기산행 · 전국 명산 탐방 · 건강한 동행
          </p>
        </div>

        {/* 연락처 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">연락처</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              경기도 어딘가 산악로 100
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              031-000-0000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              info@sanakwi.kr
            </li>
          </ul>
        </div>

        {/* 바로가기 + SNS */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">바로가기</h3>
          <ul className="space-y-2 text-sm text-gray-500 mb-5">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="#"
              aria-label="유튜브"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Video className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="인스타그램"
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Camera className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 하단 크레딧 */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 text-[11px] text-gray-400">
          &copy; 2026 국민산악회. Designed by H.Co (에이치코)
        </div>
      </div>
    </footer>
  )
}
