import StudioPage from 'components/StudioPage'
import { useMemo } from 'react'
import { Studio } from 'sanity'
import config from 'sanity.config'

export default function WordpressRoute() {
  return (
    <StudioPage>
      <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
  )
}
