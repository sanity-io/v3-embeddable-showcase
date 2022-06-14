import StudioPage from 'components/StudioPage'
import { Studio, type WorkspaceOptions } from 'sanity'
import {
  overlayDrafts,
  createClient,
  createPreviewClient,
  projectId,
  dataset,
  allPostsQuery,
  workspacesQuery,
} from 'hooks/useSanityClient'
import config from 'sanity.config'
import {config as themerConfig} from 'components/studios/themer'


export interface Props {
  workspaces: Partial<WorkspaceOptions>[]
}

// WTODO: query workspace theme data from themer
export default function ManageWorkspace(props: Props) {
  console.log('ManageWorkspace!!',{props})
  return (
    <StudioPage>
      <Studio config={config} unstable_noAuthBoundary />
    </StudioPage>
  )
}

export async function getInitialProps(): Promise<{props: Props}> {
  const {dataset} = themerConfig
  const client = createClient().withConfig({dataset})
  const data = await client.fetch(workspacesQuery)
  return {
    props: {
      workspaces: Array.isArray(data) ? data : [],
    },
  }
}
