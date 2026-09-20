import LZString from 'lz-string'
import type { AppConfig } from '@/types/config'
import { copyToClipboard } from './promptGenerator'

const HASH_PREFIX = '#state='

/**
 * AppConfig オブジェクトを JSON 文字列化し、LZ-String で超圧縮エンコードして URL ハッシュ文字列を生成する
 */
export function encodeConfigToHash(config: AppConfig): string {
  try {
    const jsonStr = JSON.stringify(config)
    const compressed = LZString.compressToEncodedURIComponent(jsonStr)
    return `${HASH_PREFIX}${compressed}`
  } catch (err) {
    console.error('Failed to encode config to hash:', err)
    return ''
  }
}

/**
 * URL ハッシュ文字列から設定オブジェクトを安全にデコード・検証して復元する
 */
export function decodeConfigFromHash(hash: string): Partial<AppConfig> | null {
  if (!hash || !hash.includes('state=')) {
    return null
  }

  try {
    // Extract the encoded string after "state="
    const stateMatch = hash.match(/state=([^&]+)/)
    if (!stateMatch || !stateMatch[1]) {
      return null
    }

    const encoded = stateMatch[1]
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded)
    if (!decompressed) {
      console.warn('LZString decompression returned empty string')
      return null
    }

    const parsed = JSON.parse(decompressed)
    if (!parsed || typeof parsed !== 'object') {
      console.warn('Decompressed state is not an object')
      return null
    }

    // Basic schema validation
    if (!parsed.designSystem) {
      console.warn('Decompressed state missing designSystem')
      return null
    }

    return parsed as Partial<AppConfig>
  } catch (err) {
    console.error('Failed to decode config from hash:', err)
    return null
  }
}

/**
 * 現在の URL と圧縮ハッシュを結合して完全な共有 URL を生成する
 */
export function generateShareUrl(config: AppConfig): string {
  const hash = encodeConfigToHash(config)
  const baseUrl = `${window.location.origin}${window.location.pathname}`
  return `${baseUrl}${hash}`
}

/**
 * 共有 URL を生成し、クリップボードにコピーした上でブラウザの URL バーを更新する
 */
export async function copyShareUrlToClipboard(config: AppConfig): Promise<{ success: boolean; url: string }> {
  const fullUrl = generateShareUrl(config)
  const hash = encodeConfigToHash(config)

  // Update browser address bar without reload
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', hash)
  }

  const success = await copyToClipboard(fullUrl)
  return { success, url: fullUrl }
}
