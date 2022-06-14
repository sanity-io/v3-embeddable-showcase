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
export function useWorkspacesFromThemer(): [config: Config, loaded: boolean] {
  const [loaded, setLoaded] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    client
      .fetch(workspacesQuery)
      .then((workspaces) => {
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
      .catch(setError)
      .finally(() => setLoaded(true))
  }, [])
  if (error) {
    // Rethrow to nearest boundary
    throw error
  }
  const mapped = useMemo<Config>(
    () =>
      config.map((workspace) => {
        if (!data || !Array.isArray(data)) return workspace
        // @ts-expect-error
        const matched = data.find((conf: any) => conf._id === workspace.name)
        if (!matched) {
          return workspace
        }

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
  return [mapped, loaded]
}
