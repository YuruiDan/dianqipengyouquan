import type { DisplayComment } from '../types/models'
import { formatDateTime, getInitials } from '../utils/format'
import { resolveAssetPath } from '../utils/resolveAssetPath'

interface CommentListProps {
  comments: DisplayComment[]
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="panel p-4 text-sm text-ink-700">
        暂无评论，欢迎发布第一条观点，连接历史与当代技术灵感。
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const avatarSrc = resolveAssetPath(comment.authorAvatarImage)

        return (
          <div key={comment.id} className="panel p-4">
            <div className="mb-2 flex items-start gap-3">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={`${comment.authorName} 头像`}
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${comment.authorAvatarGradient} text-xs font-bold text-white`}
                >
                  {getInitials(comment.authorName)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink-900">{comment.authorName}</span>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                    {comment.authorRoleLabel}
                  </span>
                </div>
                <div className="mt-1 text-xs text-indigo-600">{formatDateTime(comment.createdAt)}</div>
              </div>
            </div>
            <p className="whitespace-pre-wrap leading-7 text-ink-800">{comment.content}</p>
          </div>
        )
      })}
    </div>
  )
}
