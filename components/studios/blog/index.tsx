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
import { brownPelican } from 'config/projects'
import { createSchema } from 'sanity/_unstable'

export const postType = {
  name: 'post',
  types: 'document',
  title: 'Post',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    { name: 'excerpt', title: 'Excerpt', type: 'string' },
    { name: 'coverImage', title: 'Cover Image', type: 'image' },
    { name: 'date', title: 'Date', type: 'datetime' },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    },
  ],
}
export const authorType = {
  name: 'author',
  type: 'document',
  title: 'Author',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'picture', title: 'Picture', type: 'image' },
  ],
}

export const schemaTypes = [postType, authorType]

const [projectId, dataset] = brownPelican
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

export default function BlogStudio() {}
