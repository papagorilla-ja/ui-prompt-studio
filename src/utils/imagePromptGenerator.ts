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
    keywords: 'modern tech modular aesthetic, sleek dark obsidian surfaces, tactile 3D tile components, glowing subtle accent lights, matte finish, clean geometry, precision engineering',
    lighting: 'soft diffused overhead studio lighting with delicate rim lights and gentle ambient occlusion',
    medium: 'octane 3D render, 8k resolution, minimalist product design',
    negativeAdditions: 'messy, organic, grunge, vintage, cluttered',
  },
  minimal: {
    keywords: 'ultra-minimalist, vast clean negative space, precise geometric lines, elegant simplicity, bauhaus-inspired composition, monochromatic harmony with subtle vibrant accent, high-end editorial design',
    lighting: 'natural soft diffused daylight, pristine soft shadows, subtle clean gradients',
    medium: 'vector illustration and fine studio photography hybrid, razor-sharp clarity',
    negativeAdditions: 'cluttered, decorative, chaotic, busy, textured, noisy',
  },
  brutalism: {
    keywords: 'neo-brutalist graphic design, heavy bold solid black outlines, high contrast stark composition, unpolished raw tactile surfaces, constructivist poster aesthetics, industrial typography influence',
    lighting: 'flat harsh directional lighting, solid drop shadows with zero blur',
    medium: 'risograph screenprint and vector graphic, retro-modern tactile zine aesthetic',
    negativeAdditions: 'soft blur, gradients, gentle pastels, photorealistic 3d, smooth curves',
  },
  glassmorphism: {
    keywords: 'translucent frosted glass, realistic optical chromatic dispersion, ethereal refraction, luminous neon glowing border edges, smooth curved glass morphism, modern spatial computing aesthetic',
    lighting: 'vibrant colored backlight penetrating frosted glass, glowing edges and caustic light refractions',
    medium: '3D raytraced glass render, high dynamic range, soft depth of field',
    negativeAdditions: 'opaque solid, flat 2d, heavy grunge, retro pixel, harsh contrast',
  },
  retrofuturistic: {
    keywords: '1980s retrofuturistic synthwave aesthetic, luminous neon wireframe grid, CRT phosphor scanline glow, magenta and cyan dual-tone palette, vintage sci-fi anime cover art, chrome metallic reflections',
    lighting: 'intense neon rim light, magenta and cyan chromatic ambient glow in darkness',
    medium: 'retro cyberpunk digital painting, airbrush textures, nostalgic 80s anime aesthetic',
    negativeAdditions: 'pastel kawaii, rustic, earthy tones, modern flat minimal, daylight',
  },
  kawaii: {
    keywords: 'cute 3D claymation style, soft pastel marshmallow colors, bubbly rounded smooth shapes, adorable friendly character design, delightful whimsical aesthetic, charming playful composition',
    lighting: 'warm cozy volumetric light, soft ambient pillowy glow, gentle pillowy shadows',
    medium: 'blender 3D soft clay render, smooth matte silicone texture, cute toy miniature feel',
    negativeAdditions: 'dark, scary, gritty, sharp angles, realistic photo, intense neon, bleak',
  },
  gaming: {
    keywords: 'crisp 16-bit pixel art, arcade video game sprite aesthetic, vibrant retro CRT color palette, clean sharp pixel grid, isometric game asset, nostalgic gaming UI graphics, arcade cabinet vibes',
    lighting: 'arcade screen luminous glow, high-contrast pixel shading, vibrant neon accents',
    medium: 'authentic 16-bit pixel art, raster sprite illustration, game-ready asset',
    negativeAdditions: 'smooth vector gradients, photorealistic 3d, realistic clay, blurred lines',
  },
}

interface AssetTypePromptMeta {
  composition: string
  defaultAspect: ImageAspectRatio
  framing: string
}

