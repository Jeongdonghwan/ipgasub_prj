import { NavLink, useLocation } from 'react-router-dom'
import { findMenuGroup } from '../../lib/menuConfig'

/**
 * 현재 경로가 속한 메뉴 그룹의 2Depth를 탭으로 렌더.
 * (협회소개·회원안내 등 정적 페이지가 공유하는 서브 내비게이션)
 */
export default function SubNav() {
  const { pathname } = useLocation()
  const group = findMenuGroup(pathname)
  if (!group) return null

  return (
    <nav className="max-w-6xl mx-auto px-4 pt-4">
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {group.children.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              `px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
