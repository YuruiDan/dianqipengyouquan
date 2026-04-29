import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getInitials } from '../utils/format'
import { resolveAssetPath } from '../utils/resolveAssetPath'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/timeline', label: '时间轴' },
  { to: '/people', label: '人物' },
  { to: '/inventions', label: '发明图鉴' },
  { to: '/about', label: '关于项目' },
]

const activeClass =
  'rounded-full bg-gradient-to-r from-indigo-700 via-indigo-600 to-aurora-500 px-4 py-2 text-white shadow-md shadow-indigo-300/50 ring-1 ring-white/40'

const defaultClass =
  'rounded-full px-4 py-2 text-ink-700/90 transition-all duration-200 hover:bg-white hover:text-indigo-700 hover:shadow-sm'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const emblemSrc = resolveAssetPath('/tongji-emblem-circle.png')

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/78 shadow-[0_6px_30px_rgba(12,24,58,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link to="/" className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <div className="min-w-0">
            <div className="truncate font-display text-2xl font-bold tracking-tight text-ink-900">
              电气<span className="bg-gradient-to-r from-indigo-700 to-aurora-500 bg-clip-text text-transparent">朋友圈</span>
            </div>
            <div className="hidden text-xs text-indigo-600/90 sm:block">Inventors Circle Timeline</div>
          </div>
          <img
            src={emblemSrc}
            alt="同济大学校徽"
            className="h-8 w-8 rounded-full border border-indigo-100/80 bg-white/90 p-0.5 object-contain shadow-sm sm:h-10 sm:w-10 md:h-12 md:w-12"
            loading="eager"
            decoding="async"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-indigo-50/60 p-1 shadow-inner shadow-white/70 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? activeClass : defaultClass)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {currentUser ? (
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${currentUser.avatarGradient} text-sm font-bold text-white sm:h-10 sm:w-10`}
            >
              {getInitials(currentUser.displayName)}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-ink-900">{currentUser.displayName}</div>
              <div className="text-xs text-indigo-600">@{currentUser.username}</div>
            </div>
            <button
              onClick={logout}
              className="rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-300 hover:bg-indigo-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              退出
            </button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/login"
              className="rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-300 hover:bg-indigo-50 sm:px-4 sm:py-2 sm:text-sm"
            >
              登录
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-indigo-700 to-aurora-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-300/50 transition-all duration-200 hover:-translate-y-[1px] hover:opacity-95 sm:px-4 sm:py-2 sm:text-sm"
            >
              注册
            </Link>
          </div>
        )}
      </div>

    </header>
  )
}
