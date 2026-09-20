<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()

const radiusPresets = [
  { label: '0px (鋭角)', value: 0 },
  { label: '4px', value: 4 },
  { label: '8px', value: 8 },
  { label: '12px', value: 12 },
  { label: '16px (Bento)', value: 16 },
  { label: '24px', value: 24 },
  { label: '丸 (9999px)', value: 9999 },
]

const maxWidthOptions = [
  { label: '1024px', value: '1024px' },
  { label: '1280px (標準)', value: '1280px' },
  { label: '1440px (広め)', value: '1440px' },
  { label: '1600px (特大)', value: '1600px' },
  { label: '100% (フル幅)', value: '100%' },
]

const h1SizeOptions = [
  { label: '2.5rem (40px)', value: '2.5rem' },
  { label: '3.0rem (48px)', value: '3.0rem' },
  { label: '3.5rem (56px: 推奨)', value: '3.5rem' },
  { label: '4.0rem (64px)', value: '4.0rem' },
]

const h1WeightOptions = [
  { label: '700 (Bold)', value: 700 },
  { label: '800 (ExtraBold)', value: 800 },
  { label: '900 (Black)', value: 900 },
]
</script>

<template>
  <div class="rules-editor d-flex flex-column gap-3">
    <!-- Prominent Section Header -->
    <div class="section-header gap-2 mb-2">
      <span class="step-badge">STEP 2</span>
      <div class="icon-box">
        <v-icon icon="mdi-ruler-square" size="16" color="primary" />
      </div>
      <h3 class="section-title">数値ルール (Design Tokens)</h3>
    </div>

    <!-- 1. Grid Gap -->
    <div class="linear-card pa-3">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="text-body-2 font-weight-bold text-white">グリッド間隔 (gap)</span>
        <v-chip size="x-small" color="primary" variant="flat" class="font-mono font-weight-bold">
          {{ store.config.rules.gap }}px
        </v-chip>
      </div>
      <div class="text-caption text-grey mb-2">カードやコンテンツ同士の隙間</div>
      <v-slider
        v-model="store.config.rules.gap"
        :min="8"
        :max="48"
        :step="2"
        color="primary"
        hide-details
        density="compact"
      />
    </div>

    <!-- 2. Padding -->
    <div class="linear-card pa-3">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="text-body-2 font-weight-bold text-white">コンポーネント内側余白 (padding)</span>
        <v-chip size="x-small" color="primary" variant="flat" class="font-mono font-weight-bold">
          {{ store.config.rules.padding }}px
        </v-chip>
      </div>
      <div class="text-caption text-grey mb-2">カード内は指定値、セクション間は64px以上</div>
      <v-slider
        v-model="store.config.rules.padding"
        :min="8"
        :max="48"
        :step="2"
        color="primary"
        hide-details
        density="compact"
      />
    </div>

    <!-- 2.5 Button Gap (ボタン間隔) -->
    <div class="linear-card pa-3">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="text-body-2 font-weight-bold text-white">ボタン・アクション間隔 (buttonGap)</span>
        <v-chip size="x-small" color="primary" variant="flat" class="font-mono font-weight-bold">
          {{ store.config.rules.buttonGap ?? 10 }}px
        </v-chip>
      </div>
      <div class="text-caption text-grey mb-2">アクションボタン同士の隙間。誤操作防止と視覚的リズムを調整</div>
      <v-slider
        v-model="store.config.rules.buttonGap"
        :min="4"
        :max="24"
        :step="2"
        color="primary"
        hide-details
        density="compact"
      />
    </div>

    <!-- 3. Border Radius -->
    <div class="linear-card pa-3">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="text-body-2 font-weight-bold text-white">角丸の半径 (border-radius)</span>
        <v-chip size="x-small" color="primary" variant="flat" class="font-mono font-weight-bold">
          {{ store.config.rules.borderRadius }}px
        </v-chip>
      </div>
      <div class="text-caption text-grey mb-2">サイトの印象を左右する丸み</div>
      <v-slider
        v-if="store.config.rules.borderRadius <= 32"
        v-model="store.config.rules.borderRadius"
        :min="0"
        :max="32"
        :step="2"
        color="primary"
        hide-details
        density="compact"
        class="mb-2"
      />
      <!-- Quick radius chips -->
      <div class="d-flex flex-wrap gap-1 mt-1">
        <v-chip
          v-for="r in radiusPresets"
          :key="r.value"
          size="x-small"
          :variant="store.config.rules.borderRadius === r.value ? 'flat' : 'outlined'"
          :color="store.config.rules.borderRadius === r.value ? 'primary' : 'default'"
          class="cursor-pointer font-weight-medium"
          @click="store.updateRules({ borderRadius: r.value })"
        >
          {{ r.label }}
        </v-chip>
      </div>
    </div>

    <!-- 4. Border Width -->
    <div class="linear-card pa-3">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="text-body-2 font-weight-bold text-white">境界線の太さ (border-width)</span>
        <v-chip size="x-small" color="primary" variant="flat" class="font-mono font-weight-bold">
          {{ store.config.rules.borderWidth }}px
        </v-chip>
      </div>
      <div class="text-caption text-grey mb-2">ミニマルなら1px、ブルータリズムなら2px</div>
      <v-btn-toggle
        :model-value="store.config.rules.borderWidth"
        mandatory
        density="compact"
        color="primary"
        class="w-100"
        @update:model-value="(val) => store.updateRules({ borderWidth: val as number })"
      >
        <v-btn :value="0" class="flex-grow-1">0px (線なし)</v-btn>
        <v-btn :value="1" class="flex-grow-1 font-weight-bold">1px (極細)</v-btn>
        <v-btn :value="2" class="flex-grow-1 font-weight-bold">2px (強調)</v-btn>
        <v-btn :value="3" class="flex-grow-1">3px (太線)</v-btn>
      </v-btn-toggle>
    </div>

    <!-- 5. Typography Scale -->
    <div class="linear-card pa-3">
      <div class="text-body-2 font-weight-bold text-white mb-1">タイポグラフィ比率（ジャンプ率）</div>
      <div class="text-caption text-grey mb-3">見出しと本文の明確なメリハリ</div>

      <v-row dense>
        <v-col cols="6">
          <v-select
            v-model="store.config.rules.h1Size"
            :items="h1SizeOptions"
            item-title="label"
            item-value="value"
            label="見出し (h1) サイズ"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="store.config.rules.h1Weight"
            :items="h1WeightOptions"
            item-title="label"
            item-value="value"
            label="見出し 太さ"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>
      </v-row>
    </div>

    <!-- 6. Content Max Width -->
    <div class="linear-card pa-3">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="text-body-2 font-weight-bold text-white">コンテンツ最大幅 (max-width)</span>
        <v-chip size="x-small" color="primary" variant="flat" class="font-mono font-weight-bold">
          {{ store.config.rules.maxWidth }}
        </v-chip>
      </div>
      <div class="text-caption text-grey mb-2">画面横の広がりすぎを防ぐ上限値</div>
      <div class="d-flex flex-wrap gap-1">
        <v-chip
          v-for="w in maxWidthOptions"
          :key="w.value"
          size="x-small"
          :variant="store.config.rules.maxWidth === w.value ? 'flat' : 'outlined'"
          :color="store.config.rules.maxWidth === w.value ? 'primary' : 'default'"
          class="cursor-pointer font-weight-medium"
          @click="store.updateRules({ maxWidth: w.value })"
        >
          {{ w.label }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.font-mono { font-family: var(--font-mono); }
</style>
