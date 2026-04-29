import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Timeline from '../components/Timeline'
import { getAllInventions, getAllTimelineEvents, getPostById, getUserById } from '../data/selectors'

export default function TimelinePage() {
  const events = useMemo(() => getAllTimelineEvents(), [])
  const inventions = useMemo(() => getAllInventions(), [])
  const [activeEventId, setActiveEventId] = useState(events[0]?.id ?? '')

  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? events[0],
    [activeEventId, events],
  )

  const activePost = activeEvent ? getPostById(activeEvent.postId) : undefined
  const activeUser = activeEvent ? getUserById(activeEvent.actorId) : undefined
  const activeInvention = useMemo(() => {
    if (!activePost) {
      return undefined
    }

    return inventions.find((invention) =>
      activePost.relatedInventionIds.includes(invention.id),
    )
  }, [activePost, inventions])

  const focusEventParam = activeEvent ? encodeURIComponent(activeEvent.id) : ''

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 lg:px-6">
      <section className="panel surface-glow mb-5 p-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">电气工程发展时间轴</h1>
        <p className="mt-3 leading-7 text-ink-700">
          从 1752 年到 21 世纪，19 个关键节点展示电气工程如何从自然现象研究，逐步演进为能源系统、通信网络与智能基础设施。
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Timeline
          events={events}
          activeEventId={activeEvent?.id}
          onSelectEvent={(event) => setActiveEventId(event.id)}
        />

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="panel p-4">
            <h2 className="panel-title">讲解路径</h2>
            {activeEvent ? (
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                  <div className="text-xs font-semibold text-indigo-700">当前节点</div>
                  <div className="mt-1 font-semibold text-ink-900">
                    {activeEvent.yearLabel} · {activeEvent.title}
                  </div>
                  <p className="mt-2 leading-6 text-ink-700">{activeEvent.description}</p>
                </div>

                {activePost ? (
                  <div className="rounded-xl border border-indigo-100 p-3">
                    <div className="text-xs font-semibold text-indigo-700">1. 对应动态</div>
                    <p className="mt-1 font-semibold text-ink-900">{activePost.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        to={`/post/${activePost.id}?from=timeline&event=${focusEventParam}`}
                        className="rounded-full border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        详情页阅读
                      </Link>
                      <Link
                        to={`/?focusPost=${activePost.id}&focusEvent=${focusEventParam}`}
                        className="rounded-full border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        首页高亮
                      </Link>
                    </div>
                  </div>
                ) : null}

                {activeUser ? (
                  <div className="rounded-xl border border-indigo-100 p-3">
                    <div className="text-xs font-semibold text-indigo-700">2. 关键人物</div>
                    <p className="mt-1 font-semibold text-ink-900">{activeUser.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        to={`/people/${activeUser.id}`}
                        className="rounded-full border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        人物主页
                      </Link>
                      <Link
                        to={`/people?focusUser=${activeUser.id}&focusEvent=${focusEventParam}`}
                        className="rounded-full border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        人物页高亮
                      </Link>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-xl border border-indigo-100 p-3">
                  <div className="text-xs font-semibold text-indigo-700">3. 关联发明</div>
                  {activeInvention ? (
                    <>
                      <p className="mt-1 font-semibold text-ink-900">{activeInvention.name}</p>
                      <Link
                        to={`/inventions?focusInvention=${activeInvention.id}&focusEvent=${focusEventParam}`}
                        className="mt-2 inline-flex rounded-full border border-indigo-200 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        发明页高亮
                      </Link>
                    </>
                  ) : (
                    <p className="mt-1 text-ink-700">该节点暂无直接关联发明条目。</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-700">暂无时间轴节点。</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
