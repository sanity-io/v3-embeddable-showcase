import { black, white } from '@sanity/color'
import Link from 'next/link'
import Sandbox from 'components/Sandbox'

import config from 'sanity.config'
import { BottomSheet } from 'react-spring-bottom-sheet'
import React, {
  useState,
  useMemo,
  useLayoutEffect,
  useEffect,
  Suspense,
} from 'react'
import styled from 'styled-components'
import {
  defaultTheme,
  StudioProvider,
  StudioLayout,
  useWorkspace,
} from 'sanity'
import {
  ThemeProvider,
  Container,
  Card,
  Flex,
  Box,
  Text,
  Label,
  Grid,
  Inline,
  Switch,
  Checkbox,
  createColorTheme,
  Select,
  Avatar,
  usePrefersDark,
} from '@sanity/ui'

import * as stable from 'sanity'
import * as unstable from 'sanity/_unstable'
import { unstable_batchedUpdates } from 'react-dom'
import ThemePreview from 'components/ThemePreview'
import {
  useCustomStudioTheme,
  useColorConfigState,
  useTonesFromPreset,
  demoImagePalette,
  useMagicRouter,
} from 'hooks'
import ColorTintsPreview from 'components/ColorTintsPreview'
import ColorConfigEditor from 'ColorConfigEditor'
import { useRouter } from 'sanity/_unstable'
import ImagePalettePreview from 'components/ImagePalettePreview'
import { useColorScheme } from 'hooks/useSanityStudio'
console.log(stable, unstable)

//const location = createLocation({pathname: '/desk'})
//const history = createMemoryHistory({initialEntries: ['/'], initialIndex: 1})

const RENDER_INLINE = true

