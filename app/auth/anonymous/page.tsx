'use client'

import { useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AnonymousAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    const handleAnonymousSignIn = async () => {
      try {
        const result = await signIn('anonymous', {
          redirect: false,
          callbackUrl,
        })

        if (result?.ok) {
          router.push(callbackUrl)
        } else {
          console.error('匿名認証に失敗しました')
          router.push('/')
        }
      } catch (error) {
        console.error('匿名認証エラー:', error)
        router.push('/')
      }
    }

    handleAnonymousSignIn()
  }, [router, callbackUrl])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">
          認証中です...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          しばらくお待ちください
        </p>
      </div>
    </div>
  )
}