import { createMemoryHistory, createHashHistory, type Listener } from 'history'
import { getLuminance, mix, parseToHsl, setHue, setLightness } from 'polished'
import {
  black as _black,
  type ColorTints,
  type ColorValue,
  hues as _hues,
  white as _white,
  type ColorHueConfig,
  COLOR_TINTS,
  type ColorHueKey,
  type ColorTintKey,
} from '@sanity/color'
import { useState, useMemo, useLayoutEffect, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  type Theme,
  createColorTheme,
  rgba,
  multiply as _multiply,
  screen as _screen,
  parseColor,
  rgbToHex,
} from '@sanity/ui'
import {
  defaultTheme,
  ColorSchemeProvider,
  StudioProvider,
  StudioLayout,
  ImagePalette,
} from 'sanity'

// @TODO use this hook to look up studios in the workspaces array
export function useBasePath() {
  const router = useRouter()
  return useMemo(() => router.route.split('/[')[0], [router.route])
}

export function useColorConfigState(props: ColorHueConfig) {
  const [darkest, setDarkest] = useState(props.darkest)
  const [lightest, setLightest] = useState(props.lightest)
  const [mid, setMid] = useState(props.mid)
  const [midPoint, setMidPoint] = useState(props.midPoint)
  const state = useMemo<
    Pick<ColorHueConfig, 'darkest' | 'lightest' | 'mid' | 'midPoint'>
  >(
    () => ({ darkest, lightest, mid, midPoint }),
    [darkest, lightest, mid, midPoint]
  )

  // Sync state updates from props
  useEffect(() => void setDarkest(props.darkest), [props.darkest])
  useEffect(() => void setLightest(props.lightest), [props.lightest])
  useEffect(() => void setMid(props.mid), [props.mid])
  useEffect(() => void setMidPoint(props.midPoint), [props.midPoint])

  return {
    state,
    setDarkest,
    setMid,
    setMidPoint,
    setLightest,
  }
}

/*
Lets use data like this to generate a theme:
// from *[_type == "sanity.imageAsset"].metadata.palette
// can also query *[_type == "sanity.imagePalette"]
// From this image "https://unsplash.com/photos/sO-JmQj95ec"

*/
export const demoImagePalette = {
  _type: 'sanity.imagePalette',
  darkMuted: {
    _type: 'sanity.imagePaletteSwatch',
    background: '#242853',
    foreground: '#fff',
    population: 7.61,
    title: '#fff',
  },
  darkVibrant: {
    _type: 'sanity.imagePaletteSwatch',
    background: '#1c2c6c',
    foreground: '#fff',
    population: 0.01,
    title: '#fff',
  },
  dominant: {
    _type: 'sanity.imagePaletteSwatch',
    background: '#242853',
    foreground: '#fff',
    population: 7.61,
    title: '#fff',
  },
  lightMuted: {
    _type: 'sanity.imagePaletteSwatch',
    background: '#d4a2ce',
    foreground: '#000',
    population: 2.32,
    title: '#fff',
  },
  lightVibrant: {
    _type: 'sanity.imagePaletteSwatch',
    background: '#f9b1a1',
    foreground: '#000',
    population: 1.11,
    title: '#fff',
  },
  muted: {
    _type: 'sanity.imagePaletteSwatch',
    background: '#ab5753',
    foreground: '#fff',
    population: 2.39,
    title: '#fff',
  },
  vibrant: {
    _type: 'sanity.imagePaletteSwatch',
    background: '#b43c34',
    foreground: '#fff',
    population: 0,
    title: '#fff',
  },
} as const

const NEUTRAL_TONES = ['default', 'transparent']

// https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/ui/src/theme/studioTheme/helpers.ts#L3-L17
function multiply(bg: string, fg: string): string {
  const b = parseColor(bg)
  const s = parseColor(fg)
  const hex = rgbToHex(_multiply(b, s))

  return hex
}
function screen(bg: string, fg: string): string {
  const b = parseColor(bg)
  const s = parseColor(fg)
  const hex = rgbToHex(_screen(b, s))

  return hex
}

// @TODO: report that the Studio isn't exporting RootTheme
type StudioTheme = typeof defaultTheme

const defaultTones: { [key: string]: ColorTints } = {
  default: _hues.gray,
  transparent: _hues.gray,
  primary: _hues.blue,
  positive: _hues.green,
  caution: _hues.yellow,
  critical: _hues.red,
}
type Tones = typeof defaultTones

// Sanity always have 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
// Unknown if anything fails if 950 is missing
function createHues(palette: {
  [key in keyof ColorTints]: string
}): ColorTints {
  return Object.entries(palette).reduce((result, [tint, hex]) => {
    result[tint as keyof ColorTints] = { title: `Slate ${tint}`, hex }
    return result
  }, {} as ColorTints)
}

