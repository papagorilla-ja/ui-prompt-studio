<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import type { ImageAssetType, TargetImageAI, ImageAspectRatio } from '@/types/config'

const store = useConfigStore()

const currentAsset = computed(() => store.config.imageAsset)

const assetTypes: { id: ImageAssetType; label: string; icon: string; defaultAspect: ImageAspectRatio }[] = [
  { id: 'app-icon', label: 'アプリアイコン', icon: 'mdi-crop-square', defaultAspect: '1:1' },
  { id: 'hero-illustration', label: 'ヒーロー画像', icon: 'mdi-image-frame', defaultAspect: '16:9' },
  { id: 'background-art', label: '背景アート', icon: 'mdi-wallpaper', defaultAspect: '16:9' },
  { id: 'character-sprite', label: 'キャラクター', icon: 'mdi-account-star-outline', defaultAspect: '1:1' },
  { id: 'empty-state', label: '空状態イラスト', icon: 'mdi-inbox-outline', defaultAspect: '4:3' },
]

const targetAIs: { id: TargetImageAI; label: string; icon: string; tag: string }[] = [
  { id: 'gemini', label: 'Gemini', icon: 'mdi-google', tag: 'Imagen 3' },
  { id: 'midjourney', label: 'Midjourney', icon: 'mdi-sail-boat', tag: 'v6.1' },
  { id: 'dalle3', label: 'DALL-E 3', icon: 'mdi-robot', tag: 'ChatGPT' },
  { id: 'stable-diffusion', label: 'SD / FLUX', icon: 'mdi-lightning-bolt', tag: 'OpenSource' },
]

const aspectRatios: ImageAspectRatio[] = ['1:1', '16:9', '4:3', '9:16']

const quickSuggestions = [
  { label: '3Dクレイの愛らしい猫', motif: 'Cute fluffy cat character with big eyes, soft pastel clay texture' },
  { label: '未来都市サイバーパンクHUD', motif: 'Futuristic cyberpunk city analytics HUD with glowing holographic data' },
  { label: 'すりガラスのデータキューブ', motif: 'Translucent frosted glass modular cube with glowing internal core' },
  { label: 'レトロゲームの宝箱', motif: 'Arcade video game treasure chest with sparkling magic gems, 16-bit' },
  { label: 'AIタスク管理アイコン', motif: 'Modern minimalist abstract productivity lightning node, app store icon' },
]

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
</script>

