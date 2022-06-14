import { projectId, dataset } from 'hooks/useSanityClient'
import { type WorkspaceOptions } from 'sanity'

import { useMemo } from 'react'
import { Studio, createConfig } from 'sanity'

import { useBasePath } from 'hooks'
import {
  DefaultDocumentNodeResolver,
  deskTool,
  View,
  ViewBuilder,
} from 'sanity/desk'
import { types } from 'components/studios/blog'
import {defaultDocumentNode} from 'components/studios/blog-pro'

// TODO add schema for site settings, feature flags

export const config: WorkspaceOptions = {
  basePath: '/manage/blog-pro-max',
  projectId,
  dataset,
  plugins: [deskTool({ defaultDocumentNode })],
  name: 'blog-pro-max',
  title: 'Pro Max Blog',
  schema: { types },
}
