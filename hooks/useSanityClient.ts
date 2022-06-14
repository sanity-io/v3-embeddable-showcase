import createImageUrlBuilder from '@sanity/image-url'
import createSanityClient from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''

const clientConfig = {
  // Hardcoding on purpose, dot-env is the way
  // If you *really must* use another project id, use the client.withConfig({projectId: ''}) technique
  projectId,
  dataset,
  // Only use the API CDN when in the browser and in production mode
  useCdn:
    typeof document === 'undefined' && process.env.NODE_ENV === 'production',
  apiVersion: 'v2022-03-13',
}
export function createClient() {
  return createSanityClient(clientConfig)
}

export function createPreviewClient({
  token = process.env.SANITY_API_TOKEN,
}: {
  token?: string
} = {}) {
  if (!token) {
    throw new Error('No API token provided to the Sanity Preview client')
  }

  if (typeof document !== 'undefined') {
    throw new Error(
      'Your Sanity API token is exposed in your browser bundle, revoke it and create a new one in sanity.io/manage'
    )
  }

  return createClient().withConfig({ token, useCdn: false })
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

const imageBuilder = createImageUrlBuilder({ projectId, dataset })
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

export const postFields = /* groq */ `
  _id,
  name,
  title,
  date,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`

export const allPostsQuery = /* groq */ `
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`

export const postQuery = /* groq */ `
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = /* groq */ `
*[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = /* groq */ `
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`

// Grab the workspaces data we store in the Themer workspace
// Used to generate the studio theme, and change minor aspects of the GUI like title and logo
export const workspacesQuery = /* groq */ `
*[_type == "workspace"]{...,theme->{...,"palette": source.asset->metadata.palette}}
`
