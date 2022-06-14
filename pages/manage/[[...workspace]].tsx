import Singularity from 'components/Singularity'
import { useEffect, useState } from 'react'
import StudioPage from 'components/StudioPage'
import { config as themerConfig } from 'components/studios/themer'
import { createClient, workspacesQuery } from 'hooks/useSanityClient'
import { useWorkspacesFromThemer } from 'hooks/useSanityStudio'
import { Studio, type WorkspaceOptions } from 'sanity'

export interface Props {
  workspaces: WorkspaceOptions[]
}

// WTODO: query workspace theme data from themer
export default function ManageWorkspace(props: Props) {
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

  const [configMergedWithThemer] = useWorkspacesFromThemer()

  return (
    <>
      <StudioPage>
        <Studio config={configMergedWithThemer} unstable_noAuthBoundary />
      </StudioPage>
      <Singularity singularity={singularity} />
    </>
  )
}

export async function getServerProps(): Promise<{ props: Props }> {
  const { dataset } = themerConfig
  const client = createClient().withConfig({ dataset })
  const data = await client.fetch(workspacesQuery)
  return {
    props: {
      workspaces: Array.isArray(data) ? data : [],
    },
  }
}
