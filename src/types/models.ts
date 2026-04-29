export interface User {
  id: string
  name: string
  handle: string
  verifiedLabel: string
  roleType: 'historical' | 'modern' | 'technology' | 'organization' | 'system'
  bio: string
  contributions: string[]
  avatarGradient: string
  avatarImage?: string
  joinedYearLabel?: string
}

export interface PostComment {
  id: string
  authorId: string
  content: string
  createdAt: string
}

export interface ResearchStep {
  title: string
  content: string
}

export interface FormulaDerivation {
  name: string
  expression: string
  derivation: string
  note: string
}

export interface Post {
  id: string
  authorId: string
  authorName: string
  verifiedLabel: string
  title: string
  summary?: string
  yearLabel: string
  yearSort: number
  content: string
  researchSteps?: ResearchStep[]
  formulaDerivations?: FormulaDerivation[]
  tags: string[]
  likes: number
  commentsCount: number
  reposts: number
  favorites: number
  relatedInventionIds: string[]
  createdAt: string
  comments: PostComment[]
}

export interface Invention {
  id: string
  name: string
  yearLabel: string
  yearSort: number
  inventorIds: string[]
  summary: string
  engineeringSignificance: string
  relatedPostIds: string[]
  tags: string[]
  impactScore: number
}

export interface TimelineEvent {
  id: string
  yearLabel: string
  yearSort: number
  title: string
  description: string
  actorId: string
  postId: string
}

export interface AuthUser {
  id: string
  username: string
  displayName: string
  password: string
  avatarGradient: string
  roleLabel: string
  createdAt: string
}

export interface InteractionRecord {
  liked: boolean
  reposted: boolean
  favorited: boolean
}

export type InteractionCollection = Record<string, Record<string, InteractionRecord>>

export interface UserGeneratedComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatarGradient: string
  authorAvatarImage?: string
  authorRoleLabel: string
  content: string
  createdAt: string
}

export interface DisplayComment {
  id: string
  authorId: string
  authorName: string
  authorRoleLabel: string
  authorAvatarGradient: string
  authorAvatarImage?: string
  content: string
  createdAt: string
}

export interface PostStats {
  likes: number
  reposts: number
  favorites: number
  comments: number
}
