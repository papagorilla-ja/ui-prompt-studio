export type PlatformType = 'web' | 'desktop'
export type ThemeMode = 'dark' | 'light'

export type DesignSystemType =
  | 'bento'
  | 'brutalism'
  | 'minimal'
  | 'retrofuturistic'
  | 'glassmorphism'

export type OutputTechStack =
  | 'react-tailwind'
  | 'vue-tailwind'
  | 'html-vanilla'
  | 'nextjs-shadcn'

export interface RulesConfig {
  gap: number           // グリッド間隔 (px)
  padding: number       // 内側余白 (px)
  borderRadius: number  // 角丸半径 (px: 0, 4, 8, 12, 16, 24, 32, 9999)
  borderWidth: number   // 境界線幅 (px: 0, 1, 2, 3)
  h1Size: string        // 見出しサイズ (例: "3.5rem" / "56px")
  h1Weight: number      // 見出しウェイト (例: 800)
  bodySize: string      // 本文サイズ (例: "1rem" / "16px")
  maxWidth: string      // コンテンツ最大幅 (例: "1280px", "1440px", "100%")
}

export interface ColorsConfig {
  base: string          // メイン背景色 (#HEX)
  surface: string       // コンポーネント背景色 (#HEX)
  primaryText: string   // 主要テキスト色 (#HEX)
  secondaryText: string // 副次的テキスト色 (#HEX)
  accent: string        // アクセントカラー (#HEX: 3%制限ルール適用)
  border: string        // ボーダー色 (#HEX)
}

export interface ComponentsConfig {
  // ウィンドウ・ナビゲーション
  titlebar: boolean     // デスクトップ用カスタムタイトルバー
  sidebar: boolean      // サイドバーナビゲーション
  navbar: boolean       // グローバルナビゲーションバー
  profileArea: boolean  // ユーザーアカウント/プロフィールエリア
  // ヘッダー・キービジュアル
  contextHeader: boolean// コンテキストヘッダー（検索・パンくず）
  heroSection: boolean  // ヒーローセクション
  // メインコンテンツ
  bentoContainer: boolean // Bento Grid コンテナ
  statCards: boolean    // 統計数値カード（巨大数字・トレンド矢印）
  charts: boolean       // インタラクティブチャート
  activityTable: boolean// アクティビティログテーブル
  // 入力・操作
  minimalForm: boolean  // ミニマル入力フォーム
  actionButtons: boolean// アクションボタン群
  // フッター
  statusBar: boolean    // ステータスバー
}

export interface AppConfig {
  version: number
  platform: PlatformType
  themeMode: ThemeMode
  designSystem: DesignSystemType
  rules: RulesConfig
  colors: ColorsConfig
  components: ComponentsConfig
  customPurpose: string
  outputTechStack: OutputTechStack
}

export interface SavedPreset {
  id: string
  name: string
  createdAt: number
  config: AppConfig
}

export interface DesignSystemMeta {
  id: DesignSystemType
  name: string
  subtitle: string
  description: string
  defaultRules: RulesConfig
  defaultColors: ColorsConfig
  defaultLightColors: ColorsConfig
}
