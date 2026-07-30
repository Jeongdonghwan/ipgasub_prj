import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, User } from 'lucide-react'
import { MENU } from '../../lib/menuConfig'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-gray-100 text-gray-600 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {/* 브랜드 */}
        <div>
          <div className="leading-tight mb-3">
            <span className="block text-[10px] text-gray-400 tracking-wide">사단법인</span>
            <span className="block text-[16px] font-extrabold text-gray-900 tracking-tight">
              대한민국골프<span className="text-primary">&amp;</span>파크기술협회
            </span>
            <span className="block text-[10px] font-semibold text-primary mt-0.5">
              (2026-전남광주통합특별시-1호)
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            건강한 골프 문화와 파크골프 기술의<br />
            발전을 함께합니다.
          </p>
        </div>

        {/* 협회 정보 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">협회 정보</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>전남광주통합특별시 광산구 상무대로 104<br />(도산동, 해송빌딩)</span>
            </li>
            <li className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary shrink-0" /> 대표자 : 김광만
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" /> 062-945-9015
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" /> info@kgpta.or.kr
            </li>
          </ul>
        </div>

        {/* 바로가기 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">바로가기</h3>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-gray-500">
            {MENU.map((g) => (
              <li key={g.label}>
                <Link to={g.to} className="hover:text-primary transition-colors">{g.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 하단 크레딧 */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5 text-[11px] text-gray-400">
          &copy; 2026 사단법인 대한민국골프&amp;파크기술협회. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
