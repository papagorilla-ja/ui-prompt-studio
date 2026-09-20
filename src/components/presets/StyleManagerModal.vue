<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { copyToClipboard } from '@/utils/promptGenerator'

const emit = defineEmits<{
  (e: 'notify', message: string): void
}>()

const store = useConfigStore()

const isOpen = ref(false)
const activeTab = ref<'presets' | 'json'>('presets')

// Preset Save Form
const newPresetName = ref('')
const deleteConfirmId = ref<string | null>(null)

// JSON Import Form
const importJsonText = ref('')
const importStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)
const isExportCopied = ref(false)

const exportedJson = computed(() => {
  return store.exportPresetsAsJson()
})

function generateDefaultName(): string {
  const dsName = store.currentDesignSystemMeta.name.split('/')[0].trim()
  const now = new Date()
  const dateStr = `${now.getMonth() + 1}/${now.getDate()}`
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  return `${dsName} カスタム (${dateStr} ${timeStr})`
}

function open(tab: 'presets' | 'json' = 'presets') {
  activeTab.value = tab
  newPresetName.value = generateDefaultName()
  importStatus.value = null
  deleteConfirmId.value = null
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function handleSavePreset() {
  const name = newPresetName.value.trim() || generateDefaultName()
  store.saveCurrentAsPreset(name)
  emit('notify', `プリセット「${name}」を保存しました！`)
  newPresetName.value = generateDefaultName()
}

function handleLoadPreset(id: string, name: string) {
  const success = store.loadPreset(id)
  if (success) {
    emit('notify', `スタイル「${name}」を適用しました！`)
  }
}

function handleDeletePreset(id: string, name: string) {
  store.deletePreset(id)
  deleteConfirmId.value = null
  emit('notify', `プリセット「${name}」を削除しました`)
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function handleCopyJson() {
  const success = await copyToClipboard(exportedJson.value)
  if (success) {
    isExportCopied.value = true
    emit('notify', 'JSON設定データをクリップボードにコピーしました！')
    setTimeout(() => {
      isExportCopied.value = false
    }, 2000)
  }
}

function handleDownloadJson() {
  const filename = `ui-prompt-studio-backup-${Date.now()}.json`
  const blob = new Blob([exportedJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  emit('notify', `${filename} をダウンロードしました`)
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    if (text) {
      importJsonText.value = text
      executeImport()
    }
  }
  reader.readAsText(file)
  input.value = ''
}

function executeImport() {
  if (!importJsonText.value.trim()) {
    importStatus.value = { type: 'error', message: 'インポートするJSONテキストを入力してください' }
    return
  }

  const result = store.importFromJson(importJsonText.value)
  if (result.success) {
    importStatus.value = { type: 'success', message: result.message }
    emit('notify', result.message)
    importJsonText.value = ''
  } else {
    importStatus.value = { type: 'error', message: result.message }
  }
}

defineExpose({
  open,
})
</script>

<template>
  <v-dialog v-model="isOpen" max-width="720">
    <div class="style-manager-card">
      <!-- Header -->
      <div class="modal-header d-flex align-center justify-space-between px-6 py-4 border-b">
        <div class="d-flex align-center gap-3">
          <div class="icon-box" style="width: 34px; height: 34px;">
            <v-icon icon="mdi-bookmark-multiple-outline" size="20" color="primary" />
          </div>
          <div>
            <div class="d-flex align-center gap-2">
              <span class="text-subtitle-1 font-weight-black text-white">マイスタイル管理 & JSONバックアップ</span>
              <span class="font-mono text-caption text-primary font-weight-bold">LOCAL & JSON</span>
            </div>
            <div class="text-caption text-grey">
              お気に入りのデザイントークン設定を保存・復元・バックアップ
            </div>
          </div>
        </div>

        <button type="button" class="close-modal-btn" @click="close">
          <v-icon icon="mdi-close" size="18" color="grey" />
        </button>
      </div>

      <!-- Tab Switcher -->
      <div class="d-flex align-center px-6 pt-3 gap-2 border-b">
        <button
          type="button"
          class="manager-tab-btn"
          :class="{ 'manager-tab-btn-active': activeTab === 'presets' }"
          @click="activeTab = 'presets'"
        >
          <v-icon icon="mdi-bookmark-outline" size="16" />
          <span>保存済みスタイル ({{ store.savedPresets.length }})</span>
        </button>

        <button
          type="button"
          class="manager-tab-btn"
          :class="{ 'manager-tab-btn-active': activeTab === 'json' }"
          @click="activeTab = 'json'"
        >
          <v-icon icon="mdi-code-json" size="16" />
          <span>JSON バックアップ & リストア</span>
        </button>
      </div>

      <!-- Body Content -->
      <div class="pa-6 modal-body-scroll">
        <!-- Tab 1: Presets Management -->
        <div v-if="activeTab === 'presets'" class="d-flex flex-column gap-4">
          <!-- Save Current Setting Box -->
          <div class="save-box pa-3 d-flex flex-column gap-2">
            <label class="text-caption font-weight-bold text-grey-lighten-2 d-flex align-center gap-1-5">
              <v-icon icon="mdi-plus-circle-outline" size="14" color="primary" />
              <span>現在の設定をマイスタイルとして保存</span>
            </label>
            <div class="d-flex align-center gap-2">
              <v-text-field
                v-model="newPresetName"
                placeholder="プリセット名を入力..."
                density="compact"
                variant="outlined"
                hide-details
                class="flex-grow-1"
                @keyup.enter="handleSavePreset"
              />
              <button
                type="button"
                class="save-btn px-4 py-2 font-weight-bold d-flex align-center gap-1"
                @click="handleSavePreset"
              >
                <v-icon icon="mdi-content-save-outline" size="16" />
                <span>保存</span>
              </button>
            </div>
          </div>

          <!-- Presets List -->
          <div>
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-caption font-weight-bold text-grey-lighten-2">
                保存済みマイスタイル一覧
              </span>
              <span class="text-caption text-grey font-mono">
                計 {{ store.savedPresets.length }} 件
              </span>
            </div>

            <!-- Empty State -->
            <div v-if="store.savedPresets.length === 0" class="empty-state-box pa-6 text-center">
              <v-icon icon="mdi-bookmark-off-outline" size="32" color="grey" class="mb-2" />
              <div class="text-subtitle-2 text-white font-weight-medium mb-1">保存されたスタイルはありません</div>
              <div class="text-caption text-grey">
                上の入力欄から、現在調整したデザイン設定をマイスタイルとして保存できます。
              </div>
            </div>

            <!-- Presets Cards -->
            <div v-else class="d-flex flex-column gap-2">
              <div
                v-for="preset in store.savedPresets"
                :key="preset.id"
                class="preset-item-card pa-3 d-flex align-center justify-space-between gap-3"
              >
                <!-- Info -->
                <div class="flex-grow-1">
                  <div class="d-flex align-center gap-2 mb-1">
                    <span class="text-subtitle-2 font-weight-bold text-white">{{ preset.name }}</span>
                    <span class="preset-tag font-mono">{{ preset.config.designSystem.toUpperCase() }}</span>
                    <span class="preset-tag font-mono text-grey">{{ preset.config.themeMode.toUpperCase() }}</span>
                  </div>
                  <div class="text-caption text-grey font-mono d-flex align-center gap-3">
                    <span>作成: {{ formatDate(preset.createdAt) }}</span>
                    <span>プラットフォーム: {{ preset.config.platform }}</span>
                    <span>スタック: {{ preset.config.outputTechStack }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="d-flex align-center gap-1-5 flex-shrink-0">
                  <button
                    type="button"
                    class="apply-btn px-3 py-1-5 text-caption font-weight-bold d-flex align-center gap-1"
                    @click="handleLoadPreset(preset.id, preset.name)"
                  >
                    <v-icon icon="mdi-check" size="14" />
                    <span>適用</span>
                  </button>

                  <template v-if="deleteConfirmId === preset.id">
                    <button
                      type="button"
                      class="delete-confirm-btn px-2 py-1-5 text-caption font-weight-bold"
                      @click="handleDeletePreset(preset.id, preset.name)"
                    >
                      本当に削除
                    </button>
                    <button
                      type="button"
                      class="cancel-btn px-2 py-1-5 text-caption"
                      @click="deleteConfirmId = null"
                    >
                      中止
                    </button>
                  </template>

                  <button
                    v-else
                    type="button"
                    class="icon-action-btn"
                    title="プリセットを削除"
                    @click="deleteConfirmId = preset.id"
                  >
                    <v-icon icon="mdi-delete-outline" size="16" color="grey" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: JSON Backup & Restore -->
        <div v-if="activeTab === 'json'" class="d-flex flex-column gap-4">
          <!-- Status Banner -->
          <div v-if="importStatus" class="pa-2-5 rounded text-caption d-flex align-center gap-2" :class="importStatus.type === 'success' ? 'status-success' : 'status-error'">
            <v-icon :icon="importStatus.type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'" size="16" />
            <span>{{ importStatus.message }}</span>
          </div>

          <!-- Export Section -->
          <div class="section-box pa-3">
            <div class="d-flex align-center justify-space-between mb-2">
              <div>
                <div class="text-subtitle-2 font-weight-bold text-white d-flex align-center gap-1-5">
                  <v-icon icon="mdi-download" size="16" color="primary" />
                  <span>JSONエクスポート (設定バックアップ)</span>
                </div>
                <div class="text-caption text-grey">
                  現在のアクティブ設定および全保存済みプリセットを含むJSONデータを書き出します
                </div>
              </div>

              <div class="d-flex align-center gap-2">
                <button
                  type="button"
                  class="pro-action-btn px-3 py-1-5 d-flex align-center gap-1 text-caption font-weight-bold"
                  @click="handleCopyJson"
                >
                  <v-icon :icon="isExportCopied ? 'mdi-check' : 'mdi-content-copy'" size="14" />
                  <span>{{ isExportCopied ? 'コピー完了' : 'JSONコピー' }}</span>
                </button>

                <button
                  type="button"
                  class="pro-action-btn pro-action-btn-primary px-3 py-1-5 d-flex align-center gap-1 text-caption font-weight-bold"
                  @click="handleDownloadJson"
                >
                  <v-icon icon="mdi-download" size="14" />
                  <span>.json ダウンロード</span>
                </button>
              </div>
            </div>

            <!-- JSON Preview Box -->
            <div class="json-preview-container pa-2">
              <pre class="json-code font-mono"><code>{{ exportedJson }}</code></pre>
            </div>
          </div>

          <!-- Import Section -->
          <div class="section-box pa-3">
            <div class="mb-2">
              <div class="text-subtitle-2 font-weight-bold text-white d-flex align-center gap-1-5">
                <v-icon icon="mdi-upload" size="16" color="secondary" />
                <span>JSONインポート (設定復元)</span>
              </div>
              <div class="text-caption text-grey">
                エクスポートした <code>.json</code> ファイルを選択するか、JSONテキストを直接貼り付けて復元します
              </div>
            </div>

            <!-- File Upload Zone -->
            <div class="d-flex align-center gap-3 mb-3">
              <label class="file-upload-btn px-3 py-2 text-caption font-weight-bold d-flex align-center gap-1 cursor-pointer">
                <v-icon icon="mdi-file-upload-outline" size="16" color="secondary" />
                <span>JSONファイルを選択</span>
                <input type="file" accept=".json,application/json" class="d-none" @change="handleFileUpload" />
              </label>
              <span class="text-caption text-grey">または、下のテキストエリアに直接貼り付け</span>
            </div>

            <v-textarea
              v-model="importJsonText"
              placeholder="ここにバックアップJSONコードを貼り付けてください..."
              rows="4"
              variant="outlined"
              density="compact"
              class="font-mono text-caption mb-2"
              hide-details
            />

            <div class="d-flex justify-end">
              <button
                type="button"
                class="apply-btn px-4 py-1-5 text-caption font-weight-bold d-flex align-center gap-1"
                :disabled="!importJsonText.trim()"
                @click="executeImport"
              >
                <v-icon icon="mdi-restore" size="14" />
                <span>インポートを実行</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<style scoped>
.gap-1-5 { gap: 6px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.font-mono { font-family: var(--font-mono); }
.cursor-pointer { cursor: pointer; }

.style-manager-card {
  background: rgba(13, 15, 23, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.modal-body-scroll {
  max-height: 75vh;
  overflow-y: auto;
}

.close-modal-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-modal-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.manager-tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
}
.manager-tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}
.manager-tab-btn-active {
  color: #ffffff !important;
  background: rgba(99, 102, 241, 0.25) !important;
  border: 1px solid rgba(99, 102, 241, 0.4) !important;
}

.save-box {
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
}

.save-btn {
  background: linear-gradient(135deg, #6366f1, #38bdf8);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.82rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.save-btn:hover {
  opacity: 0.92;
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
}

.empty-state-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 8px;
}

.preset-item-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  transition: all 0.15s ease;
}
.preset-item-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.16);
}

.preset-tag {
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #a5b4fc;
}

.apply-btn {
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #38bdf8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.apply-btn:hover {
  background: rgba(56, 189, 248, 0.28);
  color: #ffffff;
}

.delete-confirm-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
  border-radius: 4px;
  cursor: pointer;
}
.cancel-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  border-radius: 4px;
  cursor: pointer;
}

.icon-action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.icon-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.section-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
}

.json-preview-container {
  max-height: 160px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
}

.json-code {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.4;
  color: #94a3b8;
  white-space: pre;
}

.file-upload-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #ffffff;
  transition: all 0.15s ease;
}
.file-upload-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
</style>
