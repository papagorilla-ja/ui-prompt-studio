import type { AppConfig, DesignSystemMeta } from '@/types/config'

/**
 * Generates an exhaustive, high-precision Markdown prompt for external AI coding tools
 * (Claude 3.5 Sonnet, ChatGPT o1/4o, Gemini 1.5 Pro, v0, Bolt.new, Cursor).
 */
export function generatePrompt(config: AppConfig, meta: DesignSystemMeta): string {
  const isDesktop = config.platform === 'desktop'

  // 1. Target platform specific details
  const platformName = isDesktop
    ? 'デスクトップアプリケーション (Tauri / Electron / 各種ネイティブフレームワーク)'
    : 'Web アプリケーション (モダンSaaS / クラウドコンソール / レスポンシブWeb)'

  const windowFeatures = isDesktop
    ? '- ウィンドウ特性: フレームレス・カスタムタイトルバー（macOS風信号機ボタン 🔴🟡🟢）、デスクトップ向け高密度（Compact）レイアウト、キーボード操作性（⌘K等のショートカット）を考慮'
    : '- 画面特性: フルレスポンシブWebレイアウト、主要モダンブラウザ（Chrome/Safari/Edge/Firefox）最適化、滑らかなスクロール＆インタラクション'

  // 2. Design System Guidance
  const systemGuidelines: Record<string, string> = {
    minimalism:
      '余計な装飾を徹底的に削ぎ落とし、大胆な余白（Negative Space）と美しいタイポグラフィのジャンプ率で語る洗練された静寂な世界観。境界線は最小限にとどめ、情報の純粋な美しさを引き出してください。',
    bento:
      'AppleやLinearが牽引する現代的モジュラーカード（Bento Grid）レイアウト。情報をグリッド状の角丸タイルに整理し、明確なビジュアル階層と直感的なスキャンしやすさを保ってください。',
    retrofuturism:
      '80〜90年代のサイバーパンク・SF・HUD計器のような近未来感。暗黒空間に走るネオングロー、微細なスキャンライン、情報密度の高いインジケーターを表現してください。',
    glassmorphism:
      '磨りガラスのような透過背景（backdrop-filter: blur）と、微細な1pxホワイトボーダー・インナーシャドウが生み出す多層的な奥行きと浮遊感を演出してください。',
    brutalism:
      '余計なぼかし影やグラデーションを排除し、明確な黒ボーダーとソリッドな高コントラストで表現するタクタイル・ブルータリズム。角丸は0px、無駄のないソリッドな美学を維持してください。',
    kawaii:
      'ぷっくりとした大きな角丸、柔らかなソフトドロップシャドウ、パステルカラー（ピンク・ミント・ラベンダー）が織りなすキュートで親しみやすい世界観。バブル感のあるピル型ボタンや愛らしいマイクロインタラクションを意識してください。',
    gaming:
      '8bit/16bitレトロアーケードやサイバーパンクゲームのHUD・ダッシュボード。直角（ほぼ0px角丸）、発光するネオングロー、ピクセル的枠線、HP/MP風ゲージやゲームスコアを連想させる高揚感のあるインターフェースを構築してください。',
  }

  const guide = systemGuidelines[config.designSystem] || meta.description

  // 3. Components breakdown list
  const compItems: string[] = []
  const c = config.components

  if (isDesktop && c.titlebar) {
    compItems.push('- ウィンドウ上部: カスタムタイトルバー（macOS風 赤・黄・緑 信号機ボタン、アプリタイトル、ウィンドウドラッグ領域）')
  }
  if (c.navbar) {
    compItems.push('- グローバルナビゲーションバー: ブランドロゴ、主要グローバルリンク、クイックアクションボタン')
  }
  if (c.sidebar) {
    const sub = c.profileArea ? '（ナビゲーションリンク群 ＋ 最下部ユーザープロフィール/アカウントカード）' : '（ナビゲーションリンク群）'
    compItems.push(`- サイドバー: 常時表示または折りたたみ可能なサイドナビゲーション ${sub}`)
  }
  if (c.contextHeader) {
    compItems.push('- コンテキストヘッダー: パンくずリスト（階層ナビゲーション）、クイック検索バー（⌘K ショートカット表記付き）')
  }
  if (c.heroSection) {
    compItems.push('- ヒーローセクション: 視線を引きつける洗練された見出しキャッチコピー、簡潔な説明文、プライマリCTAボタン ＋ セカンダリボタン')
  }
  if (c.bentoContainer || c.statCards || c.charts || c.activityTable) {
    const subParts: string[] = []
    if (c.statCards) subParts.push('統計数値カード（巨大タイポグラフィ ＋ トレンド矢印/達成バッジ）')
    if (c.charts) subParts.push('リアルタイム・エリアラインチャート（SVG / 軽量チャート描画）')
    if (c.activityTable) subParts.push('最新アクティビティ履歴テーブル（状態バッジ付き）')
    compItems.push(`- メインコンテンツ (Bento Grid): 12カラム等のモジュラーグリッドコンテナ [${subParts.join(' / ')}]`)
  }
  if (c.minimalForm || c.actionButtons) {
    const formParts: string[] = []
    if (c.minimalForm) formParts.push('ラベル付き入力フィールド・セレクトボックス')
    if (c.actionButtons) formParts.push('主要アクション（デプロイ/保存）ボタン ＋ キャンセルボタン')
    compItems.push(`- 入力・操作エリア: クイック設定フォーム [${formParts.join(' ＋ ')}]`)
  }
  if (c.statusBar) {
    compItems.push('- ウィンドウ/画面最下部: ステータスバー（稼働状況パルスドット「Ready / Operational」、Gitコミットハッシュ、レスポンス速度、エンコーディング）')
  }

  const componentsSection = compItems.length > 0
    ? compItems.join('\n')
    : '- 必要最小限のメインコンテンツカードおよびコンテナ'

  // 4. Tech Stack Quality Guidelines
  const stackGuidelines: Record<string, string> = {
    'React (TSX) + TailwindCSS':
      '- TypeScript型安全性を徹底し、TailwindCSSユーティリティクラス（カスタム値は角括弧またはテーマ拡張で対応）を用いてモジュール分割されたクリーンなReactコンポーネントを出力してください。\n- アイコンには Lucide React または Heroicons を使用してください。',
    'Vue 3 (SFC) + TailwindCSS':
      '- Vue 3 Composition API (`<script setup lang="ts">`) を採用し、TailwindCSSを用いて単一ファイルコンポーネント (SFC) として出力してください。\n- リアクティブな状態管理は `ref` / `computed` を活用してください。',
    'Vanilla HTML + Modern CSS + JS':
      '- 外部フレームワークに依存せず、セマンティックなHTML5、CSSカスタムプロパティ（CSS変数）、モダンなCSS Grid / Flexbox、素のJavaScriptのみで完結する堅牢なコードを出力してください。',
    'Next.js (App Router) + TailwindCSS':
      '- Next.js App Router (Server Components / Client Components `"use client"` の適切な分離) に準拠し、TailwindCSSを用いた本番グレードの構成を出力してください。',
    'SvelteKit + TailwindCSS':
      '- SvelteKitの軽量でリアクティブなコンポーネント構造とTailwindCSSを組み合わせ、無駄のないエレガントなコードを出力してください。',
    'Flutter (Dart)':
      '- Flutterのウィジェットツリー（StatelessWidget / StatefulWidget）に落とし込み、`ThemeData` や `BoxDecoration` を駆使して指定の数値ルール・配色を正確に再現してください。',
    'SwiftUI (macOS/iOS)':
      '- SwiftUIの宣言的構文で記述し、`View` プロトコルに準拠したクリーンな構造、`Color` アセット指定、角丸や余白を再現してください。',
  }

  const stackGuide = stackGuidelines[config.outputTechStack] ||
    `- 指定の技術スタック（${config.outputTechStack}）の最新ベストプラクティスに則り、保守性の高いコードを出力してください。`

  // 5. Construct Markdown Output
  return `# UI実装指示プロンプト

## 1. アプリケーション概要
- ターゲット種別: ${platformName}
- 目的・機能: ${config.customPurpose || '洗練されたモダンUIアプリケーション'}
- 実装コードスタック: ${config.outputTechStack}
${windowFeatures}

## 2. デザインシステム・世界観
- スタイル: ${meta.name} (${meta.subtitle})
- 世界観の指針: ${guide}

## 3. 厳格な数値ルール (Design Tokens)
以下のデザイントークン数値を厳格に遵守し、統一感とリズムのあるUIを構築してください。
- グリッド・レイアウト間隔 (gap): ${config.rules.gap}px
- コンポーネント内側余白 (padding): ${config.rules.padding}px 一律
- 角丸の半径 (border-radius): ${config.rules.borderRadius}px 一律
- 境界線の太さ (border-width): ${config.rules.borderWidth}px
- ボタン・アクション間隔 (button-gap): ${config.rules.buttonGap ?? 10}px (アクションボタン間の適切な余白)
- タイポグラフィ比率:
  - 見出し (h1): ${config.rules.h1Size} / font-weight: ${config.rules.h1Weight} (Bold)
  - 本文 (body): ${config.rules.bodySize} / font-weight: 400 (Regular)
- コンテンツ最大幅 (max-width): ${config.rules.maxWidth}

## 4. 厳格なカラーパレット
以下の指定カラーコード（HEX）をそれぞれの役割に限定して使用し、勝手な原色や不要なグラデーションは一切追加しないでください。
- カラーテーマモード: ${config.themeMode === 'light' ? '☀️ ライトモード (Light Theme / 明るく清潔感のある白・淡色基調)' : '🌙 ダークモード (Dark Theme / 集中力を高める深色・黒基調)'}
- メイン背景色 (Base / Background): ${config.colors.base}
- コンポーネント背景色 (Surface / Card): ${config.colors.surface}
- 主要テキスト色 (Primary Text): ${config.colors.primaryText} (高い視認性)
- 副次的テキスト色 (Secondary Text): ${config.colors.secondaryText} (コントラストを抑えた補助色)
- アクセントカラー (Accent Color): ${config.colors.accent}
  ※最重要ルール: アクセントカラーの使用率は画面全体の「3%未満」に厳密に制限し、最重要アクション（CTAボタン）や主要ステータスインジケーターのみに限定してください。
- 境界線の色 (Border Color): ${config.colors.border} (悪目立ちしない繊細なトーン)

## 5. 実装対象コンポーネント
以下のコンポーネント構造を過不足なく実装し、視線誘導の整った美しい画面レイアウトを完成させてください。
${componentsSection}

## 6. 実装上の品質要件
${stackGuide}
- 装飾過多（派手すぎるシャドウや過剰なアニメーション）を避け、タイポグラフィの階層と整然とした余白によってプロフェッショナルな品質を達成してください。
- テキストと背景色のコントラスト比を十分に確保し、Web Content Accessibility Guidelines (WCAG) AA基準を満たしてください。
- ウィンドウのリサイズや画面幅の変動に対してレイアウト崩れが発生しないレスポンシブ耐性を担保してください。
`
}

/**
 * Downloads the text content as a file with the specified filename.
 */
export function downloadMarkdownFile(content: string, filename = 'ui-prompt.md'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Copies the text to clipboard with modern Clipboard API and fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fallback
    }
  }

  // Fallback for older browsers / insecure context
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch {
    document.body.removeChild(textArea)
    return false
  }
}
