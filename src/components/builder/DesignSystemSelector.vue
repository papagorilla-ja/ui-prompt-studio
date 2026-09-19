<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import { DESIGN_SYSTEMS } from '@/constants/presets'
import type { DesignSystemType } from '@/types/config'

import bentoImg from '@/assets/images/ds-bento.jpg'
import brutalismImg from '@/assets/images/ds-brutalism.jpg'
import minimalImg from '@/assets/images/ds-minimal.jpg'
import retroImg from '@/assets/images/ds-retrofuturistic.jpg'
import glassImg from '@/assets/images/ds-glassmorphism.jpg'

const store = useConfigStore()

const systemImages: Record<DesignSystemType, string> = {
  bento: bentoImg,
  brutalism: brutalismImg,
  minimal: minimalImg,
  retrofuturistic: retroImg,
  glassmorphism: glassImg,
}

const systems = Object.values(DESIGN_SYSTEMS)
</script>

<template>
  <div class="design-system-selector">
    <!-- Prominent Section Header -->
    <div class="section-header justify-space-between mb-3">
      <div class="d-flex align-center gap-2">
        <span class="step-badge">STEP 1</span>
        <div class="icon-box">
          <v-icon icon="mdi-shape-outline" size="18" color="primary" />
        </div>
        <h3 class="section-title">デザインシステム・世界観</h3>
      </div>
      <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold">
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
        <div class="d-flex align-center gap-3">
          <!-- AI Generated Visual Thumbnail Preview -->
          <div class="system-thumbnail-container">
            <img
              :src="systemImages[s.id as DesignSystemType]"
              :alt="s.name"
              class="system-thumbnail"
            />
            <div
              v-if="store.config.designSystem === s.id"
              class="selected-check-badge"
            >
              <v-icon icon="mdi-check" size="14" color="white" />
            </div>
          </div>

          <!-- System Info -->
          <div class="flex-grow-1">
            <div class="d-flex align-center justify-space-between mb-1">
              <div class="d-flex align-center gap-2">
                <span class="text-body-2 font-weight-bold text-white">{{ s.name }}</span>
                <v-chip
                  v-if="s.id === 'bento'"
                  size="x-small"
                  color="secondary"
                  variant="flat"
                  class="font-weight-bold"
                >
                  人気No.1
                </v-chip>
              </div>
              <v-icon
                :icon="store.config.designSystem === s.id ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
                :color="store.config.designSystem === s.id ? 'primary' : 'grey-darken-1'"
                size="18"
              />
            </div>

            <div class="text-caption text-grey-lighten-1 mb-1 line-clamp-1">
              {{ s.subtitle }}
            </div>

            <div class="text-caption text-grey-darken-1 line-clamp-2">
              {{ s.description }}
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.transition-all { transition: all 0.2s ease; }

.system-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 10px !important;
}

.system-card:hover {
  border-color: rgba(99, 102, 241, 0.4) !important;
  background: rgba(99, 102, 241, 0.04) !important;
}

.active-system {
  border-color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.12) !important;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

.system-thumbnail-container {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.system-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.selected-check-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
