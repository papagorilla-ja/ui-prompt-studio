<script setup lang="ts">
import { ref, computed } from 'vue'
import StepAccordionItem from './StepAccordionItem.vue'
import PlatformSelector from './PlatformSelector.vue'
import DesignSystemSelector from './DesignSystemSelector.vue'
import RulesEditor from './RulesEditor.vue'
import ColorPaletteEditor from './ColorPaletteEditor.vue'
import ComponentsSelector from './ComponentsSelector.vue'
import TechStackSelector from './TechStackSelector.vue'
import PurposeEditor from './PurposeEditor.vue'

// Accordion open states (STEP 0: Platform is open by default)
const openSteps = ref<Record<string, boolean>>({
  step0: true,
  step1: false,
  step2: false,
  step3: false,
  step4: false,
  step5: false,
  step6: false,
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
</script>

<template>
  <div class="builder-panel pa-4">
    <!-- Global Expand / Collapse Toolbar -->
    <div class="accordion-controls d-flex align-center justify-space-between mb-3 px-1">
      <div class="d-flex align-center gap-2">
        <span class="text-caption text-grey font-weight-medium">ステップ設定</span>
        <span class="open-count-badge font-mono">
          {{ openCount }}/7 開放中
        </span>
      </div>
      <div class="d-flex align-center gap-1">
        <v-btn
          size="x-small"
          variant="text"
          color="warning"
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
      v-model="openSteps.step6"
    >
      <PurposeEditor />
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
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}

.font-mono {
  font-family: var(--font-mono);
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
</style>
