const memoryStore = new Map<string, string>()

export const STORAGE_KEYS = {
  authUsers: 'electric_planet_auth_users',
  currentUser: 'electric_planet_current_user',
  interactions: 'electric_planet_interactions',
  userComments: 'electric_planet_user_comments',
} as const

const hasWindow = () => typeof window !== 'undefined'

const safeGetRaw = (key: string): string | null => {
  if (!hasWindow()) {
    return memoryStore.get(key) ?? null
  }

  try {
    const value = window.localStorage.getItem(key)
    if (value !== null) {
      return value
    }
  } catch {
    return memoryStore.get(key) ?? null
  }

  return memoryStore.get(key) ?? null
}

const safeSetRaw = (key: string, value: string): void => {
  memoryStore.set(key, value)
  if (!hasWindow()) {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore localStorage write failures and keep memory fallback.
  }
}

export const readStorage = <T>(key: string, fallback: T): T => {
  const raw = safeGetRaw(key)
  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const writeStorage = <T>(key: string, value: T): void => {
  safeSetRaw(key, JSON.stringify(value))
}

export const removeStorage = (key: string): void => {
  memoryStore.delete(key)
  if (!hasWindow()) {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore.
  }
}
