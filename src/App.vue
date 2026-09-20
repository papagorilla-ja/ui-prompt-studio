<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { decodeConfigFromHash, copyShareUrlToClipboard } from '@/utils/urlSharing'
import { useConfigStore } from '@/stores/configStore'
import BuilderPanel from '@/components/builder/BuilderPanel.vue'
import SandboxStage from '@/components/preview/SandboxStage.vue'
import PromptViewer from '@/components/prompt/PromptViewer.vue'
import WorkflowGuideBar from '@/components/guidance/WorkflowGuideBar.vue'
import OnboardingModal from '@/components/guidance/OnboardingModal.vue'
import StyleManagerModal from '@/components/presets/StyleManagerModal.vue'
import appLogo from '@/assets/images/logo.jpg'

const store = useConfigStore()

const snackbar = ref(false)
const snackbarText = ref('')
const zoomLevel = ref('100')
const previewDensity = ref('default')
const isUrlCopied = ref(false)

function restoreFromHash() {
  const hash = window.location.hash
  if (hash && hash.includes('state=')) {
    const decoded = decodeConfigFromHash(hash)
    if (decoded) {
      store.loadConfig(decoded)
      showNotification(`共有URLから設定を復元しました (${store.currentDesignSystemMeta.name.split('/')[0].trim()} - ${store.isLight ? 'Light' : 'Dark'})`)
    } else {
      showNotification('共有URLの解析に失敗しました。デフォルト設定で表示します')
    }
  }
}

