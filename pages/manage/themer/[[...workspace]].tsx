import { useMemo } from 'react'
import workspaces from 'sanity.config'
import {
  type StudioTheme,
  useCustomStudioTheme,
  useTonesFromPreset,
} from 'hooks'
import Singularity from 'components/Singularity'
import StudioPage from 'components/StudioPage'

import { Studio } from 'sanity'
import { useEffect, useState } from 'react'
import config from 'sanity.config'

interface Props {
  theme: StudioTheme
}

export {getInitialProps} from '../[[...workspace]]'

// Reuse getInitialProps from parent, and wrap parent for max code reuse

//TODO move logic out, it only executes on initial page load. If 
// Studio routing triggers it then next won't see it
export default function ThemerWorkspace(props: Props) {
  console.log('Yes!')
  const preset = useTonesFromPreset({ preset: 'imagepalette' })
  const fallbackTheme = useCustomStudioTheme({ config: preset })
  const theme = props.theme || fallbackTheme
  const appliedTheme = useMemo(
    () => workspaces.map((workspace) => ({ ...workspace, theme })),
    [theme]
  )
  const [singularity, setSingularity] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps,react-hooks/rules-of-hooks
  useEffect(() => {
    const handler = () => {
      const maybeSingularity = document.querySelectorAll(
        '[data-studio-preview]'
      )
      if (maybeSingularity.length > 3 && !singularity) {
        setSingularity(true)
      }
    }
    handler()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [singularity])

  return (
    <>
      <StudioPage>
        <Studio config={appliedTheme} unstable_noAuthBoundary />
      </StudioPage>
      <Singularity singularity={singularity} />
    </>
  )
}
