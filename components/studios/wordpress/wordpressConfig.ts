import { type WorkspaceOptions } from 'sanity'
import { projectId, dataset } from 'hooks/useSanityClient'

import { deskTool } from 'sanity/desk'
import { types } from './wordpressSchema'

export const config: WorkspaceOptions = {
  basePath: '/wp-admin',
  projectId,
  dataset,
  plugins: [deskTool()],
  name: 'wordpress',
  title: 'Not Wordpress',
  schema: {
    types,
  },
}
