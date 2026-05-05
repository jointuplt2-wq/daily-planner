'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { bkend } from '@/lib/bkend'

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const next: typeof errors = {}
    if (!email) next.email = '이메일을 입력해주세요'
    if (password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다'
    if (password !== confirm) next.confirm = '비밀번호가 일치하지 않습니다'
    return next
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await bkend.auth.signup(email, password)
      router.push('/planner')
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : '회원가입에 실패했습니다' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className={inputClass}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="8자 이상"
          className={inputClass}
        />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">비밀번호 확인</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className={inputClass}
        />
        {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
      </div>

      {errors.general && <p className="text-red-400 text-sm">{errors.general}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? '가입 중...' : '회원가입'}
      </button>
    </form>
  )
}
