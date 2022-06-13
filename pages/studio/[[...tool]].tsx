import { createStudioConfig } from 'components/studios/blog'
import StudioPage from 'components/StudioPage'
import { useMemo } from 'react'
import { Studio } from 'sanity'

import { useBasePath } from 'hooks'

export default function StudioRoute() {
  const basePath = useBasePath()
  const config = useMemo(() => createStudioConfig({ basePath }), [basePath])
  return (
    <StudioPage>
      <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
  )
}
