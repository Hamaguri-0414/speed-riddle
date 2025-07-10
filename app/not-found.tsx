'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { Header } from '@/components/layout/header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* 404 アイコン */}
          <div className="text-8xl mb-6">🔍</div>
          
          {/* エラーメッセージ */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            ページが見つかりません
          </h2>
          <p className="text-gray-600 mb-8">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>
          
          {/* アクションボタン */}
          <div className="space-y-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full justify-center"
            >
              <Home className="w-5 h-5" />
              謎解き一覧に戻る
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors w-full justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              前のページに戻る
            </button>
          </div>
          
          {/* ヘルプメッセージ */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 謎解きをお探しの場合は、一覧ページから選択してください
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}