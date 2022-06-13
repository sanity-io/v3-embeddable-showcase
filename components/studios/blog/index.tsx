// @TODO the index should just be a re-exporter, move stuff like the scheme to ./schema etc
// This is the Studio used to edit the blog based on vercel's starter

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

export const dataset = 'production'
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
    name: 'blog',
    title: 'Blog',
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
