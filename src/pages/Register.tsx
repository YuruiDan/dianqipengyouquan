import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = register({ displayName, username, password })
    setNotice(result.message)
    if (result.ok) {
      navigate('/')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <section className="panel p-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">注册电气朋友圈账号</h1>
        <p className="mt-2 text-sm text-ink-700">注册后你的互动会保存到本地，可用于课堂展示演示。</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-ink-800">
            昵称
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="mt-1 w-full rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 outline-none transition focus:border-indigo-300 focus:bg-white"
              placeholder="例如：电气班同学A"
            />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            用户名
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1 w-full rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 outline-none transition focus:border-indigo-300 focus:bg-white"
              placeholder="仅用于登录"
            />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 outline-none transition focus:border-indigo-300 focus:bg-white"
              placeholder="至少 6 位"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-700 to-aurora-500 py-2.5 text-sm font-semibold text-white"
          >
            注册并登录
          </button>
        </form>

        {notice ? <p className="mt-3 text-sm text-indigo-700">{notice}</p> : null}
        <p className="mt-4 text-sm text-ink-700">
          已有账号？
          <Link to="/login" className="ml-1 font-semibold text-indigo-700 underline">
            去登录
          </Link>
        </p>
      </section>
    </div>
  )
}
