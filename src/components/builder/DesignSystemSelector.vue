<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import { DESIGN_SYSTEMS } from '@/constants/presets'
import type { DesignSystemType } from '@/types/config'

import bentoImg from '@/assets/images/ds-bento.jpg'
import brutalismImg from '@/assets/images/ds-brutalism.jpg'
import minimalImg from '@/assets/images/ds-minimal.jpg'
import retroImg from '@/assets/images/ds-retrofuturistic.jpg'
import glassImg from '@/assets/images/ds-glassmorphism.jpg'
import kawaiiImg from '@/assets/images/ds-kawaii.jpg'
import gamingImg from '@/assets/images/ds-gaming.jpg'

const store = useConfigStore()

const systemImages: Record<DesignSystemType, string> = {
  bento: bentoImg,
  brutalism: brutalismImg,
  minimal: minimalImg,
  retrofuturistic: retroImg,
  glassmorphism: glassImg,
  kawaii: kawaiiImg,
  gaming: gamingImg,
}

const systems = Object.values(DESIGN_SYSTEMS)
</script>

<template>
  <div class="design-system-selector">
    <!-- Prominent Section Header -->
    <div class="section-header justify-space-between mb-1">
      <div class="d-flex align-center gap-2">
        <span class="step-badge">STEP 1</span>
        <div class="icon-box">
          <v-icon icon="mdi-shape-outline" size="16" color="primary" />
        </div>
        <h3 class="section-title">デザインシステム・世界観</h3>
      </div>
      <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
        推奨初期値自動適用
      </v-chip>
    </div>
    <p class="step-guide-subtext">
      アプリ全体のデザイン思想・世界観を決定します。選択時に最適な余白数値と推奨パレットが自動適用されます。
    </p>

    <!-- Theme Mode Selector (Dark / Light) Placed prominently at top of STEP 1 -->
    <div class="theme-mode-card linear-card pa-3 mb-3">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-theme-light-dark" size="16" color="primary" />
          <span class="text-body-2 font-weight-bold text-white">カラーテーマモード</span>
        </div>
        <span class="text-caption font-mono text-grey font-weight-bold">
          {{ store.isLight ? '☀️ LIGHT MODE' : '🌙 DARK MODE' }}
        </span>
      </div>

      <div class="theme-mode-toggle-group d-flex align-center">
        <button
          id="btn-theme-dark"
          type="button"
          class="theme-mode-btn flex-1 d-flex align-center justify-center gap-2"
          :class="{ 'theme-mode-btn-active': !store.isLight }"
          @click="store.setThemeMode('dark')"
        >
          <v-icon icon="mdi-weather-night" size="16" />
          <span>ダークモード</span>
        </button>

        <button
          id="btn-theme-light"
          type="button"
          class="theme-mode-btn flex-1 d-flex align-center justify-center gap-2"
          :class="{ 'theme-mode-btn-active': store.isLight }"
          @click="store.setThemeMode('light')"
        >
          <v-icon icon="mdi-white-balance-sunny" size="16" />
          <span>ライトモード</span>
        </button>
      </div>

      <div class="text-caption text-grey mt-2" style="font-size: 0.68rem !important; line-height: 1.3;">
        ※切り替え時に、選択中の世界観に合わせた推奨カラーパレット（白背景 / 深色背景）を自動セットします。
      </div>
    </div>

    <div class="systems-grid d-flex flex-column gap-2">
      <div
        v-for="s in systems"
        :key="s.id"
        class="system-card linear-card pa-3 cursor-pointer"
        :class="{
          'active-system': store.config.designSystem === s.id,
        }"
        @click="store.setDesignSystem(s.id as DesignSystemType)"
      >
        <div class="d-flex align-center gap-3">
          <!-- AI Generated Visual Thumbnail Preview -->
          <div class="system-thumbnail-container">
            <img
              :src="systemImages[s.id as DesignSystemType]"
              :alt="s.name"
              class="system-thumbnail"
            />
            <div
              v-if="store.config.designSystem === s.id"
              class="selected-check-badge"
            >
              <v-icon icon="mdi-check" size="14" color="white" />
            </div>
          </div>

          <!-- System Info -->
          <div class="flex-grow-1 overflow-hidden">
            <div class="d-flex align-center justify-space-between mb-1">
              <div class="d-flex align-center gap-2">
                <span class="text-body-2 font-weight-bold text-white">{{ s.name }}</span>
                <v-chip
                  v-if="s.id === 'bento'"
                  size="x-small"
                  color="secondary"
                  variant="flat"
                  class="font-weight-bold"
                >
                  人気No.1
                </v-chip>
              </div>
              <v-icon
                :icon="store.config.designSystem === s.id ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
                :color="store.config.designSystem === s.id ? 'primary' : 'grey-darken-1'"
                size="18"
              />
            </div>

            <div class="text-caption text-grey-lighten-2 mb-1 line-clamp-1">
              {{ s.subtitle }}
            </div>

            <div class="text-caption text-grey line-clamp-2">
              {{ s.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.active-system {
  border-color: #6366f1 !important;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.18) 0%, rgba(56, 189, 248, 0.08) 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 20px rgba(99, 102, 241, 0.25) !important;
}

.system-thumbnail-container {
  width: 68px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.system-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.selected-check-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.theme-mode-toggle-group {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 3px;
  gap: 4px;
}

.theme-mode-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-mode-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.theme-mode-btn-active {
  color: #ffffff !important;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.85), rgba(56, 189, 248, 0.85)) !important;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}
</style>
