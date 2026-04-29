export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return isoDate
  }

  const formatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return formatter.format(date)
}

export const getInitials = (name: string): string => {
  const cleaned = name.trim()
  if (cleaned.length <= 2) {
    return cleaned
  }
  return cleaned.slice(0, 2)
}
