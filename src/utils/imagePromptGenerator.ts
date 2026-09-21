import type {
  AppConfig,
  DesignSystemType,
  ImageAssetType,
  TargetImageAI,
  ImageAspectRatio,
} from '@/types/config'

export interface GeneratedImagePrompt {
  fullPrompt: string
  negativePrompt: string
  explanationJa: string
  targetToolName: string
  aspectRatio: ImageAspectRatio
  tags: string[]
}

interface DesignSystemAesthetic {
  keywords: string
  lighting: string
  medium: string
  negativeAdditions?: string
}

const DESIGN_AESTHETICS: Record<DesignSystemType, DesignSystemAesthetic> = {
  bento: {
    keywords: 'モダンテック・モジュラーデザイン、洗練されたダークオブシディアンの質感、立体的な3Dタイルコンポーネント、繊細なアクセント発光、マット仕上げ、幾何学的な精密構造',
    lighting: 'スタジオの柔らかな拡散光、美しいリムライトとアンビエントオクルージョン',
    medium: '3Dレンダリング、超高精細4K、ミニマルプロダクトデザイン',
    negativeAdditions: '乱雑, 汚れ, 有機的すぎる形状, レトロ風',
  },
  minimal: {
    keywords: 'ウルトラミニマル、計算された広い余白、繊細で正確な幾何学ライン、洗練された簡潔さ、バウハウス風の幾何学構成、ハイエンドなエディトリアルデザイン',
    lighting: '自然で柔らかな自然光、クリアで薄い陰影、繊細なグラデーション',
    medium: 'ベクターイラストレーションとクリーンなスタジオ撮影の融合、極めてシャープなディテール',
    negativeAdditions: '装飾過多, 混雑, 粗いノイズ, 派手すぎるテクスチャ',
  },
  brutalism: {
    keywords: 'ネオブロータリズム、力強い太い黒の境界線、ハイコントラストな構成、未加工の触感テクスチャ、構成主義ポスターの美学、大胆なインダストリアルグラフィック',
    lighting: 'フラットで力強い指向性照明、ぼかしのないソリッドなドロップシャドウ',
    medium: 'リソグラフ印刷風・ベクターグラフィック、レトロモダンなZINEアート',
    negativeAdditions: '柔らかいぼかし, グラデーション, パステルカラー, フォトリアル3D',
  },
  glassmorphism: {
    keywords: '半透明のフロストガラス（すりガラス）、美しい光の分散と屈折、発光するネオンのエッジ境界、滑らかな曲面グラスモーフィズム、空間コンピューティング風の美学',
    lighting: 'すりガラスを透過する鮮やかなバックライト、光の屈折とエッジの発光グロー',
    medium: '3Dレイトレーシングガラスレンダリング、被写界深度、高い透明感',
    negativeAdditions: '不透明なベタ塗り, フラット2D, 汚れ, レトロピクセル',
  },
  retrofuturistic: {
    keywords: '1980年代風レトロフューチャー・シンセウェーブ、ネオンに光るワイヤーフレームグリッド、CRTモニターの走査線グロー、マゼンタとシアンのデュアルトーン、80年代SFアニメのテイスト、クロームメタリックの反射',
    lighting: '暗闇に浮かぶ鮮烈なネオンリムライト、マゼンタとシアンの環境光',
    medium: 'レトロサイバーパンクデジタルペインティング、エアブラシ質感',
    negativeAdditions: 'パステルカワイイ, 土っぽいトーン, 現代風フラット, 昼間の自然光',
  },
  kawaii: {
    keywords: 'キュートな3Dクレイアニメーションスタイル、柔らかいマシュマロパステルカラー、ぷっくりと丸みを帯びた滑らかなフォルム、親しみやすく愛らしいキャラクターデザイン、温かみのある世界観',
    lighting: '暖かく居心地の良いボリューム光、ふんわりとした柔らかな陰影',
    medium: 'Blender 3Dソフトクレイレンダリング、マットなシリコン質感、ミニチュアトイの触感',
    negativeAdditions: 'ダーク, ホラー, 尖った角, リアルな生々しい写真, 荒廃',
  },
  gaming: {
    keywords: '鮮明な16ビットドット絵・ピクセルアート、アーケードゲームスプライトの美学、レトロCRTの鮮やかなカラーパレット、美しいピクセルグリッド、アイソメトリックなゲームアセット',
    lighting: 'アーケード画面の発光グロー、ハイコントラストなピクセル陰影、鮮やかなネオンアクセント' ,
    medium: '本格16ビットピクセルアート、ゲーム用グラフィックアセット',
    negativeAdditions: '滑らかなベクターグラデーション, フォトリアル3D, リアルクレイ, ぼやけた輪郭',
  },
}

