<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { generatePrompt, downloadMarkdownFile, copyToClipboard } from '@/utils/promptGenerator'

const emit = defineEmits<{
  (e: 'notify', message: string): void
}>()

const store = useConfigStore()
const isCopied = ref(false)

// Real-time reactive prompt calculation
const promptMarkdown = computed(() => {
  return generatePrompt(store.config, store.currentDesignSystemMeta)
})

const charCount = computed(() => promptMarkdown.value.length)
// Rough token estimation for LLMs (1 token ~= 3-4 chars for mixed Japanese/English)
const estimatedTokens = computed(() => Math.round(charCount.value / 3.2))

async function handleCopy() {
  const success = await copyToClipboard(promptMarkdown.value)
  if (success) {
    isCopied.value = true
    emit('notify', 'AIプロンプトをクリップボードにコピーしました！')
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } else {
    emit('notify', 'コピーに失敗しました')
  }
}

function handleDownload() {
  const filename = `ui-prompt-${store.config.designSystem}-${store.config.themeMode}-${store.config.platform}.md`
  downloadMarkdownFile(promptMarkdown.value, filename)
  emit('notify', `${filename} をダウンロードしました`)
}
</script>

<template>
  <div class="prompt-viewer-container d-flex flex-column h-100 pa-4">
    <!-- Header Controls -->
    <div class="d-flex align-center justify-space-between mb-2 flex-shrink-0">
      <!-- Title & Token Counter -->
      <div class="d-flex align-center gap-2">
        <span class="step-badge" style="background: rgba(99,102,241,0.25); border-color: rgba(99,102,241,0.45); color: #a5b4fc;">
          OUTPUT
        </span>
        <span class="text-body-2 font-weight-bold text-white">生成プロンプト (Markdown)</span>

        <!-- Metrics Badges -->
        <div class="d-none d-sm-flex align-center gap-2 ml-2">
          <span class="metric-pill font-mono">
            {{ charCount.toLocaleString() }} 文字
          </span>
          <span class="metric-pill font-mono" style="color: #38bdf8;">
            ~{{ estimatedTokens.toLocaleString() }} Tokens
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex align-center gap-2">
        <!-- Copy Button with Micro-Animation -->
        <button
          type="button"
          class="pro-action-btn pro-action-btn-primary px-3 py-1 d-flex align-center gap-1 font-weight-bold"
          :style="{ background: isCopied ? 'linear-gradient(135deg, #10b981, #059669) !important' : '' }"
          @click="handleCopy"
        >
          <v-icon :icon="isCopied ? 'mdi-check' : 'mdi-content-copy'" size="15" />
          <span>{{ isCopied ? 'コピー完了！' : 'プロンプトをコピー' }}</span>
        </button>

        <!-- Download Button -->
        <button
          type="button"
          class="pro-action-btn px-3 py-1 d-flex align-center gap-1"
          title="Markdownファイル (.md) としてダウンロード"
          @click="handleDownload"
        >
          <v-icon icon="mdi-download" size="15" color="primary" />
          <span class="d-none d-sm-inline">.md 保存</span>
        </button>
      </div>
    </div>

    <!-- Code Display Sheet -->
    <div class="prompt-code-window flex-1 overflow-hidden d-flex flex-column">
      <div class="prompt-code-scroll pa-3">
        <pre class="prompt-pre-content"><code>{{ promptMarkdown }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prompt-viewer-container {
  box-sizing: border-box;
}

.metric-pill {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.prompt-code-window {
  background: rgba(8, 9, 13, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), inset 0 0 16px rgba(0, 0, 0, 0.4);
}

.prompt-code-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
}

.prompt-pre-content {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.6;
  color: #cbd5e1;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
