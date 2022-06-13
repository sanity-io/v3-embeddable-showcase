import { useState, useEffect } from 'react'
import { usePrefersDark, type ThemeColorSchemeKey } from '@sanity/ui'

export function useColorScheme() {
  const dark = usePrefersDark()
  const [scheme, setScheme] = useState<ThemeColorSchemeKey>('light')
  useEffect(() => {
    // This is necessary to SSSR hydration, server doesn't know atm what you got so it defaults to white, and have to apply dark if you prefer taht
    setScheme(dark ? 'dark' : 'light')
  }, [dark])

  return scheme
}
