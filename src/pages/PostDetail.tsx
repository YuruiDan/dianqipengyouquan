import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CommentList from '../components/CommentList'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import { useFeed } from '../context/FeedContext'
import { getAllInventions, getPostAuthor, getPostById, getPostsByAuthor } from '../data/selectors'
import type { InteractionRecord } from '../types/models'

const sectionTitleTemplate = [
  '历史背景',
  '问题提出',
  '思考过程',
  '实验或发明过程',
  '关键现象',
  '相关公式',
  '公式解释',
  '工程意义',
  '后世影响',
]

interface ContentSection {
  id: string
  title: string
  content: string
}

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const post = id ? getPostById(id) : undefined
  const { currentUser } = useAuth()
  const { getCommentsForPost, getInteraction, getPostStats, toggleInteraction, addComment } = useFeed()
  const [draftComment, setDraftComment] = useState('')
  const [notice, setNotice] = useState('')
  const [readingProgress, setReadingProgress] = useState(0)
  const [showBackTop, setShowBackTop] = useState(false)
  const sourcePage = searchParams.get('from')
  const fallbackPath =
    sourcePage === 'timeline'
      ? '/timeline'
      : sourcePage === 'people'
        ? '/people'
        : sourcePage === 'inventions'
          ? '/inventions'
          : '/'

  const contentSections = useMemo<ContentSection[]>(() => {
    if (!post) {
      return []
    }

    const paragraphs = post.content
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    return paragraphs.map((paragraph, index) => ({
      id: `content-section-${index + 1}`,
      title: sectionTitleTemplate[index] ?? `延伸解读 ${index + 1}`,
      content: paragraph,
    }))
  }, [post])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollableHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollableHeight) * 100)) : 0
      setReadingProgress(nextProgress)
      setShowBackTop(scrollTop > 420)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-[980px] px-4 py-10 lg:px-6">
        <div className="panel p-6 text-center">
          <h1 className="font-display text-3xl font-bold text-ink-900">动态不存在</h1>
          <p className="mt-3 text-ink-700">你访问的内容可能已下架或链接有误。</p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const comments = getCommentsForPost(post)
  const postStats = getPostStats(post, currentUser?.id ?? null)
  const author = getPostAuthor(post)
  const relatedPosts = getPostsByAuthor(post.authorId).filter((item) => item.id !== post.id).slice(0, 3)
  const relatedInventions = getAllInventions().filter((item) => post.relatedInventionIds.includes(item.id))

  const handleAction = (action: keyof InteractionRecord) => {
    const message = toggleInteraction(post.id, currentUser?.id ?? null, action)
    if (message) {
      setNotice(message)
      return
    }
    setNotice('互动状态已更新。')
  }

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = addComment(post.id, currentUser, draftComment)
    setNotice(result.message)
    if (result.ok) {
      setDraftComment('')
    }
  }

  const jumpToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackNavigation = () => {
    const idx =
      typeof window.history.state?.idx === 'number'
        ? window.history.state.idx
        : -1
    const hasHistory = idx > 0 || window.history.length > 1

    if (hasHistory) {
      navigate(-1)
      return
    }

    navigate(fallbackPath, { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-6 lg:px-6">
      <div className="fixed left-0 right-0 top-[72px] z-30 h-1 bg-indigo-100/70">
        <div
          className="h-full bg-gradient-to-r from-indigo-700 via-violet-500 to-cyan-500 transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-indigo-700">
        <button
          type="button"
          onClick={handleBackNavigation}
          className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 font-semibold transition hover:bg-indigo-200"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M11.8 4.5L6.2 10l5.6 5.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          返回上一页
        </button>
        <Link
          to={`/people/${post.authorId}`}
          className="rounded-full border border-indigo-200 px-3 py-1 hover:bg-indigo-50"
        >
          查看 {post.authorName} 人物主页
        </Link>
      </div>

      <section className="panel mb-4 p-4">
        <h2 className="panel-title">目录锚点</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {contentSections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpToSection(section.id)}
              className="rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              {index + 1}. {section.title}
            </button>
          ))}
        </div>
      </section>

      <PostCard
        post={post}
        author={author}
        stats={postStats}
        interaction={getInteraction(post.id, currentUser?.id ?? null)}
        onAction={handleAction}
        contentOverride={
          <div className="space-y-6">
            {contentSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h4 className="mb-2 text-lg font-semibold text-ink-900">{section.title}</h4>
                <p className="whitespace-pre-wrap leading-8 text-ink-800">{section.content}</p>
              </section>
            ))}
          </div>
        }
        showFullContent
      />

      {notice ? <p className="mt-3 text-sm text-indigo-700">{notice}</p> : null}

      {relatedInventions.length > 0 ? (
        <section className="mt-6">
          <h2 className="panel-title mb-3">工程延伸解读</h2>
          <div className="space-y-3">
            {relatedInventions.map((item) => (
              <article key={item.id} className="panel p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {item.yearLabel}
                  </span>
                  <span className="text-sm font-bold text-ink-900">{item.name}</span>
                </div>
                <p className="text-sm leading-7 text-ink-800">{item.summary}</p>
                <p className="mt-2 rounded-xl bg-indigo-50/70 p-3 text-sm leading-7 text-ink-700">
                  工程意义：{item.engineeringSignificance}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section id="comments" className="mt-6">
        <h2 className="panel-title mb-3">评论区（{postStats.comments}）</h2>

        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="panel mb-4 p-4">
            <label className="mb-2 block text-sm font-semibold text-ink-800">
              以 {currentUser.displayName} 身份发表评论
            </label>
            <textarea
              value={draftComment}
              onChange={(event) => setDraftComment(event.target.value)}
              rows={4}
              placeholder="说说你眼中的技术接力..."
              className="w-full resize-none rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-sm leading-6 text-ink-900 outline-none transition focus:border-indigo-300 focus:bg-white"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-gradient-to-r from-indigo-700 to-aurora-500 px-4 py-2 text-sm font-semibold text-white"
              >
                发布评论
              </button>
            </div>
          </form>
        ) : (
          <div className="panel mb-4 p-4 text-sm text-ink-700">
            游客可以浏览评论，登录后可以发布评论和互动。
            <Link to="/login" className="ml-1 font-semibold text-indigo-700 underline">
              立即登录
            </Link>
          </div>
        )}

        <CommentList comments={comments} />
      </section>

      {relatedPosts.length > 0 ? (
        <section className="mt-8">
          <h2 className="panel-title mb-3">同作者更多动态</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {relatedPosts.map((item) => (
              <Link key={item.id} to={`/post/${item.id}`} className="panel block p-4 hover:bg-indigo-50/40">
                <div className="text-xs text-indigo-600">{item.yearLabel}</div>
                <div className="mt-1 font-semibold text-ink-900">{item.title}</div>
                <p className="mt-2 line-clamp-2 text-sm text-ink-700">{item.summary ?? item.content}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {showBackTop ? (
        <button
          type="button"
          onClick={backToTop}
          className="fixed bottom-6 right-6 z-30 rounded-full border border-indigo-200 bg-white/95 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-lg backdrop-blur transition hover:bg-indigo-50"
        >
          回到顶部
        </button>
      ) : null}
    </div>
  )
}
