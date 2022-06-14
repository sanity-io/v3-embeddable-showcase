import StudioPage from 'components/StudioPage'
import { config as themerConfig } from 'components/studios/themer'
import { createClient, workspacesQuery } from 'hooks/useSanityClient'
import { useWorkspacesFromThemer } from 'hooks/useSanityStudio'
import { Studio, type WorkspaceOptions } from 'sanity'
import config from 'sanity.config'

import { createStudioTheme, useTonesFromPreset } from 'hooks'
import { useMemo } from 'react'
import workspaces from 'sanity.config'

export interface Props {
  workspaces: WorkspaceOptions[]
}

// WTODO: query workspace theme data from themer
export default function ManageWorkspace(props: Props) {
  console.log('ManageWorkspace!!', { props })
  /*
  const preset = useTonesFromPreset({ preset: 'imagepalette' })
  const fallbackTheme = useCustomStudioTheme({ config: preset })
  const theme = props.theme || fallbackTheme
  const appliedTheme = useMemo(
    () => workspaces.map((workspace) => ({ ...workspace, theme })),
    [theme]
  )
  // */
  const [configMergedWithThemer] = useWorkspacesFromThemer()

  return (
    <StudioPage>
      <Studio config={configMergedWithThemer} unstable_noAuthBoundary />
    </StudioPage>
  )
}

export async function getServerProps(): Promise<{ props: Props }> {
  const { dataset } = themerConfig
  const client = createClient().withConfig({ dataset })
  const data = await client.fetch(workspacesQuery)
  console.log('getServerProps', data)
  return {
    props: {
      workspaces: Array.isArray(data) ? data : [],
    },
  }
}
