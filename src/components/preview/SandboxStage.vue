<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import PreviewTitlebar from './PreviewTitlebar.vue'
import PreviewNavbar from './PreviewNavbar.vue'
import PreviewSidebar from './PreviewSidebar.vue'
import PreviewContextHeader from './PreviewContextHeader.vue'
import PreviewHero from './PreviewHero.vue'
import PreviewBentoGrid from './PreviewBentoGrid.vue'
import PreviewForm from './PreviewForm.vue'
import PreviewStatusBar from './PreviewStatusBar.vue'

interface Props {
  zoom?: string
  density?: string
}

withDefaults(defineProps<Props>(), {
  zoom: '100',
  density: 'default'
})

const store = useConfigStore()

// Bind user-selected numerical rules and colors directly as CSS variables
const cssVariables = computed(() => ({
  '--ui-bg': store.config.colors.base,
  '--ui-surface': store.config.colors.surface,
  '--ui-border': store.config.colors.border,
  '--ui-accent': store.config.colors.accent,
  '--ui-text-primary': store.config.colors.primaryText,
  '--ui-text-secondary': store.config.colors.secondaryText,
  '--ui-radius': `${store.config.rules.borderRadius}px`,
  '--ui-padding': `${store.config.rules.padding}px`,
  '--ui-gap': `${store.config.rules.gap}px`,
  '--ui-border-width': `${store.config.rules.borderWidth}px`,
}))

const hasMainContent = computed(() => {
  const c = store.config.components
  return c.contextHeader || c.heroSection || c.bentoContainer || c.statCards || c.charts || c.activityTable || c.minimalForm || c.actionButtons
})
</script>

<template>
  <div class="sandbox-stage-wrapper">
    <div
      class="sandbox-scaler"
      :style="{
        transform: `scale(${Number(zoom) / 100})`,
        transformOrigin: 'top center',
      }"
    >
      <div
        class="ui-preview-sandbox"
        :class="[
          `system-${store.config.designSystem}`,
          `density-${density}`,
        ]"
        :style="[
          cssVariables,
          {
            maxWidth: store.config.rules.maxWidth === '100%' ? '840px' : store.config.rules.maxWidth,
            width: '100%',
            boxShadow: store.config.designSystem === 'brutalism'
              ? '4px 4px 0px #ffffff'
              : '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          }
        ]"
      >
        <!-- 1. Window Titlebar (macOS traffic lights for Desktop mode) -->
        <PreviewTitlebar v-if="store.isDesktop && store.config.components.titlebar" />

        <!-- 2. Global Navbar -->
        <PreviewNavbar v-if="store.config.components.navbar" />

        <!-- 3. Main Body: Sidebar + Main Content -->
        <div class="sandbox-body-layout">
          <!-- Sidebar -->
          <PreviewSidebar v-if="store.config.components.sidebar" />

          <!-- Content Canvas -->
          <div class="sandbox-content-area">
            <!-- Context Header (Breadcrumb + Search) -->
            <PreviewContextHeader v-if="store.config.components.contextHeader" />

            <!-- Hero Section -->
            <PreviewHero v-if="store.config.components.heroSection" />

            <!-- Bento Modular Grid (Stats, Chart, Activity Log) -->
            <PreviewBentoGrid v-if="store.config.components.bentoContainer || store.config.components.statCards || store.config.components.charts || store.config.components.activityTable" />

            <!-- Minimal Form & Action Buttons -->
            <PreviewForm v-if="store.config.components.minimalForm || store.config.components.actionButtons" />

            <!-- Fallback if all content components are disabled -->
            <div
              v-if="!hasMainContent"
              class="sandbox-card d-flex align-center justify-center pa-8 text-center"
              style="min-height: 200px; border-style: dashed;"
            >
              <div style="color: var(--ui-text-secondary); font-size: 0.8rem;">
                <v-icon icon="mdi-view-dashboard-outline" size="32" class="mb-2" style="opacity: 0.5;" />
                <div style="font-weight: 700;">表示するコンテンツが選択されていません</div>
                <div style="font-size: 0.72rem; opacity: 0.7; margin-top: 4px;">
                  左ペインの「4. 実装コンポーネント選択」から表示したいパーツにチェックを入れてください
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Status Bar (Footer) -->
        <PreviewStatusBar v-if="store.config.components.statusBar" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sandbox-stage-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
  padding: 24px 16px 40px 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.sandbox-scaler {
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
