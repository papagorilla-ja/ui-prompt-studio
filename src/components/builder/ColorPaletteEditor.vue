<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import type { ColorsConfig, ThemeMode } from '@/types/config'

const store = useConfigStore()

interface ColorItemDef {
  key: keyof ColorsConfig
  label: string
  desc: string
  isAccent?: boolean
}

const colorItems: ColorItemDef[] = [
  {
    key: 'base',
    label: 'メイン背景色 (Base / Background)',
    desc: '画面全体の背景。ダーク時は深色、ライト時は白や淡いトーン',
  },
  {
    key: 'surface',
    label: 'コンポーネント背景色 (Surface / Card)',
    desc: 'カードやナビなど、ベース背景の上に配置する要素の色',
  },
  {
    key: 'primaryText',
    label: '主要テキスト色 (Primary Text)',
    desc: '最も読ませたい文字色。背景との十分なコントラストを担保',
  },
  {
    key: 'secondaryText',
    label: '副次的テキスト色 (Secondary Text)',
    desc: '説明文やメタデータ用のグレー色。視線誘導のためコントラストを抑制',
  },
  {
    key: 'accent',
    label: 'アクセントカラー (Accent Color)',
    desc: '最重要CTAやグラフ強調に限定。画面全体の3%未満ルールを自動付与',
    isAccent: true,
  },
  {
    key: 'border',
    label: 'ボーダー・境界線の色 (Border Color)',
    desc: '悪目立ちしない微細な境界線の色',
  },
]

function handleThemeChange(mode: ThemeMode) {
  store.setThemeMode(mode)
}
</script>

<template>
  <div class="color-palette-editor d-flex flex-column gap-3">
    <!-- Prominent Section Header -->
    <div class="section-header justify-space-between mb-1">
      <div class="d-flex align-center gap-2">
        <span class="step-badge">STEP 3</span>
        <div class="icon-box">
          <v-icon icon="mdi-palette-outline" size="16" color="primary" />
        </div>
        <h3 class="section-title">カラーパレット (Roles & Rules)</h3>
      </div>
      <v-chip size="x-small" color="secondary" variant="flat" class="font-weight-bold">
        役割ごと指定
      </v-chip>
    </div>

    <!-- Theme Mode Selector (Dark / Light) -->
    <div class="theme-mode-card linear-card pa-3">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="d-flex align-center gap-2">
          <v-icon icon="mdi-theme-light-dark" size="16" color="primary" />
          <span class="text-body-2 font-weight-bold text-white">テーマモード</span>
        </div>
        <span class="text-caption font-mono text-grey">
          {{ store.isLight ? '☀️ LIGHT MODE' : '🌙 DARK MODE' }}
        </span>
      </div>

      <div class="theme-mode-toggle-group d-flex align-center">
        <button
          id="btn-theme-dark"
          type="button"
          class="theme-mode-btn flex-1 d-flex align-center justify-center gap-2"
          :class="{ 'theme-mode-btn-active': !store.isLight }"
          @click="handleThemeChange('dark')"
        >
          <v-icon icon="mdi-weather-night" size="16" />
          <span>ダークモード</span>
        </button>

        <button
          id="btn-theme-light"
          type="button"
          class="theme-mode-btn flex-1 d-flex align-center justify-center gap-2"
          :class="{ 'theme-mode-btn-active': store.isLight }"
          @click="handleThemeChange('light')"
        >
          <v-icon icon="mdi-white-balance-sunny" size="16" />
          <span>ライトモード</span>
        </button>
      </div>

      <div class="text-caption text-grey mt-2" style="font-size: 0.68rem !important; line-height: 1.3;">
        ※切り替え時に、選択中の世界観に合わせた推奨パレット（白背景 / 深色背景）を自動セットします。
      </div>
    </div>

    <!-- Color Items -->
    <div
      v-for="item in colorItems"
      :key="item.key"
      class="color-card linear-card pa-3"
      :class="{ 'accent-border': item.isAccent }"
    >
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="d-flex align-center gap-2">
          <span class="text-body-2 font-weight-bold text-white">{{ item.label }}</span>
          <v-chip
            v-if="item.isAccent"
            size="x-small"
            color="error"
            variant="flat"
            class="font-weight-bold"
          >
            3% 未満厳守
          </v-chip>
        </div>
      </div>

      <div class="text-caption text-grey-lighten-1 mb-2">{{ item.desc }}</div>

      <!-- Color preview swatch & Hex input -->
      <div class="d-flex align-center gap-2">
        <v-menu :close-on-content-click="false" location="bottom start">
          <template #activator="{ props }">
            <button
              v-bind="props"
              type="button"
              class="color-swatch-btn"
              :style="{ background: store.config.colors[item.key] }"
              title="カラーピッカーを開く"
            />
          </template>
          <v-card class="pa-2 bg-surface-variant">
            <v-color-picker
              v-model="store.config.colors[item.key]"
              mode="hex"
              show-swatches
              hide-inputs
            />
          </v-card>
        </v-menu>

        <v-text-field
          v-model="store.config.colors[item.key]"
          density="compact"
          variant="outlined"
          hide-details
          class="font-mono text-caption flex-grow-1"
          placeholder="#HEX"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.font-mono { font-family: var(--font-mono); }

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

.accent-border {
  border-color: rgba(244, 63, 94, 0.45) !important;
  background: linear-gradient(180deg, rgba(244, 63, 94, 0.12) 0%, rgba(14, 16, 23, 0.7) 100%) !important;
  box-shadow: inset 0 1px 0 rgba(244, 63, 94, 0.3), 0 0 16px rgba(244, 63, 94, 0.15) !important;
}

.color-swatch-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.color-swatch-btn:hover {
  transform: scale(1.06);
  border-color: #6366f1;
}
</style>