onMounted(() => {
  restoreFromHash()
  window.addEventListener('hashchange', restoreFromHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', restoreFromHash)
})

async function handleShareUrl() {
  const { success } = await copyShareUrlToClipboard(store.config)
  if (success) {
    isUrlCopied.value = true
    showNotification('共有URLをクリップボードにコピーしました！このリンクを開くと設定がそのまま復元されます')
    setTimeout(() => {
      isUrlCopied.value = false
    }, 2000)
  } else {
    showNotification('URLのコピーに失敗しました')
  }
}
const onboardingModalRef = ref<InstanceType<typeof OnboardingModal> | null>(null)
const styleManagerModalRef = ref<InstanceType<typeof StyleManagerModal> | null>(null)

function openStyleManager(tab: 'presets' | 'json' = 'presets') {
  styleManagerModalRef.value?.open(tab)
}

function openGuide() {
  onboardingModalRef.value?.open()
}

function showNotification(text: string) {
  snackbarText.value = text
  snackbar.value = true
}

function handleReset() {
  store.resetToDefault()
  showNotification('設定を初期デフォルト値にリセットしました')
}
</script>

<template>
  <v-app class="studio-app">
    <!-- Studio Header (Linear / Raycast Pro) -->
    <header class="studio-header">
      <!-- Left: Logo & Studio Identity -->
      <div class="d-flex align-center gap-3">
        <div class="logo-wrapper">
          <img :src="appLogo" alt="UI Prompt Studio Logo" class="header-logo" />
        </div>
        <div>
          <div class="d-flex align-center gap-2">
            <span class="text-subtitle-1 font-weight-black tracking-wide bg-gradient-text">UI Prompt Studio</span>
            <span class="pro-tag">PRO</span>
          </div>
          <div class="text-caption text-grey" style="font-size: 0.7rem !important; line-height: 1;">
            AIに渡すだけで理想のUIコードを一発生成する指示書スタジオ
          </div>
        </div>
      </div>

      <!-- Center: Live Status & Token Counter -->
      <div class="d-none d-md-flex align-center gap-3 status-pill-container px-3 py-1">
        <div class="d-flex align-center gap-2">
          <span class="pulse-dot"></span>
          <span class="text-caption font-weight-bold tracking-wide text-grey-lighten-2">LIVE STUDIO</span>
        </div>
        <span class="divider-dot">•</span>
        <div class="text-caption font-mono text-primary font-weight-bold">
          {{ store.config.platform.toUpperCase() }} × {{ store.currentDesignSystemMeta.name.split('/')[0].trim() }} × {{ store.isLight ? 'LIGHT' : 'DARK' }}
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="d-flex align-center gap-2">
        <button
          type="button"
          class="pro-action-btn pro-action-btn-guide px-3 py-1 d-flex align-center gap-1"
          title="使い方・目的の解説ガイドを開く"
          @click="openGuide"
        >
          <v-icon icon="mdi-help-circle-outline" size="16" color="warning" />
          <span class="font-weight-bold text-white">使い方</span>
        </button>
        <button
          type="button"
          class="pro-action-btn px-3 py-1 d-flex align-center gap-1"
          title="お気に入りスタイルを保存・呼び出し"
          @click="openStyleManager('presets')"
        >
          <v-icon icon="mdi-bookmark-outline" size="16" color="primary" />
          <span>スタイル保存</span>
          <span v-if="store.savedPresets.length > 0" class="saved-preset-count font-mono">
            {{ store.savedPresets.length }}
          </span>
        </button>

        <button
          type="button"
          class="pro-action-btn px-3 py-1 d-flex align-center gap-1"
          title="設定をJSONでエクスポート / インポート"
          @click="openStyleManager('json')"
        >
          <v-icon icon="mdi-code-json" size="16" color="grey" />
          <span>JSON</span>
        </button>

        <button
          type="button"
          class="pro-action-btn pro-action-btn-primary px-3 py-1 d-flex align-center gap-1"
          :style="{ background: isUrlCopied ? 'linear-gradient(135deg, #10b981, #059669) !important' : '' }"
          title="設定全体をURLハッシュに圧縮して共有リンクをコピー"
          @click="handleShareUrl"
        >
          <v-icon :icon="isUrlCopied ? 'mdi-check' : 'mdi-share-variant-outline'" size="16" />
          <span>{{ isUrlCopied ? 'URLコピー完了！' : 'URL共有' }}</span>
        </button>

        <button
          type="button"
          class="pro-action-btn px-2 py-1"
          title="初期値にリセット"
          @click="handleReset"
        >
          <v-icon icon="mdi-refresh" size="16" color="grey" />
        </button>
      </div>
    </header>

    <!-- Workflow Guide Bar (Issue #28) -->
    <WorkflowGuideBar @open-guide="openGuide" />

    <!-- Studio Main 2-Pane Body -->
    <main class="studio-body">
      <!-- Left Pane: Settings & Builder -->
      <section class="studio-left-pane">
        <div class="left-pane-header px-4 py-3 border-b d-flex align-center justify-space-between sticky-header">
          <div class="d-flex align-center gap-2">
            <div class="icon-box" style="width: 26px; height: 26px;">
              <v-icon icon="mdi-tune" size="16" color="primary" />
            </div>
            <span class="text-subtitle-2 font-weight-bold text-white tracking-wide">DESIGN SPEC BUILDER</span>
          </div>
          <span class="status-token-badge font-mono">
            READY
          </span>
        </div>

        <BuilderPanel />
      </section>

      <!-- Right Pane: Preview (Top) & Prompt (Bottom) -->
      <section class="studio-right-pane">
        <!-- Top: Sandbox Preview with Dot Grid Canvas -->
        <div class="studio-preview-section dot-grid-canvas">
          <!-- Floating Toolbar -->
          <div class="preview-toolbar-overlay d-flex align-center justify-space-between px-4 py-3">
            <div class="d-flex align-center gap-2">
              <div class="text-caption font-weight-bold text-grey-lighten-1 d-flex align-center">
                <v-icon icon="mdi-eye-outline" size="16" class="mr-2" color="secondary" />
                <span>リアルタイム・サンドボックスプレビュー</span>
              </div>
              <span class="preview-sync-hint d-none d-lg-inline-flex align-center gap-1 font-mono">
                <v-icon icon="mdi-arrow-left-bold" size="12" color="primary" />
                <span>左パネルの変更がリアルタイム反映</span>
              </span>
            </div>

            <!-- Floating Pill Controls -->
            <div class="floating-pill-toolbar d-flex align-center gap-2">
              <!-- Density -->
              <div class="d-flex align-center gap-1 px-1">
                <button
                  type="button"
                  class="pill-btn"
                  :class="{ 'pill-btn-active': previewDensity === 'default' }"
                  @click="previewDensity = 'default'"
                >
                  標準余白
                </button>
                <button
                  type="button"
                  class="pill-btn"
                  :class="{ 'pill-btn-active': previewDensity === 'compact' }"
                  @click="previewDensity = 'compact'"
                >
                  高密度
                </button>
              </div>

              <span style="width: 1px; height: 14px; background: rgba(255,255,255,0.15);"></span>

              <!-- Zoom -->
              <div class="d-flex align-center gap-1 px-1">
                <button
                  v-for="z in ['100', '75', '50']"
                  :key="z"
                  type="button"
                  class="pill-btn"
                  :class="{ 'pill-btn-active': zoomLevel === z }"
                  @click="zoomLevel = z"
                >
                  {{ z }}%
                </button>
              </div>
            </div>
          </div>

          <!-- Interactive Sandbox Stage -->
          <div class="flex-1 overflow-hidden d-flex flex-column">
            <SandboxStage :zoom="zoomLevel" :density="previewDensity" />
          </div>
        </div>

        <!-- Bottom: Prompt Output (Linear Pro Style) -->
        <div class="studio-prompt-section">
          <PromptViewer @notify="showNotification" />
        </div>
      </section>
    </main>

    <!-- Onboarding Guide Modal (Issue #28) -->
    <OnboardingModal ref="onboardingModalRef" />

    <!-- Style Manager & JSON Backup Modal (Issue #6) -->
    <StyleManagerModal ref="styleManagerModalRef" @notify="showNotification" />

    <!-- Global Snackbar -->
    <v-snackbar v-model="snackbar" timeout="2500" color="primary" location="bottom right">
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" icon="mdi-close" size="small" @click="snackbar = false" />
      </template>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.tracking-wide { letter-spacing: 0.05em; }
.font-mono { font-family: var(--font-mono); }
.transition-all { transition: all 0.2s ease; }

.sticky-header {
  position: sticky;
  top: 0;
  background: rgba(13, 15, 23, 0.95);
  backdrop-filter: blur(16px);
  z-index: 10;
}

.logo-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(56, 189, 248, 0.4));
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.4);
}

.header-logo {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}

.bg-gradient-text {
  background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pro-tag {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  padding: 1px 6px;
  border-radius: 4px;
  background: linear-gradient(135deg, #6366f1, #38bdf8);
  color: #ffffff;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
}

.status-pill-container {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.divider-dot {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
}

.status-token-badge {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 4px;
  padding: 2px 6px;
}

.workspace-label {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-mono);
}

.pill-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pill-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}

.pro-action-btn-guide {
  background: rgba(245, 158, 11, 0.12) !important;
  border-color: rgba(245, 158, 11, 0.35) !important;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.2);
}
.pro-action-btn-guide:hover {
  background: rgba(245, 158, 11, 0.22) !important;
  border-color: rgba(245, 158, 11, 0.5) !important;
}

.saved-preset-count {
  font-size: 0.62rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.5);
}

.preview-sync-hint {
  font-size: 0.65rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 12px;
  padding: 1px 8px;
}

.pill-btn-active {
  color: #ffffff !important;
  background: rgba(99, 102, 241, 0.3) !important;
  border: 1px solid rgba(99, 102, 241, 0.4) !important;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.2);
}
</style>