// https://github.com/tailwindlabs/tailwindcss/blob/b8cda161dd0993083dcef1e2a03988c70be0ce93/src/public/colors.js#L16-L27
const slateHues = createHues({
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#0b111f',
})
export const slateTones = {
  ...defaultTones,
  default: slateHues,
  transparent: slateHues,
  primary: slateHues,
}

export function useMagicRouter(initial: string) {
  const history = useMemo((): ReturnType<typeof createMemoryHistory> => {
    const history = createMemoryHistory({
      initialEntries: [initial],
    })
    return {
      get action() {
        return history.action
      },
      get index() {
        return history.index
      },
      get location() {
        return history.location
      },
      get createHref() {
        return history.createHref
      },
      get push() {
        return history.push
      },
      get replace() {
        return history.replace
      },
      get go() {
        return history.go
      },
      get back() {
        return history.back
      },
      get forward() {
        return history.forward
      },
      get block() {
        return history.block
      },
      // Overriding listen to workaround a problem where native history provides history.listen(location => void), but the npm package is history.listen(({action, location}) => void)
      listen(listener: Listener) {
        return history.listen(({ action, location }) => {
          console.log('history.listen', action, location)
          // @ts-expect-error -- working around a bug? in studio
          listener(location)
        })
      },
    }
  }, [])

  return history
}

export type PresetTheme = 'default' | 'blackpink' | 'web3' | 'imagepalette'
type CustomStudioThemeProps = {
  preset?: PresetTheme
  black?: string
  white?: string
}
const web3Black = '#171721'
const web3White = '#f0eff3'
const pinkBlack = '#171721'
const pinkWhite = '#f7f2f5'
// Should return 500
// const tests = ['#64748b', '#6b7280', '#71717a', '#737373', '#78716c', '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6','#6366f1', '#8b5cf6', '#a855f7', '#d946ef','#ec4899', '#f43f5e']
function getMidPointFromLuminance(color: string): number {
  const luminance = getLuminance(color)
  const corrected = 1 - luminance
  const tint = corrected * 650

  // TODO should round by 100, except for 50 and 950

  return Math.round(tint / 100) * 100
}
function widenColorHue(
  a: string,
  b: string,
  lower: number,
  upper: number
): string {
  const aHsl = parseToHsl(a)
  const bHsl = parseToHsl(b)

  console.log(
    'widen',
    a,
    b,
    aHsl.hue,
    bHsl.hue,
    { lower, upper },
    Math.max(aHsl.hue - lower, bHsl.hue),
    Math.min(aHsl.hue + upper, bHsl.hue),
    aHsl.hue < bHsl.hue + lower,
    aHsl.hue < bHsl.hue - upper
  )
  const withinLowerBounds = aHsl.hue > bHsl.hue && aHsl.hue < bHsl.hue + lower
  const withinUpperBounds = aHsl.hue < bHsl.hue && aHsl.hue > bHsl.hue - upper
  if (withinLowerBounds || withinUpperBounds) {
    const moveDown = bHsl.hue + lower
    const moveUp = bHsl.hue - upper
    if (moveDown - aHsl.hue > moveUp - aHsl.hue) {
      return setHue(moveUp, a)
    }
    return setHue(moveDown, a)
  }
  if (aHsl.hue < bHsl.hue && aHsl.hue > bHsl.hue - upper) {
    return setHue(bHsl.hue - upper, a)
  }

  return a
}