console.debug({ defaultTheme })
type StudioTheme = typeof defaultTheme
function IndexPage() {
  console.warn(config[0].basePath || '/')
  // const history = useMagicRouter(config[0].basePath || '/')
  const history = useMagicRouter('/studio/desk')
  console.log(history)

  const [preset, setPreset] = useState<any>('imagepalette')
  const colorConfigs = useTonesFromPreset({ preset })
  const defaultColorState = useColorConfigState(colorConfigs.default)
  const transparentColorState = useColorConfigState(colorConfigs.transparent)
  const primaryColorState = useColorConfigState(colorConfigs.primary)
  const positiveColorState = useColorConfigState(colorConfigs.positive)
  const cautionColorState = useColorConfigState(colorConfigs.caution)
  const criticalColorState = useColorConfigState(colorConfigs.critical)

  const previewTheme = useCustomStudioTheme({
    config: {
      default: {
        ...defaultColorState.state,
        title: colorConfigs.default.title,
      },
      transparent: {
        ...transparentColorState.state,
        title: colorConfigs.transparent.title,
      },
      primary: {
        ...primaryColorState.state,
        title: colorConfigs.primary.title,
      },
      positive: {
        ...positiveColorState.state,
        title: colorConfigs.positive.title,
      },
      caution: {
        ...cautionColorState.state,
        title: colorConfigs.caution.title,
      },
      critical: {
        ...criticalColorState.state,
        title: colorConfigs.critical.title,
      },
    },
  })
  const splitScreenTheme = useMemo<StudioTheme>(() => {
    const superTheme: Partial<StudioTheme> = {}

    // Split screen, emulates what happens if they were wrapped in iframes
    superTheme.media = defaultTheme.media.map((media) => media / 2)

    return { ...previewTheme, ...superTheme }
  }, [previewTheme])
  const [splitScreen, setSplitScreen] = useState(false)

  // TODO generate tones, there are 6 tones, default, transparent, primary, positive, caution, critical
  // each tone have a range.
  // A tone is generated in Sanity using darkest, mid, lightest, and midPoint
  // const studioConfig = useMemo(() => getWordpressConfig({ basePath: '/' }), [])
  const studioConfig = config[0]

  return (
    <>
      <>
        <Card padding={4} paddingBottom={2} style={{ textAlign: 'center' }}>
          <Inline space={[3, 3, 4, 5]}>
            <Card padding={4}>
              <Flex align="center">
                <Switch
                  id="splitScreen"
                  checked={splitScreen}
                  onChange={() => setSplitScreen((prev) => !prev)}
                />
                <Box flex={1} paddingLeft={3}>
                  <Text>
                    <label htmlFor="splitScreen">Split-screen</label>
                  </Text>
                </Box>
              </Flex>
            </Card>
            <Card padding={4}>
              <Select
                id="preset"
                value={preset}
                onChange={(event) => {
                  console.log(event, event.currentTarget.value)
                  setPreset(event.currentTarget.value)
                }}
              >
                <option value="default">Default</option>
                <option value="web3">Web3</option>
                <option value="blackpink">BlackPink</option>
                <option value="imagepalette">ImagePalette</option>
              </Select>
            </Card>
          </Inline>
        </Card>
        {preset === 'imagepalette' && (
          <Card paddingBottom={4} paddingX={4}>
            <Grid gap={5} columns={[1, 1, 2, 3, 5, 7]}>
              <ImagePalettePreview value={demoImagePalette} />
            </Grid>
          </Card>
        )}
        <Card paddingBottom={4} paddingX={4}>
          <Grid gap={5} columns={[1, 1, 1, 1, 2]}>
            <ColorConfigEditor
              open
              title="Default"
              state={defaultColorState.state}
              setDarkest={defaultColorState.setDarkest}
              setLightest={defaultColorState.setLightest}
              setMid={defaultColorState.setMid}
              setMidPoint={defaultColorState.setMidPoint}
            />
            <ColorConfigEditor
              open
              title="Primary"
              state={primaryColorState.state}
              setDarkest={primaryColorState.setDarkest}
              setLightest={primaryColorState.setLightest}
              setMid={primaryColorState.setMid}
              setMidPoint={primaryColorState.setMidPoint}
            />
            <ColorConfigEditor
              title="Transparent"
              state={transparentColorState.state}
              setDarkest={transparentColorState.setDarkest}
              setLightest={transparentColorState.setLightest}
              setMid={transparentColorState.setMid}
              setMidPoint={transparentColorState.setMidPoint}
            />
            <ColorConfigEditor
              title="Positive"
              state={positiveColorState.state}
              setDarkest={positiveColorState.setDarkest}
              setLightest={positiveColorState.setLightest}
              setMid={positiveColorState.setMid}
              setMidPoint={positiveColorState.setMidPoint}
            />
            <ColorConfigEditor
              title="Caution"
              state={cautionColorState.state}
              setDarkest={cautionColorState.setDarkest}
              setLightest={cautionColorState.setLightest}
              setMid={cautionColorState.setMid}
              setMidPoint={cautionColorState.setMidPoint}
            />
            <ColorConfigEditor
              title="Critical"
              state={criticalColorState.state}
              setDarkest={criticalColorState.setDarkest}
              setLightest={criticalColorState.setLightest}
              setMid={criticalColorState.setMid}
              setMidPoint={criticalColorState.setMidPoint}
            />
          </Grid>
        </Card>
        <Grid className="gap-px " columns={splitScreen ? 2 : 1}>
          {/* <Suspense fallback={'Loading ThemePreview...'}> */}
          <ThemeProvider
            key="light"
            scheme={splitScreen ? 'light' : undefined}
            theme={previewTheme}
          >
            <ThemePreview />
          </ThemeProvider>
          {splitScreen && (
            <ThemeProvider key="dark" scheme="dark" theme={previewTheme}>
              <ThemePreview />
            </ThemeProvider>
          )}
          {/* </Suspense> */}
        </Grid>
        {RENDER_INLINE && (
          <Grid className="h-[50vh] gap-px" columns={splitScreen ? 2 : 1}>
            <StudioProvider
              unstable_history={history}
              config={studioConfig}
              unstable_noAuthBoundary
            >
              <ThemeProvider
                key="auto"
                scheme={splitScreen ? 'light' : undefined}
                theme={splitScreen ? splitScreenTheme : previewTheme}
              >
                <StudioLayout />
              </ThemeProvider>
              {splitScreen && (
                <ThemeProvider
                  key="dark"
                  scheme="dark"
                  theme={splitScreenTheme}
                >
                  <StudioLayout />
                </ThemeProvider>
              )}
            </StudioProvider>
          </Grid>
        )}
      </>
      {RENDER_INLINE && (
        <main className="flex h-screen max-h-[length:100dvh] flex-wrap items-center justify-center gap-20 dark:bg-[#101112]">
          <BottomSheetStudio
            label={
              <>
                <svg
                  aria-label="Sanity"
                  className="mr-0.5 inline-block h-6 w-6 -translate-x-1 scale-125"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M161.527 136.723C161.527 179.76 187.738 205.443 240.388 219.095L296 232.283C345.687 243.852 376 272.775 376 319.514C376 341.727 369.162 360.931 357.538 375.971C357.538 329.232 333.607 303.78 276.171 288.74L221.47 276.246C177.709 266.065 143.977 242.464 143.977 191.56C143.977 170.505 150.359 151.994 161.527 136.723Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M323.35 308.176C347.054 323.679 357.538 345.197 357.538 376.202C337.709 401.654 303.293 416 262.724 416C194.575 416 146.484 381.756 136 322.753H201.641C210.074 350.056 232.41 362.551 262.268 362.551C298.735 362.32 322.895 342.652 323.35 308.176Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M195.715 200.816C172.923 186.007 161.527 165.183 161.527 136.954C180.672 111.503 213.493 96 253.835 96C323.35 96 363.692 133.252 373.721 185.776H310.359C303.293 165.183 285.971 148.986 254.291 148.986C220.33 148.986 197.311 169.116 195.715 200.816Z"
                    fill="white"
                  ></path>
                </svg>
                Launch Studio (inline)
              </>
            }
          >
            <StudioProvider
              unstable_history={history}
              config={studioConfig}
              unstable_noAuthBoundary
            >
              <StudioLayout />
            </StudioProvider>
          </BottomSheetStudio>
          <BottomSheetStudio
            label={
              <>
                <svg
                  aria-label="Sanity"
                  className="mr-0.5 inline-block h-6 w-6 -translate-x-1 scale-125"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M161.527 136.723C161.527 179.76 187.738 205.443 240.388 219.095L296 232.283C345.687 243.852 376 272.775 376 319.514C376 341.727 369.162 360.931 357.538 375.971C357.538 329.232 333.607 303.78 276.171 288.74L221.47 276.246C177.709 266.065 143.977 242.464 143.977 191.56C143.977 170.505 150.359 151.994 161.527 136.723Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M323.35 308.176C347.054 323.679 357.538 345.197 357.538 376.202C337.709 401.654 303.293 416 262.724 416C194.575 416 146.484 381.756 136 322.753H201.641C210.074 350.056 232.41 362.551 262.268 362.551C298.735 362.32 322.895 342.652 323.35 308.176Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M195.715 200.816C172.923 186.007 161.527 165.183 161.527 136.954C180.672 111.503 213.493 96 253.835 96C323.35 96 363.692 133.252 373.721 185.776H310.359C303.293 165.183 285.971 148.986 254.291 148.986C220.33 148.986 197.311 169.116 195.715 200.816Z"
                    fill="white"
                  ></path>
                </svg>
                Launch Studio (styled)
              </>
            }
          >
            <StudioProvider
              unstable_history={history}
              config={studioConfig}
              unstable_noAuthBoundary
            >
              <ThemeProvider theme={previewTheme}>
                <StudioLayout />
              </ThemeProvider>
            </StudioProvider>
          </BottomSheetStudio>
          <BottomSheetStudio
            label={
              <>
                <svg
                  aria-label="Sanity"
                  className="mr-0.5 inline-block h-6 w-6 -translate-x-1 scale-125"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M161.527 136.723C161.527 179.76 187.738 205.443 240.388 219.095L296 232.283C345.687 243.852 376 272.775 376 319.514C376 341.727 369.162 360.931 357.538 375.971C357.538 329.232 333.607 303.78 276.171 288.74L221.47 276.246C177.709 266.065 143.977 242.464 143.977 191.56C143.977 170.505 150.359 151.994 161.527 136.723Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M323.35 308.176C347.054 323.679 357.538 345.197 357.538 376.202C337.709 401.654 303.293 416 262.724 416C194.575 416 146.484 381.756 136 322.753H201.641C210.074 350.056 232.41 362.551 262.268 362.551C298.735 362.32 322.895 342.652 323.35 308.176Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M195.715 200.816C172.923 186.007 161.527 165.183 161.527 136.954C180.672 111.503 213.493 96 253.835 96C323.35 96 363.692 133.252 373.721 185.776H310.359C303.293 165.183 285.971 148.986 254.291 148.986C220.33 148.986 197.311 169.116 195.715 200.816Z"
                    fill="white"
                  ></path>
                </svg>
                Launch Studio (split-screen)
              </>
            }
          >
            <Grid
              className="h-[number:var(--rsbs-overlay-h,100%)] gap-px"
              columns={2}
            >
              <StudioProvider
                unstable_history={history}
                config={studioConfig}
                unstable_noAuthBoundary
              >
                <ThemeProvider scheme="light" theme={splitScreenTheme}>
                  <StudioLayout />
                </ThemeProvider>
                <ThemeProvider scheme="dark" theme={splitScreenTheme}>
                  <StudioLayout />
                </ThemeProvider>
              </StudioProvider>
            </Grid>
          </BottomSheetStudio>
          <BottomSheetStudio
            hidden
            sandbox
            label={
              <>
                <svg
                  aria-label="Sanity"
                  className="mr-0.5 inline-block h-6 w-6 -translate-x-1 scale-125"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M161.527 136.723C161.527 179.76 187.738 205.443 240.388 219.095L296 232.283C345.687 243.852 376 272.775 376 319.514C376 341.727 369.162 360.931 357.538 375.971C357.538 329.232 333.607 303.78 276.171 288.74L221.47 276.246C177.709 266.065 143.977 242.464 143.977 191.56C143.977 170.505 150.359 151.994 161.527 136.723Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M323.35 308.176C347.054 323.679 357.538 345.197 357.538 376.202C337.709 401.654 303.293 416 262.724 416C194.575 416 146.484 381.756 136 322.753H201.641C210.074 350.056 232.41 362.551 262.268 362.551C298.735 362.32 322.895 342.652 323.35 308.176Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M195.715 200.816C172.923 186.007 161.527 165.183 161.527 136.954C180.672 111.503 213.493 96 253.835 96C323.35 96 363.692 133.252 373.721 185.776H310.359C303.293 165.183 285.971 148.986 254.291 148.986C220.33 148.986 197.311 169.116 195.715 200.816Z"
                    fill="white"
                  ></path>
                </svg>
                Launch Studio (iframe embedded)
              </>
            }
          >
            <StudioProvider
              scheme="light"
              unstable_noAuthBoundary
              unstable_history={history}
              config={studioConfig}
            >
              <StudioLayout />
            </StudioProvider>
          </BottomSheetStudio>
          <BottomSheetStudio
            hidden
            key="iframe"
            label={
              <>
                <svg
                  aria-label="Sanity"
                  className="mr-0.5 inline-block h-6 w-6 -translate-x-1 scale-125"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M161.527 136.723C161.527 179.76 187.738 205.443 240.388 219.095L296 232.283C345.687 243.852 376 272.775 376 319.514C376 341.727 369.162 360.931 357.538 375.971C357.538 329.232 333.607 303.78 276.171 288.74L221.47 276.246C177.709 266.065 143.977 242.464 143.977 191.56C143.977 170.505 150.359 151.994 161.527 136.723Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M323.35 308.176C347.054 323.679 357.538 345.197 357.538 376.202C337.709 401.654 303.293 416 262.724 416C194.575 416 146.484 381.756 136 322.753H201.641C210.074 350.056 232.41 362.551 262.268 362.551C298.735 362.32 322.895 342.652 323.35 308.176Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M195.715 200.816C172.923 186.007 161.527 165.183 161.527 136.954C180.672 111.503 213.493 96 253.835 96C323.35 96 363.692 133.252 373.721 185.776H310.359C303.293 165.183 285.971 148.986 254.291 148.986C220.33 148.986 197.311 169.116 195.715 200.816Z"
                    fill="white"
                  ></path>
                </svg>
                Launch Studio (iframe external)
              </>
            }
          >
            <Sandbox src="/wp-admin" />
          </BottomSheetStudio>
        </main>
      )}
    </>
  )
}

