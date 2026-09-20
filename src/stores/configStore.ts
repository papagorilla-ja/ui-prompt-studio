import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  AppConfig,
  PlatformType,
  ThemeMode,
  DesignSystemType,
  RulesConfig,
  ColorsConfig,
  ComponentsConfig,
  OutputTechStack,
  SavedPreset,
} from '@/types/config'
import { DESIGN_SYSTEMS, createInitialConfig } from '@/constants/presets'

const PRESETS_STORAGE_KEY = 'ui-prompt-studio-presets-v1'
const ACTIVE_CONFIG_STORAGE_KEY = 'ui-prompt-studio-active-config-v1'

export const useConfigStore = defineStore('config', () => {
  // 1. Reactive State
  const config = ref<AppConfig>(loadInitialActiveConfig())
  const savedPresets = ref<SavedPreset[]>(loadStoredPresets())

  // 2. Getters
  const currentDesignSystemMeta = computed(() => {
    return DESIGN_SYSTEMS[config.value.designSystem] || DESIGN_SYSTEMS.bento
  })

  const isDesktop = computed(() => config.value.platform === 'desktop')
  const isLight = computed(() => config.value.themeMode === 'light')

  const cssVariables = computed(() => {
    const { colors, rules } = config.value
    return {
      '--ui-bg': colors.base,
      '--ui-surface': colors.surface,
      '--ui-text-primary': colors.primaryText,
      '--ui-text-secondary': colors.secondaryText,
      '--ui-accent': colors.accent,
      '--ui-border': colors.border,
      '--ui-radius': `${rules.borderRadius}px`,
      '--ui-gap': `${rules.gap}px`,
      '--ui-padding': `${rules.padding}px`,
      '--ui-button-gap': `${rules.buttonGap ?? 10}px`,
      '--ui-border-width': `${rules.borderWidth}px`,
      '--ui-h1-size': rules.h1Size,
      '--ui-h1-weight': rules.h1Weight.toString(),
      '--ui-body-size': rules.bodySize,
      '--ui-max-width': rules.maxWidth,
    }
  })

  // 3. Actions: Platform & Design System
  function setPlatform(platform: PlatformType) {
    config.value.platform = platform
    if (platform === 'desktop') {
      config.value.components.titlebar = true
      if (config.value.rules.maxWidth === '1280px') {
        config.value.rules.maxWidth = '100%'
      }
    } else {
      config.value.components.titlebar = false
      if (config.value.rules.maxWidth === '100%') {
        config.value.rules.maxWidth = '1280px'
      }
    }
    persistActiveConfig()
  }

  function setThemeMode(mode: ThemeMode) {
    config.value.themeMode = mode
    const meta = currentDesignSystemMeta.value
    if (meta) {
      config.value.colors = {
        ...(mode === 'light' ? meta.defaultLightColors : meta.defaultColors),
      }
    }
    persistActiveConfig()
  }

  function setDesignSystem(system: DesignSystemType) {
    config.value.designSystem = system
    const meta = DESIGN_SYSTEMS[system]
    if (meta) {
      // Apply professional smart recommended defaults
      config.value.rules = { ...meta.defaultRules }
      config.value.colors = {
        ...(config.value.themeMode === 'light' ? meta.defaultLightColors : meta.defaultColors),
      }
      // Keep desktop maxWidth preference
      if (config.value.platform === 'desktop') {
        config.value.rules.maxWidth = '100%'
      }
    }
    persistActiveConfig()
  }

  // 4. Actions: Fine-tuning Rules & Colors
  function updateRules(rules: Partial<RulesConfig>) {
    config.value.rules = { ...config.value.rules, ...rules }
    persistActiveConfig()
  }

  function updateColors(colors: Partial<ColorsConfig>) {
    config.value.colors = { ...config.value.colors, ...colors }
    persistActiveConfig()
  }

  function toggleComponent(key: keyof ComponentsConfig, value?: boolean) {
    if (typeof value === 'boolean') {
      config.value.components[key] = value
    } else {
      config.value.components[key] = !config.value.components[key]
    }
    persistActiveConfig()
  }

  function setAllComponents(enabled: boolean) {
    for (const key of Object.keys(config.value.components) as (keyof ComponentsConfig)[]) {
      if (key === 'titlebar' && config.value.platform !== 'desktop') {
        config.value.components[key] = false
      } else {
        config.value.components[key] = enabled
      }
    }
    persistActiveConfig()
  }

  function setCustomPurpose(purpose: string) {
    config.value.customPurpose = purpose
    persistActiveConfig()
  }

  function setOutputTechStack(stack: OutputTechStack) {
    config.value.outputTechStack = stack
    persistActiveConfig()
  }

  function resetToDefault() {
    config.value = createInitialConfig()
    persistActiveConfig()
  }

  function loadConfig(newConfig: Partial<AppConfig>) {
    try {
      const initial = createInitialConfig()
      config.value = {
        version: newConfig.version ?? 1,
        platform: newConfig.platform ?? initial.platform,
        themeMode: newConfig.themeMode ?? initial.themeMode,
        designSystem: newConfig.designSystem ?? initial.designSystem,
        rules: { ...initial.rules, ...(newConfig.rules || {}) },
        colors: { ...initial.colors, ...(newConfig.colors || {}) },
        components: { ...initial.components, ...(newConfig.components || {}) },
        customPurpose: newConfig.customPurpose ?? '',
        outputTechStack: newConfig.outputTechStack ?? initial.outputTechStack,
      }
      persistActiveConfig()
      return true
    } catch {
      return false
    }
  }

  // 5. Presets Management (LocalStorage)
  function saveCurrentAsPreset(name: string): SavedPreset {
    const preset: SavedPreset = {
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim() || `${currentDesignSystemMeta.value.name} カスタム`,
      createdAt: Date.now(),
      config: JSON.parse(JSON.stringify(config.value)),
    }
    savedPresets.value.unshift(preset)
    persistSavedPresets()
    return preset
  }

  function loadPreset(id: string): boolean {
    const preset = savedPresets.value.find((p) => p.id === id)
    if (preset) {
      loadConfig(preset.config)
      return true
    }
    return false
  }

  function deletePreset(id: string): boolean {
    const idx = savedPresets.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      savedPresets.value.splice(idx, 1)
      persistSavedPresets()
      return true
    }
    return false
  }

  function exportPresetsAsJson(): string {
    const payload = {
      app: 'ui-prompt-studio',
      version: 1,
      exportedAt: Date.now(),
      currentConfig: config.value,
      presets: savedPresets.value,
    }
    return JSON.stringify(payload, null, 2)
  }

  function importFromJson(jsonStr: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonStr)
      if (!data || typeof data !== 'object') {
        return { success: false, message: '無効なJSONフォーマットです' }
      }

      if (data.currentConfig) {
        loadConfig(data.currentConfig)
      }

      if (Array.isArray(data.presets)) {
        // Merge without duplicate IDs
        const existingIds = new Set(savedPresets.value.map((p) => p.id))
        const newPresets = data.presets.filter((p: SavedPreset) => p.id && p.name && !existingIds.has(p.id))
        savedPresets.value.unshift(...newPresets)
        persistSavedPresets()
      }

      return { success: true, message: '設定とプリセットを正常に読み込みました' }
    } catch (err: any) {
      return { success: false, message: `JSON読み込みエラー: ${err.message}` }
    }
  }

  // 6. Persistence Helpers
  function persistActiveConfig() {
    try {
      localStorage.setItem(ACTIVE_CONFIG_STORAGE_KEY, JSON.stringify(config.value))
    } catch (e) {
      console.warn('LocalStorage save failed', e)
    }
  }

  function persistSavedPresets() {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(savedPresets.value))
    } catch (e) {
      console.warn('LocalStorage save presets failed', e)
    }
  }

  function loadInitialActiveConfig(): AppConfig {
    try {
      const saved = localStorage.getItem(ACTIVE_CONFIG_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object' && parsed.designSystem) {
          const initial = createInitialConfig()
          return {
            version: parsed.version ?? 1,
            platform: parsed.platform ?? initial.platform,
            themeMode: parsed.themeMode ?? initial.themeMode,
            designSystem: parsed.designSystem ?? initial.designSystem,
            rules: { ...initial.rules, ...(parsed.rules || {}) },
            colors: { ...initial.colors, ...(parsed.colors || {}) },
            components: { ...initial.components, ...(parsed.components || {}) },
            customPurpose: parsed.customPurpose ?? '',
            outputTechStack: parsed.outputTechStack ?? initial.outputTechStack,
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage load failed, fallback to defaults', e)
    }
    return createInitialConfig()
  }

  function loadStoredPresets(): SavedPreset[] {
    try {
      const saved = localStorage.getItem(PRESETS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('LocalStorage load presets failed', e)
    }
    return []
  }

  return {
    // State & Getters
    config,
    savedPresets,
    currentDesignSystemMeta,
    isDesktop,
    isLight,
    cssVariables,
    // Actions
    setPlatform,
    setThemeMode,
    setDesignSystem,
    updateRules,
    updateColors,
    toggleComponent,
    setAllComponents,
    setCustomPurpose,
    setOutputTechStack,
    resetToDefault,
    loadConfig,
    saveCurrentAsPreset,
    loadPreset,
    deletePreset,
    exportPresetsAsJson,
    importFromJson,
  }
})
