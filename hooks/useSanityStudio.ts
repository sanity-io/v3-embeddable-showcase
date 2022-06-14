import { type Config, type WorkspaceOptions } from 'sanity'
import { useState, useEffect, useMemo } from 'react'
import { usePrefersDark, type ThemeColorSchemeKey } from '@sanity/ui'
import config from 'sanity.config'
import { config as themerConfig } from 'components/studios/themer'
import { createClient, workspacesQuery } from './useSanityClient'
import { createStudioTheme, getColorConfigsFromImagePalette } from 'hooks'

export function useColorScheme() {
  const dark = usePrefersDark()
  const [scheme, setScheme] = useState<ThemeColorSchemeKey>('light')
  useEffect(() => {
    // This is necessary to SSSR hydration, server doesn't know atm what you got so it defaults to white, and have to apply dark if you prefer taht
    setScheme(dark ? 'dark' : 'light')
  }, [dark])

  return scheme
}

const { dataset } = themerConfig
const client = createClient().withConfig({ dataset })
export function useWorkspacesFromThemer(): Config {
  const [data, setData] = useState([])
  useEffect(() => {
    client.fetch(workspacesQuery).then((workspaces) => {
      console.log({ workspaces })
      const withTones = workspaces.map((workspace: unknown) => {
        const colorConfig = (workspace as any).theme?.palette
          ? getColorConfigsFromImagePalette({
              palette: (workspace as any).theme?.palette,
            })
          : undefined
        debugger
        // TODO add support for presets etc, for now it's ok to just grab colors from an image
        const theme = colorConfig
          ? createStudioTheme({ config: colorConfig })
          : undefined
        debugger
        return { ...(workspace as any), theme }
      })
      setData(withTones)
    })
  }, [])

  console.log(data)
  return useMemo<Config>(
    () =>
      config.map((workspace) => {
        debugger
        if (!Array.isArray(data)) return workspace
        const matched = data.find((conf: any) => conf.name === workspace.name)
        debugger
        if (!matched) return workspace

        const { title, theme, subtitle, logo } = matched
        return {
          ...workspace,
          title,
          theme,
          subtitle,
          logo,
        }
      }),
    [data]
  )
}
