import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页', hint: 'HOME' },
  { to: '/timeline', label: '时间轴', hint: 'TIME' },
  { to: '/people', label: '人物', hint: 'PEOPLE' },
  { to: '/inventions', label: '图鉴', hint: 'TECH' },
  { to: '/about', label: '关于', hint: 'ABOUT' },
]

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-indigo-100/80 bg-white/92 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-[640px] grid-cols-5 gap-1 px-2 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? 'flex min-h-[50px] flex-col items-center justify-center rounded-xl bg-gradient-to-r from-indigo-700 to-aurora-500 text-white shadow-md shadow-indigo-300/45'
                : 'flex min-h-[50px] flex-col items-center justify-center rounded-xl text-ink-700 transition-all duration-200 hover:bg-indigo-50'
            }
          >
            <span className="text-[10px] font-semibold tracking-wide opacity-80">{item.hint}</span>
            <span className="mt-0.5 text-xs font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
