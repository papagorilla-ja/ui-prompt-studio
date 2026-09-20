<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { generatePrompt, downloadMarkdownFile, copyToClipboard } from '@/utils/promptGenerator'
import { generateImageAssetPrompt } from '@/utils/imagePromptGenerator'

const emit = defineEmits<{
  (e: 'notify', message: string): void
}>()

const store = useConfigStore()
const activeTab = ref<'ui-code' | 'image-asset'>('ui-code')

const isCopied = ref(false)
const isImageCopied = ref(false)
const isNegativeCopied = ref(false)

// UI Code Prompt
const promptMarkdown = computed(() => {
  return generatePrompt(store.config, store.currentDesignSystemMeta)
})

const charCount = computed(() => promptMarkdown.value.length)
const estimatedTokens = computed(() => Math.round(charCount.value / 3.2))

// Image Asset Prompt
const imagePromptData = computed(() => {
  return generateImageAssetPrompt(store.config)
})

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

async function handleImageCopy() {
  const success = await copyToClipboard(imagePromptData.value.fullPrompt)
  if (success) {
    isImageCopied.value = true
    emit('notify', `${imagePromptData.value.targetToolName} 向け画像プロンプトをコピーしました！`)
    setTimeout(() => {
      isImageCopied.value = false
    }, 2000)
  } else {
    emit('notify', 'コピーに失敗しました')
  }
}

async function handleNegativeCopy() {
  const success = await copyToClipboard(imagePromptData.value.negativePrompt)
  if (success) {
    isNegativeCopied.value = true
    emit('notify', 'ネガティブプロンプトをコピーしました！')
    setTimeout(() => {
      isNegativeCopied.value = false
    }, 2000)
  } else {
    emit('notify', 'コピーに失敗しました')
  }
}

function handleDownload() {
  if (activeTab.value === 'ui-code') {
    const filename = `ui-prompt-${store.config.designSystem}-${store.config.themeMode}-${store.config.platform}.md`
    downloadMarkdownFile(promptMarkdown.value, filename)
    emit('notify', `${filename} をダウンロードしました`)
  } else {
    const filename = `image-prompt-${store.config.designSystem}-${store.config.imageAsset.assetType}.txt`
    downloadMarkdownFile(imagePromptData.value.fullPrompt, filename)
    emit('notify', `${filename} をダウンロードしました`)
  }
}

function openExternalAI() {
  const target = store.config.imageAsset.targetAi
  let url = 'https://gemini.google.com/'
  if (target === 'midjourney') url = 'https://www.midjourney.com/explore'
  else if (target === 'dalle3') url = 'https://chatgpt.com/'
  window.open(url, '_blank')
}
</script>