interface AssetTypePromptMeta {
  labelJa: string
  composition: string
  defaultAspect: ImageAspectRatio
  framing: string
}

const ASSET_TYPE_META: Record<ImageAssetType, AssetTypePromptMeta> = {
  'app-icon': {
    labelJa: 'アプリアイコン',
    composition: '中央配置のアプリアイコン、角丸スクワークルバッジ、クリーンな単色背景、象徴的で印象的なシンボル、縮小表示でも高い視認性',
    defaultAspect: '1:1',
    framing: '正方形アイコンバッジ、中央マクロクローズアップ',
  },
  'hero-illustration': {
    labelJa: 'ヒーロー画像',
    composition: '広角シネマティックなヒーローイラストレーション、ストーリー性のあるダイナミックな構図、UIテキスト配置用の広い余白、Webサイトのトップヘッダー用プレミアムビジュアル',
    defaultAspect: '16:9',
    framing: 'パノラマワイドショット、ヘッダーバナー構図',
  },
  'background-art': {
    labelJa: '背景アート',
    composition: '控えめで美しいアンビエント背景アート、シームレスな装飾テクスチャ、穏やかで低コントラストな大気グラデーション、UIを邪魔しない抽象的壁紙',
    defaultAspect: '16:9',
    framing: 'ワイドな環境背景、低コントラストのフォーカス',
  },
  'character-sprite': {
    labelJa: 'キャラクター',
    composition: '全身キャラクタースプライト、生き生きとした表情とポーズ、明確なシルエット、単色背景に単体配置、ゲームやアプリ用のキャラクターコンセプト、正面やや斜め向き',
    defaultAspect: '1:1',
    framing: 'キャラクター全身ポートレート、単体切り抜きアセット',
  },
  'empty-state': {
    labelJa: '空状態イラスト',
    composition: '親しみやすい空状態（Empty State）UIイラストレーション、親切で共感を呼ぶコンセプトヴィネット、浮遊するモチーフ、クリーンで isolated な構図',
    defaultAspect: '4:3',
    framing: '中央配置のヴィネットイラスト',
  },
}