export function getColorConfigsFromImagePalette({
  palette,
}: {
  palette: ImagePalette
}): {
  default: ColorHueConfig
  transparent: ColorHueConfig
  primary: ColorHueConfig
  positive: ColorHueConfig
  caution: ColorHueConfig
  critical: ColorHueConfig
} {
  const darkest = palette.darkMuted?.background
    ? setLightness(0.066, palette.darkMuted.background)
    : _black.hex
  const lightest = palette.lightMuted?.background
    ? setLightness(0.98, palette.lightMuted.background)
    : _white.hex
  const defaultMid = palette.muted?.background || _hues.gray[500].hex
  const transparentMid = palette.darkMuted?.background || defaultMid
  const primaryMid = palette.vibrant?.background || primaryColorConfig.mid
  const positiveMid = widenColorHue(positiveColorConfig.mid, primaryMid, 12, 12)
  const cautionMid = widenColorHue(cautionColorConfig.mid, primaryMid, 12, 12)
  const criticalMid = widenColorHue(criticalColorConfig.mid, primaryMid, 12, 12)
  return {
    default: {
      ...defaultColorConfig,
      mid: defaultMid,
      darkest,
      lightest,
      midPoint: getMidPointFromLuminance(defaultMid),
    },
    transparent: {
      ...transparentColorConfig,
      mid: transparentMid,
      darkest,
      lightest,
      midPoint: getMidPointFromLuminance(transparentMid),
    },
    primary: {
      ...primaryColorConfig,
      mid: primaryMid,
      darkest,
      lightest,
      midPoint: getMidPointFromLuminance(primaryMid),
    },
    positive: {
      ...positiveColorConfig,
      mid: positiveMid,
      darkest,
      lightest,
      midPoint: getMidPointFromLuminance(positiveMid),
    },
    caution: {
      ...cautionColorConfig,
      mid: cautionMid,
      darkest,
      lightest,
      midPoint: getMidPointFromLuminance(cautionMid),
    },
    critical: {
      ...criticalColorConfig,
      mid: criticalMid,
      darkest,
      lightest,
      midPoint: getMidPointFromLuminance(criticalMid),
    },
  }
}
function getPresetTones(preset: CustomStudioThemeProps['preset']): {
  default?: ColorHueConfig
  transparent?: ColorHueConfig
  primary?: ColorHueConfig
  positive?: ColorHueConfig
  caution?: ColorHueConfig
  critical?: ColorHueConfig
} {
  switch (preset) {
    // https://github.com/tailwindlabs/tailwindcss/blob/b8cda161dd0993083dcef1e2a03988c70be0ce93/src/public/colors.js#L208-L219
    case 'imagepalette':
      return getColorConfigsFromImagePalette({ palette: demoImagePalette })
    case 'web3':
      return {
        default: {
          ...defaultColorConfig,
          mid: '#72658b',
          darkest: web3Black,
          lightest: web3White,
          midPoint: 500,
        },
        transparent: {
          ...transparentColorConfig,
          mid: '#72658b',
          darkest: web3Black,
          lightest: web3White,
          midPoint: 500,
        },
        primary: {
          ...primaryColorConfig,
          mid: '#6366f1',
          darkest: web3Black,
          lightest: web3White,
          midPoint: 500,
        },
        positive: {
          ...positiveColorConfig,
          darkest: web3Black,
          lightest: web3White,
        },
        caution: {
          ...cautionColorConfig,
          darkest: web3Black,
          lightest: web3White,
        },
        critical: {
          ...criticalColorConfig,
          darkest: web3Black,
          lightest: web3White,
        },
      }
    case 'blackpink':
      return {
        default: {
          ...defaultColorConfig,
          mid: '#8b6584',
          darkest: pinkBlack,
          lightest: pinkWhite,
          midPoint: 500,
        },
        transparent: {
          ...transparentColorConfig,
          mid: '#503a4c',
          darkest: pinkBlack,
          lightest: pinkWhite,
          midPoint: 500,
        },
        primary: {
          ...primaryColorConfig,
          mid: '#ec4899',
          darkest: pinkBlack,
          lightest: pinkWhite,
          midPoint: 500,
        },
        positive: {
          ...positiveColorConfig,
          darkest: pinkBlack,
          lightest: pinkWhite,
          mid: '#10b981',
          midPoint: 500,
        },
        caution: {
          ...cautionColorConfig,
          darkest: pinkBlack,
          lightest: pinkWhite,
          mid: '#fde047',
          midPoint: 300,
        },
        critical: {
          ...criticalColorConfig,
          darkest: pinkBlack,
          lightest: pinkWhite,
          mid: '#fe3459',
          midPoint: 500,
        },
      }
    default:
      return {}
  }
}

