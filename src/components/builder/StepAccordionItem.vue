<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    stepNumber: number | string
    title: string
    icon: string
    guideText?: string
    summary?: string
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
      <div class="d-flex align-center gap-2 overflow-hidden mr-2">
        <span class="step-badge">STEP {{ stepNumber }}</span>
        <div class="icon-box">
          <v-icon :icon="icon" size="16" color="primary" />
        </div>
        <h3 class="section-title text-truncate">{{ title }}</h3>
        <v-chip
          v-if="badgeTag"
          size="x-small"
          color="primary"
          variant="flat"
          class="font-weight-bold ml-1 d-none d-sm-inline-flex"
        >
          {{ badgeTag }}
        </v-chip>
      </div>

      <div class="d-flex align-center gap-2 flex-shrink-0">
        <!-- Summary pill showing current selection -->
        <span
          v-if="summary"
          class="step-summary-pill text-truncate font-mono"
          :title="summary"
        >
          {{ summary }}
        </span>
        <div class="chevron-box d-flex align-center justify-center">
          <v-icon
            icon="mdi-chevron-down"
            size="18"
            class="chevron-icon"
            :class="{ 'chevron-rotated': modelValue }"
          />
        </div>
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}

.step-accordion-item.is-open {
  border-color: rgba(99, 102, 241, 0.35);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(99, 102, 241, 0.15);
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

.step-summary-pill {
  font-size: 0.72rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  max-width: 170px;
  display: inline-block;
  line-height: 1.4;
  letter-spacing: -0.01em;
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
  color: #38bdf8 !important;
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
