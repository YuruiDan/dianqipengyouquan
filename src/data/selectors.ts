import { mockInventions } from './mockInventions'
import { mockPosts } from './mockPosts'
import { mockTimeline } from './mockTimeline'
import { mockUsers, userById } from './mockUsers'
import type { Invention, Post, TimelineEvent, User } from '../types/models'

export const getAllPosts = (): Post[] =>
  [...mockPosts].sort((a, b) => b.yearSort - a.yearSort || b.createdAt.localeCompare(a.createdAt))

export const getPostById = (postId: string): Post | undefined =>
  mockPosts.find((post) => post.id === postId)

export const getAllUsers = (): User[] => [...mockUsers]

export const getUserById = (userId: string): User | undefined => userById[userId]

export const getPostAuthor = (post: Post): User | undefined => getUserById(post.authorId)

export const getAllTimelineEvents = (): TimelineEvent[] =>
  [...mockTimeline].sort((a, b) => a.yearSort - b.yearSort || a.id.localeCompare(b.id))

export const getAllInventions = (): Invention[] =>
  [...mockInventions].sort((a, b) => b.impactScore - a.impactScore || a.yearSort - b.yearSort)

export const getPostsByAuthor = (authorId: string): Post[] =>
  getAllPosts().filter((post) => post.authorId === authorId)

export const getPrimaryAuthors = (): User[] => {
  const authorIds = new Set(mockPosts.map((post) => post.authorId))
  return mockUsers.filter((user) => authorIds.has(user.id))
}

export const searchPosts = (posts: Post[], query: string, activeTag: string): Post[] => {
  const normalizedQuery = query.trim().toLowerCase()
  return posts.filter((post) => {
    const hitTag = activeTag === '全部' || post.tags.includes(activeTag)
    if (!hitTag) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    const commentContent = post.comments.map((comment) => comment.content).join(' ')
    const searchContent = [
      post.title,
      post.content,
      post.authorName,
      ...post.tags,
      commentContent,
      post.yearLabel,
      post.verifiedLabel,
    ].join(' ')

    return searchContent.toLowerCase().includes(normalizedQuery)
  })
}

export const getUniqueTags = (): string[] => {
  const tags = new Set<string>()
  mockPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag))
  })

  return ['全部', ...Array.from(tags)]
}