// hues.gray
const defaultColorConfig = {
  title: 'Default',
  darkest: _black.hex,
  mid: '#8690A0',
  lightest: _white.hex,
  midPoint: 500,
} as const
// hues.gray
const transparentColorConfig = {
  title: 'Transparent',
  darkest: _black.hex,
  mid: '#8690A0',
  lightest: _white.hex,
  midPoint: 500,
} as const
// hues.blue
const primaryColorConfig = {
  title: 'Primary',
  darkest: _black.hex,
  mid: '#2276FC',
  lightest: _white.hex,
  midPoint: 500,
} as const
// hues.green
const positiveColorConfig = {
  title: 'Positive',
  darkest: _black.hex,
  mid: '#43D675',
  lightest: _white.hex,
  midPoint: 400,
} as const
// hues.yellow
const cautionColorConfig = {
  title: 'Caution',
  darkest: _black.hex,
  mid: '#FBD024',
  lightest: _white.hex,
  midPoint: 300,
} as const
// hues.red
const criticalColorConfig = {
  title: 'Critical',
  darkest: _black.hex,
  mid: '#F03E2F',
  lightest: _white.hex,
  midPoint: 500,
} as const
export function useTonesFromPreset({ preset }: { preset: PresetTheme }): {
  default: ColorHueConfig
  transparent: ColorHueConfig
  primary: ColorHueConfig
  positive: ColorHueConfig
  caution: ColorHueConfig
  critical: ColorHueConfig
} {
  const overrides = getPresetTones(preset)
  return {
    default: defaultColorConfig,
    transparent: transparentColorConfig,
    primary: primaryColorConfig,
    positive: positiveColorConfig,
    caution: cautionColorConfig,
    critical: criticalColorConfig,
    ...overrides,
  }
}
function useTonesFromConfig({
  config,
}: {
  config: {
    default: ColorHueConfig
    transparent: ColorHueConfig
    primary: ColorHueConfig
    positive: ColorHueConfig
    caution: ColorHueConfig
    critical: ColorHueConfig
  }
}): {
  default: ColorTints
  transparent: ColorTints
  primary: ColorTints
  positive: ColorTints
  caution: ColorTints
  critical: ColorTints
} {
  const defaultTints = useTintsFromHue(config.default || defaultColorConfig)
  const transparentTints = useTintsFromHue(
    config.transparent || transparentColorConfig
  )
  const primaryTints = useTintsFromHue(config.primary || primaryColorConfig)
  const positiveTints = useTintsFromHue(config.positive || positiveColorConfig)
  const cautionTints = useTintsFromHue(config.caution || cautionColorConfig)
  const criticalTints = useTintsFromHue(config.critical || criticalColorConfig)

  return {
    default: defaultTints,
    transparent: transparentTints,
    primary: primaryTints,
    positive: positiveTints,
    caution: cautionTints,
    critical: criticalTints,
  }
}
export function useCustomStudioTheme({
  config,
}: {
  config: {
    default: ColorHueConfig
    transparent: ColorHueConfig
    primary: ColorHueConfig
    positive: ColorHueConfig
    caution: ColorHueConfig
    critical: ColorHueConfig
  }
}): StudioTheme {
  const tones = useTonesFromConfig({ config })
  // console.log({ tones })
  const black = { title: 'Black', hex: config.default?.darkest || _black.hex }
  const white = { title: 'white', hex: config.default?.lightest || _white.hex }
  // @TODO: consider making these overridable
  //const focusRingHue = _hues.blue
  const focusRingHue = tones.primary
  //const accentHue = _hues.red
  const accentHue = tones.critical
  // const linkHue = _hues.blue
  const linkHue = tones.primary

  return useMemo<StudioTheme>(() => {
    const superTheme: Partial<StudioTheme> = {}

    // Generate colors :OOO
    // Based on https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/ui/src/theme/studioTheme/color.ts#L6-L637
    superTheme.color = createColorTheme({
      base: ({ dark, name }) => {
        if (name === 'default') {
          const skeletonFrom = dark
            ? tones.transparent[900].hex
            : tones.transparent[100].hex

          return {
            // @TODO: consider making this overridable
            fg: dark ? white.hex : black.hex,
            // @TODO: consider making this overridable
            bg: dark ? black.hex : white.hex,
            // @TODO: consider making this overridable
            border: tones.transparent[dark ? 800 : 200].hex,
            focusRing: focusRingHue[dark ? 500 : 500].hex,
            shadow: {
              outline: rgba(tones.transparent[500].hex, 0.4),
              umbra: rgba(dark ? black.hex : tones.transparent[500].hex, 0.2),
              penumbra: rgba(
                dark ? black.hex : tones.transparent[500].hex,
                0.14
              ),
              ambient: rgba(
                dark ? black.hex : tones.transparent[500].hex,
                0.12
              ),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        if (name === 'transparent') {
          const tints = tones.default
          const skeletonFrom = tints[dark ? 800 : 200].hex

          return {
            fg: tints[dark ? 100 : 900].hex,
            bg: tints[dark ? 950 : 50].hex,
            border: tints[dark ? 800 : 300].hex,
            focusRing: focusRingHue[500].hex,
            shadow: {
              outline: rgba(tints[500].hex, dark ? 0.2 : 0.4),
              umbra: rgba(dark ? black.hex : tints[500].hex, 0.2),
              penumbra: rgba(dark ? black.hex : tints[500].hex, 0.14),
              ambient: rgba(dark ? black.hex : tints[500].hex, 0.12),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        const tints = tones[name] || tones.default
        const skeletonFrom = tints[dark ? 800 : 200].hex

        return {
          fg: tints[dark ? 100 : 900].hex,
          bg: tints[dark ? 950 : 50].hex,
          border: tints[dark ? 800 : 200].hex,
          focusRing: tints[500].hex,
          shadow: {
            outline: rgba(tints[500].hex, dark ? 0.2 : 0.4),
            umbra: rgba(dark ? black.hex : tints[500].hex, 0.2),
            penumbra: rgba(dark ? black.hex : tints[500].hex, 0.14),
            ambient: rgba(dark ? black.hex : tints[500].hex, 0.12),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      },

      solid: ({ base, dark, name, state, tone }) => {
        const mix = dark ? screen : multiply
        const mix2 = dark ? multiply : screen
        const defaultTints = tones[name] || tones.default
        const isNeutral =
          NEUTRAL_TONES.includes(name) && NEUTRAL_TONES.includes(tone)

        let tints = tones[tone === 'default' ? name : tone] || defaultTints

        if (state === 'disabled') {
          tints = defaultTints
          const bg = mix(base.bg, tints[dark ? 800 : 200].hex)
          const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

          return {
            bg,
            bg2: mix2(bg, tints[dark ? 50 : 950].hex),
            border: mix(base.bg, tints[dark ? 800 : 200].hex),
            fg: mix(base.bg, dark ? black.hex : white.hex),
            muted: {
              fg: mix(base.bg, tints[dark ? 950 : 50].hex),
            },
            accent: {
              fg: mix(base.bg, tints[dark ? 950 : 50].hex),
            },
            link: {
              fg: mix(base.bg, tints[dark ? 950 : 50].hex),
            },
            code: {
              bg,
              fg: mix(base.bg, tints[dark ? 950 : 50].hex),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        if (state === 'hovered') {
          const bg = mix(base.bg, tints[dark ? 300 : 600].hex)
          const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

          return {
            bg,
            bg2: mix2(bg, tints[dark ? 50 : 950].hex),
            border: mix(base.bg, tints[dark ? 300 : 600].hex),
            fg: mix(base.bg, dark ? black.hex : white.hex),
            muted: {
              fg: mix(base.bg, tints[dark ? 800 : 200].hex),
            },
            accent: {
              fg: mix2(bg, accentHue[dark ? 800 : 200].hex),
            },
            link: {
              fg: mix2(bg, linkHue[dark ? 800 : 200].hex),
            },
            code: {
              bg: mix(bg, tints[dark ? 950 : 50].hex),
              fg: mix(base.bg, tints[dark ? 800 : 200].hex),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        if (state === 'pressed') {
          const bg = mix(base.bg, tints[dark ? 200 : 800].hex)
          const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

          return {
            bg: mix(base.bg, tints[dark ? 200 : 800].hex),
            bg2: mix2(bg, tints[dark ? 50 : 950].hex),
            border: mix(base.bg, tints[dark ? 200 : 800].hex),
            fg: mix(base.bg, dark ? black.hex : white.hex),
            muted: {
              fg: mix(base.bg, tints[dark ? 800 : 200].hex),
            },
            accent: {
              fg: mix2(bg, accentHue[dark ? 800 : 200].hex),
            },
            link: {
              fg: mix2(bg, linkHue[dark ? 800 : 200].hex),
            },
            code: {
              bg: mix(bg, tints[dark ? 950 : 50].hex),
              fg: mix(base.bg, tints[dark ? 800 : 200].hex),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        if (state === 'selected') {
          if (isNeutral) {
            tints = tones.primary
          }

          const bg = mix(base.bg, tints[dark ? 200 : 800].hex)
          const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

          return {
            bg,
            bg2: mix2(bg, tints[dark ? 50 : 950].hex),
            border: mix(base.bg, tints[dark ? 200 : 800].hex),
            fg: mix(base.bg, dark ? black.hex : white.hex),
            muted: {
              fg: mix(base.bg, tints[dark ? 800 : 200].hex),
            },
            accent: {
              fg: mix2(bg, accentHue[dark ? 800 : 200].hex),
            },
            link: {
              fg: mix2(bg, linkHue[dark ? 800 : 200].hex),
            },
            code: {
              bg: mix(bg, tints[dark ? 950 : 50].hex),
              fg: mix(base.bg, tints[dark ? 800 : 200].hex),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        // state: "enabled" | unknown
        const bg = mix(base.bg, tints[dark ? 400 : 500].hex)
        const skeletonFrom = mix2(bg, tints[dark ? 200 : 800].hex)

        return {
          bg,
          bg2: mix2(bg, tints[dark ? 50 : 950].hex),
          border: mix(base.bg, tints[dark ? 400 : 500].hex),
          fg: mix(base.bg, dark ? black.hex : white.hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 900 : 100].hex),
          },
          accent: {
            fg: mix2(bg, accentHue[dark ? 900 : 100].hex),
          },
          link: {
            fg: mix2(bg, linkHue[dark ? 900 : 100].hex),
          },
          code: {
            bg: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 900 : 100].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      },

      muted: ({ base, dark, name, state, tone }) => {
        const mix = dark ? screen : multiply
        const defaultTints = tones[name] || tones.default
        const isNeutral =
          NEUTRAL_TONES.includes(name) && NEUTRAL_TONES.includes(tone)

        let tints = tones[tone === 'default' ? name : tone] || defaultTints

        if (state === 'disabled') {
          tints = defaultTints

          const bg = base.bg
          const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

          return {
            bg,
            bg2: mix(bg, tints[dark ? 950 : 50].hex),
            border: mix(bg, tints[dark ? 950 : 50].hex),
            fg: mix(bg, tints[dark ? 800 : 200].hex),
            muted: {
              fg: mix(bg, tints[dark ? 900 : 100].hex),
            },
            accent: {
              fg: mix(bg, tints[dark ? 900 : 100].hex),
            },
            link: {
              fg: mix(bg, tints[dark ? 900 : 100].hex),
            },
            code: {
              bg,
              fg: mix(bg, tints[dark ? 900 : 100].hex),
            },
            skeleton: {
              from: rgba(skeletonFrom, 0.5),
              to: rgba(skeletonFrom, 0.25),
            },
          }
        }

        if (state === 'hovered') {
          if (isNeutral) {
            tints = tones.primary
          }

          const bg = mix(base.bg, tints[dark ? 950 : 50].hex)
          const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

          return {
            bg,
            bg2: mix(bg, tints[dark ? 950 : 50].hex),
            border: mix(bg, tints[dark ? 900 : 100].hex),
            fg: mix(base.bg, tints[dark ? 200 : 800].hex),
            muted: {
              fg: mix(base.bg, tints[dark ? 400 : 600].hex),
            },
            accent: {
              fg: mix(base.bg, linkHue[dark ? 400 : 500].hex),
            },
            link: {
              fg: mix(base.bg, linkHue[dark ? 400 : 600].hex),
            },
            code: {
              bg: mix(bg, tints[dark ? 950 : 50].hex),
              fg: mix(base.bg, tints[dark ? 400 : 600].hex),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        if (state === 'pressed') {
          if (isNeutral) {
            tints = tones.primary
          }

          const bg = mix(base.bg, tints[dark ? 900 : 100].hex)
          const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

          return {
            bg,
            bg2: mix(bg, tints[dark ? 950 : 50].hex),
            border: mix(bg, tints[dark ? 900 : 100].hex),
            fg: mix(base.bg, tints[dark ? 200 : 800].hex),
            muted: {
              fg: mix(base.bg, tints[dark ? 400 : 600].hex),
            },
            accent: {
              fg: mix(bg, accentHue[dark ? 400 : 500].hex),
            },
            link: {
              fg: mix(bg, linkHue[dark ? 400 : 600].hex),
            },
            code: {
              bg: mix(bg, tints[dark ? 950 : 50].hex),
              fg: mix(base.bg, tints[dark ? 400 : 600].hex),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        if (state === 'selected') {
          if (isNeutral) {
            tints = tones.primary
          }

          const bg = mix(base.bg, tints[dark ? 900 : 100].hex)
          const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

          return {
            bg,
            bg2: mix(bg, tints[dark ? 950 : 50].hex),
            border: mix(bg, tints[dark ? 900 : 100].hex),
            fg: mix(base.bg, tints[dark ? 200 : 800].hex),
            muted: {
              fg: mix(base.bg, tints[dark ? 400 : 600].hex),
            },
            accent: {
              fg: mix(bg, accentHue[dark ? 400 : 500].hex),
            },
            link: {
              fg: mix(bg, linkHue[dark ? 400 : 600].hex),
            },
            code: {
              bg: mix(bg, tints[dark ? 950 : 50].hex),
              fg: mix(base.bg, tints[dark ? 400 : 600].hex),
            },
            skeleton: {
              from: skeletonFrom,
              to: rgba(skeletonFrom, 0.5),
            },
          }
        }

        const bg = base.bg
        const skeletonFrom = mix(bg, tints[dark ? 900 : 100].hex)

        return {
          bg,
          bg2: mix(bg, tints[dark ? 950 : 50].hex),
          border: mix(bg, tints[dark ? 900 : 100].hex),
          fg: mix(base.bg, tints[dark ? 300 : 700].hex),
          muted: {
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          accent: {
            fg: mix(base.bg, accentHue[dark ? 400 : 500].hex),
          },
          link: {
            fg: mix(base.bg, linkHue[dark ? 400 : 600].hex),
          },
          code: {
            bg: mix(base.bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      },

      button: ({ base, mode, muted, solid }) => {
        if (mode === 'bleed') {
          return {
            enabled: {
              ...muted.enabled,
              border: muted.enabled.bg,
            },
            hovered: {
              ...muted.hovered,
              border: muted.hovered.bg,
            },
            pressed: {
              ...muted.pressed,
              border: muted.pressed.bg,
            },
            selected: {
              ...muted.selected,
              border: muted.selected.bg,
            },
            disabled: {
              ...muted.disabled,
              border: muted.disabled.bg,
            },
          }
        }

        if (mode === 'ghost') {
          return {
            ...solid,
            enabled: {
              ...muted.enabled,
              border: base.border,
            },
            disabled: muted.disabled,
          }
        }

        return solid
      },

      card: ({ base, dark, muted, name, solid, state }) => {
        if (state === 'hovered') {
          return muted[name].hovered
        }

        if (state === 'disabled') {
          return muted[name].disabled
        }

        const isNeutral = NEUTRAL_TONES.includes(name)
        const tints = tones[name] || tones.default
        const mix = dark ? screen : multiply

        if (state === 'pressed') {
          if (isNeutral) {
            return muted.primary.pressed
          }

          return muted[name].pressed
        }

        if (state === 'selected') {
          if (isNeutral) {
            return solid.primary.enabled
          }

          return solid[name].enabled
        }

        const bg = base.bg
        const skeletonFrom = mix(base.bg, tints[dark ? 900 : 100].hex)

        return {
          bg,
          bg2: mix(bg, tints[dark ? 950 : 50].hex),
          fg: base.fg,
          border: base.border,
          muted: {
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
          },
          accent: {
            fg: mix(base.bg, _hues.red[dark ? 400 : 500].hex),
          },
          link: {
            fg: mix(base.bg, _hues.blue[dark ? 400 : 600].hex),
          },
          code: {
            bg: mix(base.bg, tints[dark ? 950 : 50].hex),
            fg: tints[dark ? 400 : 600].hex,
          },
          skeleton: {
            from: skeletonFrom,
            to: rgba(skeletonFrom, 0.5),
          },
        }
      },

      input: ({ base, dark, mode, state }) => {
        const mix = dark ? screen : multiply

        if (mode === 'invalid') {
          const tints = tones.critical

          return {
            bg: mix(base.bg, tints[dark ? 950 : 50].hex),
            fg: mix(base.bg, tints[dark ? 400 : 600].hex),
            border: mix(base.bg, tints[dark ? 800 : 200].hex),
            placeholder: mix(base.bg, tints[dark ? 600 : 400].hex),
          }
        }

        if (state === 'hovered') {
          return {
            bg: base.bg,
            fg: base.fg,
            border: mix(base.bg, _hues.gray[dark ? 700 : 300].hex),
            placeholder: mix(base.bg, _hues.gray[dark ? 600 : 400].hex),
          }
        }

        if (state === 'disabled') {
          return {
            bg: mix(base.bg, _hues.gray[dark ? 950 : 50].hex),
            fg: mix(base.bg, _hues.gray[dark ? 700 : 300].hex),
            border: mix(base.bg, _hues.gray[dark ? 900 : 100].hex),
            placeholder: mix(base.bg, _hues.gray[dark ? 800 : 200].hex),
          }
        }

        if (state === 'readOnly') {
          return {
            bg: mix(base.bg, _hues.gray[dark ? 950 : 50].hex),
            fg: mix(base.bg, _hues.gray[dark ? 200 : 800].hex),
            border: mix(base.bg, _hues.gray[dark ? 800 : 200].hex),
            placeholder: mix(base.bg, _hues.gray[dark ? 600 : 400].hex),
          }
        }

        return {
          bg: base.bg,
          fg: base.fg,
          border: base.border,
          placeholder: mix(base.bg, _hues.gray[dark ? 600 : 400].hex),
        }
      },

      selectable: ({ base, muted, tone, solid, state }) => {
        if (state === 'enabled') {
          return {
            ...muted[tone].enabled,
            bg: base.bg,
          }
        }

        if (state === 'pressed') {
          if (tone === 'default') {
            return muted.primary.pressed
          }

          return muted[tone].pressed
        }

        if (state === 'selected') {
          if (tone === 'default') {
            return solid.primary.enabled
          }

          return solid[tone].enabled
        }

        if (state === 'disabled') {
          return {
            ...muted[tone].disabled,
            bg: base.bg,
          }
        }

        return muted[tone][state]
      },

      spot: ({ base, dark, key }) => {
        const mix = dark ? screen : multiply

        return mix(base.bg, _hues[key][dark ? 400 : 500].hex)
      },

      syntax: ({ base, dark }) => {
        const mix = dark ? screen : multiply
        const mainShade = dark ? 400 : 600
        const secondaryShade = dark ? 600 : 400

        return {
          atrule: mix(base.bg, _hues.purple[mainShade].hex),
          attrName: mix(base.bg, _hues.green[mainShade].hex),
          attrValue: mix(base.bg, _hues.yellow[mainShade].hex),
          attribute: mix(base.bg, _hues.yellow[mainShade].hex),
          boolean: mix(base.bg, _hues.purple[mainShade].hex),
          builtin: mix(base.bg, _hues.purple[mainShade].hex),
          cdata: mix(base.bg, _hues.yellow[mainShade].hex),
          char: mix(base.bg, _hues.yellow[mainShade].hex),
          class: mix(base.bg, _hues.orange[mainShade].hex),
          className: mix(base.bg, _hues.cyan[mainShade].hex),
          comment: mix(base.bg, _hues.gray[secondaryShade].hex),
          constant: mix(base.bg, _hues.purple[mainShade].hex),
          deleted: mix(base.bg, _hues.red[mainShade].hex),
          doctype: mix(base.bg, _hues.gray[secondaryShade].hex),
          entity: mix(base.bg, _hues.red[mainShade].hex),
          function: mix(base.bg, _hues.green[mainShade].hex),
          hexcode: mix(base.bg, _hues.blue[mainShade].hex),
          id: mix(base.bg, _hues.purple[mainShade].hex),
          important: mix(base.bg, _hues.purple[mainShade].hex),
          inserted: mix(base.bg, _hues.yellow[mainShade].hex),
          keyword: mix(base.bg, _hues.magenta[mainShade].hex),
          number: mix(base.bg, _hues.purple[mainShade].hex),
          operator: mix(base.bg, _hues.magenta[mainShade].hex),
          prolog: mix(base.bg, _hues.gray[secondaryShade].hex),
          property: mix(base.bg, _hues.blue[mainShade].hex),
          pseudoClass: mix(base.bg, _hues.yellow[mainShade].hex),
          pseudoElement: mix(base.bg, _hues.yellow[mainShade].hex),
          punctuation: mix(base.bg, _hues.gray[mainShade].hex),
          regex: mix(base.bg, _hues.blue[mainShade].hex),
          selector: mix(base.bg, _hues.red[mainShade].hex),
          string: mix(base.bg, _hues.yellow[mainShade].hex),
          symbol: mix(base.bg, _hues.purple[mainShade].hex),
          tag: mix(base.bg, _hues.red[mainShade].hex),
          unit: mix(base.bg, _hues.orange[mainShade].hex),
          url: mix(base.bg, _hues.red[mainShade].hex),
          variable: mix(base.bg, _hues.red[mainShade].hex),
        }
      },
    })

    return { ...defaultTheme, ...superTheme }
  }, [accentHue, black.hex, focusRingHue, linkHue, tones, white.hex])
}

// https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/color/scripts/generate.ts#L18-L58
function getColorHex(config: ColorHueConfig, tint: string): string {
  const tintNum = Number(tint)
  const midPoint = config.midPoint || 500
  const darkSize = 1000 - midPoint
  const lightPosition = tintNum / midPoint
  const darkPosition = (tintNum - midPoint) / darkSize

  if (tintNum === midPoint) {
    return config.mid.toLowerCase()
  }

  // light side of scale: x < midPoint
  if (tintNum < midPoint) {
    return mix(lightPosition, config.mid, config.lightest)
  }

  // dark side of scale: x > midPoint
  return mix(darkPosition, config.darkest, config.mid)
}

// https://github.com/sanity-io/design/blob/804bf73dffb1c0ecb1c2e6758135784502768bfe/packages/%40sanity/color/scripts/generate.ts#L42-L58
export function useTintsFromHue({
  darkest,
  lightest,
  mid,
  midPoint,
  title,
}: ColorHueConfig): ColorTints {
  const config = useMemo<ColorHueConfig>(
    () => ({ darkest, lightest, mid, midPoint, title }),
    [darkest, lightest, mid, midPoint, title]
  )

  return useMemo(() => {
    const initial = {} as ColorTints
    const tints = COLOR_TINTS.reduce((acc, tint) => {
      acc[tint] = {
        title: `${config.title} ${tint}`,
        hex: getColorHex(config, tint),
      }

      return acc
    }, initial)

    return tints
  }, [config])
}
