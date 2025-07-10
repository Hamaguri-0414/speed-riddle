import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Speed Riddle - 謎解きスピード競争サイト',
  description: '謎解きの速さを競うオンライン謎解きサイト。様々な謎解きに挑戦して、あなたのスピードをランキングで確認できます。',
  keywords: ['謎解き', 'パズル', 'スピード', '競争', 'ランキング', 'ゲーム'],
  authors: [{ name: 'Speed Riddle Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}