const ASSET_TYPE_META: Record<ImageAssetType, AssetTypePromptMeta> = {
  'app-icon': {
    composition: 'centered app icon, rounded squircle badge canvas, isolated on a clean neutral background, iconic visual metaphor, bold recognizable symbol, high visual readability at small scale, modern app store icon',
    defaultAspect: '1:1',
    framing: 'square icon badge, centered macro shot',
  },
  'hero-illustration': {
    composition: 'wide-angle cinematic hero illustration, expansive storytelling composition, dynamic perspective, generous negative space on one side for UI text overlay, premium website header visual',
    defaultAspect: '16:9',
    framing: 'panoramic wide shot, banner layout',
  },
  'background-art': {
    composition: 'subtle ambient background artwork, seamless decorative texture, gentle low-contrast atmospheric gradient, unobtrusive abstract wallpaper, non-distracting UI backdrop',
    defaultAspect: '16:9',
    framing: 'wide ambient backdrop, low contrast focus',
  },
  'character-sprite': {
    composition: 'full body character sprite, expressive dynamic pose, clear distinct silhouette, isolated on neutral background, game-ready character concept, front three-quarter view',
    defaultAspect: '1:1',
    framing: 'character full portrait, isolated asset',
  },
  'empty-state': {
    composition: 'friendly empty state UI illustration, conceptual storytelling vignette, whimsical floating objects, clean isolated composition, inviting and empathetic mood',
    defaultAspect: '4:3',
    framing: 'centered vignette illustration',
  },
}

export function generateImageAssetPrompt(config: AppConfig): GeneratedImagePrompt {
  const { designSystem, colors, themeMode, imageAsset } = config
  const asset = imageAsset || {
    assetType: 'app-icon',
    themeMotif: '洗練されたアプリアイコン',
    targetAi: 'gemini',
    aspectRatio: '1:1',
    includeNegativePrompt: true,
  }

  const aesthetic = DESIGN_AESTHETICS[designSystem] || DESIGN_AESTHETICS.bento
  const assetMeta = ASSET_TYPE_META[asset.assetType] || ASSET_TYPE_META['app-icon']
  const aspectRatio = asset.aspectRatio || assetMeta.defaultAspect

  // Color palette hints
  const themeHint = themeMode === 'light' ? 'light and airy color theme, bright clean atmosphere' : 'dark obsidian background, moody high-contrast lighting'
  const colorPalettePrompt = `Color accents harmonized with primary hex ${colors.accent}, surface tone ${colors.surface}, and text highlights ${colors.primaryText}`

  // Motif translation / formatting
  const motif = asset.themeMotif.trim() || 'futuristic productivity app'

  let fullPrompt = ''
  let negativePrompt = 'text, letters, watermark, signature, blurry, low resolution, artifacts, distorted, poorly drawn, deformed, disfigured, bad anatomy'

  if (aesthetic.negativeAdditions) {
    negativePrompt += `, ${aesthetic.negativeAdditions}`
  }

  const baseContent = `${motif}, ${assetMeta.composition}, ${aesthetic.keywords}, ${aesthetic.lighting}, ${aesthetic.medium}, ${themeHint}, ${colorPalettePrompt}`

  switch (asset.targetAi) {
    case 'midjourney':
      fullPrompt = `${baseContent} --ar ${aspectRatio.replace(':', ':')} --v 6.1 --style raw`
      break

    case 'gemini':
      fullPrompt = `Generate a high-fidelity production-ready ${asset.assetType.replace('-', ' ')} using Google Nano Banana:
Subject/Theme: ${motif}
Visual Style: ${aesthetic.keywords}, ${aesthetic.medium}
Lighting & Atmosphere: ${aesthetic.lighting}, ${themeHint}
Composition & Framing: ${assetMeta.composition}, ${assetMeta.framing}
Color Harmony: ${colorPalettePrompt}
Quality: ultra-sharp 4K fidelity, pristine surface textures, clean studio background, no text, no watermarks, ready for UI implementation.`
      break

    case 'dalle3':
      fullPrompt = `A premium UI graphic asset for a web application representing ${motif}.
Format: ${assetMeta.composition}.
Visual Style: ${aesthetic.keywords}.
Lighting and Textures: ${aesthetic.lighting}, ${aesthetic.medium}.
Color Mood: ${themeHint}. Accent color: ${colors.accent}.
Do not include any text, letters, UI buttons, or words in the image.`
      break

    case 'stable-diffusion':
    default:
      fullPrompt = `${baseContent}, masterpiece, best quality, ultra-detailed`
      break
  }

  const targetNames: Record<TargetImageAI, string> = {
    gemini: 'Google Gemini (Nano Banana Pro / Nano Banana 2)',
    midjourney: 'Midjourney v6.1 / Niji 6',
    dalle3: 'DALL-E 3 (ChatGPT Plus)',
    'stable-diffusion': 'Stable Diffusion 3.5 Large / FLUX',
  }

  const explanationJa = `選択中のデザインシステム「${designSystem}」の美術様式およびカラーパレット（アクセント: ${colors.accent}）と調和するよう自動構成されたプロンプトです。`

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
