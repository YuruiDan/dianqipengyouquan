import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { InteractionRecord, Post, PostStats, User } from '../types/models'
import { getInitials } from '../utils/format'

const actionConfig: Array<{ key: keyof InteractionRecord; label: string }> = [
  { key: 'liked', label: '点赞' },
  { key: 'reposted', label: '转发' },
  { key: 'favorited', label: '收藏' },
]

interface PostCardProps {
  post: Post
  author?: User
  stats: PostStats
  interaction: InteractionRecord
  onAction?: (action: keyof InteractionRecord) => void
  showFullContent?: boolean
  actionLocked?: boolean
  highlighted?: boolean
  articleId?: string
  contentOverride?: ReactNode
}

export default function PostCard({
  post,
  author,
  stats,
  interaction,
  onAction,
  showFullContent = false,
  actionLocked = false,
  highlighted = false,
  articleId,
  contentOverride,
}: PostCardProps) {
  const previewLimit = 420
  const previewSource = post.summary ?? post.content
  const isTruncated = !showFullContent && previewSource.length > previewLimit

  const previewText = showFullContent
    ? post.content
    : isTruncated
      ? `${previewSource.slice(0, previewLimit)}...`
      : previewSource

  const cardClass = `panel p-5 transition-all duration-200 ${
    highlighted
      ? 'border-indigo-300 ring-2 ring-indigo-200 shadow-lg shadow-indigo-100/70'
      : 'elevate-on-hover'
  }`

  return (
    <article id={articleId} className={cardClass}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {author?.avatarImage ? (
            <img
              src={author.avatarImage}
              alt={`${author.name} 头像`}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${author?.avatarGradient ?? 'from-slate-600 to-slate-400'} text-sm font-bold text-white`}
            >
              {getInitials(author?.name ?? post.authorName)}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/people/${post.authorId}`} className="text-base font-bold text-ink-900 hover:underline">
                {post.authorName}
              </Link>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {post.verifiedLabel}
              </span>
            </div>
            <div className="mt-1 text-xs text-indigo-600">
              @{author?.handle.replace('@', '') ?? post.authorId} · 历史年份 {post.yearLabel}
            </div>
          </div>
        </div>
        <Link
          to={`/post/${post.id}`}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-indigo-200 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-300 hover:bg-indigo-50"
        >
          查看详情 <span aria-hidden>↗</span>
        </Link>
      </div>

      <h3 className="mb-3 font-display text-2xl font-bold leading-tight text-ink-900">{post.title}</h3>
      {contentOverride ? (
        <div className="space-y-6">{contentOverride}</div>
      ) : (
        <>
          <p className="whitespace-pre-wrap leading-8 text-ink-800">{previewText}</p>

          {isTruncated ? (
            <Link to={`/post/${post.id}`} className="mt-2 inline-flex text-sm font-semibold text-indigo-700 hover:underline">
              展开阅读全文
            </Link>
          ) : null}
        </>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="pill-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-indigo-50 pt-4">
        {actionConfig.map((action) => {
          const isActive = interaction[action.key]
          const count =
            action.key === 'liked'
              ? stats.likes
              : action.key === 'reposted'
                ? stats.reposts
                : stats.favorites
          return (
            <button
              key={action.key}
              type="button"
              disabled={actionLocked}
              onClick={() => onAction?.(action.key)}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                isActive
                  ? 'border-indigo-300 bg-indigo-100 text-indigo-700'
                  : 'border-indigo-100 bg-white text-ink-700 hover:border-indigo-200 hover:bg-indigo-50'
              } ${actionLocked ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {action.label} {count}
            </button>
          )
        })}
        <Link
          to={`/post/${post.id}#comments`}
          className="rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-sm font-semibold text-ink-700 transition hover:border-indigo-200 hover:bg-indigo-50"
        >
          评论 {stats.comments}
        </Link>
      </div>
    </article>
  )
}
