# 状態管理解説 - 初学者向けガイド

## 目次
1. [状態管理とは何か？](#状態管理とは何か)
2. [なぜ状態管理が必要なのか？](#なぜ状態管理が必要なのか)
3. [Zustandとは？](#zustandとは)
4. [実装の詳細解説](#実装の詳細解説)
5. [具体的な使用例](#具体的な使用例)

## 状態管理とは何か？

**状態（State）** とは、アプリケーションが覚えておく情報のことです。

### 日常生活での例
- **テレビのリモコン**: 現在のチャンネル、音量
- **エアコン**: 設定温度、運転モード（冷房/暖房）
- **スマートフォン**: バッテリー残量、Wi-Fi接続状態

### Webアプリケーションでの状態
- **ユーザー情報**: ログイン状態、ユーザー名
- **画面の状態**: ローディング中、エラー表示
- **データ**: ショッピングカートの中身、検索結果

## なぜ状態管理が必要なのか？

### Speed-Riddleアプリでの具体例

#### 1. ログイン状態の管理

```javascript
// 問題: 複数のページで同じ情報が必要
ヘッダー → "Anonymous-abc123さん、こんにちは"
謎解きページ → "Anonymous-abc123として記録されます"
ランキングページ → "Anonymous-abc123の順位は..."
```

**状態管理なしの場合:**
```javascript
// 各ページで個別に情報を取得（非効率）
function Header() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/auth/session').then(/*...*/)  // API呼び出し
  }, [])
}

function PuzzlePage() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch('/api/auth/session').then(/*...*/)  // 同じAPI呼び出し
  }, [])
}
```

**状態管理ありの場合:**
```javascript
// 一箇所で管理、どこからでもアクセス可能
function Header() {
  const { user } = useAuth()  // すぐに使える
}

function PuzzlePage() {
  const { user } = useAuth()  // すぐに使える
}
```

#### 2. 謎解きセッションの管理

```javascript
// 謎解き中に覚えておく必要がある情報
{
  currentQuestionIndex: 2,      // 現在3問目
  startedAt: "2024-01-01...",   // 開始時刻
  answers: ["答え1", "答え2", ""], // これまでの解答
  segmentTimes: [30000, 45000, 0] // 各問題にかかった時間（ミリ秒）
}
```

この情報は：
- **謎解きページ**: 現在の問題を表示
- **タイマーコンポーネント**: 経過時間を計算
- **進捗バー**: 何問目/全問数を表示
- **リザルトページ**: 最終結果を表示

すべてのコンポーネントで同じ情報を共有する必要があります。

## Zustandとは？

Zustandは、React用の軽量な状態管理ライブラリです。

### 他の状態管理ライブラリとの比較

| ライブラリ | 設定の複雑さ | 学習コスト | ファイルサイズ |
|------------|--------------|------------|----------------|
| Redux | 複雑 | 高い | 大きい |
| Context API | 中程度 | 中程度 | なし（React内蔵） |
| **Zustand** | **簡単** | **低い** | **小さい** |

### Zustandの特徴

```javascript
// とてもシンプルな設定
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))

// 使うのも簡単
function Counter() {
  const { count, increment } = useStore()
  return <button onClick={increment}>{count}</button>
}
```

## 実装の詳細解説

### 1. 認証ストア（`store/auth-store.ts`）

```typescript
interface AuthStore extends AuthState {
  // 状態（データ）
  isAuthenticated: boolean      // ログイン済みか？
  session: SessionInfo | null   // ユーザー情報
  isLoading: boolean           // 処理中か？
  
  // アクション（状態を変更する関数）
  setSession: (session: SessionInfo | null) => void
  clearSession: () => void
  signInAnonymously: () => Promise<void>
  signOut: () => Promise<void>
}
```

#### 状態の変化パターン

```javascript
// 初期状態
{
  isAuthenticated: false,
  session: null,
  isLoading: false
}

// ログイン処理中
{
  isAuthenticated: false,
  session: null,
  isLoading: true  ← 変化
}

// ログイン完了
{
  isAuthenticated: true,      ← 変化
  session: {                  ← 変化
    userId: "anonymous_123",
    name: "Anonymous-123",
    isAnonymous: true
  },
  isLoading: false           ← 変化
}
```

#### 永続化機能

```typescript
persist(
  (set, get) => ({
    // ストアの定義
  }),
  {
    name: 'auth-storage',  // localStorageのキー名
    partialize: (state) => ({
      session: state.session,           // これだけ保存
      isAuthenticated: state.isAuthenticated,
    }),
  }
)
```

**解説:**
- `persist`: ブラウザを閉じても状態を保持
- `partialize`: 保存する項目を選択（isLoadingは保存しない）
- ブラウザリロード時に状態が復元される

### 2. 謎解きストア（`store/puzzle-store.ts`）

```typescript
interface PuzzleSession {
  id: string                    // セッションID
  puzzleId: string             // 謎解きID
  startedAt: Date              // 開始時刻
  currentQuestionIndex: number  // 現在の問題番号
  totalQuestions: number       // 全問題数
  segmentTimes: number[]       // 各問題の時間
  answers: string[]            // 各問題の解答
  isCompleted: boolean         // 完了フラグ
}
```

#### セッション開始時の処理

```typescript
startSession: (puzzleId, totalQuestions) => {
  const sessionId = `session_${Date.now()}_${Math.random()...}`
  
  set({
    currentSession: {
      id: sessionId,
      puzzleId,
      startedAt: new Date(),
      currentQuestionIndex: 0,                    // 1問目から
      totalQuestions,
      segmentTimes: new Array(totalQuestions).fill(0), // [0,0,0,...]
      answers: new Array(totalQuestions).fill(''),     // ['','','',...]
      isCompleted: false,
    }
  })
}
```

#### 解答更新時の処理

```typescript
updateAnswer: (answer) => {
  const session = get().currentSession
  const newAnswers = [...session.answers]       // 配列をコピー
  newAnswers[session.currentQuestionIndex] = answer  // 現在の問題の解答を更新
  
  set({
    currentSession: {
      ...session,        // 他の項目はそのまま
      answers: newAnswers // 解答だけ更新
    }
  })
}
```

### 3. カスタムフック（`hooks/use-auth.ts`）

```typescript
export function useAuth() {
  const { data: session, status } = useSession()  // NextAuth.jsのフック
  const { 
    isAuthenticated, 
    session: storeSession, 
    setSession, 
    clearSession 
  } = useAuthStore()  // Zustandのフック
  
  // NextAuth.jsとZustandの状態を同期
  useEffect(() => {
    if (session?.user) {
      const sessionInfo = {
        userId: session.user.id,
        isAnonymous: session.user.isAnonymous,
        name: session.user.name,
      }
      setSession(sessionInfo)  // Zustandに保存
    }
  }, [session])
  
  return {
    isAuthenticated,
    user: session?.user || null,
    // ... その他
  }
}
```

**解説:**
- NextAuth.jsとZustandの橋渡し役
- NextAuth.jsのセッション情報をZustandに同期
- コンポーネントで使いやすい形で情報を提供

## 具体的な使用例

### 1. ヘッダーコンポーネントでの使用

```typescript
function Header() {
  const { isAuthenticated, user, signOut } = useAuth()
  
  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>こんにちは、{user.name}さん</span>
          <button onClick={signOut}>ログアウト</button>
        </div>
      ) : (
        <div>ゲストユーザー</div>
      )}
    </header>
  )
}
```

### 2. 謎解きページでの使用

```typescript
function PuzzlePage() {
  const { currentSession, updateAnswer, nextQuestion } = usePuzzleStore()
  const [inputAnswer, setInputAnswer] = useState('')
  
  const handleSubmit = () => {
    updateAnswer(inputAnswer)        // ストアに解答を保存
    
    // 正解チェック後
    if (isCorrect) {
      nextQuestion()                 // 次の問題へ
    }
  }
  
  if (!currentSession) {
    return <div>セッションが見つかりません</div>
  }
  
  return (
    <div>
      <h2>問題 {currentSession.currentQuestionIndex + 1} / {currentSession.totalQuestions}</h2>
      <img src={questionImage} />
      <input 
        value={inputAnswer}
        onChange={(e) => setInputAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>解答</button>
    </div>
  )
}
```

### 3. 進捗表示コンポーネント

```typescript
function ProgressBar() {
  const { currentSession } = usePuzzleStore()
  
  if (!currentSession) return null
  
  const progress = (currentSession.currentQuestionIndex / currentSession.totalQuestions) * 100
  
  return (
    <div>
      <div style={{ width: `${progress}%`, backgroundColor: 'blue' }} />
      <span>{currentSession.currentQuestionIndex} / {currentSession.totalQuestions}</span>
    </div>
  )
}
```

### 4. タイマーコンポーネント

```typescript
function Timer() {
  const { currentSession, recordSegmentTime } = usePuzzleStore()
  const [elapsedTime, setElapsedTime] = useState(0)
  
  useEffect(() => {
    if (!currentSession) return
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - new Date(currentSession.startedAt).getTime()
      setElapsedTime(elapsed)
    }, 100)  // 100msごとに更新
    
    return () => clearInterval(interval)
  }, [currentSession])
  
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const milliseconds = Math.floor((ms % 1000) / 10)
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`
  }
  
  return <div>経過時間: {formatTime(elapsedTime)}</div>
}
```

## 状態管理の利点まとめ

### 1. データの一元管理
```javascript
// 一箇所で管理
const authStore = {
  user: "Anonymous-abc123",
  isAuthenticated: true
}

// どこからでもアクセス可能
Header → authStore.user
PuzzlePage → authStore.user
RankingPage → authStore.user
```

### 2. 状態の同期
```javascript
// ログアウトボタンを押すと
signOut() // authStoreが更新される

// 自動的に全てのコンポーネントが再レンダリング
Header → "ゲストユーザー" に変更
PuzzlePage → ログインページにリダイレクト
```

### 3. 永続化
```javascript
// ブラウザを閉じても情報が保持される
localStorage.setItem('auth-storage', JSON.stringify({
  session: { ... },
  isAuthenticated: true
}))

// 次回アクセス時に自動復元
useAuthStore.getState() // 前回の状態を取得
```

### 4. パフォーマンス向上
```javascript
// API呼び出しは1回だけ
useAuth() // 初回のみAPI呼び出し

// 他のコンポーネントは保存済みデータを使用
useAuth() // キャッシュされたデータを即座に返す
```

このように、状態管理により効率的で保守性の高いアプリケーションを構築できます！