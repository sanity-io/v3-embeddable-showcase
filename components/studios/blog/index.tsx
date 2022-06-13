// @TODO the index should just be a re-exporter, move stuff like the scheme to ./schema etc
// This is the Studio used to edit the blog based on vercel's starter

import {
  type Config,
  createConfig,
  type WorkspaceOptions,
} from 'sanity'
import { projectId } from 'hooks/useSanityClient'

import { deskTool } from 'sanity/desk'
import { types } from './blogSchema'

// @TODO move this one to an env var, only the themer needs a diff dataset
export const dataset = 'production'
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

// @deprecated
export function createStudioConfig({
  // @TODO: moving away from dynamic basePath
  basePath,
  ...other
}: Partial<Pick<WorkspaceOptions, 'basePath'>> &
  Partial<Omit<WorkspaceOptions, 'basePath'>>): Config {
  return createConfig({
    basePath,
    projectId,
    dataset,
    plugins: [deskTool()],
    name: 'blog',
    title: 'Blog',
    schema: {
      types,
    },
    ...other,
  })
}

export * from './blogConfig'