<template>
  <div class="linear-card pa-4 mb-4">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center gap-2">
        <span class="step-badge">STEP 7</span>
        <h3 class="text-subtitle-2 font-weight-bold text-white tracking-wide">
          画像アセット指示設定 (外部AI連携)
        </h3>
      </div>
      <span class="text-caption text-secondary font-weight-bold font-mono">
        {{ currentAsset.targetAi.toUpperCase() }}
      </span>
    </div>

    <p class="text-caption text-grey-lighten-1 mb-4 leading-relaxed">
      UIの世界観・配色と完全に連動した画像素材（アイコン・キービジュアル・キャラ等）を、GeminiやMidjourney等の外部画像AIで生成するためのプロンプトを設定します。
    </p>

    <!-- 1. Asset Type Selection -->
    <div class="mb-4">
      <label class="text-caption font-weight-bold text-grey-lighten-2 d-block mb-2">
        1. アセット種別
      </label>
      <div class="d-flex flex-wrap gap-2">
        <button
          v-for="item in assetTypes"
          :key="item.id"
          type="button"
          class="asset-type-btn d-flex align-center gap-1 px-2 py-1-5"
          :class="{ 'asset-type-btn-active': currentAsset.assetType === item.id }"
          @click="selectAssetType(item.id, item.defaultAspect)"
        >
          <v-icon :icon="item.icon" size="14" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Motif / Theme Input -->
    <div class="mb-4">
      <div class="d-flex align-center justify-space-between mb-1-5">
        <label class="text-caption font-weight-bold text-grey-lighten-2">
          2. テーマ・モチーフ（描きたいもの）
        </label>
        <span class="text-caption text-grey text-xs">日本語または英語で入力</span>
      </div>
      <v-text-field
        :model-value="currentAsset.themeMotif"
        density="compact"
        variant="outlined"
        placeholder="例: 空飛ぶ猫の配達員、未来都市のダッシュボード、ポーションボトル..."
        hide-details
        class="motif-input mb-2"
        @update:model-value="(val) => store.updateImageAsset({ themeMotif: val })"
      />

      <!-- Quick Suggestion Chips -->
      <div class="d-flex flex-wrap gap-1-5 align-center">
        <span class="text-caption text-grey text-xs mr-1">サジェスト:</span>
        <button
          v-for="(sug, idx) in quickSuggestions"
          :key="idx"
          type="button"
          class="suggestion-chip text-xs px-2 py-0-5"
          @click="applySuggestion(sug.motif)"
        >
          {{ sug.label }}
        </button>
      </div>
    </div>

    <!-- 3. Target Image AI & Aspect Ratio -->
    <div class="d-grid grid-cols-2 gap-3 mb-3">
      <!-- Target AI -->
      <div>
        <label class="text-caption font-weight-bold text-grey-lighten-2 d-block mb-1-5">
          3. ターゲット画像AI
        </label>
        <div class="d-flex flex-column gap-1">
          <button
            v-for="ai in targetAIs"
            :key="ai.id"
            type="button"
            class="target-ai-btn d-flex align-center justify-space-between px-2 py-1"
            :class="{ 'target-ai-btn-active': currentAsset.targetAi === ai.id }"
            @click="selectTargetAI(ai.id)"
          >
            <div class="d-flex align-center gap-1-5">
              <v-icon :icon="ai.icon" size="14" />
              <span class="font-weight-medium">{{ ai.label }}</span>
            </div>
            <span class="ai-tag">{{ ai.tag }}</span>
          </button>
        </div>
      </div>

      <!-- Aspect Ratio -->
      <div>
        <label class="text-caption font-weight-bold text-grey-lighten-2 d-block mb-1-5">
          4. アスペクト比
        </label>
        <div class="d-grid grid-cols-2 gap-1">
          <button
            v-for="ratio in aspectRatios"
            :key="ratio"
            type="button"
            class="ratio-btn py-2 text-center"
            :class="{ 'ratio-btn-active': currentAsset.aspectRatio === ratio }"
            @click="selectAspectRatio(ratio)"
          >
            <span class="font-mono font-weight-bold d-block">{{ ratio }}</span>
          </button>
        </div>

        <!-- Sync Info Badge -->
        <div class="sync-info-box mt-2 p-2">
          <div class="d-flex align-center gap-1 text-xs text-primary font-weight-bold mb-0-5">
            <v-icon icon="mdi-sync" size="12" />
            <span>世界観・カラー連動中</span>
          </div>
          <p class="text-xs text-grey leading-tight mb-0">
            選択中の「{{ store.currentDesignSystemMeta.name.split('/')[0] }}」とアクセント色（{{ store.config.colors.accent }}）が反映されます。
          </p>
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
.text-xs { font-size: 0.7rem !important; }
.py-0-5 { padding-top: 2px; padding-bottom: 2px; }
.py-1-5 { padding-top: 6px; padding-bottom: 6px; }
.d-grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.font-mono { font-family: var(--font-mono); }

.asset-type-btn {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.asset-type-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.asset-type-btn-active {
  background: rgba(99, 102, 241, 0.2) !important;
  border-color: rgba(99, 102, 241, 0.5) !important;
  color: #ffffff !important;
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.25);
}

.suggestion-chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.15s ease;
}

.suggestion-chip:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.4);
  color: #ffffff;
}

.target-ai-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.target-ai-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.target-ai-btn-active {
  background: rgba(56, 189, 248, 0.15) !important;
  border-color: rgba(56, 189, 248, 0.4) !important;
  color: #ffffff !important;
}

.ai-tag {
  font-size: 0.62rem;
  padding: 1px 4px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

.ratio-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ratio-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}

.ratio-btn-active {
  background: rgba(168, 85, 247, 0.2) !important;
  border-color: rgba(168, 85, 247, 0.5) !important;
  color: #ffffff !important;
}

.sync-info-box {
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 6px;
  padding: 6px 8px;
}
</style>
