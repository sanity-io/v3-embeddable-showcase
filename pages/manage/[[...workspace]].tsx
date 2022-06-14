import StudioPage from 'components/StudioPage'
import { Studio } from 'sanity'
import config from 'sanity.config'


export interface Props {}

// WTODO: query workspace theme data from themer
export default function ManageWorkspace(props: Props) {
  console.log(props)
  return (
    <StudioPage>
      <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
  )
}

export async function getInitialProps(): {props: Props} {
  return {
    props: {},
  }
}
