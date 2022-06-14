import StudioPage from 'components/StudioPage'
import { Studio } from 'sanity'
import config from 'sanity.config'

// WTODO: query workspace theme data from themer
export default function ManageWorkspace() {
  return (
    <StudioPage>
      <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
  )
}
