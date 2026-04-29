import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = login({ username, password })
    setNotice(result.message)
    if (result.ok) {
      navigate('/')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <section className="panel p-6">
        <h1 className="font-display text-3xl font-bold text-ink-900">登录电气朋友圈</h1>
        <p className="mt-2 text-sm text-ink-700">游客可浏览，登录后可点赞、收藏、转发和发表评论。</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-ink-800">
            用户名
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-1 w-full rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 outline-none transition focus:border-indigo-300 focus:bg-white"
              placeholder="请输入用户名"
            />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            密码
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 outline-none transition focus:border-indigo-300 focus:bg-white"
              placeholder="请输入密码"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-indigo-700 to-aurora-500 py-2.5 text-sm font-semibold text-white"
          >
            登录
          </button>
        </form>

        {notice ? <p className="mt-3 text-sm text-indigo-700">{notice}</p> : null}

        <div className="mt-4 rounded-xl bg-indigo-50 p-3 text-xs leading-6 text-indigo-700">
          演示账号：用户名 <span className="font-bold">demo</span>，密码 <span className="font-bold">123456</span>
        </div>
        <p className="mt-4 text-sm text-ink-700">
          还没有账号？
          <Link to="/register" className="ml-1 font-semibold text-indigo-700 underline">
            去注册
          </Link>
        </p>
      </section>
    </div>
  )
}
