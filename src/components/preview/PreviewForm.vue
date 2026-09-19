<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <div v-if="store.config.components.minimalForm || store.config.components.actionButtons" class="sandbox-card col-span-12">
    <div class="d-flex align-center justify-space-between mb-3">
      <span class="stat-card-label">クイックアクション設定</span>
      <span class="font-mono" style="font-size: 0.65rem; color: var(--ui-text-secondary);">FORM & ACTIONS</span>
    </div>

    <!-- Minimal Form Fields -->
    <div v-if="store.config.components.minimalForm" class="d-flex flex-column gap-2 mb-3">
      <div>
        <label style="display: block; font-size: 0.7rem; font-weight: 600; color: var(--ui-text-secondary); margin-bottom: 4px;">
          デプロイ識別名
        </label>
        <input
          type="text"
          class="sandbox-input"
          placeholder="v2.4.0-edge-release"
          value="v2.4.0-edge-release"
        />
      </div>

      <div class="d-flex gap-2">
        <div style="flex: 1;">
          <label style="display: block; font-size: 0.7rem; font-weight: 600; color: var(--ui-text-secondary); margin-bottom: 4px;">
            ターゲット環境
          </label>
          <select
            class="sandbox-input"
            style="cursor: pointer;"
          >
            <option>Production (Edge Cluster)</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
        </div>

        <div style="flex: 1;">
          <label style="display: block; font-size: 0.7rem; font-weight: 600; color: var(--ui-text-secondary); margin-bottom: 4px;">
            レプリカ数
          </label>
          <input
            type="number"
            class="sandbox-input"
            value="3"
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="store.config.components.actionButtons" class="d-flex align-center justify-end gap-2 pt-2 border-t" style="border-color: rgba(255,255,255,0.06) !important;">
      <button type="button" class="sandbox-btn sandbox-btn-secondary">
        キャンセル
      </button>
      <button type="button" class="sandbox-btn sandbox-btn-accent">
        <v-icon icon="mdi-rocket-launch-outline" size="13" />
        <span>変更をデプロイ</span>
      </button>
    </div>
  </div>
</template>
