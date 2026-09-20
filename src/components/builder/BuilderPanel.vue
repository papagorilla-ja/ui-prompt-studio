<script setup lang="ts">
import PlatformSelector from './PlatformSelector.vue'
import DesignSystemSelector from './DesignSystemSelector.vue'
import RulesEditor from './RulesEditor.vue'
import ColorPaletteEditor from './ColorPaletteEditor.vue'
import ComponentsSelector from './ComponentsSelector.vue'
import TechStackAndPurpose from './TechStackAndPurpose.vue'
import ImageAssetSettings from './ImageAssetSettings.vue'
</script>

<template>
  <div class="builder-panel d-flex flex-column gap-4 pa-4">
    <!-- 0. Platform -->
    <PlatformSelector />

    <v-divider class="my-1 border-opacity-25" />

    <!-- 1. Design System -->
    <DesignSystemSelector />

    <v-divider class="my-1 border-opacity-25" />

    <!-- 2. Rules -->
    <RulesEditor />

    <v-divider class="my-1 border-opacity-25" />

    <!-- 3. Colors -->
    <ColorPaletteEditor />

    <v-divider class="my-1 border-opacity-25" />

    <!-- 4. Components -->
    <ComponentsSelector />

    <v-divider class="my-1 border-opacity-25" />

    <!-- 5 & 6. Tech Stack & Purpose -->
    <TechStackAndPurpose />

    <v-divider class="my-1 border-opacity-25" />

    <!-- 7. Image Asset Prompt Generator -->
    <ImageAssetSettings />
  </div>
</template>

<style scoped>
.gap-4 { gap: 16px; }
.builder-panel {
  max-width: 100%;
}
</style>
