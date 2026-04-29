import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser } from '../types/models'
import { STORAGE_KEYS, readStorage, removeStorage, writeStorage } from '../utils/storage'

interface LoginPayload {
  username: string
  password: string
}

interface RegisterPayload extends LoginPayload {
  displayName: string
}

interface AuthContextValue {
  currentUser: AuthUser | null
  users: AuthUser[]
  login: (payload: LoginPayload) => { ok: boolean; message: string }
  register: (payload: RegisterPayload) => { ok: boolean; message: string }
  logout: () => void
}

const defaultUsers: AuthUser[] = [
  {
    id: 'local_demo_student',
    username: 'demo',
    displayName: '现代学生小明',
    password: '123456',
    avatarGradient: 'from-cyan-500 to-indigo-500',
    roleLabel: '课程演示账号',
    createdAt: new Date('2026-01-01T00:00:00.000Z').toISOString(),
  },
]

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const normalizeUsername = (username: string): string => username.trim().toLowerCase()

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<AuthUser[]>(() => {
    const storedUsers = readStorage<AuthUser[]>(STORAGE_KEYS.authUsers, [])
    if (storedUsers.length > 0) {
      return storedUsers
    }
    writeStorage(STORAGE_KEYS.authUsers, defaultUsers)
    return defaultUsers
  })

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const storedCurrentUser = readStorage<AuthUser | null>(STORAGE_KEYS.currentUser, null)
    if (!storedCurrentUser) {
      return null
    }

    const availableUsers = readStorage<AuthUser[]>(STORAGE_KEYS.authUsers, defaultUsers)
    const matchedUser = availableUsers.find((user) => user.id === storedCurrentUser.id)
    if (!matchedUser) {
      removeStorage(STORAGE_KEYS.currentUser)
      return null
    }

    return matchedUser
  })

  const login: AuthContextValue['login'] = ({ username, password }) => {
    const normalized = normalizeUsername(username)
    const matched = users.find((user) => normalizeUsername(user.username) === normalized)
    if (!matched || matched.password !== password) {
      return { ok: false, message: '用户名或密码不正确。' }
    }

    setCurrentUser(matched)
    writeStorage(STORAGE_KEYS.currentUser, matched)
    return { ok: true, message: `欢迎回来，${matched.displayName}！` }
  }

  const register: AuthContextValue['register'] = ({ username, password, displayName }) => {
    const normalized = normalizeUsername(username)
    if (!normalized || !displayName.trim()) {
      return { ok: false, message: '用户名和昵称不能为空。' }
    }
    if (password.length < 6) {
      return { ok: false, message: '密码至少 6 位。' }
    }

    const duplicated = users.some((user) => normalizeUsername(user.username) === normalized)
    if (duplicated) {
      return { ok: false, message: '该用户名已存在，请更换。' }
    }

    const gradientPool = [
      'from-blue-500 to-indigo-500',
      'from-teal-500 to-cyan-500',
      'from-purple-500 to-fuchsia-500',
      'from-indigo-500 to-violet-500',
      'from-sky-500 to-blue-500',
    ]

    const newUser: AuthUser = {
      id: `local_${Date.now()}`,
      username: normalized,
      displayName: displayName.trim(),
      password,
      avatarGradient: gradientPool[Math.floor(Math.random() * gradientPool.length)],
      roleLabel: '朋友圈新成员',
      createdAt: new Date().toISOString(),
    }

    const nextUsers = [newUser, ...users]
    setUsers(nextUsers)
    setCurrentUser(newUser)
    writeStorage(STORAGE_KEYS.authUsers, nextUsers)
    writeStorage(STORAGE_KEYS.currentUser, newUser)
    return { ok: true, message: `注册成功，欢迎加入电气朋友圈，${newUser.displayName}！` }
  }

  const logout = () => {
    setCurrentUser(null)
    removeStorage(STORAGE_KEYS.currentUser)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
