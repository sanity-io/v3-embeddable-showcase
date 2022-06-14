import { black, white } from '@sanity/color'
import Link from 'next/link'
import Sandbox from 'components/Sandbox'

import { useId } from '@reach/auto-id'
import { useState, useMemo, useLayoutEffect, useEffect } from 'react'
import styled from 'styled-components'
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
import { defaultTheme, StudioProvider, StudioLayout } from 'sanity'
import {
  ThemeProvider,
  Avatar,
  Container,
  Card,
  Flex,
  Box,
  rgbToHex,
  Spinner,
  Text,
  Label,
  Grid,
  Inline,
  Switch,
  Checkbox,
  createColorTheme,
  Select,
  usePrefersDark,
  parseColor,
  Heading,
} from '@sanity/ui'
import { unstable_batchedUpdates } from 'react-dom'
import {
  useColorConfigState,
  createTintsFromHue,
} from 'hooks'
import ColorTintsPreview from 'components/ColorTintsPreview'


interface Props {
  state: Omit<ColorHueConfig, 'title'>
  title: string
  setDarkest: (state: string) => void
  setLightest: (state: string) => void
  setMid: (state: string) => void
  setMidPoint: (state: number) => void
  open?: boolean
}
export default function ColorConfigEditor({
  state,
  title,
  setMid,
  setMidPoint,
  setDarkest,
  setLightest,
  open,
}: Props) {
  const config = useMemo(() => ({ ...state, title }), [state, title])
  const {
    state: previewState,
    setMid: setMidPreview,
    setDarkest: setDarkestPreview,
    setLightest: setLightestPreview,
    setMidPoint: setMidPointPreview,
  } = useColorConfigState(config)
  // @TODO stop spreading on every update
  const previewConfig = useMemo(
    () => ({
      ...previewState,
      midPoint: roundToScale(previewState.midPoint),
      title,
    }),
    [previewState, title]
  )
  const tints = createTintsFromHue(previewConfig)
  // Debounce updates as updating a ThemeProvider context is slow
  const [tick, setTick] = useState(0)

  /*
  // Workspaces fails to load in React v18, unclear why
  const [working, startTransition] =
    'useTransition' in React
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useTransition()
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        [tick > 0, unstable_batchedUpdates]
        // */
        const working = tick > 0;
        const startTransition = unstable_batchedUpdates;

  // Reset syncing to parent if parent have new props
  useEffect(() => {
    startTransition(() => setTick(0))
  }, [startTransition, state])

  // Schedule state update to parent after a debounce
  useEffect(() => {
    if (tick) {
      const changed =
        previewState.lightest != state.lightest ||
        previewState.darkest != state.darkest ||
        previewState.mid != state.mid ||
        previewState.midPoint != state.midPoint
      if (changed) {
        const { mid, midPoint, darkest, lightest } = previewState
        /*
        if ('startTransition' in React) {
          startTransition(() => {
            setMid(mid)
            setMidPoint(roundToScale(midPoint))
            setDarkest(darkest)
            setLightest(lightest)
          })
          return
        }
        // */
        if ('requestIdleCallback' in window) {
          const idleCB = requestIdleCallback(
            () => {
              unstable_batchedUpdates(() => {
                setMid(mid)
                setMidPoint(roundToScale(midPoint))
                setDarkest(darkest)
                setLightest(lightest)
              })
            },
            { timeout: 1000 }
          )
          return () => cancelIdleCallback(idleCB)
        }
        const timeout = setTimeout(() => {
          unstable_batchedUpdates(() => {
            setMid(mid)
            setMidPoint(roundToScale(midPoint))
            setDarkest(darkest)
            setLightest(lightest)
          })
        }, 100)
        return () => clearTimeout(timeout)
      }
      startTransition(() => {
        setTick(0)
      })
    }
  }, [
    previewState,
    setDarkest,
    setLightest,
    setMid,
    setMidPoint,
    startTransition,
    state.darkest,
    state.lightest,
    state.mid,
    state.midPoint,
    tick,
  ])

  const midRangeId = `mid-range-${useId()}`

  return (
    <Flex direction="column" align="flex-start" as="details" open={open}>
      <summary
        style={{
          cursor: 'pointer',
          position: 'relative',
          width: 'max-content',
        }}
      >
        {config.title}{' '}
        {working && (
          <span style={{ display: 'inline-block', position: 'relative' }}>
            <Spinner
              style={{
                position: 'absolute',
                top: '-0.5rem',
                left: '0.3rem',
                transform: 'scale(0.8)',
              }}
            />
          </span>
        )}
      </summary>
      <Grid columns={11} gap={1}>
        <ColorTintsPreview tints={tints} />
      </Grid>
      <Box paddingTop={3} paddingBottom={1}>
        <Grid
          gap={4}
          style={{
            width: 'max-content',
            gridTemplateAreas: `"mid light dark range range"`,
          }}
        >
          <ColorPicker
            label="Color"
            value={previewState.mid}
            setValue={
              /*
              'startTransition' in React
                ? (value) => {
                    setMidPreview(value)
                    startTransition(() => setMid(value))
                  }
                : setMidPreview
                // */
                setMidPreview
            }
            setTick={setTick}
          />
          <ColorPicker
            label="Lightest"
            value={previewState.lightest}
            setValue={setLightestPreview}
            setTick={setTick}
          />
          <ColorPicker
            label="Darkest"
            value={previewState.darkest}
            setValue={setDarkestPreview}
            setTick={setTick}
          />
          <Card colSpan={2}>
            <Label muted style={{ marginBottom: '0.6rem' }} size={0}>
              Mid point ({roundToScale(previewState.midPoint)})
            </Label>
            <input
              type="range"
              min={50}
              max={950}
              // step={25}
              style={{ width: '320px' }}
              onPointerUp={(event) => {
                const { value } = event.currentTarget
                const midPoint = Number(value)
                setMidPointPreview(roundToScale(midPoint))
              }}
              title={`${previewState.midPoint}`}
              value={previewState.midPoint}
              onBlur={(event) => {
                const { value } = event.currentTarget
                const midPoint = Number(value)
                setMidPointPreview(roundToScale(midPoint))
                setTick((tick) => ++tick)
              }}
              onChange={(event) => {
                const { value } = event.target
                const midPoint = Number(value)
                setMidPointPreview(midPoint)
                if (process.env.NODE_ENV === 'production')
                  setTick((tick) => ++tick)
                //  setTick((tick) => ++tick)

                // unstable_batchedUpdates(() => setMid(value))
              }}
              list={midRangeId}
            />
            <datalist id={midRangeId}>
              {COLOR_TINTS.map((tint) => (
                <option key={tint} value={tint} />
              ))}
            </datalist>
          </Card>
        </Grid>
      </Box>
    </Flex>
  )
}

function roundToScale(value: number): number {
  if (value < 75) {
    return 50
  }
  if (value > 925) {
    return 950
  }

  return Math.round(value / 100) * 100
}

function ColorPicker({
  label,
  value,
  setValue,
  setTick,
}: {
  label: string
  value: string
  setValue: (value: string) => void
  setTick: React.Dispatch<React.SetStateAction<number>>
}) {
  const parsedColor = useMemo(() => rgbToHex(parseColor(value)), [value])
  return (
    <Card>
      <Label muted style={{ marginBottom: '0.6rem' }} size={0}>
        {label}
      </Label>
      <input
        type="color"
        value={parsedColor}
        onPointerUp={() => setTick((tick) => ++tick)}
        onBlur={() => setTick((tick) => ++tick)}
        onChange={(event) => {
          const { value } = event.target
          setValue(value)
          if (process.env.NODE_ENV === 'production') setTick((tick) => ++tick)
        }}
      />
      <Text
        as="output"
        muted
        size={0}
        style={{ paddingTop: '0.2rem', fontFeatureSettings: 'tnum' }}
      >
        {parsedColor}
      </Text>
    </Card>
  )
}
