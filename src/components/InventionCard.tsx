import { Link } from 'react-router-dom'
import type { Invention, Post } from '../types/models'
import { userById } from '../data/mockUsers'

interface InventionCardProps {
  invention: Invention
  relatedPosts: Post[]
  highlighted?: boolean
  articleId?: string
}

export default function InventionCard({
  invention,
  relatedPosts,
  highlighted = false,
  articleId,
}: InventionCardProps) {
  const inventorNames = invention.inventorIds.map((id) => userById[id]?.name ?? id).join('、')
  const cardClass = `panel p-5 transition ${
    highlighted ? 'border-indigo-300 ring-2 ring-indigo-200 shadow-lg shadow-indigo-100/70' : ''
  }`

  return (
    <article id={articleId} className={cardClass}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
          {invention.yearLabel}
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          影响指数 {invention.impactScore}
        </span>
      </div>
      <h3 className="font-display text-2xl font-bold text-ink-900">{invention.name}</h3>
      <div className="mt-1 text-sm text-indigo-700">贡献者：{inventorNames}</div>
      <p className="mt-3 leading-7 text-ink-800">{invention.summary}</p>
      <p className="mt-3 rounded-xl bg-indigo-50/70 p-3 text-sm leading-7 text-ink-700">
        工程意义：{invention.engineeringSignificance}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {invention.tags.map((tag) => (
          <span key={tag} className="pill-tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            关联动态：{post.title}
          </Link>
        ))}
      </div>
    </article>
  )
}
