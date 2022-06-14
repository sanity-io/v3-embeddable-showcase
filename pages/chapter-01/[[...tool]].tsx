import StudioPage from 'components/StudioPage'
import { useMemo } from 'react'
import { Studio } from 'sanity'
import workspaces from 'sanity.config'
import {
  type StudioTheme,
  useCustomStudioTheme,
  useTonesFromPreset,
} from 'hooks'

interface Props {
  theme: StudioTheme
}

export default function StudioRoute(props: Props) {
  const preset = useTonesFromPreset({ preset: 'blackpink' })
  const fallbackTheme = useCustomStudioTheme({ config: preset })
  const theme = props.theme || fallbackTheme
  const appliedTheme = useMemo(
    () => workspaces.map((workspace) => ({ ...workspace, theme })),
    [theme]
  )
  return (
    <StudioPage>
      <Studio config={appliedTheme} unstable_noAuthBoundary />
    </StudioPage>
  )
}
