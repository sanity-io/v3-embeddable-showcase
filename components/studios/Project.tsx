// The overall project and Next.js site config here

import { useMemo } from 'react'
import {
  type Config,
  createConfig,
  Studio,
  type StudioProviderProps,
  type WorkspaceOptions,
} from 'sanity'
import { deskTool } from 'sanity/desk'

import { useBasePath } from 'hooks'
import { projectId } from 'hooks/useSanityClient'

export function getConfig({
  basePath,
  ...other
}: Pick<WorkspaceOptions, 'basePath'> &
  Partial<Omit<WorkspaceOptions, 'basePath'>>): Config {
  return createConfig({
    basePath,
    projectId,
    // @TODO give its own dataset
    dataset: 'staging',
    plugins: [deskTool()],
    name: 'midnight-pegasus',
    title: 'Studio V3',
    schema: {
      types: [
        {
          type: 'document',
          name: 'demo',
          title: 'Post',
          fields: [
            {
              type: 'string',
              name: 'title',
              title: 'Title',
            },
          ],
        },
      ],
      ...other,
    },
  })
}

export default function Project(
  props: Omit<Partial<StudioProviderProps>, 'children'>
) {
  const basePath = useBasePath()
  const config = useMemo(
    () =>
      getConfig({
        basePath,
      }),
    [basePath]
  )

  return <Studio unstable_noAuthBoundary config={config} {...props} />
}
