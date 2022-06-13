import { useMemo } from 'react'
import {
  type Config,
  createConfig,
  Studio,
  type StudioProviderProps,
  type WorkspaceOptions,
} from 'sanity'
import { projectId } from 'hooks/useSanityClient'
import { deskTool } from 'sanity/desk'
import {dataset} from 'components/studios/blog'

import { useBasePath } from 'hooks'

// This Studio is really just a visually different version of the blog, same data

export function createStudioConfig({
  basePath,
  ...other
}: Pick<WorkspaceOptions, 'basePath'> &
  Partial<Omit<WorkspaceOptions, 'basePath'>>): Config {
  return createConfig({
    basePath,
    projectId,
    dataset,
    plugins: [deskTool()],
    name: 'brown-pelican',
    title: 'Wordpress',
    schema: {
      types: [
        {
          name: 'post',
          type: 'document',
          title: 'Post',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
              },
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{ type: 'block' }],
            },
            {
              name: 'excerpt',
              title: 'Excerpt',
              type: 'string',
            },
            {
              name: 'coverImage',
              title: 'Cover Image',
              type: 'image',
            },
            {
              name: 'date',
              title: 'Date',
              type: 'datetime',
            },
            {
              name: 'author',
              title: 'Author',
              type: 'reference',
              to: [{ type: 'author' }],
            },
          ],
        },
        {
          name: 'author',
          type: 'document',
          title: 'Author',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'picture',
              title: 'Picture',
              type: 'image',
            },
          ],
        },
      ],
    },
    ...other,
  })
}

export default function StudioPage(
  props: Omit<Partial<StudioProviderProps>, 'children'>
) {
  const basePath = useBasePath()
  const config = useMemo(
    () =>
      createStudioConfig({
        basePath,
      }),
    [basePath]
  )

  return <Studio unstable_noAuthBoundary config={config} {...props} />
}
