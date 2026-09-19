<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <aside class="sandbox-sidebar">
    <div class="sandbox-sidebar-nav">
      <div class="sandbox-sidebar-link active">
        <v-icon icon="mdi-view-dashboard" size="14" />
        <span>ダッシュボード</span>
      </div>
      <div class="sandbox-sidebar-link">
        <v-icon icon="mdi-chart-line" size="14" />
        <span>統計データ</span>
      </div>
      <div class="sandbox-sidebar-link">
        <v-icon icon="mdi-folder-outline" size="14" />
        <span>プロジェクト</span>
      </div>
      <div class="sandbox-sidebar-link">
        <v-icon icon="mdi-cog-outline" size="14" />
        <span>環境設定</span>
      </div>
    </div>

    <!-- Profile Area -->
    <div v-if="store.config.components.profileArea" class="sandbox-profile-card">
      <div class="sandbox-avatar">
        <span>AI</span>
      </div>
      <div style="line-height: 1.1; overflow: hidden;">
        <div style="font-size: 0.72rem; font-weight: 700; color: var(--ui-text-primary); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
          Pro Member
        </div>
        <div style="font-size: 0.62rem; color: var(--ui-text-secondary);">
          team@workspace.dev
        </div>
      </div>
    </div>
  </aside>
</template>
