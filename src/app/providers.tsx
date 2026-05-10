'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const PUBLIC_PATHS = ['/', '/login', '/signup']

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      })
  )

  const router = useRouter()
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  useEffect(() => { pathnameRef.current = pathname }, [pathname])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Firebase 세션 복원 시 쿠키 갱신 (PWA 재오픈 후 쿠키 소실 방지)
        const token = await user.getIdToken()
        const maxAge = 60 * 60 * 24 * 30
        document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`

        if (PUBLIC_PATHS.includes(pathnameRef.current)) {
          router.replace('/planner')
        }
      }
    })
    return () => unsub()
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
