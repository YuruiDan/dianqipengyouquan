import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import InventionCard from '../components/InventionCard'
import { getAllInventions, getPostById } from '../data/selectors'
import type { Post } from '../types/models'

export default function InventionsPage() {
  const inventions = getAllInventions()
  const [searchParams] = useSearchParams()
  const focusInventionId = searchParams.get('focusInvention')
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '')

  const filtered = inventions.filter((invention) => {
    const searchContent = [
      invention.name,
      invention.summary,
      invention.engineeringSignificance,
      ...invention.tags,
      invention.yearLabel,
    ]
      .join(' ')
      .toLowerCase()
    return searchContent.includes(keyword.trim().toLowerCase())
  })

  useEffect(() => {
    if (!focusInventionId) {
      return
    }

    const timer = window.setTimeout(() => {
      const target = document.getElementById(`invention-card-${focusInventionId}`)
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)

    return () => window.clearTimeout(timer)
  }, [focusInventionId])

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 lg:px-6">
      <section className="panel mb-5 p-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">发明图鉴</h1>
        <p className="mt-3 leading-7 text-ink-700">
          每个发明条目都包含工程意义与关联动态，方便在课堂展示时讲清楚“发现-理论-系统-产业”的传承链条。
        </p>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索发明名称、意义、标签..."
          className="mt-4 w-full rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2 text-sm outline-none transition focus:border-indigo-300 focus:bg-white md:max-w-md"
        />
      </section>

      <div className="space-y-4">
        {filtered.map((invention) => (
          <InventionCard
            key={invention.id}
            invention={invention}
            relatedPosts={invention.relatedPostIds
              .map((postId) => getPostById(postId))
              .filter((post): post is Post => Boolean(post))}
            highlighted={focusInventionId === invention.id}
            articleId={`invention-card-${invention.id}`}
          />
        ))}
      </div>
    </div>
  )
}
