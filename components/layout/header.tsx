'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { PlusCircle, User, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { isAuthenticated, user, signOut, signInAnonymously } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await signOut()
    } else {
      await signInAnonymously()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SR</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Speed Riddle
            </span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              謎解き一覧
            </Link>
            <Link 
              href="/puzzles/create" 
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              謎解きを作る
            </Link>
          </nav>

          {/* ユーザーメニュー */}
          <div className="flex items-center gap-4">
            {/* ユーザー情報 */}
            <div className="hidden sm:block">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">ゲスト</span>
              )}
            </div>

            {/* 認証ボタン */}
            <button
              onClick={handleAuthAction}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">ログアウト</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">ログイン</span>
                </>
              )}
            </button>

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                謎解き一覧
              </Link>
              <Link 
                href="/puzzles/create" 
                className="flex items-center gap-2 text-blue-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <PlusCircle className="w-4 h-4" />
                謎解きを作る
              </Link>
              
              {/* モバイル用ユーザー情報 */}
              <div className="pt-3 border-t border-gray-200">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 py-2">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 py-2">ゲストユーザー</div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}