# UI Prompt Studio 🎨⚡

> **AIに渡すだけで、理想のフロントエンドUIコードを一発生成する指示書スタジオ**  
> Claude 3.7 / ChatGPT (GPT-4o) / Cursor / v0 / Gemini などのAIコーディングツールにコピペして使用する、高精度なUIプロンプトジェネレーター。

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Deploy to GitHub Pages](https://github.com/papagorilla-ja/ui-prompt-studio/actions/workflows/deploy.yml/badge.svg)](https://github.com/papagorilla-ja/ui-prompt-studio/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 💡 なぜこのツールが必要なのか？ (Problem & Solution)

AIに「いい感じのダッシュボードを作って」と漠然と指示すると、**余白がバラバラになり、配色の統一感が崩れ、毎回出力がブレてしまいます**。

**UI Prompt Studio** は、プロのフロントエンドエンジニアが設計したデザイントークン体系に基づき、**デザインシステム・数値ルール・カラーパレット（3%アクセントルール）・コンポーネント構成** を直感的に選択。リアルタイムの隔離サンドボックスで見た目を検証しながら、AIが一発でプロダクション品質のコードを出力できる完全な指示プロンプトを生成します。

---

## ✨ 主な機能

### 1. 7つの厳選デザインシステム（ダーク & ライト両対応）
- 🍱 **Bento Grid / モジュラー**: 情報を整然とした角丸タイル状に分割する万能スタイル
- ⬛ **タクタイル・ブルータリズム**: ぼかし影なし・1-2pxソリッド線・高コントラスト幾何学構造
- ⚪ **ミニマリズム UI**: 広大な余白とタイポグラフィのジャンプ率に集中するAIネイティブ設計
- 🌆 **レトロフューチャリズム**: 80年代サイバーパンク・CRT走査線・ネオングロー
- 💎 **グラスモフィズム**: Apple Vision Pro以降洗練されたすりガラス調レイヤー（Backdrop Blur）
- 🌸 **Kawaii / パステルポップ**: ぷっくり角丸・ソフトシャドウ・パステルカラーのキュートな世界観
- 👾 **Webゲーム / アーケード・ピクセル**: 16-bitドット枠・CRTステータスゲージ・レトロアーケード

### 2. 厳格なデザイントークン調律 (STEP 0〜4)
- **ターゲット環境**: Webアプリケーション（レスポンシブ） / デスクトップアプリ（タイトルバー付き）
- **数値ルール**: グリッド間隔、内側余白、角丸（0〜丸）、ボタン間隔、境界線幅、見出しサイズ
- **カラー設計**: ベース背景、コンポーネント背景、主要/副次テキスト、アクセント（3%限定ルール）、ボーダー
- **UIパーツ選択**: タイトルバー、サイドバー、グローバルナビ、Bento Grid、統計カード、チャート、アクティビティログテーブル、ミニマルフォーム

### 3. 多様な出力コードスタック (STEP 5)
- **React (TSX) + TailwindCSS**
- **Vue 3 (SFC) + TailwindCSS**
- **HTML5 + Vanilla CSS**
- **単一HTML完結 (Single-file HTML)**: Google Apps Script (GAS) やローカル即時実行向け（`<style>` と `<script>` をインライン完結）
- **Next.js + shadcn/ui**

### 4. 🎨 外部画像生成AI向けアセットプロンプト生成 (STEP 7)
- 選択中のデザインシステムの世界観（Kawaiiクレイ調、ピクセルアート等）やアクセント色と連動した**英語画像プロンプト（Midjourney, Gemini, DALL-E 3, SD対応）**を自動生成。
- アプリアイコン、キービジュアル、背景アート、キャラクタースプライトを即座に調達可能。

### 5. 🛠️ 運用・共有機能
- **マイスタイル保存**: ローカルストレージにお気に入りの設定を名前付き保存・ワンクリック呼び出し
- **JSONバックアップ & リストア**: 設定と全プリセットを `.json` ファイルで入出力
- **LZ-String URLハッシュ共有**: 超高密度圧縮したハッシュ付きURLで、チームメンバーへ設定を完全共有
- **オンボーディングガイド**: 初回訪問者向けチュートリアルモーダル & 3ステップガイドバー

---

## 🚀 デプロイ方法

本アプリケーションは完全なクライアントサイド（サーバーレス）構成のため、静的ホスティングサービスでゼロコスト運用が可能です。

### 1. Vercel へのデプロイ
1. [Vercel Dashboard](https://vercel.com/new) にアクセス
2. GitHub リポジトリ `papagorilla-ja/ui-prompt-studio` をインポート
3. Framework Preset で `Vite` を選択し、**Deploy** をクリック（設定変更不要で即座に公開されます）

### 2. GitHub Pages へのデプロイ
リポジトリの `main` ブランチにプッシュされると、`.github/workflows/deploy.yml` により自動でビルド＆デプロイされます。  
リポジトリの **Settings > Pages** で Source を **GitHub Actions** に設定してください。

---

## 💻 ローカル開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/papagorilla-ja/ui-prompt-studio.git
cd ui-prompt-studio

# 依存関係のインストール
npm install

# 開発サーバーの起動 (http://localhost:5173/)
npm run dev

# 本番ビルド & 型チェック
npm run build

# 本番プレビュー
npm run preview
```

---

## 📜 ライセンス

MIT License © 2026 papagorilla-ja
