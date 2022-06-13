import StudioPage from 'components/StudioPage'
import { useMemo } from 'react'
import { Studio } from 'sanity'
import config from 'sanity.config'

import { useBasePath } from 'hooks'

// const studioConfig = createConfig(workspaces)
export default function StudioRoute() {
  //const workspaces = useWorkspacesConfig()
  // const studioConfig = useMemo(() => createConfig([{ ...config}, ...workspaces ]), [workspaces])
  // const studioConfig = useMemo(() => createConfig(workspaces), [workspaces])
  return (
    <StudioPage>
      <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
  )
}
