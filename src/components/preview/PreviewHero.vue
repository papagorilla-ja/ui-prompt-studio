<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <div class="sandbox-hero">
    <div class="sandbox-hero-title">
      {{ store.currentDesignSystemMeta.name }}
    </div>
    <div class="sandbox-hero-desc">
      {{ store.currentDesignSystemMeta.description }}
    </div>
    <div class="d-flex align-center gap-2 mt-2">
      <button type="button" class="sandbox-btn sandbox-btn-accent">
        <span>今すぐ始める</span>
        <v-icon icon="mdi-arrow-right" size="13" />
      </button>
      <button type="button" class="sandbox-btn sandbox-btn-secondary">
        <span>ドキュメントを見る</span>
      </button>
    </div>
  </div>
</template>
