import {
  type ResolveProductionUrlContext,
  type SanityDocumentLike,
  type WorkspaceOptions,
} from 'sanity'
import { projectId, dataset } from 'hooks/useSanityClient'
import { LemonIcon } from '@sanity/icons'

import { deskTool } from 'sanity/desk'
import { types } from './blogSchema'

export async function productionUrl(
  _: unknown,
  { document }: ResolveProductionUrlContext
) {
  const params = new URLSearchParams()
  if (!process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET) return
  if (!(document?.slug as any)?.current) return
  // @TODO read the secret from a hidden schema so it's not in the bundle code
  const url = new URL('/api/preview', window.location.origin)
  url.searchParams.set('secret', process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET)
  url.searchParams.set('slug', (document.slug as any).current)
  return url.toString()
}

export const config: WorkspaceOptions = {
  basePath: '/manage/blog',
  icon: LemonIcon,
  projectId,
  dataset,
  plugins: [deskTool()],
  name: 'blog',
  schema: { types },
  document: { productionUrl },
}
