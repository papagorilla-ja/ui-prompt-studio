<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import type { PlatformType } from '@/types/config'

const store = useConfigStore()

const platforms: { value: PlatformType; title: string; icon: string; desc: string }[] = [
  {
    value: 'web',
    title: 'Web アプリケーション',
    icon: 'mdi-web',
    desc: 'SaaS、ダッシュボード、管理画面、SPA (中央配置・レスポンシブWeb)',
  },
  {
    value: 'desktop',
    title: 'デスクトップアプリ',
    icon: 'mdi-laptop',
    desc: 'Tauri, Electron, macOS/Winアプリ (タイトルバー・高密度レイアウト)',
  },
]
</script>

<template>
  <div class="platform-selector">
    <!-- Prominent Section Header -->
    <div class="section-header gap-2 mb-3">
      <span class="step-badge">STEP 0</span>
      <div class="icon-box">
        <v-icon icon="mdi-devices" size="18" color="primary" />
      </div>
      <h3 class="section-title">ターゲットアプリ種別</h3>
    </div>

    <v-row dense>
      <v-col v-for="p in platforms" :key="p.value" cols="6">
        <v-card
          variant="outlined"
          class="platform-card pa-3 cursor-pointer transition-all"
          :class="{
            'active-platform': store.config.platform === p.value,
          }"
          @click="store.setPlatform(p.value)"
        >
          <div class="d-flex align-center justify-space-between mb-1">
            <div class="d-flex align-center gap-2">
              <v-icon
                :icon="p.icon"
                :color="store.config.platform === p.value ? 'primary' : 'grey'"
                size="20"
              />
              <span class="text-body-2 font-weight-bold">{{ p.title }}</span>
            </div>
            <v-icon
              v-if="store.config.platform === p.value"
              icon="mdi-check-circle"
              color="primary"
              size="18"
            />
          </div>
          <div class="text-caption text-grey text-truncate-2">
            {{ p.desc }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.platform-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
  background: rgba(255, 255, 255, 0.02) !important;
  border-radius: 10px !important;
}

.platform-card:hover {
  border-color: rgba(99, 102, 241, 0.4) !important;
  background: rgba(99, 102, 241, 0.05) !important;
}

.active-platform {
  border-color: #6366f1 !important;
  background: rgba(99, 102, 241, 0.12) !important;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.25);
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
}
.gap-2 { gap: 8px; }
.transition-all { transition: all 0.2s ease; }
</style>
