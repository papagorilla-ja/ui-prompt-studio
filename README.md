# UI Prompt Studio

生成AIにWebやデスクトップアプリケーションのUIを「ダサく」させないために、プロンプトでカチッと指定すべき4大要素（デザインシステム、数値ルール、カラーパレット、実装コンポーネント）を直感的に選択・カスタマイズし、リアルタイムプレビューを確認しながら最高品質の指示プロンプトをワンクリック生成するスタジオ型Webアプリケーションです。

---

## 主な機能

- **ターゲットプラットフォーム選択**: Web アプリケーション (SaaS / 管理画面) / デスクトップアプリケーション (Tauri / Electron)
- **トレンド・デザインシステム**: Bento Grid、タクタイル・ブルータリズム、ミニマリズム UI、レトロフューチャリズム、グラスモフィズム
- **プロ推奨デフォルト値の自動適用**: 世界観を選ぶだけで破綻しない数値・カラーが一発反映
- **数値ルール調律**: `gap`, `padding`, `border-radius`, `border-width`, タイポグラフィジャンプ率, `max-width`
- **カラーパレット設定**: Base, Surface, Primary/Secondary Text, Accent (3%ルール), Border
- **実装コンポーネント選択**: ナビゲーション、カスタムタイトルバー（デスクトップ時）、ヘッダー、Bento、統計カード、チャート、テーブル等
- **出力コードスタック指定**: React (TSX) + Tailwind, Vue 3 + Tailwind, HTML + Vanilla CSS, Next.js + shadcn/ui
- **リアルタイム・サンドボックスプレビュー**: CSS IsolationによりVuetifyスタイルと分離されたプレビュー表示（ズーム・表示密度切り替え対応）
- **状態管理 & 共有**: LocalStorageプリセット保存、JSONバックアップ/リストア、LZ-StringによるURLハッシュ共有

---

## 技術スタック

- **フレームワーク**: Vue 3 (Composition API, `<script setup>`) + TypeScript
- **ビルドツール**: Vite
- **UIライブラリ**: Vuetify 3 (`@mdi/font`)
- **スタイリング**: Custom Vanilla CSS / CSS Custom Properties
- **状態管理**: Pinia + LocalStorage
- **圧縮ライブラリ**: LZ-String

---

## 開発方針

本プロジェクトは **GitHub Issue** をベースとしてタスク管理・機能開発を進めます。
詳細は [requirements.md](./requirements.md) を参照してください。
