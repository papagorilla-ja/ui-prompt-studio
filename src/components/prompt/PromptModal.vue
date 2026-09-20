<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import PromptViewer from './PromptViewer.vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'notify', message: string): void
}>()

const store = useConfigStore()
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="1060px"
    transition="dialog-bottom-transition"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="prompt-modal-card linear-card d-flex flex-column">
      <!-- Modal Header -->
      <div class="modal-header px-5 py-3-5 d-flex align-center justify-space-between border-b">
        <div class="d-flex align-center gap-3">
          <div class="icon-box" style="width: 32px; height: 32px;">
            <v-icon icon="mdi-code-tags" size="20" color="primary" />
          </div>
          <div>
            <div class="d-flex align-center gap-2 flex-wrap">
              <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">
                AIフロントエンド指示プロンプト
              </h2>
              <span class="active-system-badge font-mono">
                {{ store.currentDesignSystemMeta.name.split('/')[0].trim() }} • {{ store.isLight ? 'LIGHT' : 'DARK' }}
              </span>
            </div>
            <p class="text-caption text-grey mb-0 mt-0-5">
              Claude, Cursor, ChatGPT, v0 等に貼り付けて即座にUIコードを生成できる詳細指示書です
            </p>
          </div>
        </div>

        <div class="d-flex align-center gap-2">
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            color="grey"
            aria-label="閉じる"
            @click="emit('update:modelValue', false)"
          />
        </div>
      </div>

      <!-- Modal Body (PromptViewer) -->
      <div class="modal-body pa-4 flex-1 overflow-hidden d-flex flex-column" style="min-height: 540px; max-height: 72vh;">
        <PromptViewer @notify="(msg) => emit('notify', msg)" />
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer px-5 py-2-5 d-flex align-center justify-space-between border-t">
        <div class="d-flex align-center gap-2 text-caption text-grey">
          <v-icon icon="mdi-lightbulb-outline" size="14" color="primary" />
          <span>推奨AI: <strong>Claude 3.7 Sonnet / Claude 3.5 Sonnet / Cursor / GPT-4o / v0</strong></span>
        </div>

        <v-btn
          variant="tonal"
          color="grey"
          size="small"
          class="text-none font-weight-bold"
          @click="emit('update:modelValue', false)"
        >
          閉じる (Esc)
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<style scoped>
.prompt-modal-card {
  background: #0d0f17 !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 12px;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 24px rgba(99, 102, 241, 0.2);
  overflow: hidden;
}

.modal-header {
  background: rgba(255, 255, 255, 0.02);
}

.py-3-5 {
  padding-top: 14px;
  padding-bottom: 14px;
}

.py-2-5 {
  padding-top: 10px;
  padding-bottom: 10px;
}

.active-system-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.35);
  color: #a5b4fc;
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.font-mono {
  font-family: var(--font-mono);
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
