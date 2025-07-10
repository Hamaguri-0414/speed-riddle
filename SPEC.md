# 仕様書
speed-riddleプロジェクトは謎解きを解いたスピードを競うことを目的とした謎解き出題サイトです。

## 機能要件
モダンなデザインで以下のような機能を備えています。
- 謎解き出題機能(優先度・高)
    - 謎解き一覧画面
        - 挑戦できる謎解きが一覧になっています。
        - サムネイルと説明文、挑戦するボタン、ランキングボタンが各リストにあります。
        - ヘッダーには謎解きを出題するボタンがあり、こちらを押すことで謎解き出題機能側の画面に遷移します。
    - 謎解き開始前画面
        - 謎解き一覧画面の挑戦するボタンを押すことでこの画面に遷移します。
        - サムネイルと説明文、スタートボタンのみが表示されています。
    - 謎解き画面
        - 全体の問題数分のどこまで進行したかの数値、経過した時間、謎の画像、解答方法の指定（ひらがな、カタカナ、漢字など、複数設定可能）、解答入力欄、送信ボタンがあります。
        - 解答を入力し、エンターを押すか送信ボタンを押すことで正誤判定がされます。
        - 生後判定時、正解であれば正解表示がされたあとに次の問題があれば次の問題が表示されます。最後の問題であればリザルト画面に遷移します。
    - リザルト画面
        - トータルでかかった時間、セグメント（問題ごと）の経過時間、トータルとセグメントそれぞれで全体分の何位なのか表示されます。
        - ランキングに対して、投稿する名前を入力する欄と、匿名で投稿する、名前を出して投稿するのどちらかのボタンを押します。押されずにセッションが切れた場合は匿名で投稿されたものとして扱われます。
    - ランキング画面
        - リザルト画面から遷移します。各ユーザーのランキング状況が確認できます。
        - 謎解き一覧画面に戻るボタンを押すことで謎解き一覧画面に戻ります。
- 謎解き出題機能(優先度・高)
    - 謎解き出題画面
        - 謎解きを出題することができます。こちらで登録した謎が謎解き一覧画面に表示されます。
        - サムネイルの設定、説明文の設定、謎解きの設定（後述）ができます。
        - 謎解きの設定
            - プラスボタンを押す度に1問謎を設定する項目が追加されます。以下の項目があり、それぞれを埋める必要があります。
                - 謎の画像
                - 謎の答え（1つ以上、複数解設定可能）
        - 投稿するボタンを押すことで投稿することができます。

## 技術選定

### フロントエンド技術
- **フレームワーク**: Next.js 14 (App Router)
  - 理由: SSR/SSGによるSEO対策、高速なページ遷移、型安全性
- **言語**: TypeScript
  - 理由: 型安全性による開発効率向上、バグの早期発見
- **UIライブラリ**: React 18
  - 理由: コンポーネントベースの開発、豊富なエコシステム
- **スタイリング**: Tailwind CSS + shadcn/ui
  - 理由: モダンなデザインの実現、開発速度の向上、一貫性のあるUI
- **状態管理**: Zustand
  - 理由: シンプルなAPI、TypeScript対応、パフォーマンス最適化
- **フォーム管理**: React Hook Form + Zod
  - 理由: バリデーション処理の簡潔化、型安全なスキーマ定義

### バックエンド技術
- **APIフレームワーク**: Next.js API Routes
  - 理由: フロントエンドとの統合、型共有の容易さ
- **認証**: NextAuth.js (Auth.js)
  - 理由: セッション管理、匿名ユーザー対応、OAuth対応可能
- **画像アップロード**: Cloudinary または AWS S3
  - 理由: 画像最適化、CDN配信、セキュアなアップロード
- **リアルタイム機能**: Pusher または Socket.io
  - 理由: ランキング更新のリアルタイム反映（将来実装）

### データベース・インフラ
- **データベース**: PostgreSQL + Prisma ORM
  - 理由: リレーショナルデータの管理、型安全なクエリ、マイグレーション管理
- **キャッシュ**: Redis (Upstash)
  - 理由: ランキングの高速化、セッション管理
- **ホスティング**: Vercel
  - 理由: Next.jsとの親和性、自動デプロイ、エッジ配信
- **データベースホスティング**: Supabase または PlanetScale
  - 理由: マネージドサービス、スケーラビリティ、開発者体験

### 開発環境・ツール
- **パッケージマネージャー**: pnpm
  - 理由: 高速インストール、ディスク効率
- **コード品質**:
  - ESLint: コード規約の統一
  - Prettier: コードフォーマット
  - Husky + lint-staged: pre-commitフック
- **テスト**:
  - Vitest: ユニットテスト
  - Playwright: E2Eテスト
- **CI/CD**: GitHub Actions
  - 理由: 自動テスト、型チェック、デプロイ

### セキュリティ考慮事項
- **画像アップロード**: ファイルサイズ制限、形式検証
- **入力検証**: サーバーサイドでの厳格な検証
- **レート制限**: 謎解き投稿・解答送信の制限
- **CSRF対策**: Next.jsのビルトイン機能を活用
- **XSS対策**: React自動エスケープ、sanitize処理

### パフォーマンス最適化
- **画像最適化**: Next.js Image、WebP変換
- **コード分割**: 動的インポート、遅延読み込み
- **データベースクエリ**: インデックス最適化、N+1問題の回避
- **キャッシュ戦略**: 
  - 静的アセット: ブラウザキャッシュ
  - APIレスポンス: Redisキャッシュ
  - ランキング: 定期更新バッチ

## データモデル設計

### 主要エンティティ
1. **Puzzle（謎解き）**
   - id: UUID
   - title: string
   - description: string
   - thumbnail_url: string
   - created_at: timestamp
   - created_by: string (optional)
   - is_active: boolean

2. **Question（問題）**
   - id: UUID
   - puzzle_id: UUID (FK)
   - order: integer
   - image_url: string
   - answer_format: string[] (ひらがな、カタカナ、漢字など)

3. **Answer（解答）**
   - id: UUID
   - question_id: UUID (FK)
   - correct_answer: string
   - alternative_answers: string[] (別解)

4. **Session（セッション）**
   - id: UUID
   - puzzle_id: UUID (FK)
   - user_name: string (optional)
   - started_at: timestamp
   - completed_at: timestamp (optional)
   - total_time: integer (milliseconds)

5. **SegmentTime（セグメントタイム）**
   - id: UUID
   - session_id: UUID (FK)
   - question_id: UUID (FK)
   - time_spent: integer (milliseconds)
   - attempts: integer

6. **Ranking（ランキング）**
   - id: UUID
   - puzzle_id: UUID (FK)
   - session_id: UUID (FK)
   - user_name: string
   - total_time: integer
   - rank: integer
   - is_anonymous: boolean

## API設計

### エンドポイント一覧
- `GET /api/puzzles` - 謎解き一覧取得
- `GET /api/puzzles/:id` - 謎解き詳細取得
- `POST /api/puzzles` - 謎解き投稿
- `GET /api/puzzles/:id/questions` - 問題一覧取得
- `POST /api/puzzles/:id/start` - セッション開始
- `POST /api/puzzles/:id/answer` - 解答送信
- `GET /api/puzzles/:id/ranking` - ランキング取得
- `POST /api/puzzles/:id/complete` - セッション完了・ランキング登録

## 画面遷移フロー

```
謎解き一覧画面
    ├─> 謎解き開始前画面
    │       └─> 謎解き画面
    │               └─> リザルト画面
    │                       └─> ランキング画面
    │                               └─> 謎解き一覧画面
    └─> 謎解き出題画面
            └─> 謎解き一覧画面
```