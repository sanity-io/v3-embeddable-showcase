import { type SanityDocument } from '@sanity/types'
import IndexPage from 'chapters/01'
import {
  overlayDrafts,
  createClient,
  createPreviewClient,
  projectId,
  dataset,
} from 'hooks/useSanityClient'
import { createPreviewSubscriptionHook } from 'next-sanity'

const query = /* groq */ `*[_type == "post"] | order(date desc, _updatedAt desc) {
  _id,
  name,
  title,
  date,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
}`

const usePreviewSubscription = createPreviewSubscriptionHook({
  projectId,
  dataset,
})
export default function Index({
  allPosts,
  preview,
}: {
  allPosts: any[]
  preview: boolean
}) {
  const { data } = usePreviewSubscription(query, {
    initialData: allPosts,
    enabled: preview,
  })
  return (
    <>
      <IndexPage allPosts={data} preview={preview} />
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const client = preview ? createPreviewClient() : createClient()

  const allPosts = overlayDrafts(await client.fetch(query))
  return {
    props: { allPosts, preview },
  }
}
