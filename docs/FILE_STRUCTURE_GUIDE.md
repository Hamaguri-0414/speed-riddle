# ファイル構成ガイド - 初学者向け

## 目次
1. [全体のファイル構成](#全体のファイル構成)
2. [ディレクトリ別詳細説明](#ディレクトリ別詳細説明)
3. [各ファイルの詳細説明](#各ファイルの詳細説明)
4. [ファイル間の関係性](#ファイル間の関係性)

## 全体のファイル構成

```
speed-riddle/
├── 📁 app/                          # Next.js App Router（ページとAPI）
│   ├── 📁 api/                      # バックエンドAPI
│   │   └── 📁 auth/                 # 認証関連API
│   │       ├── 📁 [...nextauth]/    # NextAuth.jsのAPI
│   │       ├── 📁 anonymous/        # 匿名ユーザー管理API
│   │       └── 📁 session/          # セッション管理API
│   └── 📁 auth/                     # 認証関連ページ
│       └── 📁 anonymous/            # 匿名認証ページ
├── 📁 components/                   # 再利用可能なUIコンポーネント
│   └── 📁 providers/                # Context・Provider系
├── 📁 docs/                         # ドキュメント（今作成中）
├── 📁 hooks/                        # カスタムフック
├── 📁 lib/                          # ユーティリティ関数・設定
├── 📁 store/                        # 状態管理（Zustand）
├── 📁 types/                        # TypeScript型定義
├── 📄 middleware.ts                 # Next.jsミドルウェア
├── 📄 .env.example                  # 環境変数のサンプル
└── 📄 README.md                     # プロジェクト概要
```

## ディレクトリ別詳細説明

### 📁 `app/` - Next.js App Router

Next.js 13以降の新しいルーティングシステムです。

```
app/
├── api/          # サーバーサイドAPI（バックエンド）
└── (pages)/      # フロントエンドページ（将来実装）
```

**特徴:**
- フォルダ名がURLパスになる
- `page.tsx` がそのパスのページになる
- `route.ts` がAPIエンドポイントになる

**例:**
```
app/auth/anonymous/page.tsx → /auth/anonymous ページ
app/api/auth/session/route.ts → /api/auth/session API
```

### 📁 `app/api/` - バックエンドAPI

サーバーサイドで動作するAPI群です。

```
api/
└── auth/                    # 認証関連のAPI
    ├── [...nextauth]/       # NextAuth.jsの自動生成API
    ├── anonymous/           # 匿名ユーザー管理
    └── session/             # セッション情報管理
```

**役割:**
- フロントエンドからのリクエストを処理
- データベースとの連携（将来実装）
- 認証・認可の処理

### 📁 `components/` - UIコンポーネント

再利用可能なReactコンポーネントを格納します。

```
components/
└── providers/               # Context・Provider系
    └── auth-provider.tsx    # 認証プロバイダー
```

**将来追加予定:**
```
components/
├── ui/                      # 基本UIコンポーネント
│   ├── button.tsx
│   ├── input.tsx
│   └── modal.tsx
├── puzzle/                  # 謎解き関連コンポーネント
│   ├── puzzle-card.tsx
│   ├── timer.tsx
│   └── progress-bar.tsx
└── layout/                  # レイアウト関連
    ├── header.tsx
    └── footer.tsx
```

### 📁 `hooks/` - カスタムフック

Reactの再利用可能なロジックを格納します。

```
hooks/
└── use-auth.ts              # 認証関連のロジック
```

**カスタムフックとは:**
- Reactのフック（useState, useEffectなど）を組み合わせた関数
- コンポーネント間でロジックを共有する仕組み

### 📁 `lib/` - ユーティリティ関数・設定

プロジェクト全体で使用する共通機能を格納します。

```
lib/
├── auth.ts                  # NextAuth.jsの設定
├── auth-utils.ts            # 認証関連のヘルパー関数
└── session-utils.ts         # セッション管理のヘルパー関数
```

### 📁 `store/` - 状態管理

Zustandを使用したグローバル状態管理を格納します。

```
store/
├── auth-store.ts            # 認証状態の管理
└── puzzle-store.ts          # 謎解きセッションの管理
```

### 📁 `types/` - TypeScript型定義

TypeScriptの型定義を格納します。

```
types/
├── auth.ts                  # 認証関連の型
└── store.ts                 # ストア・データ関連の型
```

## 各ファイルの詳細説明

### 認証システム関連

#### `lib/auth.ts` - NextAuth.js設定ファイル
```typescript
// 役割: 認証方法の設定
export const authOptions: NextAuthOptions = {
  providers: [/* 認証プロバイダーの設定 */],
  callbacks: {/* 認証後の処理 */},
  // ...
}
```

#### `app/api/auth/[...nextauth]/route.ts` - NextAuth.js APIルート
```typescript
// 役割: NextAuth.jsの自動生成API
// 生成されるエンドポイント:
// - GET/POST /api/auth/signin
// - GET/POST /api/auth/signout
// - GET/POST /api/auth/callback
// - GET /api/auth/session
```

#### `hooks/use-auth.ts` - 認証カスタムフック
```typescript
// 役割: 認証ロジックの共通化
export function useAuth() {
  return {
    isAuthenticated: boolean,    // ログイン状態
    user: User | null,          // ユーザー情報
    signInAnonymously: Function, // 匿名ログイン
    signOut: Function,          // ログアウト
  }
}
```

#### `store/auth-store.ts` - 認証状態管理
```typescript
// 役割: 認証状態のグローバル管理
interface AuthStore {
  isAuthenticated: boolean,
  session: SessionInfo | null,
  setSession: Function,
  clearSession: Function,
  // ...
}
```

### セッション管理関連

#### `store/puzzle-store.ts` - 謎解きセッション管理
```typescript
// 役割: 謎解き進行状況の管理
interface PuzzleStore {
  currentSession: PuzzleSession | null,
  startSession: Function,
  updateAnswer: Function,
  nextQuestion: Function,
  // ...
}
```

#### `lib/session-utils.ts` - セッション関連ヘルパー
```typescript
// 役割: セッション操作の共通関数
export function calculateElapsedTime(startTime: string): number
export function formatTime(milliseconds: number): string
export function validateSession(session: PuzzleSession): boolean
```

### ミドルウェア・セキュリティ

#### `middleware.ts` - Next.jsミドルウェア
```typescript
// 役割: リクエストの前処理・認証チェック
export default withAuth(function middleware(req) {
  // 認証が必要なページへのアクセス制御
  // 未認証時の自動リダイレクト
})
```

### 型定義関連

#### `types/auth.ts` - 認証関連型定義
```typescript
// 役割: 認証に関する型の定義
interface SessionInfo {
  userId: string
  isAnonymous: boolean
  name: string | null
}
```

#### `types/store.ts` - データ関連型定義
```typescript
// 役割: データ構造の型定義
interface PuzzleSession {
  id: string
  puzzleId: string
  startedAt: string
  // ...
}
```

## ファイル間の関係性

### 1. 認証フロー

```
ユーザーアクセス
       ↓
middleware.ts（認証チェック）
       ↓
app/auth/anonymous/page.tsx（匿名認証ページ）
       ↓
hooks/use-auth.ts（認証ロジック）
       ↓
lib/auth.ts（認証設定）
       ↓
app/api/auth/[...nextauth]/route.ts（API処理）
       ↓
store/auth-store.ts（状態保存）
```

### 2. データの流れ

```
UI Component
    ↓ (ユーザー操作)
Custom Hook (hooks/)
    ↓ (ビジネスロジック)
Store (store/)
    ↓ (状態更新)
API Route (app/api/)
    ↓ (データ処理)
Database（将来実装）
```

### 3. 型定義の活用

```
types/ (型定義)
    ↓ (型を提供)
store/ (状態管理)
    ↓ (型安全な状態)
hooks/ (カスタムフック)
    ↓ (型安全なAPI)
Components (UIコンポーネント)
```

### 4. ユーティリティ関数の活用

```
lib/ (ユーティリティ関数)
    ↓ (共通処理)
Multiple Files (複数のファイル)
    - store/
    - hooks/
    - components/
    - app/api/
```

## 設定ファイル

### `.env.example` - 環境変数サンプル
```bash
# 役割: 必要な環境変数の例を示す
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
DATABASE_URL=postgresql://...
```

### `README.md` - プロジェクト概要
```markdown
# 役割: プロジェクトの説明・セットアップ方法
- 概要
- 技術スタック
- インストール方法
- 実装状況
```

## ファイル命名規則

### ディレクトリ名
- **ケバブケース**: `auth-store.ts`, `session-utils.ts`
- **単数形**: `component/`, `hook/`, `lib/`

### ファイル名
- **コンポーネント**: PascalCase `AuthProvider.tsx`
- **フック**: camelCase `use-auth.ts`
- **ユーティリティ**: kebab-case `auth-utils.ts`
- **型定義**: kebab-case `auth.ts`

### 変数・関数名
- **変数**: camelCase `isAuthenticated`
- **関数**: camelCase `signInAnonymously`
- **コンポーネント**: PascalCase `AuthProvider`
- **型**: PascalCase `SessionInfo`

この構成により、機能ごとに整理された保守性の高いコードベースを実現しています！