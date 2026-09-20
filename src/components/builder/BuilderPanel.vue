<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import StepAccordionItem from './StepAccordionItem.vue'
import PlatformSelector from './PlatformSelector.vue'
import DesignSystemSelector from './DesignSystemSelector.vue'
import RulesEditor from './RulesEditor.vue'
import ColorPaletteEditor from './ColorPaletteEditor.vue'
import ComponentsSelector from './ComponentsSelector.vue'
import TechStackSelector from './TechStackSelector.vue'
import PurposeEditor from './PurposeEditor.vue'
import ImageAssetSettings from './ImageAssetSettings.vue'

const store = useConfigStore()

// Accordion open states (STEP 1: Design System is open by default)
const openSteps = ref<Record<string, boolean>>({
  step0: false,
  step1: true,
  step2: false,
  step3: false,
  step4: false,
  step5: false,
  step6: false,
  step7: false,
})

const openCount = computed(() => {
  return Object.values(openSteps.value).filter(Boolean).length
})

function expandAll() {
  Object.keys(openSteps.value).forEach((k) => {
    openSteps.value[k] = true
  })
}

function collapseAll() {
  Object.keys(openSteps.value).forEach((k) => {
    openSteps.value[k] = false
  })
}

// Real-time summaries for each step
const platformSummary = computed(() => {
  return store.config.platform === 'web' ? 'Web (SaaS)' : 'デスクトップ'
})

const designSystemSummary = computed(() => {
  const name = store.currentDesignSystemMeta.name.split('/')[0].trim()
  const mode = store.isLight ? 'Light' : 'Dark'
  return `${name} • ${mode}`
})

const rulesSummary = computed(() => {
  const r = store.config.rules.borderRadius
  const g = store.config.rules.gap
  const b = store.config.rules.buttonGap ?? 8
  return `角丸${r}px • 余白${g}px • 隙間${b}px`
})

const colorSummary = computed(() => {
  return `${store.isLight ? '☀️ Light' : '🌙 Dark'} (${store.config.colors.accent})`
})

const componentsSummary = computed(() => {
  const total = Object.values(store.config.components).filter(Boolean).length
  return `${total}個選択中`
})

const techStackSummary = computed(() => {
  const map: Record<string, string> = {
    'react-tailwind': 'React + Tailwind',
    'vue-tailwind': 'Vue 3 + Tailwind',
    'html-vanilla': 'HTML5 + CSS',
    'html-single-file': '単一HTML (GAS)',
    'nextjs-shadcn': 'Next.js + shadcn',
  }
  return map[store.config.outputTechStack] || store.config.outputTechStack
})

const purposeSummary = computed(() => {
  return store.config.customPurpose.trim() ? '要件入力あり' : '任意未入力'
})

const imageAssetSummary = computed(() => {
  const ai = store.config.imageAsset?.targetAi?.toUpperCase() || 'GEMINI'
  const aspect = store.config.imageAsset?.aspectRatio || '1:1'
  return `${ai} • ${aspect}`
})
</script>

