import { mix } from 'polished'
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
import { useState, useMemo, useLayoutEffect, useEffect, memo } from 'react'
import { useRouter } from 'next/router'
import {
  type Theme,
  rgba,
  multiply as _multiply,
  screen as _screen,
  parseColor,
  rgbToHex,
  ThemeProvider,
  Container,
  Card,
  Flex,
  Box,
  Text,
  Label,
  Grid,
  Stack,
  Inline,
  Switch,
  Checkbox,
  createColorTheme,
  Select,
  usePrefersDark,
} from '@sanity/ui'

interface Props {
  tints: ColorTints
}
function ColorTintsPreview({ tints }: Props) {
  return (
    <>
      {Object.entries(tints).map(([tint, color]) => (
        <Card tone="default" key={tint} shadow={1} radius={3}>
          <Card
            padding={4}
            radius={3}
            style={{
              background: color.hex,
              borderBottomLeftRadius: '0px',
              borderBottomRightRadius: '0px',
            }}
          />
          <Box padding={1} paddingTop={2}>
            <Text size={0} muted>
              {tint}
            </Text>
          </Box>
          <Box padding={1} paddingBottom={2}>
            <Text size={0} style={{ minWidth: '56px' }}>
              {color.hex}
            </Text>
          </Box>
        </Card>
      ))}
    </>
  )
}
export default memo(ColorTintsPreview)
