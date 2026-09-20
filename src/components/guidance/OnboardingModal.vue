<script setup lang="ts">
import { ref, onMounted } from 'vue'
import appLogo from '@/assets/images/logo.jpg'

const ONBOARDED_KEY = 'ui-prompt-studio-onboarded-v1'

const isOpen = ref(false)
const activeTab = ref<'why' | 'how' | 'features'>('why')
const dontShowAgain = ref(false)

onMounted(() => {
  const hasOnboarded = localStorage.getItem(ONBOARDED_KEY)
  if (!hasOnboarded) {
    // Show automatically for first-time visitors
    isOpen.value = true
  }
})

function open() {
  isOpen.value = true
}

function close() {
  if (dontShowAgain.value) {
    localStorage.setItem(ONBOARDED_KEY, 'true')
  }
  isOpen.value = false
}

function getStarted() {
  localStorage.setItem(ONBOARDED_KEY, 'true')
  isOpen.value = false
}

defineExpose({
  open,
})
</script>

<template>
  <v-dialog v-model="isOpen" max-width="740" persistent>
    <div class="onboarding-modal-card">
      <!-- Modal Header -->
      <div class="modal-header d-flex align-center justify-space-between px-6 py-4 border-b">
        <div class="d-flex align-center gap-3">
          <div class="modal-logo-box">
            <img :src="appLogo" alt="Studio Logo" class="modal-logo" />
          </div>
          <div>
            <div class="d-flex align-center gap-2">
              <span class="text-h6 font-weight-black tracking-wide text-white">UI Prompt Studio</span>
              <span class="pro-tag">WELCOME</span>
            </div>
            <div class="text-caption text-grey">
              AIに渡すだけで理想のUIコードを一発生成する指示書スタジオ
            </div>
          </div>
        </div>

        <button type="button" class="close-modal-btn" @click="close">
          <v-icon icon="mdi-close" size="20" color="grey" />
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="d-flex align-center px-6 pt-3 gap-2 border-b">
        <button
          type="button"
          class="onboarding-tab-btn"
          :class="{ 'onboarding-tab-btn-active': activeTab === 'why' }"
          @click="activeTab = 'why'"
        >
          <v-icon icon="mdi-help-circle-outline" size="16" />
          <span>何ができるツール？ (Why)</span>
        </button>

        <button
          type="button"
          class="onboarding-tab-btn"
          :class="{ 'onboarding-tab-btn-active': activeTab === 'how' }"
          @click="activeTab = 'how'"
        >
          <v-icon icon="mdi-numeric-3-circle-outline" size="16" />
          <span>簡単3ステップ (How)</span>
        </button>

        <button
          type="button"
          class="onboarding-tab-btn"
          :class="{ 'onboarding-tab-btn-active': activeTab === 'features' }"
          @click="activeTab = 'features'"
        >
          <v-icon icon="mdi-star-outline" size="16" />
          <span>便利なプロ機能</span>
        </button>
      </div>

      <!-- Modal Body Content -->
      <div class="modal-body pa-6">
        <!-- Tab 1: Why / Value Proposition -->
        <div v-if="activeTab === 'why'" class="d-flex flex-column gap-4">
          <div class="hero-callout pa-4 d-flex align-start gap-3">
            <v-icon icon="mdi-auto-fix" size="24" color="primary" class="mt-1 flex-shrink-0" />
            <div>
              <h4 class="text-subtitle-1 font-weight-bold text-white mb-1">
                AIコーディングの「デザインのブレ」をゼロにする指示書メーカー
              </h4>
              <p class="text-body-2 text-grey-lighten-1 leading-relaxed mb-0">
                Claude、ChatGPT、Cursor、v0などのAIに「かっこいいUIを作って」と頼むと、余白がバラバラになったり、世界観がチグハグになりがちです。<br />
                本スタジオでデザインルールをあらかじめ策定し、<strong>CSS変数・コンポーネント構成・3%アクセント色ルール</strong>をまとめたプロンプトをAIに渡すことで、一発でプロダクション品質のコードを生成させることができます。
              </p>
            </div>
          </div>

          <div class="d-grid grid-cols-3 gap-3">
            <div class="feature-tile pa-3">
              <v-icon icon="mdi-palette-outline" size="22" color="secondary" class="mb-2" />
              <div class="text-subtitle-2 font-weight-bold text-white mb-1">7種のデザインシステム</div>
              <div class="text-caption text-grey leading-relaxed">
                Bento Grid、ブルータリズム、ミニマリズム、グラスモフィズム、Kawaii、Webゲーム等から選択。
              </div>
            </div>

            <div class="feature-tile pa-3">
              <v-icon icon="mdi-eye-outline" size="22" color="primary" class="mb-2" />
              <div class="text-subtitle-2 font-weight-bold text-white mb-1">ライブサンドボックス</div>
              <div class="text-caption text-grey leading-relaxed">
                スライダーや配色を変えた瞬間、中央のリアルタイムプレビューに即時反映。
              </div>
            </div>

            <div class="feature-tile pa-3">
              <v-icon icon="mdi-server-off" size="22" color="success" class="mb-2" />
              <div class="text-subtitle-2 font-weight-bold text-white mb-1">完全クライアント完結</div>
              <div class="text-caption text-grey leading-relaxed">
                サーバー通信ゼロ。APIキーも不要。ブラウザ内ですべて安全かつ高速に動作します。
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: How to Use (3 Steps) -->
        <div v-if="activeTab === 'how'" class="d-flex flex-column gap-3">
          <!-- Step 1 Card -->
          <div class="step-guide-card pa-3 d-flex align-start gap-3">
            <span class="step-huge-num">1</span>
            <div>
              <h4 class="text-subtitle-2 font-weight-bold text-white mb-1 d-flex align-center gap-2">
                <span>スタイルを選ぶ（左パネル）</span>
                <span class="badge-sub">STEP 0〜6</span>
              </h4>
              <p class="text-caption text-grey-lighten-1 leading-relaxed mb-0">
                Webかデスクトップか、ダーク/ライトテーマ、7種のデザインシステム、グリッド余白、配色、出力コードスタック（React, Vue, 単一HTML等）をポチポチ選択します。
              </p>
            </div>
          </div>

          <!-- Step 2 Card -->
          <div class="step-guide-card pa-3 d-flex align-start gap-3">
            <span class="step-huge-num">2</span>
            <div>
              <h4 class="text-subtitle-2 font-weight-bold text-white mb-1 d-flex align-center gap-2">
                <span>リアルタイムに確認する（中央プレビュー）</span>
                <span class="badge-sub">LIVE PREVIEW</span>
              </h4>
              <p class="text-caption text-grey-lighten-1 leading-relaxed mb-0">
                設定したデザイン・余白・配色が中央のサンドボックスに即座に反映されます。ボタン間隔やホバー時のマイクロインタラクションを体感しながら微調整できます。
              </p>
            </div>
          </div>

          <!-- Step 3 Card -->
          <div class="step-guide-card pa-3 d-flex align-start gap-3">
            <span class="step-huge-num">3</span>
            <div>
              <h4 class="text-subtitle-2 font-weight-bold text-white mb-1 d-flex align-center gap-2">
                <span>プロンプトをコピーしてAIに渡す（プレビュー上部）</span>
                <span class="badge-sub">ONE-CLICK COPY</span>
              </h4>
              <p class="text-caption text-grey-lighten-1 leading-relaxed mb-0">
                プレビュー上部の「UI指示書プロンプト」ボタンを押してモーダルを開き、ワンクリックでコピーしてお使いのAI（Claude 3.7 / ChatGPT / Cursor / v0）のチャットにペーストするだけ！完成度の高いフロントエンドコードが出力されます。
              </p>
            </div>
          </div>
        </div>

        <!-- Tab 3: Pro Features -->
        <div v-if="activeTab === 'features'" class="d-flex flex-column gap-3">
          <div class="feature-guide-row pa-3 d-flex align-start gap-3">
            <v-icon icon="mdi-file-code-outline" size="24" color="warning" class="mt-1" />
            <div>
              <h4 class="text-subtitle-2 font-weight-bold text-white mb-1">
                単一HTML完結（Google Apps Script / ローカル即時実行）
              </h4>
              <p class="text-caption text-grey-lighten-1 leading-relaxed mb-0">
                Node.jsやnpmビルド不要！<code>&lt;style&gt;</code> と <code>&lt;script&gt;</code> を1枚の <code>.html</code> 内に完結させ、ダブルクリックやGAS（HTML Service）でそのまま動くコードをAIに出力させることができます。
              </p>
            </div>
          </div>

          <div class="feature-guide-row pa-3 d-flex align-start gap-3">
            <v-icon icon="mdi-image-auto-adjust" size="24" color="primary" class="mt-1" />
            <div>
              <h4 class="text-subtitle-2 font-weight-bold text-white mb-1">
                外部画像生成AI向けアセットプロンプト生成
              </h4>
              <p class="text-caption text-grey-lighten-1 leading-relaxed mb-0">
                選択中のデザインシステム（Kawaiiの3Dクレイ調、ゲームの16bitピクセル等）と調和するアプリアイコンやヒーロー画像のプロンプト（英語）を自動生成。Google GeminiやMidjourneyに貼るだけで素材が揃います。
              </p>
            </div>
          </div>

          <div class="feature-guide-row pa-3 d-flex align-start gap-3">
            <v-icon icon="mdi-share-variant-outline" size="24" color="secondary" class="mt-1" />
            <div>
              <h4 class="text-subtitle-2 font-weight-bold text-white mb-1">
                マイスタイル保存 & URLハッシュ共有
              </h4>
              <p class="text-caption text-grey-lighten-1 leading-relaxed mb-0">
                自分好みに調整したトークン設定をローカルに保存したり、URLに変換してチームメンバーと即座に共有できます。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer d-flex align-center justify-space-between px-6 py-3 border-t">
        <label class="d-flex align-center gap-2 cursor-pointer text-caption text-grey">
          <input type="checkbox" v-model="dontShowAgain" class="styled-checkbox" />
          <span>次回以降、起動時に自動表示しない</span>
        </label>

        <button type="button" class="get-started-btn px-4 py-2 font-weight-bold" @click="getStarted">
          スタジオを始める ➔
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.leading-relaxed { line-height: 1.5; }
.d-grid { display: grid; }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.cursor-pointer { cursor: pointer; }