export default function Playground() {
  const scheme = useColorScheme()
  return (
    <ThemeProvider theme={defaultTheme} scheme={scheme}>
      <IndexPage />
    </ThemeProvider>
  )
}

const StyledBottomSHeet = styled(BottomSheet)`
  --rsbs-antigap-scale-y: 0;
  --rsbs-backdrop-bg: rgba(0, 0, 0, 0.6);
  --rsbs-backdrop-opacity: 1;
  --rsbs-bg: #fff;
  --rsbs-content-opacity: 1;
  --rsbs-handle-bg: hsla(0, 0%, 0%, 0.14);
  --rsbs-max-w: auto;
  --rsbs-ml: env(safe-area-inset-left);
  --rsbs-mr: env(safe-area-inset-right);
  --rsbs-overlay-h: 0px;
  --rsbs-overlay-rounded: 16px;
  --rsbs-overlay-translate-y: 0px;
  --rsbs-ml: auto;
  --rsbs-mr: auto;
  @media screen and (min-width: 600px) {
    --rsbs-ml: calc(var(--rsbs-overlay-rounded) * 2);
    --rsbs-mr: calc(var(--rsbs-overlay-rounded) * 2);
    --rsbs-ml: calc(
      var(--rsbs-overlay-rounded) * 2 + env(safe-area-inset-left)
    );
    --rsbs-mr: calc(
      var(--rsbs-overlay-rounded) * 2 + env(safe-area-inset-right)
    );

    & [data-rsbs-overlay] {
      --rsbs-overlay-rounded: 16px;
    }
  }

  @media (prefers-color-scheme: dark) {
    --rsbs-bg: #101112;

    & [data-rsbs-overlay] {
      box-shadow: hsl(0deg 0% 100% / 25%) 0 0px 0px 1px !important;
    }
  }

  & [data-rsbs-overlay] {
    border-top-left-radius: calc(var(--rsbs-overlay-rounded) - 3px);
    border-top-right-radius: calc(var(--rsbs-overlay-rounded) - 3px);
    display: flex;
    background: var(--rsbs-bg);
    flex-direction: column;
    height: var(--rsbs-overlay-h);
    transform: translate3d(0, var(--rsbs-overlay-translate-y), 0);
    will-change: height;
  }
  & [data-rsbs-overlay]:focus {
    outline: none;
  }
  & [data-rsbs-is-blocking='false'] [data-rsbs-overlay] {
    box-shadow: 0 -5px 60px 0 rgba(38, 89, 115, 0.11),
      0 -1px 0 rgba(38, 89, 115, 0.05);
  }
  & [data-rsbs-overlay],
  &:after {
    max-width: var(--rsbs-max-w);
    margin-left: var(--rsbs-ml);
    margin-right: var(--rsbs-mr);
  }
  & [data-rsbs-overlay],
  & [data-rsbs-backdrop],
  &:after {
    z-index: 3;
    overscroll-behavior: none;
    touch-action: none;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  & [data-rsbs-backdrop] {
    top: -60px;
    bottom: -60px;
    background-color: var(--rsbs-backdrop-bg);
    will-change: opacity;
    cursor: pointer;
    opacity: var(--rsbs-content-opacity);

    @media (prefers-color-scheme: dark) {
      --rsbs-backdrop-bg: hsla(0, 0%, 0%, 0.333);
    }
  }
  & [data-rsbs-is-dismissable='false'] [data-rsbs-backdrop] {
    cursor: ns-resize;
  }

  &:after {
    content: '';
    pointer-events: none;
    background: var(--rsbs-bg);
    height: 1px;
    transform-origin: bottom;
    transform: scale3d(1, var(--rsbs-antigap-scale-y), 1);
    will-change: transform;
  }
  & [data-rsbs-footer],
  & [data-rsbs-header] {
    flex-shrink: 0;
    cursor: ns-resize;
    padding: 16px;
  }
  & [data-rsbs-header] {
    text-align: center;
    user-select: none;
    padding-top: 0;
    padding-bottom: 0;
    /* box-shadow: 0 1px 0
      rgba(46, 59, 66, calc(var(--rsbs-content-opacity) * 0.125)); */
    z-index: 1;
    /* padding-top: calc(20px + env(safe-area-inset-top)); */
    /* padding-bottom: 8px; */
  }
  & [data-rsbs-header]:before {
    opacity: var(--rsbs-content-opacity);
    position: absolute;
    content: '';
    display: block;
    width: 36px;
    height: 4px;
    top: calc(
      env(safe-area-inset-top) + 16px - calc(var(--rsbs-overlay-rounded) * 2)
    );
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
    background-color: var(--rsbs-handle-bg);
    background-color: #a8a8a8;
  }
  @media (min-resolution: 2dppx) {
    & [data-rsbs-header]:before {
      transform: translateX(-50%) scaleY(0.75);
    }
  }
  &[data-rsbs-has-header='false'] [data-rsbs-header] {
    box-shadow: none;
    /* padding-top: calc(12px + env(safe-area-inset-top)); */
  }
  & [data-rsbs-scroll] {
    flex-shrink: 1;
    flex-grow: 1;
    -webkit-tap-highlight-color: revert;
    -webkit-touch-callout: revert;
    -webkit-user-select: auto;
    -ms-user-select: auto;
    user-select: auto;
    overflow: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  & [data-rsbs-scroll]:focus {
    outline: none;
  }
  &[data-rsbs-has-footer='false'] [data-rsbs-content] {
    padding-bottom: env(safe-area-inset-bottom);
  }
  & [data-rsbs-content] {
    /* The overflow hidden is to ensure any margin on child nodes are included when the resize observer is measuring the height */
    overflow: hidden;
  }
  & [data-rsbs-footer] {
    box-shadow: 0 -1px 0 rgba(46, 59, 66, calc(var(--rsbs-content-opacity) *
              0.125)),
      0 2px 0 var(--rsbs-bg);
    overflow: hidden;
    z-index: 1;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }

  &[data-rsbs-is-dismissable='true'],
  &[data-rsbs-is-dismissable='false']:matches([data-rsbs-state='opening'], [data-rsbs-state='closing']) {
    & :matches([data-rsbs-header], [data-rsbs-scroll], [data-rsbs-footer]) > * {
      opacity: var(--rsbs-content-opacity);
    }
    & [data-rsbs-backdrop] {
      opacity: var(--rsbs-backdrop-opacity);
    }
  }

  &[data-rsbs-state='closed'],
  &[data-rsbs-state='closing'] {
    /* Allows interactions on the rest of the page before the close transition is finished */
    pointer-events: none;
  }
`
function BottomSheetStudio({
  children,
  label,
  sandbox,
  hidden,
}: {
  children: React.ReactNode
  label: React.ReactNode
  sandbox?: boolean
  hidden?: boolean
}) {
  const [open, setOpen] = useState(false)
  const minMaxHeight = 300
  const [maxHeight, setMaxHeight] = useState(() =>
    typeof window === 'undefined' ? minMaxHeight : window.innerHeight
  )
  useEffect(() => {
    const handleResize = () =>
      void unstable_batchedUpdates(() =>
        setMaxHeight(Math.max(minMaxHeight, window.innerHeight))
      )
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (hidden) return null

  return (
    <>
      <Link href="/wp-admin">
        <a
          className="inline-flex w-auto items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[color:#101112]"
          onClick={(event) => {
            event.preventDefault()
            setOpen(true)
          }}
        >
          {label}
        </a>
      </Link>
      <StyledBottomSHeet
        open={open}
        maxHeight={maxHeight}
        defaultSnap={({ snapPoints, lastSnap }) =>
          lastSnap ?? Math.max(...snapPoints)
        }
        onDismiss={() => setOpen(false)}
        snapPoints={({ maxHeight }) => [maxHeight / 3, maxHeight - 64]}
      >
        {sandbox ? (
          <Sandbox>{children}</Sandbox>
        ) : (
          <div
            className="h-[number:var(--rsbs-overlay-h,100%)] min-h-[number:1px] w-full rounded-t-[calc(var(--rsbs-overlay-rounded)_-_3px)] opacity-[var(--rsbs-content-opacity)]"
            style={{ contain: 'strict' }}
          >
            {children}
          </div>
        )}
      </StyledBottomSHeet>
    </>
  )
}
