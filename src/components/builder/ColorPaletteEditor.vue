<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import type { ColorsConfig } from '@/types/config'

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


</script>

<template>
  <div class="color-palette-editor d-flex flex-column gap-3">


    <!-- Active Theme Mode Banner -->
    <div class="linear-card pa-2 px-3 d-flex align-center justify-space-between">
      <div class="d-flex align-center gap-2">
        <v-icon :icon="store.isLight ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" size="16" :color="store.isLight ? 'warning' : 'primary'" />
        <span class="text-caption text-white font-weight-bold">
          現在: {{ store.isLight ? 'ライトモードパレット' : 'ダークモードパレット' }}
        </span>
      </div>
      <span class="text-caption text-grey font-mono" style="font-size: 0.68rem !important;">
        (STEP 1上部で切替可能)
      </span>
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