.onboarding-modal-card {
  background: rgba(13, 15, 23, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.modal-logo-box {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(56, 189, 248, 0.4));
  padding: 1px;
}

.modal-logo {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.pro-tag {
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: 4px;
  background: linear-gradient(135deg, #6366f1, #38bdf8);
  color: #ffffff;
}

.close-modal-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.onboarding-tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}

.onboarding-tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.onboarding-tab-btn-active {
  color: #ffffff !important;
  background: rgba(99, 102, 241, 0.25) !important;
  border: 1px solid rgba(99, 102, 241, 0.4) !important;
}

.hero-callout {
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 8px;
}

.feature-tile {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
}

.step-guide-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
}

.step-guide-card-highlight {
  background: rgba(56, 189, 248, 0.08);
  border-color: rgba(56, 189, 248, 0.3);
}

.step-huge-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 900;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-huge-num-active {
  background: #38bdf8;
  color: #0f172a;
}

.badge-sub {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.badge-sub-highlight {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.feature-guide-row {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
}

.styled-checkbox {
  accent-color: #6366f1;
  width: 14px;
  height: 14px;
}

.get-started-btn {
  background: linear-gradient(135deg, #6366f1, #38bdf8);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.84rem;
  cursor: pointer;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.4);
  transition: all 0.2s ease;
}

.get-started-btn:hover {
  opacity: 0.92;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
  transform: translateY(-1px);
}
</style>
