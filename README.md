# Speed-Riddle

謎解きスピード競争サイト

## 概要

Speed-Riddleは、謎解きを解いたスピードを競うことを目的とした謎解き出題サイトです。
ユーザーは謎解きに挑戦し、タイムを競うことができます。また、独自の謎解きを作成・投稿することも可能です。

## 技術スタック

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **状態管理**: Zustand
- **認証**: NextAuth.js
- **データベース**: PostgreSQL + Prisma ORM
- **画像ストレージ**: Cloudinary / AWS S3
- **キャッシュ**: Redis (Upstash)
- **ホスティング**: Vercel

## 開発セットアップ

### 前提条件

- Node.js 18.x以上
- pnpm
- PostgreSQL
- Redis

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/speed-riddle.git
cd speed-riddle

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
# .env.localを編集して適切な値を設定

# データベースのセットアップ（PR #2で実装予定）
pnpm prisma migrate dev
pnpm prisma generate

# 開発サーバーの起動
pnpm dev
```

### 利用可能なコマンド

```bash
# 開発サーバーの起動
pnpm dev

# 本番用ビルド
pnpm build

# 本番サーバーの起動
pnpm start

# リンターの実行
pnpm lint

# 型チェック
pnpm type-check

# テストの実行
pnpm test

# データベース操作
pnpm prisma studio
pnpm prisma migrate dev
```

## 実装状況

### 完了済み機能

- [x] 認証・状態管理システム（PR #3）
  - NextAuth.js匿名認証
  - Zustand状態管理
  - セッション管理ミドルウェア

- [x] 謎解き一覧画面（PR #4）
  - 謎解き一覧表示UI
  - 謎解きカードコンポーネント
  - レスポンシブデザイン
  - モックデータによる動作確認

### 実装予定機能

- [ ] プロジェクト基盤（PR #1）
- [ ] データベース設計（PR #2）
- [ ] 謎解き開始前画面（PR #5）
- [ ] 謎解き画面の基本実装（PR #6）
- [ ] 謎解き解答システム（PR #7）
- [ ] リザルト画面とランキング機能（PR #8）
- [ ] 謎解き出題機能（PR #9-11）
- [ ] 最適化とテスト（PR #12）

詳細な実装計画は `IMPLEMENTATION_PLAN.md` を参照してください。

## プロジェクト構造

```
speed-riddle/
├── app/                  # Next.js App Router
│   ├── api/             # API Routes
│   ├── auth/            # 認証関連ページ
│   └── ...
├── components/          # Reactコンポーネント
│   └── providers/       # Context Providers
├── hooks/              # カスタムフック
├── lib/                # ユーティリティ関数
├── store/              # Zustandストア
├── types/              # TypeScript型定義
├── middleware.ts       # Next.jsミドルウェア
└── ...
```

## 貢献

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

MIT License