export function generateImageAssetPrompt(config: AppConfig): GeneratedImagePrompt {
  const { designSystem, colors, themeMode, imageAsset } = config
  const asset = imageAsset || {
    assetType: 'app-icon',
    themeMotif: '洗練されたミニマルなアプリアイコンシンボル',
    targetAi: 'gemini',
    aspectRatio: '1:1',
    includeNegativePrompt: true,
  }

  const aesthetic = DESIGN_AESTHETICS[designSystem] || DESIGN_AESTHETICS.bento
  const assetMeta = ASSET_TYPE_META[asset.assetType] || ASSET_TYPE_META['app-icon']
  const aspectRatio = asset.aspectRatio || assetMeta.defaultAspect

  // Color palette hints in Japanese
  const themeHint =
    themeMode === 'light'
      ? '明るく開放的なライトテーマ、クリアで爽やかな空気感'
      : 'ダークオブシディアン背景、コントラストの高いシックな雰囲気'

  const colorPalettePrompt = `アクセントカラー「${colors.accent}」、サーフェストーン「${colors.surface}」、文字色「${colors.primaryText}」と調和する洗練された配色`

  // Motif translation / formatting
  const motif = asset.themeMotif.trim() || '洗練されたモダンなUIグラフィック'

  let fullPrompt = ''
  let negativePrompt =
    '文字, テキスト, 英単語, ウォーターマーク, 署名, ぼやけ, 低解像度, ノイズ, アーティファクト, 歪み, 崩れた構図, 不自然な質感, 粗いディテール, 欠損'

  if (aesthetic.negativeAdditions) {
    negativePrompt += `, ${aesthetic.negativeAdditions}`
  }

  switch (asset.targetAi) {
    case 'gemini':
      fullPrompt = `Google Nano Banana（Gemini）向けのUI画像アセット生成指示：

【アセット種別】${assetMeta.labelJa}（アスペクト比 ${aspectRatio}）
【テーマ・モチーフ】${motif}
【デザイン様式】${aesthetic.keywords}
【質感・表現】${aesthetic.medium}
【照明と雰囲気】${aesthetic.lighting}、${themeHint}
【構図・レイアウト】${assetMeta.composition}、${assetMeta.framing}
【カラーパレット】${colorPalettePrompt}
【品質・仕上げ】超高精細4K品質、極めてシャープな輪郭、クリーンなスタジオ背景、画像内に不要な文字やテキスト・透かしを一切入れないこと、UI実装用に最適化`
      break

    case 'dalle3':
      fullPrompt = `Web・デスクトップアプリ向けの高品質なUI画像アセットを作成してください。

【テーマ・モチーフ】${motif}
【アセット形式】${assetMeta.labelJa}（アスペクト比 ${aspectRatio}）
【構図・アングル】${assetMeta.composition}
【ビジュアルスタイル】${aesthetic.keywords}
【質感と画材】${aesthetic.medium}
【照明と色彩】${aesthetic.lighting}。${themeHint}。${colorPalettePrompt}。
【重要禁止事項】画像内に英単語、文字、テキスト、UIボタンなどの文字要素を一切描画しないでください。`
      break

    case 'midjourney':
      fullPrompt = `${motif}, ${assetMeta.labelJa}, ${assetMeta.composition}, ${aesthetic.keywords}, ${aesthetic.lighting}, ${aesthetic.medium}, ${themeHint}, アクセントカラー ${colors.accent}, テキストなし --ar ${aspectRatio.replace(':', ':')} --v 6.1 --style raw`
      break

    case 'stable-diffusion':
    default:
      fullPrompt = `${motif}, ${assetMeta.labelJa}, ${assetMeta.composition}, ${aesthetic.keywords}, ${aesthetic.lighting}, ${aesthetic.medium}, ${themeHint}, アクセントカラー ${colors.accent}, 傑作, 最高品質, 超高精細4K, テキストなし`
      break
  }

  const targetNames: Record<TargetImageAI, string> = {
    gemini: 'Google Gemini (Nano Banana Pro / Nano Banana 2)',
    midjourney: 'Midjourney v6.1 / Niji 6',
    dalle3: 'DALL-E 3 (ChatGPT Plus)',
    'stable-diffusion': 'Stable Diffusion 3.5 Large / FLUX',
  }

  const explanationJa = `選択中のデザインシステム「${designSystem}」の美術様式およびカラーパレット（アクセント: ${colors.accent}）と調和するよう自動構成された日本語プロンプトです。`

  const tags = [
    designSystem.toUpperCase(),
    asset.assetType.toUpperCase(),
    aspectRatio,
    targetNames[asset.targetAi],
  ]

  return {
    fullPrompt,
    negativePrompt,
    explanationJa,
    targetToolName: targetNames[asset.targetAi],
    aspectRatio,
    tags,
  }
}
