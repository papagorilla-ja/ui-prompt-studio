<script setup lang="ts">
import { ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import BuilderPanel from '@/components/builder/BuilderPanel.vue'
import appLogo from '@/assets/images/logo.jpg'

const store = useConfigStore()

const snackbar = ref(false)
const snackbarText = ref('')

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
    <!-- Studio Header -->
    <header class="studio-header">
      <div class="d-flex align-center gap-3">
        <img :src="appLogo" alt="UI Prompt Studio Logo" class="header-logo" />
        <div>
          <div class="d-flex align-center gap-2">
            <span class="text-h6 font-weight-black tracking-wide bg-gradient-text">UI Prompt Studio</span>
            <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">v0.1.0</v-chip>
          </div>
          <div class="text-caption text-grey-lighten-1" style="font-size: 0.72rem !important; line-height: 1.1;">
            AIフロントエンド指示プロンプト生成スタジオ
          </div>
        </div>
      </div>

      <div class="d-flex align-center gap-2">
        <v-btn
          prepend-icon="mdi-bookmark-outline"
          variant="tonal"
          size="small"
          color="primary"
          @click="showNotification('マイスタイル保存ダイアログ (Issue #6で実装)')"
        >
          マイスタイル保存
        </v-btn>
        <v-btn
          prepend-icon="mdi-code-json"
          variant="tonal"
          size="small"
          @click="showNotification('JSON入出力 (Issue #6で実装)')"
        >
          JSON入出力
        </v-btn>
        <v-btn
          prepend-icon="mdi-share-variant-outline"
          variant="tonal"
          size="small"
          color="secondary"
          @click="showNotification('URL共有 (Issue #7で実装)')"
        >
          URL共有
        </v-btn>
        <v-btn
          icon="mdi-refresh"
          variant="text"
          size="small"
          title="初期値にリセット"
          @click="handleReset"
        />
      </div>
    </header>

    <!-- Studio Main 2-Pane Body -->
    <main class="studio-body">
      <!-- Left Pane: Settings & Builder -->
      <section class="studio-left-pane">
        <div class="left-pane-header pa-4 border-b d-flex align-center justify-space-between sticky-header">
          <div class="d-flex align-center gap-2">
            <div class="icon-box" style="width: 24px; height: 24px;">
              <v-icon icon="mdi-tune" size="16" color="primary" />
            </div>
            <span class="text-subtitle-1 font-weight-bold text-white">詳細設定パネル</span>
          </div>
          <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
            {{ store.config.platform === 'desktop' ? 'Desktop' : 'Web' }} × {{ store.currentDesignSystemMeta.name }}
          </v-chip>
        </div>

        <BuilderPanel />
      </section>

      <!-- Right Pane: Preview (Top) & Prompt (Bottom) -->
      <section class="studio-right-pane">
        <!-- Top: Sandbox Preview -->
        <div class="studio-preview-section">
          <div class="d-flex align-center justify-space-between px-4 py-2 border-b" style="background: rgba(18, 20, 28, 0.7);">
            <div class="text-caption font-weight-bold text-grey-lighten-1 d-flex align-center">
              <v-icon icon="mdi-eye-outline" size="18" class="mr-2" color="secondary" />
              リアルタイム・サンドボックスプレビュー (Issue #4)
            </div>
            <div class="d-flex align-center gap-2">
              <v-btn-toggle density="compact" mandatory size="x-small" color="secondary">
                <v-btn value="100">100%</v-btn>
                <v-btn value="75">75%</v-btn>
                <v-btn value="50">50%</v-btn>
              </v-btn-toggle>
            </div>
          </div>

          <div class="flex-1 d-flex align-center justify-center pa-6 overflow-hidden">
            <!-- Sandbox preview root applying cssVariables -->
            <div
              class="ui-preview-sandbox pa-6 rounded-lg d-flex flex-column align-center justify-center"
              :style="{
                background: store.config.colors.base,
                border: `${store.config.rules.borderWidth}px solid ${store.config.colors.border}`,
                borderRadius: `${store.config.rules.borderRadius}px`,
                width: '90%',
                maxWidth: '600px',
                minHeight: '220px',
                transition: 'all 0.25s ease',
              }"
            >
              <!-- Desktop Titlebar Mockup if Desktop is active -->
              <div
                v-if="store.isDesktop"
                class="w-100 d-flex align-center justify-space-between pb-3 mb-3 border-b"
                style="border-color: rgba(255,255,255,0.1) !important;"
              >
                <div class="d-flex align-center" style="gap: 6px;">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f; display: inline-block;"></span>
                </div>
                <span class="text-caption" :style="{ color: store.config.colors.secondaryText }">My Desktop App</span>
                <div style="width: 40px;"></div>
              </div>

              <div
                class="pa-4 rounded mb-2 text-center w-100"
                :style="{
                  background: store.config.colors.surface,
                  border: `${store.config.rules.borderWidth}px solid ${store.config.colors.border}`,
                  borderRadius: `${store.config.rules.borderRadius}px`,
                }"
              >
                <div class="text-h6 font-weight-bold" :style="{ color: store.config.colors.primaryText }">
                  {{ store.currentDesignSystemMeta.name }}
                </div>
                <div class="text-caption mt-1" :style="{ color: store.config.colors.secondaryText }">
                  Gap: {{ store.config.rules.gap }}px | Radius: {{ store.config.rules.borderRadius }}px | Border: {{ store.config.rules.borderWidth }}px
                </div>
                <v-btn
                  size="small"
                  class="mt-3"
                  :style="{
                    background: store.config.colors.accent,
                    color: '#ffffff',
                    borderRadius: `${store.config.rules.borderRadius}px`,
                  }"
                >
                  Accent Action (3%)
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom: Prompt Output -->
        <div class="studio-prompt-section pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="text-caption font-weight-bold text-grey-lighten-1 d-flex align-center">
              <v-icon icon="mdi-code-braces" size="18" class="mr-2" color="primary" />
              生成プロンプト (Markdown) (Issue #5)
            </div>
            <div class="d-flex align-center gap-2">
              <v-btn
                prepend-icon="mdi-content-copy"
                color="primary"
                size="small"
                variant="flat"
                @click="showNotification('クリップボードにコピーしました！')"
              >
                プロンプトをコピー
              </v-btn>
              <v-btn
                icon="mdi-download"
                size="small"
                variant="tonal"
                @click="showNotification('ui-prompt.md をダウンロードしました')"
              />
            </div>
          </div>

          <v-sheet
            class="pa-3 rounded font-mono text-caption flex-1 overflow-y-auto"
            color="#08090d"
            border
          >
            <pre style="margin: 0; color: #94a3b8; line-height: 1.5;"># UI実装指示プロンプト
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
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.tracking-wide { letter-spacing: 0.05em; }
.font-mono { font-family: var(--font-mono); }
.sticky-header {
  position: sticky;
  top: 0;
  background: rgba(13, 15, 23, 0.95);
  backdrop-filter: blur(12px);
  z-index: 10;
}

.header-logo {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: block;
}

.bg-gradient-text {
  background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
