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
    value: 'html-single-file',
    title: '単一HTML完結 (GAS / ローカル即時実行)',
    desc: 'ビルド不要。<style><script>内包でGASや直接実行に対応',
  },
  {
    value: 'nextjs-shadcn',
    title: 'Next.js + shadcn/ui',
    desc: '洗練されたRadixベースのモダンUI',
  },
]
</script>

<template>
  <div class="tech-stack-selector">
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
  </div>
</template>
