import { Link } from 'react-router-dom'
import type { Invention, Post, PostStats } from '../types/models'
import { userById } from '../data/mockUsers'

interface RightSidebarProps {
  posts: Post[]
  inventions: Invention[]
  statsResolver: (post: Post) => PostStats
  onTopicClick?: (tag: string) => void
}

export default function RightSidebar({
  posts,
  inventions,
  statsResolver,
  onTopicClick,
}: RightSidebarProps) {
  const inventionRank = [...inventions].sort((a, b) => b.impactScore - a.impactScore).slice(0, 5)

  const commentsByAuthor = new Map<string, number>()
  posts.forEach((post) => {
    const stats = statsResolver(post)
    commentsByAuthor.set(post.authorId, (commentsByAuthor.get(post.authorId) ?? 0) + stats.comments)
  })
  const commentRank = Array.from(commentsByAuthor.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const technologyRank = [...inventions]
    .sort((a, b) => b.relatedPostIds.length * b.impactScore - a.relatedPostIds.length * a.impactScore)
    .slice(0, 5)

  const tagCounter = new Map<string, number>()
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounter.set(tag, (tagCounter.get(tag) ?? 0) + 1)
    })
  })
  const hotTopics = Array.from(tagCounter.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
      <section className="panel elevate-on-hover p-4">
        <h3 className="panel-title">最具影响力发明榜</h3>
        <ul className="mt-3 space-y-2">
          {inventionRank.map((item, index) => (
            <Link
              key={item.id}
              to={`/inventions?q=${encodeURIComponent(item.name)}`}
              className="block rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 to-blue-50/90 px-3 py-2 transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-200 hover:from-indigo-100 hover:to-blue-100"
            >
              <div className="text-sm font-bold text-ink-900">
                {index + 1}. {item.name}
              </div>
              <div className="text-xs text-indigo-700">
                影响指数 {item.impactScore} · {item.yearLabel}
              </div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="panel elevate-on-hover p-4">
        <h3 className="panel-title">评论最多人物榜</h3>
        <ul className="mt-3 space-y-2">
          {commentRank.map(([authorId, count], index) => (
            <Link
              key={authorId}
              to={`/people/${authorId}`}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2 transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-100 hover:bg-slate-100"
            >
              <span className="text-sm font-semibold text-ink-800">
                {index + 1}. {userById[authorId]?.name ?? authorId}
              </span>
              <span className="text-xs font-semibold text-indigo-700">{count} 条</span>
            </Link>
          ))}
        </ul>
      </section>

      <section className="panel elevate-on-hover p-4">
        <h3 className="panel-title">改变世界技术榜</h3>
        <ul className="mt-3 space-y-2">
          {technologyRank.map((item, index) => (
            <Link
              key={item.id}
              to={`/inventions?q=${encodeURIComponent(item.name)}`}
              className="block rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2 transition-all duration-200 hover:-translate-y-[1px] hover:border-indigo-200 hover:from-indigo-100 hover:to-blue-100"
            >
              <div className="text-sm font-bold text-ink-900">
                {index + 1}. {item.name}
              </div>
              <div className="text-xs text-ink-700">{item.summary}</div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="panel elevate-on-hover p-4">
        <h3 className="panel-title">热门话题</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {hotTopics.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTopicClick?.(tag)}
              className="pill-tag cursor-pointer"
            >
              {tag} · {count}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}
