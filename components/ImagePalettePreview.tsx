import { black, white } from '@sanity/color'
import Link from 'next/link'
import Sandbox from 'components/Sandbox'
import { createStudioConfig as getWordpressConfig } from 'components/studios/wordpress'
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
  ColorSchemeProvider,
  StudioProvider,
  StudioLayout,
  useWorkspace,
  type ImagePalette,
  type SwatchName,
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
  Stack,
  usePrefersDark,
} from '@sanity/ui'
import { createMemoryHistory, createHashHistory, type Listener } from 'history'
import * as stable from 'sanity'
import * as unstable from 'sanity/_unstable'
import { unstable_batchedUpdates } from 'react-dom'
import ThemePreview from 'components/ThemePreview'
import {
  useCustomStudioTheme,
  useColorConfigState,
  useTonesFromPreset,
  demoImagePalette,
} from 'hooks'
import ColorTintsPreview from 'components/ColorTintsPreview'

interface Props {
  value: ImagePalette
}

const previewSwatches: SwatchName[] = [
  'darkMuted',
  'darkVibrant',
  'dominant',
  'lightMuted',
  'lightVibrant',
  'muted',
  'vibrant',
]

export default function ImagePalettePreview({ value }: Props) {
  return (
    <>
      {previewSwatches.map((swatch) => {
        const palette = value[swatch]
        if (!palette) return null
        return (
          <Card paddingTop={2} key={swatch}>
            <Text size={1} muted style={{ paddingBottom: '10px' }}>
              {swatch}
            </Text>
            <Inline space={1}>
              {[
                'background' as const,
                // 'foreground' as const,
                // 'title' as const,
              ].map((key) => (
                <Card key={key} tone="default" shadow={1} radius={3}>
                  <Card
                    padding={4}
                    radius={3}
                    style={{
                      background: palette[key],
                      borderBottomLeftRadius: '0px',
                      borderBottomRightRadius: '0px',
                    }}
                  />
                  <Box padding={1} paddingTop={2}>
                    <Text size={0} muted>
                      {key}
                    </Text>
                  </Box>
                  <Box padding={1} paddingBottom={2}>
                    <Text size={0} style={{ minWidth: '56px' }}>
                      {palette[key]}
                    </Text>
                  </Box>
                </Card>
              ))}
            </Inline>
          </Card>
        )
      })}
    </>
  )
}
