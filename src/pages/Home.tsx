import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import RightSidebar from '../components/RightSidebar'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'
import { useFeed } from '../context/FeedContext'
import { getAllInventions, getAllPosts, getPostAuthor, getUniqueTags, searchPosts } from '../data/selectors'
import type { InteractionRecord, Post } from '../types/models'
import { resolveAssetPath } from '../utils/resolveAssetPath'

export default function Home() {
  const [searchParams] = useSearchParams()
  const posts = getAllPosts()
  const inventions = getAllInventions()
  const tags = getUniqueTags()
  const allTag = tags[0] ?? '全部'
  const focusPostId = searchParams.get('focusPost')
  const focusEventId = searchParams.get('focusEvent')
  const { currentUser } = useAuth()
  const { getInteraction, getPostStats, toggleInteraction } = useFeed()
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(allTag)
  const [showAllTags, setShowAllTags] = useState(false)
  const [notice, setNotice] = useState('')
  const emblemSrc = resolveAssetPath('/tongji-emblem-circle.png')
  const timelineNotice = focusPostId
    ? focusEventId
      ? `已从时间轴节点 ${focusEventId} 定位到对应动态。`
      : '已从时间轴定位到对应动态。'
    : ''

  const filteredPosts = searchPosts(posts, query, activeTag)
  const defaultTagCount = 18
  const compactTags = tags.slice(0, defaultTagCount)
  const shouldAppendActiveTag =
    !showAllTags && activeTag !== allTag && !compactTags.includes(activeTag) && tags.includes(activeTag)
  const visibleTags = showAllTags
    ? tags
    : shouldAppendActiveTag
      ? [...compactTags, activeTag]
      : compactTags

  useEffect(() => {
    if (!focusPostId) {
      return
    }

    const timer = window.setTimeout(() => {
      const target = document.getElementById(`post-card-${focusPostId}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)

    return () => window.clearTimeout(timer)
  }, [focusPostId])

  const handleAction = (post: Post, action: keyof InteractionRecord) => {
    const message = toggleInteraction(post.id, currentUser?.id ?? null, action)
    if (message) {
      setNotice(message)
      return
    }
    setNotice('互动已记录到本地存储。')
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-6">
      <div className="panel surface-glow overflow-hidden p-0">
        <div className="relative bg-grid-surface bg-[size:24px_24px] bg-indigo-900 p-6 text-white md:p-8">
          <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-cyan-300/25 blur-2xl" />
          <div className="pointer-events-none absolute right-20 top-6 h-20 w-20 animate-glowPulse rounded-full bg-aurora-300/35 blur-xl" />
          <div className="pointer-events-none absolute -bottom-16 right-10 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="max-w-3xl md:pr-52 lg:pr-64">
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">电气朋友圈</h1>
            <p className="mt-3 text-lg font-medium text-indigo-100 sm:text-xl md:text-2xl">
              一部由发明家亲自发布的电气工程史
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100/90 md:text-base">
              历史人物、关键技术与现代学生在同一条信息流中互动。每条动态既有工程原理，也有跨时代的技术接力。
            </p>
          </div>

          <div className="absolute bottom-8 right-8 top-8 hidden items-center justify-center md:flex">
            <div className="h-full animate-float rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-sm">
              <img
                src={emblemSrc}
                alt="同济大学校徽"
                className="h-full w-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">
        <main className="space-y-4">
          <SearchBar
            inputValue={searchInput}
            appliedValue={query}
            resultCount={filteredPosts.length}
            totalCount={posts.length}
            onChange={setSearchInput}
            onSearch={() => setQuery(searchInput.trim())}
            onClear={() => {
              setSearchInput('')
              setQuery('')
              setActiveTag(allTag)
            }}
          />
          <div className="panel elevate-on-hover p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-ink-700">话题标签</div>
              <div className="text-xs text-indigo-600">
                显示 {visibleTags.length} / {tags.length}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    activeTag === tag
                      ? 'bg-gradient-to-r from-indigo-700 to-aurora-500 text-white'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {tags.length > defaultTagCount ? (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowAllTags((value) => !value)}
                  className="rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  {showAllTags ? '收起话题' : '展开更多话题'}
                </button>
              </div>
            ) : null}
            {notice || timelineNotice ? (
              <div className="mt-3 text-xs text-indigo-600">{notice || timelineNotice}</div>
            ) : null}
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={getPostAuthor(post)}
                stats={getPostStats(post, currentUser?.id ?? null)}
                interaction={getInteraction(post.id, currentUser?.id ?? null)}
                onAction={(action) => handleAction(post, action)}
                highlighted={focusPostId === post.id}
                articleId={`post-card-${post.id}`}
              />
            ))}
            {filteredPosts.length === 0 ? (
              <div className="panel p-6 text-center text-sm text-ink-700">
                暂无匹配动态，请更换关键词或话题标签。
              </div>
            ) : null}
          </div>
        </main>

        <RightSidebar
          posts={posts}
          inventions={inventions}
          statsResolver={(post) => getPostStats(post, currentUser?.id ?? null)}
          onTopicClick={(tag) => {
            setActiveTag(tag)
            setQuery('')
            setSearchInput('')
            setNotice(`已按热门话题 ${tag} 过滤动态。`)
          }}
        />
      </div>
    </div>
  )
}
