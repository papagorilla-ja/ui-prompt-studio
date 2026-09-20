<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    stepNumber: number | string
    title: string
    icon: string
    guideText?: string
    badgeTag?: string
    modelValue?: boolean
  }>(),
  {
    modelValue: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="step-accordion-item linear-card mb-3" :class="{ 'is-open': modelValue }">
    <!-- Clickable Header -->
    <button
      type="button"
      class="accordion-header px-4 py-3 d-flex align-center justify-space-between w-100"
      @click="toggle"
    >
      <div class="d-flex align-center gap-2 mr-2 flex-grow-1">
        <span class="step-badge">STEP {{ stepNumber }}</span>
        <div class="icon-box">
          <v-icon :icon="icon" size="16" color="primary" />
        </div>
        <h3 class="section-title">{{ title }}</h3>
        <v-chip
          v-if="badgeTag"
          size="x-small"
          color="warning"
          variant="flat"
          class="font-weight-bold ml-1 font-mono"
        >
          {{ badgeTag }}
        </v-chip>
      </div>

      <div class="chevron-box d-flex align-center justify-center flex-shrink-0">
        <v-icon
          icon="mdi-chevron-down"
          size="18"
          class="chevron-icon"
          :class="{ 'chevron-rotated': modelValue }"
        />
      </div>
    </button>

    <!-- Collapsible Content -->
    <v-expand-transition>
      <div v-show="modelValue" class="accordion-body px-4 pb-4 pt-3 border-t">
        <p v-if="guideText" class="step-guide-subtext mb-3">
          {{ guideText }}
        </p>
        <slot />
      </div>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.step-accordion-item {
  border: 1px solid rgba(249, 115, 22, 0.16) !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  overflow: hidden;
}

.step-accordion-item:hover {
  border-color: rgba(249, 115, 22, 0.35) !important;
}

.step-accordion-item.is-open {
  border-color: rgba(249, 115, 22, 0.5) !important;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 16px -2px rgba(249, 115, 22, 0.2) !important;
}

.accordion-header {
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
  outline: none;
}

.accordion-header:hover {
  background-color: rgba(255, 255, 255, 0.035);
}

.section-title {
  white-space: nowrap;
}

.chevron-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
}

.chevron-icon {
  color: #64748b;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s ease;
}

.chevron-rotated {
  transform: rotate(180deg);
  color: #fb923c !important;
}

.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
}

.font-mono {
  font-family: var(--font-mono);
}

.gap-2 {
  gap: 8px;
}
</style>
