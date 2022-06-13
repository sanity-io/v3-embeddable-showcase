import StudioPage from 'components/StudioPage'
import { Studio } from 'sanity'
import config from 'sanity.config'

export default function StudioRoute() {
  return (
    <StudioPage>
      <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
  )
}
