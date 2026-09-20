<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { generateImageAssetPrompt } from '@/utils/imagePromptGenerator'
import type { ImageAssetType, TargetImageAI, ImageAspectRatio } from '@/types/config'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'notify', message: string): void
}>()

const store = useConfigStore()
const currentAsset = computed(() => store.config.imageAsset)

const isPromptCopied = ref(false)
const isNegativeCopied = ref(false)

const assetTypes: { id: ImageAssetType; label: string; icon: string; defaultAspect: ImageAspectRatio }[] = [
  { id: 'app-icon', label: 'アプリアイコン', icon: 'mdi-crop-square', defaultAspect: '1:1' },
  { id: 'hero-illustration', label: 'ヒーロー画像', icon: 'mdi-image-frame', defaultAspect: '16:9' },
  { id: 'background-art', label: '背景アート', icon: 'mdi-wallpaper', defaultAspect: '16:9' },
  { id: 'character-sprite', label: 'キャラクター', icon: 'mdi-account-star-outline', defaultAspect: '1:1' },
  { id: 'empty-state', label: '空状態イラスト', icon: 'mdi-inbox-outline', defaultAspect: '4:3' },
]

const targetAIs: { id: TargetImageAI; label: string; sub: string; icon: string; tag: string; url: string }[] = [
  {
    id: 'gemini',
    label: 'Google Gemini',
    sub: 'Nano Banana Pro / Nano Banana 2',
    icon: 'mdi-google',
    tag: 'Nano Banana',
    url: 'https://aistudio.google.com/',
  },
  {
    id: 'midjourney',
    label: 'Midjourney',
    sub: 'v6.1 / Niji 6 (--ar, --style raw)',
    icon: 'mdi-sail-boat',
    tag: 'v6.1',
    url: 'https://www.midjourney.com/',
  },
  {
    id: 'dalle3',
    label: 'OpenAI DALL-E 3',
    sub: 'ChatGPT Plus / Team',
    icon: 'mdi-robot',
    tag: 'ChatGPT',
    url: 'https://chatgpt.com/',
  },
  {
    id: 'stable-diffusion',
    label: 'Stability AI / FLUX',
    sub: 'Stable Diffusion 3.5 Large / FLUX',
    icon: 'mdi-lightning-bolt',
    tag: 'SD 3.5',
    url: 'https://clipdrop.co/',
  },
]

const aspectRatios: { ratio: ImageAspectRatio; label: string }[] = [
  { ratio: '1:1', label: '正方形 (1:1)' },
  { ratio: '16:9', label: 'ワイド (16:9)' },
  { ratio: '4:3', label: '標準 (4:3)' },
  { ratio: '9:16', label: '縦長 (9:16)' },
]

const quickSuggestions = [
  { label: '未来都市のダッシュボード', motif: 'futuristic holographic analytics dashboard with neon glowing graphs and floating telemetry cards' },
  { label: '親しみやすい配達ロボット', motif: 'friendly delivery robot mascot with soft round edges and cute expressive LED face' },
  { label: '幾何学アプリアイコン', motif: 'sleek 3D geometric crystal prism app icon with smooth rounded corners' },
  { label: 'レトロアーケード筐体', motif: 'glowing vintage 80s arcade cabinet terminal with illuminated marquee and coin slot' },
  { label: 'ミニマルオフィス空間', motif: 'ultra-minimalist sunlit workspace interior with matte concrete surfaces and green potted plant' },
]

const generatedPrompt = computed(() => {
  return generateImageAssetPrompt(store.config)
})

function selectAssetType(type: ImageAssetType, defaultAspect: ImageAspectRatio) {
  store.updateImageAsset({
    assetType: type,
    aspectRatio: defaultAspect,
  })
}

function selectTargetAI(ai: TargetImageAI) {
  store.updateImageAsset({ targetAi: ai })
}

function selectAspectRatio(ratio: ImageAspectRatio) {
  store.updateImageAsset({ aspectRatio: ratio })
}

function applySuggestion(motif: string) {
  store.updateImageAsset({ themeMotif: motif })
}

