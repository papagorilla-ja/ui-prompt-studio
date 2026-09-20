<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'
import type { ComponentsConfig } from '@/types/config'

const store = useConfigStore()

interface ComponentCategory {
  title: string
  icon: string
  items: {
    key: keyof ComponentsConfig
    label: string
    desc: string
    desktopOnly?: boolean
    webRecommended?: boolean
  }[]
}

const categories: ComponentCategory[] = [
  {
    title: '構造・ナビゲーション',
    icon: 'mdi-view-dashboard-outline',
    items: [
      {
        key: 'titlebar',
        label: 'カスタムタイトルバー',
        desc: 'macOS風の信号機ボタン・ドラッグ領域（デスクトップ向け）',
        desktopOnly: true,
      },
      {
        key: 'sidebar',
        label: 'サイドバーナビゲーション',
        desc: 'SaaS・管理画面向け、折りたたみ対応',
      },
      {
        key: 'navbar',
        label: 'グローバルナビゲーションバー',
        desc: '一般的なWebサイト向け上部固定バー',
      },
      {
        key: 'profileArea',
        label: 'ユーザープロフィール / アカウント切替',
        desc: 'アバター、名前、クイック設定メニュー',
      },
    ],
  },
  {
    title: 'ヘッダー・キービジュアル',
    icon: 'mdi-page-layout-header',
    items: [
      {
        key: 'contextHeader',
        label: 'コンテキストヘッダー',
        desc: '現在のページ名、パンくずリスト、クイック検索窓',
      },
      {
        key: 'heroSection',
        label: 'ヒーローセクション',
        desc: '大きなキャッチコピー、メインビジュアル、プライマリーボタン',
        webRecommended: true,
      },
    ],
  },
  {
    title: 'メインエリア・コンテンツ',
    icon: 'mdi-view-grid-outline',
    items: [
      {
        key: 'bentoContainer',
        label: 'Bento Grid コンテナ',
        desc: '可変サイズのカード群を内包する親グリッド',
      },
      {
        key: 'statCards',
        label: 'データ・統計数値表示カード',
        desc: '巨大な数字、微細なトレンドインジケータ/矢印',
      },
      {
        key: 'charts',
        label: 'インタラクティブ・チャート/グラフ',
        desc: 'ミニマルな折れ線や棒グラフコンポーネント',
      },
      {
        key: 'activityTable',
        label: 'アクティビティログ / テーブル',
        desc: '最新ユーザーや取引履歴のクリーンな一覧',
      },
    ],
  },
  {
    title: 'インタラクション・フッター',
    icon: 'mdi-form-select',
    items: [
      {
        key: 'minimalForm',
        label: 'ミニマル入力フォーム',
        desc: 'フローティングラベル、バリデーション付きテキストフィールド',
      },
      {
        key: 'actionButtons',
        label: 'アクションボタン群',
        desc: '最重要ボタン、セカンダリボタン、アイコンのみのサードボタン',
      },
      {
        key: 'statusBar',
        label: 'ステータスバー',
        desc: '「All systems operational」などのミニマルな稼働状況バー',
      },
    ],
  },
]
</script>

<template>
  <div class="components-selector d-flex flex-column gap-3">
    <!-- Component Action Toolbar -->
    <div class="d-flex align-center justify-end gap-1 mb-1">
      <v-btn
        size="x-small"
        variant="tonal"
        color="primary"
        class="font-weight-bold"
        @click="store.setAllComponents(true)"
      >
        全選択
      </v-btn>
      <v-btn
        size="x-small"
        variant="text"
        color="grey"
        @click="store.setAllComponents(false)"
      >
        全解除
      </v-btn>
    </div>

    <!-- Category Groups -->
    <div
      v-for="cat in categories"
      :key="cat.title"
      class="cat-card linear-card pa-3"
    >
      <div class="text-body-2 font-weight-bold text-white mb-2 d-flex align-center">
        <v-icon :icon="cat.icon" size="16" class="mr-1 text-primary" />
        {{ cat.title }}
      </div>

      <div class="d-flex flex-column gap-1">
        <template v-for="item in cat.items" :key="item.key">
          <div
            class="component-item d-flex align-start pa-2 rounded cursor-pointer transition-all"
            :class="{ 'item-active': store.config.components[item.key] }"
            @click="store.toggleComponent(item.key)"
          >
            <v-checkbox-btn
              :model-value="store.config.components[item.key]"
              density="compact"
              color="primary"
              class="mr-2 mt-n1"
              @update:model-value="store.toggleComponent(item.key)"
            />
            <div class="flex-grow-1">
              <div class="d-flex align-center gap-2">
                <span class="text-body-2 font-weight-bold" :class="store.config.components[item.key] ? 'text-white' : 'text-grey-lighten-1'">{{ item.label }}</span>
                <v-chip
                  v-if="item.desktopOnly && store.isDesktop"
                  size="x-small"
                  color="secondary"
                  variant="flat"
                  class="font-weight-bold"
                >
                  Desktop推奨
                </v-chip>
                <v-chip
                  v-if="item.webRecommended && !store.isDesktop"
                  size="x-small"
                  color="info"
                  variant="tonal"
                >
                  Web推奨
                </v-chip>
              </div>
              <div class="text-caption text-grey">{{ item.desc }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.transition-all { transition: all 0.15s ease; }

.component-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.item-active {
  background: rgba(99, 102, 241, 0.1);
  border-radius: 6px;
}
</style>
