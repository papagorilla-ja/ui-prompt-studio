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
    desc: '画面全体の背景。純黒(#000000)よりわずかにニュアンスを含む色',
  },
  {
    key: 'surface',
    label: 'コンポーネント背景色 (Surface / Card)',
    desc: 'カードやナビなど、ベース背景の上に浮いた要素の色',
  },
  {
    key: 'primaryText',
    label: '主要テキスト色 (Primary Text)',
    desc: '最も読ませたい文字色。目に優しいオフホワイトを推奨',
  },
  {
    key: 'secondaryText',
    label: '副次的テキスト色 (Secondary Text)',
    desc: '説明文やメタデータ用のグレー色。視線誘導のためコントラストを抑制',
  },
  {
    key: 'accent',
    label: 'アクセントカラー (Accent Color)',
    desc: '重要CTAやグラフ強調に限定。画面全体の3%未満ルールを自動付与',
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
    <!-- Header -->
    <div class="d-flex align-center justify-space-between">
      <div class="text-caption font-weight-bold text-grey-lighten-1 d-flex align-center">
        <v-icon icon="mdi-palette-outline" size="16" class="mr-1 text-primary" />
        3. カラーパレット (Roles & Rules)
      </div>
      <v-chip size="x-small" color="secondary" variant="tonal">
        役割ごとに1色指定
      </v-chip>
    </div>

    <!-- Color Items -->
    <v-card
      v-for="item in colorItems"
      :key="item.key"
      variant="outlined"
      class="color-card pa-3"
      :class="{ 'accent-border': item.isAccent }"
    >
      <div class="d-flex align-center justify-space-between mb-1">
        <div class="d-flex align-center gap-2">
          <span class="text-body-2 font-weight-medium">{{ item.label }}</span>
          <v-chip
            v-if="item.isAccent"
            size="x-small"
            color="error"
            variant="flat"
            class="font-weight-bold"
          >
            使用率 3% 未満厳守
          </v-chip>
        </div>
      </div>

      <div class="text-caption text-grey mb-2">{{ item.desc }}</div>

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
    </v-card>
  </div>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.font-mono { font-family: var(--font-mono); }

.color-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 8px !important;
}

.accent-border {
  border-color: rgba(244, 63, 94, 0.3) !important;
  background: rgba(244, 63, 94, 0.03) !important;
}

.color-swatch-btn {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.color-swatch-btn:hover {
  transform: scale(1.05);
  border-color: #6366f1;
}
</style>