async function handleCopyPrompt() {
  try {
    await navigator.clipboard.writeText(generatedPrompt.value.fullPrompt)
    isPromptCopied.value = true
    emit('notify', `${generatedPrompt.value.targetToolName} 向け画像生成プロンプトをコピーしました`)
    setTimeout(() => {
      isPromptCopied.value = false
    }, 2500)
  } catch (err) {
    emit('notify', 'クリップボードへのコピーに失敗しました')
  }
}

async function handleCopyNegative() {
  try {
    await navigator.clipboard.writeText(generatedPrompt.value.negativePrompt)
    isNegativeCopied.value = true
    emit('notify', 'ネガティブプロンプトをコピーしました')
    setTimeout(() => {
      isNegativeCopied.value = false
    }, 2500)
  } catch (err) {
    emit('notify', 'クリップボードへのコピーに失敗しました')
  }
}

function openExternalAI() {
  const currentTarget = targetAIs.find(t => t.id === currentAsset.value.targetAi)
  if (currentTarget) {
    window.open(currentTarget.url, '_blank')
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="1100px"
    transition="dialog-bottom-transition"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="image-modal-card linear-card d-flex flex-column">
      <!-- Modal Header -->
      <div class="modal-header px-5 py-3-5 d-flex align-center justify-space-between border-b">
        <div class="d-flex align-center gap-3">
          <div class="image-icon-box">
            <v-icon icon="mdi-image-sparkles" size="20" color="warning" />
          </div>
          <div>
            <div class="d-flex align-center gap-2 flex-wrap">
              <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">
                AI画像アセット生成スタジオ
              </h2>
              <span class="active-system-badge font-mono">
                {{ store.currentDesignSystemMeta.name.split('/')[0].trim() }} • {{ store.isLight ? 'LIGHT' : 'DARK' }}
              </span>
              <span class="nano-banana-badge font-mono">
                NANO BANANA / MIDJOURNEY / DALL-E 3
              </span>
            </div>
            <p class="text-caption text-grey mb-0 mt-0-5">
              UIの世界観・配色と完全に調和する画像アセット（アイコン・キービジュアル等）の生成プロンプトを構築します
            </p>
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          color="grey"
          aria-label="閉じる"
          @click="emit('update:modelValue', false)"
        />
      </div>

      <!-- Modal Body (2 Columns on Desktop) -->
      <div class="modal-body pa-5 flex-1 overflow-y-auto" style="max-height: 75vh;">
        <div class="d-grid studio-grid gap-5">
          <!-- Left Column: Controls & Settings -->
          <div class="d-flex flex-column gap-4">
            <!-- 1. Asset Type -->
            <div>
              <label class="control-label d-block mb-2">
                1. 生成アセットの種別
              </label>
              <div class="d-flex flex-wrap gap-2">
                <button
                  v-for="item in assetTypes"
                  :key="item.id"
                  type="button"
                  class="asset-type-btn d-flex align-center gap-1-5 px-3 py-1-5"
                  :class="{ 'asset-type-btn-active': currentAsset.assetType === item.id }"
                  @click="selectAssetType(item.id, item.defaultAspect)"
                >
                  <v-icon :icon="item.icon" size="15" />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>

            <!-- 2. Motif / Theme Input (Wide & Spacious) -->
            <div>
              <div class="d-flex align-center justify-space-between mb-1-5">
                <label class="control-label">
                  2. テーマ・モチーフ（描きたいもの）
                </label>
                <span class="text-caption text-grey font-mono" style="font-size: 0.7rem !important;">日本語または英語で入力</span>
              </div>
              <v-textarea
                :model-value="currentAsset.themeMotif"
                rows="2"
                auto-grow
                density="compact"
                variant="outlined"
                placeholder="例: サイバーパンクなホログラムデータセンター、パステルでキュートな案内ボット、光沢のある幾何学アプリアイコン..."
                hide-details
                class="motif-textarea mb-2"
                @update:model-value="(val) => store.updateImageAsset({ themeMotif: val })"
              />

              <!-- Quick Suggestions -->
              <div class="d-flex flex-wrap gap-1-5 align-center">
                <span class="text-caption text-grey font-weight-medium" style="font-size: 0.7rem !important;">サジェスト:</span>
                <button
                  v-for="(sug, idx) in quickSuggestions"
                  :key="idx"
                  type="button"
                  class="suggestion-pill text-caption px-2-5 py-1"
                  @click="applySuggestion(sug.motif)"
                >
                  {{ sug.label }}
                </button>
              </div>
            </div>

            <!-- 3. Target AI Model (Google Nano Banana Pro/2 etc.) -->
            <div>
              <label class="control-label d-block mb-2">
                3. 対象AIモデル
              </label>
              <div class="d-grid grid-cols-2 gap-2">
                <button
                  v-for="ai in targetAIs"
                  :key="ai.id"
                  type="button"
                  class="ai-model-card pa-2-5 d-flex align-center justify-space-between text-left cursor-pointer"
                  :class="{ 'ai-model-card-active': currentAsset.targetAi === ai.id }"
                  @click="selectTargetAI(ai.id)"
                >
                  <div class="d-flex align-center gap-2">
                    <div class="ai-card-icon-box">
                      <v-icon :icon="ai.icon" size="18" />
                    </div>
                    <div>
                      <div class="font-weight-bold text-white text-caption">{{ ai.label }}</div>
                      <div class="text-caption text-grey text-truncate" style="font-size: 0.65rem !important;">{{ ai.sub }}</div>
                    </div>
                  </div>
                  <span class="ai-tag font-mono">{{ ai.tag }}</span>
                </button>
              </div>
            </div>

            <!-- 4. Aspect Ratio -->
            <div>
              <label class="control-label d-block mb-2">
                4. アスペクト比
              </label>
              <div class="d-grid grid-cols-4 gap-2">
                <button
                  v-for="r in aspectRatios"
                  :key="r.ratio"
                  type="button"
                  class="ratio-card py-2 text-center"
                  :class="{ 'ratio-card-active': currentAsset.aspectRatio === r.ratio }"
                  @click="selectAspectRatio(r.ratio)"
                >
                  <span class="font-mono font-weight-bold d-block text-body-2">{{ r.ratio }}</span>
                  <span class="text-caption text-grey" style="font-size: 0.65rem !important;">{{ r.label.split(' ')[0] }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Live Generated Prompts & Actions -->
          <div class="d-flex flex-column gap-3">
            <!-- English Full Prompt Box -->
            <div class="prompt-output-container pa-4 d-flex flex-column flex-1">
              <div class="d-flex align-center justify-space-between mb-2">
                <div class="d-flex align-center gap-2">
                  <v-icon icon="mdi-format-quote-close" size="16" color="warning" />
                  <span class="text-subtitle-2 font-weight-bold text-white">
                    英語生成プロンプト (English Prompt)
                  </span>
                </div>
                <div class="d-flex align-center gap-2">
                  <button
                    type="button"
                    class="action-copy-btn d-flex align-center gap-1 px-3 py-1"
                    :class="{ 'action-copy-btn-success': isPromptCopied }"
                    @click="handleCopyPrompt"
                  >
                    <v-icon :icon="isPromptCopied ? 'mdi-check' : 'mdi-content-copy'" size="14" />
                    <span>{{ isPromptCopied ? 'コピー完了！' : 'プロンプトをコピー' }}</span>
                  </button>

                  <button
                    type="button"
                    class="action-launch-btn d-flex align-center gap-1 px-2-5 py-1"
                    title="ツールを新規タブで開く"
                    @click="openExternalAI"
                  >
                    <v-icon icon="mdi-open-in-new" size="14" />
                    <span class="d-none d-sm-inline">ツールを開く</span>
                  </button>
                </div>
              </div>

              <!-- Main Prompt Code Window -->
              <div class="prompt-display-pre-box pa-3 flex-1 overflow-y-auto mb-3">
                <pre class="prompt-code font-mono"><code>{{ generatedPrompt.fullPrompt }}</code></pre>
              </div>

              <!-- Negative Prompt Box -->
              <div class="negative-box pa-3 mb-3">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="text-caption font-weight-bold text-error d-flex align-center gap-1">
                    <v-icon icon="mdi-cancel" size="13" color="error" />
                    ネガティブプロンプト (除外指示)
                  </span>
                  <button
                    type="button"
                    class="quick-copy-text-btn font-mono"
                    @click="handleCopyNegative"
                  >
                    <v-icon :icon="isNegativeCopied ? 'mdi-check' : 'mdi-content-copy'" size="12" />
                    <span>{{ isNegativeCopied ? 'コピー完了' : 'コピー' }}</span>
                  </button>
                </div>
                <code class="text-caption font-mono text-grey-lighten-1 d-block leading-relaxed" style="font-size: 0.72rem !important;">
                  {{ generatedPrompt.negativePrompt }}
                </code>
              </div>

              <!-- Harmonization Info Note -->
              <div class="harmony-info-card pa-3 d-flex align-start gap-2">
                <v-icon icon="mdi-palette-swatch-outline" size="16" color="warning" class="mt-0-5 flex-shrink-0" />
                <div class="text-caption leading-relaxed">
                  <div class="font-weight-bold text-grey-lighten-1 mb-0-5">
                    デザインシステム完全連動中
                  </div>
                  <span class="text-grey">
                    現在選択中の世界観「<strong>{{ store.currentDesignSystemMeta.name }}</strong>」およびアクセントカラー「<strong>{{ store.config.colors.accent }}</strong>」の数値・テクスチャ・光彩がプロンプトに反映されています。
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer px-5 py-2-5 d-flex align-center justify-space-between border-t">
        <div class="d-flex align-center gap-2 text-caption text-grey">
          <v-icon icon="mdi-lightbulb-on-outline" size="14" color="warning" />
          <span>生成した画像は <code>assets/</code> に保存し、ClaudeやCursorに渡すことでUIの一貫性が飛躍的に向上します</span>
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
.image-modal-card {
  background: #0c0e16 !important;
  border: 1px solid rgba(249, 115, 22, 0.25) !important;
  border-radius: 12px;
  box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 24px rgba(249, 115, 22, 0.2);
  overflow: hidden;
}

.modal-header {
  background: rgba(255, 255, 255, 0.02);
}

.image-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
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

.nano-banana-badge {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}

.studio-grid {
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 900px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}

.control-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #cbd5e1;
}

.asset-type-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.asset-type-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.asset-type-btn-active {
  background: rgba(245, 158, 11, 0.2) !important;
  border-color: rgba(245, 158, 11, 0.5) !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.25);
}

.suggestion-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.7rem;
}

