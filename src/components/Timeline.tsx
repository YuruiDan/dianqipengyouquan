import { Link } from 'react-router-dom'
import type { TimelineEvent } from '../types/models'
import { userById } from '../data/mockUsers'

interface TimelineProps {
  events: TimelineEvent[]
  activeEventId?: string
  onSelectEvent?: (event: TimelineEvent) => void
}

export default function Timeline({ events, activeEventId, onSelectEvent }: TimelineProps) {
  return (
    <div className="relative pl-6">
      <div className="absolute bottom-0 left-2 top-0 w-[2px] bg-gradient-to-b from-indigo-600 via-violet-500 to-cyan-500" />
      <div className="space-y-4">
        {events.map((event) => {
          const isActive = activeEventId === event.id
          return (
            <article
              key={event.id}
              className={`panel relative cursor-pointer p-4 transition-all duration-200 ${
                isActive
                  ? 'border-indigo-300 ring-2 ring-indigo-200 shadow-lg shadow-indigo-100/70'
                  : 'elevate-on-hover hover:border-indigo-200'
              }`}
              onClick={() => onSelectEvent?.(event)}
            >
              <div
                className={`absolute -left-[22px] top-6 h-4 w-4 rounded-full border-4 border-white ${
                  isActive ? 'animate-glowPulse bg-aurora-500' : 'bg-indigo-600'
                }`}
              />
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                {event.yearLabel}
              </span>
              <span className="text-xs text-indigo-600">{userById[event.actorId]?.name}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-ink-900">{event.title}</h3>
            <p className="mt-2 leading-7 text-ink-700">{event.description}</p>
            <Link
              to={`/post/${event.postId}?from=timeline&event=${event.id}`}
              className="mt-3 inline-flex rounded-full border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              查看对应动态
            </Link>
          </article>
          )
        })}
      </div>
    </div>
  )
}
