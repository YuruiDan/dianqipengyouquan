import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  AuthUser,
  DisplayComment,
  InteractionCollection,
  InteractionRecord,
  Post,
  PostStats,
  UserGeneratedComment,
} from '../types/models'
import { userById } from '../data/mockUsers'
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage'

type InteractionKey = keyof InteractionRecord

interface FeedContextValue {
  userComments: UserGeneratedComment[]
  getCommentsForPost: (post: Post) => DisplayComment[]
  getInteraction: (postId: string, userId: string | null) => InteractionRecord
  getPostStats: (post: Post, userId: string | null) => PostStats
  toggleInteraction: (postId: string, userId: string | null, action: InteractionKey) => string | null
  addComment: (postId: string, author: AuthUser | null, content: string) => { ok: boolean; message: string }
}

const defaultInteraction: InteractionRecord = {
  liked: false,
  reposted: false,
  favorited: false,
}

const FeedContext = createContext<FeedContextValue | undefined>(undefined)

export const FeedProvider = ({ children }: { children: ReactNode }) => {
  const [interactions, setInteractions] = useState<InteractionCollection>(() =>
    readStorage<InteractionCollection>(STORAGE_KEYS.interactions, {}),
  )
  const [userComments, setUserComments] = useState<UserGeneratedComment[]>(() =>
    readStorage<UserGeneratedComment[]>(STORAGE_KEYS.userComments, []),
  )

  const getInteraction = (postId: string, userId: string | null): InteractionRecord => {
    if (!userId) {
      return defaultInteraction
    }

    return interactions[userId]?.[postId] ?? defaultInteraction
  }

  const getPostStats = (post: Post, userId: string | null): PostStats => {
    const interaction = getInteraction(post.id, userId)
    const dynamicCommentCount = userComments.filter((comment) => comment.postId === post.id).length

    return {
      likes: post.likes + (interaction.liked ? 1 : 0),
      reposts: post.reposts + (interaction.reposted ? 1 : 0),
      favorites: post.favorites + (interaction.favorited ? 1 : 0),
      comments: post.commentsCount + dynamicCommentCount,
    }
  }

  const toggleInteraction = (
    postId: string,
    userId: string | null,
    action: InteractionKey,
  ): string | null => {
    if (!userId) {
      return '请先登录后再参与互动。'
    }

    const postMap = interactions[userId] ?? {}
    const current = postMap[postId] ?? defaultInteraction

    const nextRecord: InteractionRecord = {
      ...current,
      [action]: !current[action],
    }

    const nextInteractions: InteractionCollection = {
      ...interactions,
      [userId]: {
        ...postMap,
        [postId]: nextRecord,
      },
    }

    setInteractions(nextInteractions)
    writeStorage(STORAGE_KEYS.interactions, nextInteractions)
    return null
  }

  const addComment: FeedContextValue['addComment'] = (postId, author, content) => {
    const trimmed = content.trim()
    if (!author) {
      return { ok: false, message: '请先登录后再发表评论。' }
    }
    if (!trimmed) {
      return { ok: false, message: '评论内容不能为空。' }
    }

    const created: UserGeneratedComment = {
      id: `local_comment_${Date.now()}`,
      postId,
      authorId: author.id,
      authorName: author.displayName,
      authorAvatarGradient: author.avatarGradient,
      authorAvatarImage: undefined,
      authorRoleLabel: author.roleLabel,
      content: trimmed,
      createdAt: new Date().toISOString(),
    }

    const next = [created, ...userComments]
    setUserComments(next)
    writeStorage(STORAGE_KEYS.userComments, next)
    return { ok: true, message: '评论发布成功。' }
  }

  const getCommentsForPost = (post: Post): DisplayComment[] => {
    const baseComments: DisplayComment[] = post.comments.map((comment) => {
      const author = userById[comment.authorId]
      return {
        id: comment.id,
        authorId: comment.authorId,
        authorName: author?.name ?? '未知用户',
        authorRoleLabel: author?.verifiedLabel ?? '未知身份',
        authorAvatarGradient: author?.avatarGradient ?? 'from-slate-500 to-slate-400',
        authorAvatarImage: author?.avatarImage,
        content: comment.content,
        createdAt: comment.createdAt,
      }
    })

    const dynamicComments: DisplayComment[] = userComments
      .filter((comment) => comment.postId === post.id)
      .map((comment) => ({
        id: comment.id,
        authorId: comment.authorId,
        authorName: comment.authorName,
        authorRoleLabel: comment.authorRoleLabel,
        authorAvatarGradient: comment.authorAvatarGradient,
        authorAvatarImage: comment.authorAvatarImage,
        content: comment.content,
        createdAt: comment.createdAt,
      }))

    return [...dynamicComments, ...baseComments].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
  }

  return (
    <FeedContext.Provider
      value={{
        userComments,
        getCommentsForPost,
        getInteraction,
        getPostStats,
        toggleInteraction,
        addComment,
      }}
    >
      {children}
    </FeedContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFeed = (): FeedContextValue => {
  const context = useContext(FeedContext)
  if (!context) {
    throw new Error('useFeed must be used within FeedProvider')
  }
  return context
}