.suggestion-pill:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.4);
  color: #ffffff;
}

.ai-model-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transition: all 0.15s ease;
}

.ai-model-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.ai-model-card-active {
  background: rgba(245, 158, 11, 0.15) !important;
  border-color: rgba(245, 158, 11, 0.5) !important;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
}

.ai-card-icon-box {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-tag {
  font-size: 0.62rem;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
}

.ratio-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ratio-card:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.ratio-card-active {
  background: rgba(245, 158, 11, 0.2) !important;
  border-color: rgba(245, 158, 11, 0.5) !important;
  color: #ffffff !important;
}

.prompt-output-container {
  background: rgba(15, 17, 26, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.prompt-display-pre-box {
  background: #08090d;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  min-height: 180px;
  max-height: 260px;
}

.prompt-code {
  margin: 0;
  font-size: 0.76rem;
  line-height: 1.6;
  color: #cbd5e1;
  white-space: pre-wrap;
  word-break: break-word;
}

.action-copy-btn {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(249, 115, 22, 0.3) 100%);
  border: 1px solid rgba(249, 115, 22, 0.5);
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-copy-btn:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.5) 0%, rgba(249, 115, 22, 0.5) 100%);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.4);
}

.action-copy-btn-success {
  background: #10b981 !important;
  border-color: #10b981 !important;
}

.action-launch-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-launch-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.negative-box {
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
}

.quick-copy-text-btn {
  background: transparent;
  border: none;
  color: #38bdf8;
  font-size: 0.7rem;
  cursor: pointer;
}

.harmony-info-card {
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.18);
  border-radius: 6px;
}

.border-b { border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important; }
.border-t { border-top: 1px solid rgba(255, 255, 255, 0.08) !important; }
.font-mono { font-family: var(--font-mono); }
.d-grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.gap-1-5 { gap: 6px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-5 { gap: 20px; }
.py-1-5 { padding-top: 6px; padding-bottom: 6px; }
.py-2-5 { padding-top: 10px; padding-bottom: 10px; }
.py-3-5 { padding-top: 14px; padding-bottom: 14px; }
.px-2-5 { padding-left: 10px; padding-right: 10px; }
.pa-2-5 { padding: 10px; }
</style>
