import { type SanityDocument } from '@sanity/types'
import IndexPage from 'chapters/01'
import {
  overlayDrafts,
  createClient,
  createPreviewClient,
  projectId,
  dataset,
  allPostsQuery,
} from 'hooks/useSanityClient'
import { createPreviewSubscriptionHook } from 'next-sanity'

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
  const { data } = usePreviewSubscription(allPostsQuery, {
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

  const allPosts = overlayDrafts(await client.fetch(allPostsQuery))
  return {
    props: { allPosts, preview },
  }
}