<template>
  <div class="prompt-viewer-container d-flex flex-column h-100 pa-4">
    <!-- Top Header: Tab Selector & Actions -->
    <div class="d-flex flex-wrap align-center justify-space-between gap-2 mb-2 flex-shrink-0">
      <!-- Tabs -->
      <div class="prompt-tabs-wrapper d-flex align-center gap-1 p-1">
        <button
          type="button"
          class="prompt-tab-btn d-flex align-center gap-1-5 px-3 py-1-5"
          :class="{ 'prompt-tab-btn-active': activeTab === 'ui-code' }"
          @click="activeTab = 'ui-code'"
        >
          <v-icon icon="mdi-code-tags" size="15" />
          <span class="font-weight-bold">UIコード指示書</span>
          <span class="metric-pill font-mono d-none d-sm-inline">
            ~{{ estimatedTokens.toLocaleString() }} tok
          </span>
        </button>

        <button
          type="button"
          class="prompt-tab-btn d-flex align-center gap-1-5 px-3 py-1-5"
          :class="{ 'prompt-tab-btn-active': activeTab === 'image-asset' }"
          @click="activeTab = 'image-asset'"
        >
          <v-icon icon="mdi-image-multiple-outline" size="15" />
          <span class="font-weight-bold">画像アセット生成プロンプト</span>
          <span class="tab-badge-ai font-mono">
            {{ store.config.imageAsset.targetAi.toUpperCase() }}
          </span>
        </button>
      </div>

      <!-- Contextual CTA Hint (Issue #28) -->
      <div v-if="activeTab === 'ui-code'" class="d-none d-xl-flex align-center gap-1 cta-hint-pill">
        <v-icon icon="mdi-content-paste" size="13" color="primary" />
        <span>コピーして Claude / ChatGPT / Cursor 等に貼るだけ</span>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex align-center gap-2">
        <template v-if="activeTab === 'ui-code'">
          <!-- Copy UI Code Prompt -->
          <button
            type="button"
            class="pro-action-btn pro-action-btn-primary px-3 py-1-5 d-flex align-center gap-1 font-weight-bold"
            :style="{ background: isCopied ? 'linear-gradient(135deg, #10b981, #059669) !important' : '' }"
            @click="handleCopy"
          >
            <v-icon :icon="isCopied ? 'mdi-check' : 'mdi-content-copy'" size="15" />
            <span>{{ isCopied ? 'コピー完了！' : 'プロンプトをコピー' }}</span>
          </button>

          <!-- Download Button -->
          <button
            type="button"
            class="pro-action-btn px-3 py-1-5 d-flex align-center gap-1"
            title="Markdownファイル (.md) としてダウンロード"
            @click="handleDownload"
          >
            <v-icon icon="mdi-download" size="15" color="primary" />
            <span class="d-none d-sm-inline">.md 保存</span>
          </button>
        </template>

        <template v-else>
          <!-- Copy Image Prompt -->
          <button
            type="button"
            class="pro-action-btn pro-action-btn-primary px-3 py-1-5 d-flex align-center gap-1 font-weight-bold"
            :style="{ background: isImageCopied ? 'linear-gradient(135deg, #10b981, #059669) !important' : '' }"
            @click="handleImageCopy"
          >
            <v-icon :icon="isImageCopied ? 'mdi-check' : 'mdi-content-copy'" size="15" />
            <span>{{ isImageCopied ? 'コピー完了！' : '画像プロンプトをコピー' }}</span>
          </button>

          <!-- Launch External AI Tool -->
          <button
            type="button"
            class="pro-action-btn px-3 py-1-5 d-flex align-center gap-1"
            :title="`${imagePromptData.targetToolName} を新規タブで開く`"
            @click="openExternalAI"
          >
            <v-icon icon="mdi-open-in-new" size="14" color="secondary" />
            <span class="d-none d-sm-inline">{{ store.config.imageAsset.targetAi.toUpperCase() }}を開く</span>
          </button>
        </template>
      </div>
    </div>

    <!-- Content Pane 1: UI Code Markdown -->
    <div v-if="activeTab === 'ui-code'" class="prompt-code-window flex-1 overflow-hidden d-flex flex-column">
      <div class="prompt-code-scroll pa-3">
        <pre class="prompt-pre-content"><code>{{ promptMarkdown }}</code></pre>
      </div>
    </div>

    <!-- Content Pane 2: Image Asset AI Prompt -->
    <div v-if="activeTab === 'image-asset'" class="prompt-code-window flex-1 overflow-hidden d-flex flex-column">
      <div class="prompt-code-scroll pa-3 d-flex flex-column gap-3">
        <!-- Target Tool Header Info -->
        <div class="d-flex align-center justify-space-between flex-wrap gap-2 pb-2 border-b-subtle">
          <div class="d-flex align-center gap-2">
            <span class="ai-hero-badge font-mono">{{ imagePromptData.targetToolName }}</span>
            <span class="text-caption text-grey">アスペクト比: <strong class="text-white">{{ imagePromptData.aspectRatio }}</strong></span>
            <span class="text-caption text-grey">種別: <strong class="text-white">{{ store.config.imageAsset.assetType }}</strong></span>
          </div>
          <div class="d-flex gap-1">
            <span v-for="tag in imagePromptData.tags" :key="tag" class="tag-pill">{{ tag }}</span>
          </div>
        </div>

        <!-- Main English Prompt Box -->
        <div>
          <div class="d-flex align-center justify-space-between mb-1-5">
            <span class="text-caption font-weight-bold text-grey-lighten-2 d-flex align-center gap-1">
              <v-icon icon="mdi-format-quote-close" size="14" color="primary" />
              生成プロンプト (English Prompt / コピペ用)
            </span>
            <button
              type="button"
              class="quick-copy-text-btn d-flex align-center gap-1"
              @click="handleImageCopy"
            >
              <v-icon :icon="isImageCopied ? 'mdi-check' : 'mdi-content-copy'" size="12" />
              <span>{{ isImageCopied ? 'コピー完了' : 'コピー' }}</span>
            </button>
          </div>
          <div class="image-prompt-display-box pa-3">
            <pre class="prompt-pre-content font-mono"><code>{{ imagePromptData.fullPrompt }}</code></pre>
          </div>
        </div>

        <!-- Negative Prompt Box -->
        <div>
          <div class="d-flex align-center justify-space-between mb-1-5">
            <span class="text-caption font-weight-bold text-grey-lighten-2 d-flex align-center gap-1">
              <v-icon icon="mdi-cancel" size="14" color="error" />
              ネガティブプロンプト (Negative Prompt / 除外指示)
            </span>
            <button
              type="button"
              class="quick-copy-text-btn d-flex align-center gap-1"
              @click="handleNegativeCopy"
            >
              <v-icon :icon="isNegativeCopied ? 'mdi-check' : 'mdi-content-copy'" size="12" />
              <span>{{ isNegativeCopied ? 'コピー完了' : 'コピー' }}</span>
            </button>
          </div>
          <div class="negative-prompt-display-box pa-2-5">
            <code class="text-caption font-mono text-grey-lighten-1">{{ imagePromptData.negativePrompt }}</code>
          </div>
        </div>

        <!-- Design System Harmonization Note -->
        <div class="explanation-box pa-2-5 d-flex align-start gap-2">
          <v-icon icon="mdi-palette-swatch-outline" size="16" color="primary" class="mt-0-5 flex-shrink-0" />
          <div class="text-caption leading-relaxed">
            <span class="text-grey-lighten-1">{{ imagePromptData.explanationJa }}</span>
            <span class="text-grey d-block mt-1">
              ※ 生成された画像を保存し、お使いのアプリの <code>assets/</code> フォルダに配置してClaudeやv0に読み込ませることで、UI全体の世界観が完全に統一されます。
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-1 { gap: 4px; }
.gap-1-5 { gap: 6px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.leading-relaxed { line-height: 1.5; }
.font-mono { font-family: var(--font-mono); }

.cta-hint-pill {
  font-size: 0.7rem;
  font-weight: 600;
  color: #cbd5e1;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 12px;
  padding: 3px 10px;
}

.prompt-viewer-container {
  box-sizing: border-box;
}

.prompt-tabs-wrapper {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.prompt-tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.78rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.prompt-tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.prompt-tab-btn-active {
  color: #ffffff !important;
  background: rgba(99, 102, 241, 0.25) !important;
  border: 1px solid rgba(99, 102, 241, 0.4) !important;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.2);
}

.tab-badge-ai {
  font-size: 0.62rem;
  font-weight: 800;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
}

.metric-pill {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
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

.border-b-subtle {
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.ai-hero-badge {
  font-size: 0.72rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.25));
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #ffffff;
}

.tag-pill {
  font-size: 0.62rem;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.quick-copy-text-btn {
  background: transparent;
  border: none;
  color: #38bdf8;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.quick-copy-text-btn:hover {
  background: rgba(56, 189, 248, 0.1);
}

.image-prompt-display-box {
  background: rgba(15, 17, 26, 0.8);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 6px;
  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.3);
}

.negative-prompt-display-box {
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  padding: 8px 10px;
}

.explanation-box {
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 6px;
  padding: 8px 10px;
}
</style>
