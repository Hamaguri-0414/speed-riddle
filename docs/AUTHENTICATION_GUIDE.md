# 認証システム解説 - 初学者向けガイド

## 目次
1. [認証とは何か？](#認証とは何か)
2. [なぜ認証が必要なのか？](#なぜ認証が必要なのか)
3. [匿名認証とは？](#匿名認証とは)
4. [NextAuth.jsの役割](#nextauthjs-の役割)
5. [実装の詳細解説](#実装の詳細解説)
6. [ファイル別詳細説明](#ファイル別詳細説明)

## 認証とは何か？

**認証（Authentication）** とは、「あなたは誰ですか？」を確認することです。

### 日常生活での例
- 銀行のATMでキャッシュカードと暗証番号を入力する
- スマートフォンの指紋認証や顔認証
- 家の鍵で扉を開ける

### Webアプリケーションでの認証
- ユーザー名とパスワードでログイン
- Googleアカウントでログイン
- **匿名認証**（今回の実装）

## なぜ認証が必要なのか？

### Speed-Riddleアプリでの理由

1. **個人の記録を保存するため**
   ```
   ユーザーA: 謎解き1を30秒で解いた
   ユーザーB: 謎解き1を45秒で解いた
   → どちらがどの記録か区別する必要がある
   ```

2. **ランキング機能のため**
   ```
   1位: Anonymous-abc123 (30秒)
   2位: Anonymous-def456 (45秒)
   → 各ユーザーを識別する必要がある
   ```

3. **謎解きの投稿者を特定するため**
   ```
   この謎解きは誰が作ったか？
   → 投稿者を記録する必要がある
   ```

## 匿名認証とは？

### 通常の認証 vs 匿名認証

| 通常の認証 | 匿名認証 |
|------------|----------|
| メールアドレス + パスワード | 自動でIDを生成 |
| 個人情報が必要 | 個人情報不要 |
| アカウント登録が面倒 | すぐに使える |

### 匿名認証の仕組み

```
1. ユーザーがサイトにアクセス
2. システムが自動的にユニークなIDを生成
   例: "anonymous_1234567890_abc123"
3. そのIDで「Anonymous-abc123」という名前を作成
4. ユーザーはすぐに謎解きを始められる
```

### 具体的な例

```javascript
// システムが自動生成する情報
{
  id: "anonymous_1699123456_abc123",
  name: "Anonymous-abc123",
  isAnonymous: true
}
```

## NextAuth.js の役割

NextAuth.jsは、Webアプリケーションに認証機能を簡単に追加できるライブラリです。

### NextAuth.jsが無い場合
```javascript
// 自分で全部書く必要がある（大変！）
function login(username, password) {
  // ユーザー情報をチェック
  // セッションを作成
  // セキュリティ対策
  // ... 数百行のコード
}
```

### NextAuth.jsがある場合
```javascript
// 設定だけで認証機能が完成！
export const authOptions = {
  providers: [/* 認証方法の設定 */],
  callbacks: {/* ログイン後の処理 */}
}
```

## 実装の詳細解説

### 1. 認証設定（`lib/auth.ts`）

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'anonymous',           // 認証方法の名前
      name: 'Anonymous',         // 表示名
      type: 'credentials',       // 認証の種類
      credentials: {},           // 入力項目（空 = 何も入力不要）
      async authorize() {        // 認証処理
        const anonymousId = uuidv4()  // ユニークなIDを生成
        return {
          id: anonymousId,
          name: `Anonymous-${anonymousId.slice(0, 8)}`,
          isAnonymous: true,
        }
      },
    },
  ],
  // ... その他の設定
}
```

**解説:**
- `uuidv4()`: 世界でユニークなIDを生成する関数
- `authorize()`: 実際の認証処理を行う関数
- 戻り値: ユーザー情報オブジェクト

### 2. APIルート（`app/api/auth/[...nextauth]/route.ts`）

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

**解説:**
- Next.js 13以降のAPI Routes形式
- `[...nextauth]`は動的ルート（複数のパスを受け取る）
- `/api/auth/signin`, `/api/auth/signout` などが自動生成される

### 3. 匿名認証ページ（`app/auth/anonymous/page.tsx`）

```typescript
export default function AnonymousAuthPage() {
  const router = useRouter()
  
  useEffect(() => {
    const handleAnonymousSignIn = async () => {
      const result = await signIn('anonymous', {
        redirect: false,  // ページ遷移しない
        callbackUrl,      // 認証後の移動先
      })
      
      if (result?.ok) {
        router.push(callbackUrl)  // 成功時は指定ページへ
      }
    }
    
    handleAnonymousSignIn()
  }, [])
  
  return <div>認証中...</div>  // ローディング表示
}
```

**解説:**
- `useEffect`: ページが表示された時に自動実行
- `signIn('anonymous')`: NextAuth.jsの匿名認証を実行
- `router.push()`: プログラムでページ遷移

## ファイル別詳細説明

### 認証関連ファイル

#### `lib/auth.ts` - 認証の設定
```
役割: NextAuth.jsの設定ファイル
内容: 匿名認証の方法、セッション設定、コールバック関数
```

#### `lib/auth-utils.ts` - 認証のヘルパー関数
```typescript
// サーバーサイドでセッション情報を取得
export async function getSessionInfo(): Promise<SessionInfo | null>

// 認証が必要なAPIで使用
export async function requireAuth(): Promise<SessionInfo>

// 匿名ユーザーのID生成
export function generateAnonymousId(): string
```

#### `hooks/use-auth.ts` - 認証用カスタムフック
```typescript
export function useAuth() {
  return {
    isAuthenticated: boolean,  // ログイン済みか？
    isLoading: boolean,        // 認証処理中か？
    user: User | null,         // ユーザー情報
    signInAnonymously: () => Promise<void>,  // 匿名ログイン
    signOut: () => Promise<void>,            // ログアウト
  }
}
```

### 型定義ファイル

#### `types/auth.ts` - 認証関連の型定義
```typescript
// セッション情報の型
export interface SessionInfo {
  userId: string
  isAnonymous: boolean
  name: string | null
}

// 認証状態の型
export interface AuthState {
  isAuthenticated: boolean
  session: SessionInfo | null
  isLoading: boolean
}
```

### APIルート

#### `app/api/auth/session/route.ts` - セッション情報API
```
GET /api/auth/session  → 現在のセッション情報を取得
POST /api/auth/session → セッション情報を更新
```

#### `app/api/auth/anonymous/route.ts` - 匿名ユーザーAPI
```
GET /api/auth/anonymous   → 匿名ユーザー情報を取得
POST /api/auth/anonymous  → 新しい匿名ユーザーを作成
```

### ミドルウェア

#### `middleware.ts` - アクセス制御
```typescript
export default withAuth(function middleware(req) {
  const { pathname } = req.nextUrl
  
  // 謎解き解答時には認証が必要
  if (pathname.includes('/solve')) {
    if (!token) {
      // 未認証なら匿名認証ページへリダイレクト
      return NextResponse.redirect('/auth/anonymous')
    }
  }
})
```

**解説:**
- 特定のページにアクセスした時の処理を定義
- 認証が必要なページで未認証の場合、自動的に認証ページへ誘導

## 実際の動作フロー

### 1. ユーザーが謎解きページにアクセス

```
1. ユーザー: "謎解きを始めたい！"
2. ブラウザ: /puzzles/1/solve にアクセス
3. ミドルウェア: "認証が必要だけど、まだログインしてない"
4. ミドルウェア: /auth/anonymous にリダイレクト
```

### 2. 自動的な匿名認証

```
1. 匿名認証ページが表示
2. useEffect: 自動的にsignIn('anonymous')を実行
3. NextAuth.js: UUIDを生成して匿名ユーザーを作成
4. 認証完了: 元のページ（/puzzles/1/solve）にリダイレクト
```

### 3. 認証後の状態

```
ブラウザに保存される情報:
{
  user: {
    id: "anonymous_1699123456_abc123",
    name: "Anonymous-abc123",
    isAnonymous: true
  },
  expires: "2024-01-01T00:00:00.000Z"
}
```

### 4. 謎解き実行時

```
1. ユーザーが解答を送信
2. API: /api/puzzles/1/answer にPOST
3. サーバー: セッション情報を確認
4. サーバー: "Anonymous-abc123" として記録を保存
5. レスポンス: 正解/不正解の結果を返す
```

## まとめ

このPR #3で実装した認証システムは：

1. **ユーザーの手間を最小化**
   - アカウント登録不要
   - 自動的な匿名認証

2. **技術的な基盤を構築**
   - NextAuth.jsによる安全な認証
   - 型安全なTypeScript実装
   - 再利用可能なヘルパー関数

3. **将来の機能拡張に対応**
   - Google認証やTwitter認証の追加が簡単
   - ユーザー管理機能の拡張が可能

これにより、ユーザーは面倒な登録作業なしに、すぐに謎解きを楽しめるようになります！