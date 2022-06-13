import { type Config } from 'sanity'
import { projectId, dataset } from 'hooks/useSanityClient'

import { deskTool } from 'sanity/desk'
import { types } from './schema'

export const config: Partial<Config> = {
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [deskTool()],
  name: 'blog',
  title: 'Blog',
  schema: {
    types,
  },
}
