<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()
</script>

<template>
  <div class="sandbox-titlebar">
    <div class="sandbox-traffic-lights">
      <span class="traffic-light traffic-red"></span>
      <span class="traffic-light traffic-yellow"></span>
      <span class="traffic-light traffic-green"></span>
    </div>
    <div class="sandbox-titlebar-title">
      {{ store.config.customPurpose ? store.config.customPurpose.slice(0, 24) : 'App Window' }} // {{ store.currentDesignSystemMeta.name }}
    </div>
    <div style="width: 42px;"></div>
  </div>
</template>
