<script setup lang="ts">
import { useConfigStore } from '@/stores/configStore'

const store = useConfigStore()

const activities = [
  { user: '田中 健一', action: 'APIトークンを発行', time: '2分前', status: '完了' },
  { user: '佐藤 美咲', action: 'ダッシュボードを更新', time: '14分前', status: '完了' },
  { user: '鈴木 翔太', action: '新規ノードをデプロイ', time: '1時間前', status: '処理中' },
]
</script>

<template>
  <div class="sandbox-bento-grid">
    <!-- Stat Card 1 -->
    <div v-if="store.config.components.statCards" class="sandbox-card col-span-6">
      <div class="d-flex align-center justify-space-between">
        <span class="stat-card-label">総アクティブユーザー</span>
        <v-icon icon="mdi-account-group-outline" size="14" style="color: var(--ui-text-secondary);" />
      </div>
      <div class="stat-card-value">128,420</div>
      <div class="stat-trend-badge">
        <v-icon icon="mdi-arrow-up-right" size="12" />
        <span>+14.8% (先週比)</span>
      </div>
    </div>

    <!-- Stat Card 2 -->
    <div v-if="store.config.components.statCards" class="sandbox-card col-span-6">
      <div class="d-flex align-center justify-space-between">
        <span class="stat-card-label">システム稼働率</span>
        <v-icon icon="mdi-server" size="14" style="color: var(--ui-text-secondary);" />
      </div>
      <div class="stat-card-value">99.99%</div>
      <div class="stat-trend-badge" style="color: var(--ui-accent);">
        <v-icon icon="mdi-check-circle-outline" size="12" />
        <span>SLA正常維持</span>
      </div>
    </div>

    <!-- Interactive / Visual Chart -->
    <div v-if="store.config.components.charts" class="sandbox-card col-span-12">
      <div class="d-flex align-center justify-space-between mb-1">
        <span class="stat-card-label">トラフィック推移 // リアルタイム解析</span>
        <span class="font-mono" style="font-size: 0.65rem; color: var(--ui-text-secondary);">過去30日間</span>
      </div>

      <!-- Clean SVG Area Line Chart -->
      <div class="sandbox-chart-container">
        <svg viewBox="0 0 500 80" preserveAspectRatio="none" style="width: 100%; height: 100%; overflow: visible;">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--ui-accent)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--ui-accent)" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <!-- Area Fill -->
          <path
            d="M 0 65 Q 60 40 120 50 T 240 25 T 360 35 T 500 15 L 500 80 L 0 80 Z"
            fill="url(#chartGlow)"
          />
          <!-- Stroke Line -->
          <path
            d="M 0 65 Q 60 40 120 50 T 240 25 T 360 35 T 500 15"
            fill="none"
            stroke="var(--ui-accent)"
            stroke-width="2.5"
            stroke-linecap="round"
          />
          <!-- Peak Data Points -->
          <circle cx="240" cy="25" r="3.5" fill="var(--ui-accent)" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="500" cy="15" r="3.5" fill="var(--ui-accent)" stroke="#ffffff" stroke-width="1.5" />
        </svg>
      </div>
    </div>

    <!-- Activity Log Table -->
    <div v-if="store.config.components.activityTable" class="sandbox-card col-span-12">
      <div class="d-flex align-center justify-space-between mb-2">
        <span class="stat-card-label">最新アクティビティログ</span>
        <span class="font-mono" style="font-size: 0.65rem; color: var(--ui-text-secondary);">3件表示</span>
      </div>

      <table class="sandbox-table">
        <thead>
          <tr>
            <th>ユーザー</th>
            <th>アクション</th>
            <th>時間</th>
            <th style="text-align: right;">状態</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="act in activities" :key="act.user">
            <td style="font-weight: 600;">{{ act.user }}</td>
            <td style="color: var(--ui-text-secondary);">{{ act.action }}</td>
            <td class="font-mono" style="color: var(--ui-text-secondary);">{{ act.time }}</td>
            <td style="text-align: right;">
              <span
                style="display: inline-block; padding: 2px 6px; font-size: 0.62rem; font-weight: 700; border-radius: 4px; background: rgba(255,255,255,0.06); border: 1px solid var(--ui-border);"
                :style="{ color: act.status === '完了' ? '#10b981' : '#f59e0b' }"
              >
                {{ act.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
