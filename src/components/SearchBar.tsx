interface SearchBarProps {
  inputValue: string
  appliedValue: string
  resultCount: number
  totalCount: number
  onChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
}

export default function SearchBar({
  inputValue,
  appliedValue,
  resultCount,
  totalCount,
  onChange,
  onSearch,
  onClear,
}: SearchBarProps) {
  return (
    <section className="panel elevate-on-hover px-4 py-3">
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
      >
        <div className="hidden text-sm font-semibold text-ink-700 sm:block">搜索</div>
        <input
          value={inputValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder="搜索人物、发明、关键词或话题..."
          className="min-w-0 w-full flex-1 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-2 text-sm text-ink-900 outline-none transition-all duration-200 focus:border-indigo-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(109,89,199,0.12)] sm:w-auto sm:min-w-[220px]"
        />
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-indigo-700 to-aurora-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-300/40 transition-all duration-200 hover:-translate-y-[1px] sm:w-auto"
          >
            搜索
          </button>
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition-all duration-200 hover:-translate-y-[1px] hover:bg-indigo-50 sm:w-auto"
          >
            清空
          </button>
        </div>
      </form>
      <div className="mt-2 text-xs text-indigo-700">
        {appliedValue ? (
          <>
            当前关键词：<span className="font-semibold">{appliedValue}</span>，命中{' '}
            <span className="font-semibold">{resultCount}</span> / {totalCount} 条动态
          </>
        ) : (
          <>
            暂未设置关键词，当前显示 <span className="font-semibold">{resultCount}</span> / {totalCount}{' '}
            条动态
          </>
        )}
      </div>
    </section>
  )
}
