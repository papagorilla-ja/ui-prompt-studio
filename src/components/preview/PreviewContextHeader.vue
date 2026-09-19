<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <div class="sandbox-context-header">
    <div>
      <div class="sandbox-breadcrumb">
        ワークスペース / {{ store.config.platform === 'desktop' ? 'Desktop Client' : 'Web Console' }}
      </div>
      <div class="sandbox-page-title">
        {{ store.config.customPurpose ? store.config.customPurpose.slice(0, 30) : 'ダッシュボード概要' }}
      </div>
    </div>

    <div class="sandbox-search-box">
      <v-icon icon="mdi-magnify" size="13" />
      <span>クイック検索...</span>
      <span style="font-size: 0.6rem; opacity: 0.6; font-family: var(--font-mono); margin-left: 6px;">⌘K</span>
    </div>
  </div>
</template>
