import createImageUrlBuilder from '@sanity/image-url'
import { useMemo, useState } from 'react'
import createSanityClient from '@sanity/client'

// Only use the API CDN when in the browser and in production mode
function createClientConfig({
  dataset,
  projectId,
}: {
  projectId: string
  dataset: string
  useCdn?: boolean
}) {
  return {
    dataset,
    projectId,
    useCdn:
      typeof document === 'undefined' && process.env.NODE_ENV === 'production',
    apiVersion: 'v2022-03-13',
  }
}

export function createClient({
  projectId,
  dataset,
}: {
  projectId: string
  dataset: string
}) {
  const clientConfig = createClientConfig({ projectId, dataset })
  return createSanityClient(clientConfig)
}

export function createPreviewClient({
  token = process.env.SANITY_API_TOKEN,
  ...config
}: {
  token?: string
  projectId: string
  dataset: string
}) {
  if (!token) {
    throw new Error('No API token provided to the Sanity Preview client')
  }

  if (typeof document !== 'undefined') {
    throw new Error(
      'Your Sanity API token is exposed in your browser bundle, revoke it and create a new one in sanity.io/manage'
    )
  }

  const { dataset, projectId, apiVersion } = createClientConfig(config)
  return createSanityClient({ dataset, projectId, apiVersion, useCdn: false })
}

export function filterDataToSingleItem(data = [], preview = false) {
  if (!Array.isArray(data)) {
    return data
  }

  if (data.length === 1) {
    return data[0]
  }

  if (preview) {
    return data.find((item: any) => item._id.startsWith(`drafts.`)) || data[0]
  }

  return data[0]
}

export function useImageUrlBuilder({
  dataset,
  projectId,
}: {
  dataset: string
  projectId: string
}) {
  return useMemo(
    () => createImageUrlBuilder({ dataset, projectId }),
    [dataset, projectId]
  )
}

export function overlayDrafts(docs: any) {
  const documents = docs || []
  const overlayed = documents.reduce((map: any, doc: any) => {
    if (!doc._id) {
      throw new Error('Ensure that `_id` is included in query projection')
    }

    const isDraft = doc._id.startsWith('drafts.')
    const id = isDraft ? doc._id.slice(7) : doc._id
    return isDraft || !map.has(id) ? map.set(id, doc) : map
  }, new Map())

  return Array.from(overlayed.values())
}

//const movies = await getClient().fetch(
/* groq */ //`*[_type == "movie"]{ _id, title, slug }`
//);
