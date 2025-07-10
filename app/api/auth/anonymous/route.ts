import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    // 匿名ユーザーのIDを生成
    const anonymousId = uuidv4()
    const anonymousName = `Anonymous-${anonymousId.slice(0, 8)}`

    // 匿名ユーザー情報を返す（実際のDBがあれば、そこに保存）
    const anonymousUser = {
      id: anonymousId,
      name: anonymousName,
      isAnonymous: true,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      message: '匿名ユーザーを作成しました',
      user: anonymousUser,
    })
  } catch (error) {
    console.error('匿名ユーザー作成エラー:', error)
    return NextResponse.json({ error: '匿名ユーザーの作成に失敗しました' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 })
    }

    // 実際のDBがあれば、そこからユーザー情報を取得
    // 現在は仮実装
    const user = {
      id: userId,
      name: `Anonymous-${userId.slice(0, 8)}`,
      isAnonymous: true,
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('匿名ユーザー取得エラー:', error)
    return NextResponse.json({ error: '匿名ユーザーの取得に失敗しました' }, { status: 500 })
  }
}