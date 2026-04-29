export function resolveAssetPath(path?: string): string | undefined {
  if (!path) {
    return undefined
  }

  // Keep absolute URLs and data/blob URLs unchanged.
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }

  const base = import.meta.env.BASE_URL ?? '/'

  if (base !== '/' && path.startsWith(base)) {
    return path
  }

  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBase}${normalizedPath}`
}