<template>
  <div class="builder-panel pa-4">
    <!-- Global Expand / Collapse Toolbar -->
    <div class="accordion-controls d-flex align-center justify-space-between mb-3 px-1">
      <div class="d-flex align-center gap-2">
        <span class="text-caption text-grey font-weight-medium">ステップ設定</span>
        <span class="open-count-badge font-mono">
          {{ openCount }}/8 開放中
        </span>
      </div>
      <div class="d-flex align-center gap-1">
        <v-btn
          size="x-small"
          variant="text"
          color="primary"
          class="text-none font-weight-bold"
          prepend-icon="mdi-arrow-expand-vertical"
          @click="expandAll"
        >
          すべて開く
        </v-btn>
        <v-btn
          size="x-small"
          variant="text"
          color="grey"
          class="text-none"
          prepend-icon="mdi-arrow-collapse-vertical"
          @click="collapseAll"
        >
          すべて閉じる
        </v-btn>
      </div>
    </div>

    <!-- STEP 0: Platform -->
    <StepAccordionItem
      :step-number="0"
      title="ターゲットアプリ種別"
      icon="mdi-devices"
      guide-text="Webブラウザ向け（レスポンシブWeb/SPA）か、デスクトップ（Tauri/Electron・タイトルバー付き）かを指定します。"
      :summary="platformSummary"
      v-model="openSteps.step0"
    >
      <PlatformSelector />
    </StepAccordionItem>

    <!-- STEP 1: Design System -->
    <StepAccordionItem
      :step-number="1"
      title="デザインシステム・世界観"
      icon="mdi-shape-outline"
      guide-text="アプリ全体のデザイン思想・世界観を決定します。選択時に最適な余白数値と推奨パレットが自動適用されます。"
      badge-tag="推奨"
      :summary="designSystemSummary"
      v-model="openSteps.step1"
    >
      <DesignSystemSelector />
    </StepAccordionItem>

    <!-- STEP 2: Rules (Tokens) -->
    <StepAccordionItem
      :step-number="2"
      title="数値ルール (Design Tokens)"
      icon="mdi-ruler-square"
      guide-text="余白・角丸・ボタン隙間・ボーダー幅など、画面全体の一貫性を保つための厳格な数値デザイントークンを指定します。"
      :summary="rulesSummary"
      v-model="openSteps.step2"
    >
      <RulesEditor />
    </StepAccordionItem>

    <!-- STEP 3: Colors -->
    <StepAccordionItem
      :step-number="3"
      title="カラーパレット (Roles & Rules)"
      icon="mdi-palette-outline"
      guide-text="各UIパーツの役割（背景・サーフェス・文字・アクセント）に基づき、破綻のない厳格なカラーパレットを指定します。"
      :summary="colorSummary"
      v-model="openSteps.step3"
    >
      <ColorPaletteEditor />
    </StepAccordionItem>

    <!-- STEP 4: Components -->
    <StepAccordionItem
      :step-number="4"
      title="実装コンポーネントの対象"
      icon="mdi-checkbox-multiple-marked-outline"
      guide-text="AIに生成させる画面の構成要素をチェックします。選択したパーツのみがUI仕様書とプレビューに出現します。"
      :summary="componentsSummary"
      v-model="openSteps.step4"
    >
      <ComponentsSelector />
    </StepAccordionItem>

    <!-- STEP 5: Tech Stack -->
    <StepAccordionItem
      :step-number="5"
      title="出力コードスタック指定"
      icon="mdi-code-tags"
      guide-text="AIに出力させたいフロントエンドフレームワーク・CSS・実行環境を指定します。"
      :summary="techStackSummary"
      v-model="openSteps.step5"
    >
      <TechStackSelector />
    </StepAccordionItem>

    <!-- STEP 6: Custom Purpose -->
    <StepAccordionItem
      :step-number="6"
      title="アプリ固有の目的・機能要件"
      icon="mdi-text-box-edit-outline"
      guide-text="作成したいアプリの具体的な機能やターゲット層を記入すると、プロンプトに自然に織り込まれます。"
      :summary="purposeSummary"
      v-model="openSteps.step6"
    >
      <PurposeEditor />
    </StepAccordionItem>

    <!-- STEP 7: Image Asset Prompt Generator -->
    <StepAccordionItem
      :step-number="7"
      title="外部画像生成AI連携"
      icon="mdi-image-plus-outline"
      guide-text="UIの世界観・配色と完全に連動した画像素材（アイコン・キービジュアル等）を、外部画像AIで生成するためのプロンプトを設定します。"
      :summary="imageAssetSummary"
      v-model="openSteps.step7"
    >
      <ImageAssetSettings />
    </StepAccordionItem>
  </div>
</template>

<style scoped>
.builder-panel {
  max-width: 100%;
}

.open-count-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #818cf8;
}

.font-mono {
  font-family: var(--font-mono);
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
</style>
