import createImageUrlBuilder from '@sanity/image-url'
import { useMemo, useState } from 'react'
import createSanityClient from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

// Only use the API CDN when in the browser and in production mode
function createClientConfig({
  dataset,
}: {
  dataset: string
  useCdn?: boolean
}) {
  return {
    dataset,
    // Hardcoding on purpose, dot-env is the way
    // If you *really must* use another project id, use the client.withConfig({projectId: ''}) technique
    projectId,
    useCdn:
      typeof document === 'undefined' && process.env.NODE_ENV === 'production',
    apiVersion: 'v2022-03-13',
  }
}

export function createClient({ dataset }: { dataset: string }) {
  const clientConfig = createClientConfig({ dataset })
  return createSanityClient(clientConfig)
}

export function createPreviewClient({
  token = process.env.SANITY_API_TOKEN,
  ...config
}: {
  token?: string
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

const imageBuilder = createImageUrlBuilder({ projectId, dataset: 'production' })
export const urlForImage = (source: Parameters<typeof imageBuilder.image>[0]) =>
  imageBuilder.image(source).auto('format').fit('max')

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
