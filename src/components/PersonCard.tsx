import { Link } from 'react-router-dom'
import type { User } from '../types/models'
import { getInitials } from '../utils/format'

interface PersonCardProps {
  user: User
  postsCount: number
  highlighted?: boolean
  articleId?: string
}

export default function PersonCard({ user, postsCount, highlighted = false, articleId }: PersonCardProps) {
  const cardClass = `panel h-full p-4 transition ${
    highlighted ? 'border-indigo-300 ring-2 ring-indigo-200 shadow-lg shadow-indigo-100/70' : ''
  }`

  return (
    <article id={articleId} className={cardClass}>
      <div className="mb-3 flex items-start gap-3">
        {user.avatarImage ? (
          <img
            src={user.avatarImage}
            alt={`${user.name} 头像`}
            className="h-12 w-12 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarGradient} text-sm font-bold text-white`}
          >
            {getInitials(user.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-ink-900">{user.name}</h3>
          <div className="text-xs text-indigo-600">{user.handle}</div>
          <div className="mt-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
            {user.verifiedLabel}
          </div>
        </div>
      </div>
      <p className="line-clamp-3 min-h-[66px] text-sm leading-6 text-ink-700">{user.bio}</p>
      <div className="mt-3 text-xs font-semibold text-indigo-700">发布动态 {postsCount} 条</div>
      <Link
        to={`/people/${user.id}`}
        className="mt-3 inline-flex rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
      >
        进入人物主页
      </Link>
    </article>
  )
}
