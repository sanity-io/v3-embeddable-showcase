import { type WorkspaceOptions } from 'sanity'
import { projectId, dataset } from 'hooks/useSanityClient'

import { deskTool } from 'sanity/desk'
import { types } from './blogSchema'

export const config: WorkspaceOptions = {
  basePath: '/manage/blog',
  projectId,
  dataset,
  plugins: [deskTool()],
  name: 'blog',
  title: 'Blog',
  schema: { types },
}
