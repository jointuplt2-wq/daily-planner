'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      unsub()
      if (user) {
        const token = await user.getIdToken()
        const maxAge = 60 * 60 * 24 * 30
        document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`
        router.replace('/planner')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-900">
      <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1 text-center">로그인</h1>
        <p className="text-gray-400 text-sm mb-6 text-center">daily planner에 오신 것을 환영합니다</p>

        <LoginForm />

        <p className="text-center text-sm text-gray-400 mt-6">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-indigo-400 hover:underline font-medium">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  )
}
