<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  (e: 'open-prompt'): void
}>()

const STORAGE_KEY = 'ui-prompt-studio-guidebar-collapsed-v1'
const isCollapsed = ref(false)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    isCollapsed.value = saved === 'true'
  }
})

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
}
</script>

<template>
  <aside aria-label="クイックスタート・ワークフローガイド" class="workflow-guide-container">
    <!-- Collapsed Minimal View -->
    <div v-if="isCollapsed" class="guide-bar-collapsed px-4 py-1 d-flex align-center justify-space-between">
      <button
        type="button"
        class="reopen-guide-btn d-flex align-center gap-2"
        @click="toggleCollapse"
      >
        <v-icon icon="mdi-help-circle-outline" size="14" color="primary" />
        <span class="text-caption font-weight-medium text-grey-lighten-1">
          ワークフロー: ① 左で選ぶ ➔ ② 中央で確認 ➔ ③ プロンプトをAIにコピペ
        </span>
        <v-icon icon="mdi-chevron-down" size="14" color="grey" />
      </button>

      <button
        type="button"
        class="guide-action-link text-caption d-flex align-center gap-1 font-weight-bold"
        @click="emit('open-prompt')"
      >
        <v-icon icon="mdi-code-tags" size="14" />
        <span>プロンプトを開く</span>
      </button>
    </div>

    <!-- Expanded Full Workflow Bar -->
    <div v-else class="guide-bar-expanded px-4 py-2 d-flex flex-wrap align-center justify-space-between gap-3">
      <!-- Steps Flow -->
      <div class="d-flex flex-wrap align-center gap-2 flex-grow-1">
        <!-- Badge -->
        <div class="d-flex align-center gap-1-5 mr-1">
          <span class="guide-flow-badge font-mono">HOW TO USE</span>
        </div>

        <!-- Step 1 -->
        <div class="flow-step-item d-flex align-center gap-2 px-2-5 py-1">
          <span class="step-num">1</span>
          <div>
            <div class="step-title">スタイル選択</div>
            <div class="step-desc">左パネルで世界観・色・スタックを指定</div>
          </div>
        </div>

        <v-icon icon="mdi-arrow-right" size="14" class="flow-arrow text-grey" />

        <!-- Step 2 -->
        <div class="flow-step-item d-flex align-center gap-2 px-2-5 py-1">
          <span class="step-num">2</span>
          <div>
            <div class="step-title">リアルタイム確認</div>
            <div class="step-desc">中央サンドボックスで見た目・余白を検証</div>
          </div>
        </div>

        <v-icon icon="mdi-arrow-right" size="14" class="flow-arrow text-grey" />

        <!-- Step 3 (Clickable to open prompt modal, uniform style without highlight) -->
        <button
          type="button"
          class="flow-step-item flow-step-clickable d-flex align-center gap-2 px-2-5 py-1 text-left cursor-pointer"
          title="クリックしてプロンプトモーダルを表示"
          @click="emit('open-prompt')"
        >
          <span class="step-num">3</span>
          <div>
            <div class="step-title d-flex align-center gap-1">
              <span>AIにコピペ</span>
              <v-icon icon="mdi-open-in-new" size="11" color="grey" />
            </div>
            <div class="step-desc">プロンプトをClaude/ChatGPT/Cursorに貼る</div>
          </div>
        </button>
      </div>

      <!-- Right Controls: Collapse Only (Redundant button removed per Review #7) -->
      <div class="d-flex align-center flex-shrink-0">
        <button
          type="button"
          class="guide-collapse-btn"
          title="ガイドバーを折りたたむ"
          @click="toggleCollapse"
        >
          <v-icon icon="mdi-chevron-up" size="16" color="grey" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.gap-1 { gap: 4px; }
.gap-1-5 { gap: 6px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.px-2-5 { padding-left: 10px; padding-right: 10px; }

.workflow-guide-container {
  background: rgba(13, 15, 23, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 9;
}

.guide-bar-collapsed {
  background: rgba(255, 255, 255, 0.02);
}

.reopen-guide-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.reopen-guide-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.guide-action-link {
  background: transparent;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.guide-action-link:hover {
  background: rgba(56, 189, 248, 0.1);
  text-decoration: underline;
}

.guide-flow-badge {
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  font-family: var(--font-mono);
  color: #a5b4fc;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 4px;
  padding: 2px 6px;
}

.flow-step-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.flow-step-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.flow-step-clickable {
  outline: none;
}

.flow-step-clickable:hover {
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-1px);
}

.step-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 800;
  font-family: var(--font-mono);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-title {
  font-size: 0.74rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.step-desc {
  font-size: 0.65rem;
  color: #94a3b8;
  line-height: 1.2;
}

.flow-arrow {
  opacity: 0.5;
}

.guide-collapse-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-collapse-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
</style>
