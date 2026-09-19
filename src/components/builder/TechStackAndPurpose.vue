<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import type { OutputTechStack } from '@/types/config'

const store = useConfigStore()

const techStacks: { value: OutputTechStack; title: string; desc: string }[] = [
  {
    value: 'react-tailwind',
    title: 'React (TSX) + TailwindCSS',
    desc: 'モダンWeb・ダッシュボード開発の業界標準',
  },
  {
    value: 'vue-tailwind',
    title: 'Vue 3 (SFC) + TailwindCSS',
    desc: '単一ファイルコンポーネント構成',
  },
  {
    value: 'html-vanilla',
    title: 'HTML5 + Vanilla CSS',
    desc: '依存ゼロ・ピュアな静的マークアップ',
  },
  {
    value: 'nextjs-shadcn',
    title: 'Next.js + shadcn/ui',
    desc: '洗練されたRadixベースのモダンUI',
  },
]
</script>

<template>
  <div class="tech-stack-and-purpose d-flex flex-column gap-3">
    <!-- 5. Output Code Stack -->
    <v-card variant="outlined" class="section-card pa-3">
      <div class="section-header gap-2 mb-2">
        <span class="step-badge">STEP 5</span>
        <div class="icon-box">
          <v-icon icon="mdi-code-tags" size="18" color="primary" />
        </div>
        <h3 class="section-title">出力コードスタック指定</h3>
      </div>
      <div class="text-caption text-grey mb-3">
        AIに出力させたいフロントエンドフレームワーク・CSSを指定します
      </div>

      <v-select
        :model-value="store.config.outputTechStack"
        :items="techStacks"
        item-title="title"
        item-value="value"
        density="compact"
        variant="outlined"
        hide-details
        @update:model-value="(val) => store.setOutputTechStack(val as OutputTechStack)"
      >
        <template #item="{ props, item }">
          <v-list-item v-bind="props" :subtitle="item.raw.desc" />
        </template>
      </v-select>
    </v-card>

    <!-- 6. Custom Purpose / Feature Description -->
    <v-card variant="outlined" class="section-card pa-3">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="section-header gap-2">
          <span class="step-badge">STEP 6</span>
          <div class="icon-box">
            <v-icon icon="mdi-text-box-edit-outline" size="18" color="primary" />
          </div>
          <h3 class="section-title">アプリ固有の目的・機能要件</h3>
        </div>
        <v-btn
          v-if="store.config.customPurpose"
          size="x-small"
          variant="text"
          color="grey"
          @click="store.setCustomPurpose('')"
        >
          クリア
        </v-btn>
      </div>
      <div class="text-caption text-grey mb-3">
        作成したいアプリの具体的な機能やターゲット層を記入すると、プロンプトに自然に織り込まれます
      </div>

      <v-textarea
        :model-value="store.config.customPurpose"
        placeholder="例: 暗号資産のポートフォリオトラッカー。リアルタイムな価格チャートと損益シミュレーション、最新のトランザクション履歴を表示する。"
        rows="3"
        auto-grow
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="(val) => store.setCustomPurpose(val)"
      />
    </v-card>
  </div>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.section-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 10px !important;
}
</style>
