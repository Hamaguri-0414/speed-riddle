import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'セッションが見つかりません' }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        isAnonymous: session.user.isAnonymous,
      },
    })
  } catch (error) {
    console.error('セッション取得エラー:', error)
    return NextResponse.json({ error: 'セッションの取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'セッションが見つかりません' }, { status: 401 })
    }

    const { name } = await request.json()

    // 匿名ユーザーの名前を更新（実際のDBがあれば、そこで名前を更新）
    // 現在は仮実装
    
    return NextResponse.json({
      message: 'セッション情報を更新しました',
      user: {
        id: session.user.id,
        name: name || session.user.name,
        isAnonymous: session.user.isAnonymous,
      },
    })
  } catch (error) {
    console.error('セッション更新エラー:', error)
    return NextResponse.json({ error: 'セッションの更新に失敗しました' }, { status: 500 })
  }
}