<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <nav class="sandbox-navbar">
    <div class="sandbox-nav-brand">
      <span style="width: 8px; height: 8px; border-radius: 2px; background: var(--ui-accent); display: inline-block;"></span>
      <span>{{ store.config.customPurpose ? store.config.customPurpose.slice(0, 18) : 'AppStudio' }}</span>
    </div>

    <div class="sandbox-nav-links">
      <span style="color: var(--ui-text-primary); font-weight: 700;">ダッシュボード</span>
      <span>アナリティクス</span>
      <span>プロジェクト</span>
      <span>設定</span>
    </div>

    <div>
      <button type="button" class="sandbox-btn sandbox-btn-accent" style="padding: 4px 10px; font-size: 0.7rem;">
        新規作成
      </button>
    </div>
  </nav>
</template>
