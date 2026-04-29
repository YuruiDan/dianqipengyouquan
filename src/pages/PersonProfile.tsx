import { Link, useParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import { useFeed } from '../context/FeedContext'
import { getPostsByAuthor, getUserById } from '../data/selectors'
import type { InteractionRecord } from '../types/models'
import { getInitials } from '../utils/format'
import { resolveAssetPath } from '../utils/resolveAssetPath'

export default function PersonProfile() {
  const { id } = useParams()
  const user = id ? getUserById(id) : undefined
  const posts = id ? getPostsByAuthor(id) : []
  const { currentUser } = useAuth()
  const { getInteraction, getPostStats, toggleInteraction } = useFeed()

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-[980px] px-4 py-10 lg:px-6">
        <div className="panel p-6 text-center">
          <h1 className="font-display text-3xl font-bold text-ink-900">人物不存在</h1>
          <p className="mt-3 text-ink-700">请返回人物页选择有效角色。</p>
          <Link
            to="/people"
            className="mt-4 inline-flex rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            返回人物页
          </Link>
        </div>
      </div>
    )
  }

  const handleAction = (postId: string, action: keyof InteractionRecord) => {
    toggleInteraction(postId, currentUser?.id ?? null, action)
  }

  const avatarSrc = resolveAssetPath(user.avatarImage)

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-6 lg:px-6">
      <section className="panel mb-5 overflow-hidden p-0">
        <div className="bg-gradient-to-r from-indigo-900 via-ink-700 to-aurora-500 p-6 text-white">
          <div className="flex flex-wrap items-center gap-4">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={`${user.name} 头像`}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-white/30"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarGradient} text-xl font-bold text-white ring-4 ring-white/30`}
              >
                {getInitials(user.name)}
              </div>
            )}
            <div>
              <h1 className="font-display text-3xl font-bold">{user.name}</h1>
              <p className="mt-1 text-sm text-indigo-100">{user.handle}</p>
              <p className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                {user.verifiedLabel}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="leading-8 text-ink-800">{user.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {user.contributions.map((contribution) => (
              <span key={contribution} className="pill-tag">
                {contribution}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="panel-title mb-3">相关动态（{posts.length}）</h2>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              author={user}
              stats={getPostStats(post, currentUser?.id ?? null)}
              interaction={getInteraction(post.id, currentUser?.id ?? null)}
              onAction={(action) => handleAction(post.id, action)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
