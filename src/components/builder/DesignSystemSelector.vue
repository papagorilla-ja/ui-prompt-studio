<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import { DESIGN_SYSTEMS } from '@/constants/presets'
import type { DesignSystemType } from '@/types/config'

const store = useConfigStore()
const systems = Object.values(DESIGN_SYSTEMS)
</script>

<template>
  <div class="design-system-selector">
    <div class="d-flex align-center justify-space-between mb-2">
      <div class="text-caption font-weight-bold text-grey-lighten-1 d-flex align-center">
        <v-icon icon="mdi-shape-outline" size="16" class="mr-1 text-primary" />
        1. デザインシステム・世界観
      </div>
      <v-chip size="x-small" color="primary" variant="tonal">
        推奨初期値自動適用
      </v-chip>
    </div>

    <div class="systems-grid d-flex flex-column gap-2">
      <v-card
        v-for="s in systems"
        :key="s.id"
        variant="outlined"
        class="system-card pa-3 cursor-pointer transition-all"
        :class="{
          'active-system': store.config.designSystem === s.id,
        }"
        @click="store.setDesignSystem(s.id as DesignSystemType)"
      >
        <div class="d-flex align-center justify-space-between mb-1">
          <div class="d-flex align-center gap-2">
            <span class="text-body-2 font-weight-bold">{{ s.name }}</span>
            <v-chip
              v-if="s.id === 'bento'"
              size="x-small"
              color="secondary"
              variant="flat"
            >
              トレンドNo.1
            </v-chip>
          </div>
          <v-icon
            v-if="store.config.designSystem === s.id"
            icon="mdi-radiobox-marked"
            color="primary"
            size="18"
          />
          <v-icon
            v-else
            icon="mdi-radiobox-blank"
            color="grey-darken-1"
            size="18"
          />
        </div>

        <div class="text-caption text-grey-lighten-1 mb-1">
          {{ s.subtitle }}
        </div>

        <div class="text-caption text-grey-darken-1">
          {{ s.description }}
        </div>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.transition-all { transition: all 0.2s ease; }

.system-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 8px !important;
}

.system-card:hover {
  border-color: rgba(99, 102, 241, 0.4) !important;
  background: rgba(99, 102, 241, 0.04) !important;
}

.active-system {
  border-color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.1) !important;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.15);
}
</style>
