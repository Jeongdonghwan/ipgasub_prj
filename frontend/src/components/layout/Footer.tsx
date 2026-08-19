import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, User } from 'lucide-react'
import { MENU } from '../../lib/menuConfig'
import { useSettingsStore } from '../../store/settingsStore'

/** 협회명 안의 & 만 포인트 컬러로 표시 */
function OrgName({ name }: { name: string }) {
  const parts = name.split('&')
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="text-primary">&amp;</span>}
          {part}
        </span>
      ))}
    </>
  )
}

export default function Footer() {
  const { settings, load } = useSettingsStore()

  useEffect(() => { load() }, [load])

  return (
    <footer className="bg-surface border-t border-gray-100 text-gray-600 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        {/* 브랜드 */}
        <div>
          <div className="leading-tight mb-3">
            <span className="block text-[10px] text-gray-400 tracking-wide">사단법인</span>
            <span className="block text-[16px] font-extrabold text-gray-900 tracking-tight">
              <OrgName name={settings.footer_org_name} />
            </span>
            {settings.footer_reg_number && (
              <span className="block text-[10px] font-semibold text-primary mt-0.5">
                {settings.footer_reg_number}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
            {settings.footer_tagline}
          </p>
        </div>

        {/* 협회 정보 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">협회 정보</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            {settings.footer_address && (
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{settings.footer_address}</span>
              </li>
            )}
            {settings.footer_ceo && (
              <li className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary shrink-0" /> 대표자 : {settings.footer_ceo}
              </li>
            )}
            {settings.footer_phone && (
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" /> {settings.footer_phone}
              </li>
            )}
            {settings.footer_email && (
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" /> {settings.footer_email}
              </li>
            )}
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
          {settings.footer_copyright}
        </div>
      </div>
    </footer>
  )
}
