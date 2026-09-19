<script setup lang="ts">
import { ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import BuilderPanel from '@/components/builder/BuilderPanel.vue'
import appLogo from '@/assets/images/logo.jpg'

const store = useConfigStore()

const snackbar = ref(false)
const snackbarText = ref('')
const zoomLevel = ref('100')
const previewDensity = ref('default')

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
            AIフロントエンド指示プロンプト生成スタジオ
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
          {{ store.config.platform.toUpperCase() }} × {{ store.currentDesignSystemMeta.name.split('/')[0].trim() }}
        </div>
      </div>

      <!-- Right: Action Buttons -->
      <div class="d-flex align-center gap-2">
        <button
          type="button"
          class="pro-action-btn px-3 py-1 d-flex align-center gap-1"
          @click="showNotification('マイスタイル保存ダイアログ (Issue #6で実装)')"
        >
          <v-icon icon="mdi-bookmark-outline" size="16" color="primary" />
          <span>スタイル保存</span>
        </button>

        <button
          type="button"
          class="pro-action-btn px-3 py-1 d-flex align-center gap-1"
          @click="showNotification('JSON入出力 (Issue #6で実装)')"
        >
          <v-icon icon="mdi-code-json" size="16" color="grey" />
          <span>JSON</span>
        </button>

        <button
          type="button"
          class="pro-action-btn pro-action-btn-primary px-3 py-1 d-flex align-center gap-1"
          @click="showNotification('URL共有 (Issue #7で実装)')"
        >
          <v-icon icon="mdi-share-variant-outline" size="16" />
          <span>URL共有</span>
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
              <span class="workspace-label d-flex align-center gap-1">
                <v-icon icon="mdi-monitor-dashboard" size="14" color="primary" />
                CANVAS PREVIEW
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

          <!-- Centered Mockup Sandbox Stage -->
          <div class="flex-1 d-flex align-center justify-center pa-6 overflow-hidden">
            <!-- Sandbox preview root applying cssVariables and zoom scale -->
            <div
              class="ui-preview-sandbox pa-6 rounded-lg d-flex flex-column align-center justify-center transition-all"
              :style="{
                background: store.config.colors.base,
                border: `${store.config.rules.borderWidth}px solid ${store.config.colors.border}`,
                borderRadius: `${store.config.rules.borderRadius}px`,
                width: '90%',
                maxWidth: store.config.rules.maxWidth === '100%' ? '760px' : store.config.rules.maxWidth,
                minHeight: '260px',
                transform: `scale(${Number(zoomLevel) / 100})`,
                transformOrigin: 'center center',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              }"
            >
              <!-- Desktop Titlebar Mockup if Desktop is active -->
              <div
                v-if="store.isDesktop"
                class="w-100 d-flex align-center justify-space-between pb-3 mb-3 border-b"
                style="border-color: rgba(255,255,255,0.12) !important;"
              >
                <div class="d-flex align-center" style="gap: 6px;">
                  <span style="width: 11px; height: 11px; border-radius: 50%; background: #ff5f56; display: inline-block; box-shadow: 0 0 6px rgba(255,95,86,0.5);"></span>
                  <span style="width: 11px; height: 11px; border-radius: 50%; background: #ffbd2e; display: inline-block; box-shadow: 0 0 6px rgba(255,189,46,0.5);"></span>
                  <span style="width: 11px; height: 11px; border-radius: 50%; background: #27c93f; display: inline-block; box-shadow: 0 0 6px rgba(39,201,63,0.5);"></span>
                </div>
                <span class="text-caption font-mono font-weight-bold" :style="{ color: store.config.colors.secondaryText }">
                  UI Prompt Studio // {{ store.currentDesignSystemMeta.name }}
                </span>
                <div style="width: 45px;"></div>
              </div>

              <!-- Main Card Preview Mockup -->
              <div
                class="pa-5 rounded mb-2 text-center w-100 transition-all"
                :style="{
                  background: store.config.colors.surface,
                  border: `${store.config.rules.borderWidth}px solid ${store.config.colors.border}`,
                  borderRadius: `${store.config.rules.borderRadius}px`,
                  boxShadow: store.config.designSystem === 'brutalism' ? 'none' : '0 10px 30px rgba(0,0,0,0.3)',
                }"
              >
                <div
                  class="font-weight-black tracking-tight"
                  :style="{
                    color: store.config.colors.primaryText,
                    fontSize: store.config.rules.h1Size,
                    fontWeight: store.config.rules.h1Weight,
                    lineHeight: 1.2,
                  }"
                >
                  {{ store.currentDesignSystemMeta.name }}
                </div>
                <div class="text-caption mt-2 font-mono" :style="{ color: store.config.colors.secondaryText }">
                  gap: {{ store.config.rules.gap }}px • padding: {{ store.config.rules.padding }}px • radius: {{ store.config.rules.borderRadius }}px • border: {{ store.config.rules.borderWidth }}px
                </div>

                <div class="d-flex align-center justify-center gap-2 mt-4">
                  <button
                    type="button"
                    class="px-4 py-2 text-caption font-weight-bold tracking-wide"
                    :style="{
                      background: store.config.colors.accent,
                      color: '#ffffff',
                      borderRadius: `${store.config.rules.borderRadius}px`,
                      border: 'none',
                      boxShadow: `0 4px 14px ${store.config.colors.accent}40`,
                      cursor: 'pointer',
                    }"
                  >
                    Primary Action (3% Accent)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom: Prompt Output (Linear Pro Style) -->
        <div class="studio-prompt-section pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center gap-2">
              <span class="step-badge" style="background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); color: #a5b4fc;">OUTPUT</span>
              <span class="text-body-2 font-weight-bold text-white">生成プロンプト (Markdown)</span>
              <span class="text-caption text-grey font-mono">(Issue #5)</span>
            </div>
            <div class="d-flex align-center gap-2">
              <button
                type="button"
                class="pro-action-btn pro-action-btn-primary px-3 py-1 d-flex align-center gap-1"
                @click="showNotification('クリップボードにコピーしました！')"
              >
                <v-icon icon="mdi-content-copy" size="15" />
                <span>プロンプトをコピー</span>
              </button>
              <button
                type="button"
                class="pro-action-btn px-2 py-1"
                title="Markdownファイルとしてダウンロード"
                @click="showNotification('ui-prompt.md をダウンロードしました')"
              >
                <v-icon icon="mdi-download" size="15" color="grey" />
              </button>
            </div>
          </div>

          <v-sheet
            class="pa-3 rounded font-mono text-caption flex-1 overflow-y-auto"
            color="rgba(8, 9, 13, 0.9)"
            style="border: 1px solid rgba(255,255,255,0.08); box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);"
          >
            <pre style="margin: 0; color: #94a3b8; line-height: 1.55;"># UI実装指示プロンプト
## 1. アプリケーション概要
- ターゲット種別: {{ store.config.platform === 'desktop' ? 'デスクトップアプリケーション' : 'Web アプリケーション' }}
- 出力コードスタック: {{ store.config.outputTechStack }}
- スタイル: {{ store.currentDesignSystemMeta.name }}
- 基本カラー: Base={{ store.config.colors.base }}, Surface={{ store.config.colors.surface }}, Accent={{ store.config.colors.accent }}
... (Issue #5にて完全なフォーマッターを実装)</pre>
          </v-sheet>
        </div>
      </section>
    </main>

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

.pill-btn-active {
  color: #ffffff !important;
  background: rgba(99, 102, 241, 0.3) !important;
  border: 1px solid rgba(99, 102, 241, 0.4) !important;
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.2);
}
</style>
