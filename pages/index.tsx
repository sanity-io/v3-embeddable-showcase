import { type SanityDocument } from '@sanity/types'
import IndexPage from 'chapters/01'
import {
  overlayDrafts,
  createClient,
  createPreviewClient,
  projectId,
} from 'hooks/useSanityClient'
import { createPreviewSubscriptionHook } from 'next-sanity'
import { dataset } from 'components/studios/blog'

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
  const client = preview
    ? createPreviewClient({ dataset })
    : createClient({ dataset })

  const allPosts = overlayDrafts(await client.fetch(query))
  return {
    props: { allPosts, preview },
  }
}
