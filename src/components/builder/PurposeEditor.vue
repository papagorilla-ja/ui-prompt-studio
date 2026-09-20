<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <div class="purpose-editor">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-caption text-grey">
        作成したいアプリの具体的な機能やターゲット層を記入すると、プロンプトに自然に織り込まれます
      </span>
      <v-btn
        v-if="store.config.customPurpose"
        size="x-small"
        variant="text"
        color="grey"
        class="ml-2 flex-shrink-0"
        @click="store.setCustomPurpose('')"
      >
        クリア
      </v-btn>
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
  </div>
</template>
