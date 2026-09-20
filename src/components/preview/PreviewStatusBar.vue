<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()

const stackBadge = computed(() => {
  const map: Record<string, string> = {
    'react-tailwind': 'React+Tailwind',
    'vue-tailwind': 'Vue 3+Tailwind',
    'html-vanilla': 'HTML5+CSS',
    'html-single-file': 'Single-file HTML (GAS)',
    'nextjs-shadcn': 'Next.js+shadcn',
  }
  return map[store.config.outputTechStack] || store.config.outputTechStack
})
</script>

<template>
  <footer v-if="store.config.components.statusBar" class="sandbox-status-bar">
    <!-- Left: Status & Environment -->
    <div class="d-flex align-center gap-3">
      <div class="d-flex align-center gap-1">
        <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 6px #10b981;"></span>
        <span style="font-weight: 700; color: var(--ui-text-primary);">READY</span>
      </div>
      <span style="opacity: 0.3;">|</span>
      <span>main: @a9f4c02</span>
      <span style="opacity: 0.3;">|</span>
      <span>{{ store.config.platform === 'desktop' ? 'Desktop App' : 'Web App' }}</span>
    </div>

    <!-- Right: Metrics & Encoding -->
    <div class="d-flex align-center gap-3">
      <span>14ms</span>
      <span style="opacity: 0.3;">|</span>
      <span>UTF-8</span>
      <span style="opacity: 0.3;">|</span>
      <span style="color: var(--ui-accent); font-weight: 700;">{{ stackBadge }}</span>
    </div>
  </footer>
</template>
