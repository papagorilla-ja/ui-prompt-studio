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


    <v-row dense>
      <v-col v-for="p in platforms" :key="p.value" cols="6">
        <div
          class="platform-card linear-card pa-3 cursor-pointer"
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
              <span class="text-body-2 font-weight-bold text-white">{{ p.title }}</span>
            </div>
            <v-icon
              v-if="store.config.platform === p.value"
              icon="mdi-check-circle"
              color="primary"
              size="18"
            />
          </div>
          <div class="text-caption text-grey-lighten-1 text-truncate-2">
            {{ p.desc }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.platform-card {
  position: relative;
  overflow: hidden;
}

.active-platform {
  border-color: #6366f1 !important;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.18) 0%, rgba(56, 189, 248, 0.08) 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 20px rgba(99, 102, 241, 0.25) !important;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
}
.gap-2 { gap: 8px; }
</style>
