import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PersonCard from '../components/PersonCard'
import { getAllPosts, getPrimaryAuthors } from '../data/selectors'

export default function PeoplePage() {
  const [searchParams] = useSearchParams()
  const focusUserId = searchParams.get('focusUser')
  const [keyword, setKeyword] = useState('')
  const authors = getPrimaryAuthors()
  const posts = getAllPosts()

  const filtered = authors.filter((author) => {
    const searchContent = [author.name, author.handle, author.verifiedLabel, author.bio].join(' ').toLowerCase()
    return searchContent.includes(keyword.trim().toLowerCase())
  })

  useEffect(() => {
    if (!focusUserId) {
      return
    }

    const timer = window.setTimeout(() => {
      const target = document.getElementById(`person-card-${focusUserId}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)

    return () => window.clearTimeout(timer)
  }, [focusUserId])

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 lg:px-6">
      <section className="panel mb-5 p-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">电气人物星图</h1>
        <p className="mt-3 text-sm leading-7 text-ink-700">
          这里展示所有发布核心历史动态的作者。点击人物卡片可进入主页查看代表贡献与关联动态。
        </p>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索人物姓名、标签..."
          className="mt-4 w-full rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2 text-sm outline-none transition focus:border-indigo-300 focus:bg-white md:max-w-md"
        />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((author) => (
          <PersonCard
            key={author.id}
            user={author}
            postsCount={posts.filter((post) => post.authorId === author.id).length}
            highlighted={focusUserId === author.id}
            articleId={`person-card-${author.id}`}
          />
        ))}
      </div>
    </div>
  )
}
