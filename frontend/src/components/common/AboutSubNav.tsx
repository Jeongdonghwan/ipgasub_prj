import { NavLink } from 'react-router-dom'

const TABS = [
  { label: '인사말', to: '/about/greeting' },
  { label: '연혁', to: '/about/history' },
  { label: '임원진', to: '/about/officers' },
]

export default function AboutSubNav() {
  return (
    <nav className="max-w-4xl mx-auto px-4 pt-4">
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
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
