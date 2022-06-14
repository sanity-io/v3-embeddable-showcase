import {
  postQuery,
  projectId,
  urlForImage,
  dataset,
  createClient,
  overlayDrafts,
  postSlugsQuery,
  createPreviewClient,
} from 'hooks/useSanityClient'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from 'components/blog/Container'
import PostBody from 'components/blog/PostBody'
import MoreStories from 'components/blog/MoreStories'
import Header from 'components/blog/Header'
import PostHeader from 'components/blog/PostHeader'
import SectionSeparator from 'components/blog/SectionSeparator'
import Layout from 'components/blog/Layout'
import PostTitle from 'components/blog/PostTitle'
import { StudioProvider, type SanityDocumentLike } from 'sanity'
import { createPreviewSubscriptionHook } from 'next-sanity'
import { type Image } from 'sanity'
import { EditPost } from 'components/SuperLivePreview'
import config from 'sanity.config'
import { DocumentPresence, useDocumentPresence, useGlobalPresence, usePresenceStore, DocumentPreviewPresence } from 'sanity/_unstable'
import { useEffect, useState } from 'react'
import { createMemoryHistory } from 'history'
import { useMagicRouter } from 'hooks'

const usePreviewSubscription = createPreviewSubscriptionHook({
  projectId,
  dataset,
})
export default function Post({
  data: initialData,
  preview: _preview,
}: {
  data?: SanityDocumentLike
  preview: boolean
}) {
  const router = useRouter()

  const slug = (initialData as any)?.post?.slug
  const { data } = usePreviewSubscription(postQuery, {
    params: { slug },
    initialData,
    enabled: _preview && slug,
  })
  const preview = _preview && slug && data
  const post: {
    _id?: string
    title?: string
    coverImage?: Image
    date?: string
    excerpt?: string
    author?: { name?: string; picture?: Image }
    slug?: string
    content?: unknown
  } = data?.post as any
  const morePosts = data?.morePosts || []
  const history = useMagicRouter(`${config[0].basePath}/desk/post;${post._id}`)

  if (!router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <>
      <Layout preview={preview}>
        <Container>
          <Header />
          {router.isFallback ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <article>
                <Head>
                  <title>{post.title} | Next.js Blog Example with Sanity</title>
                  {post.coverImage && (
                    <meta
                      key="ogImage"
                      property="og:image"
                      content={urlForImage(post.coverImage)
                        .width(1200)
                        .height(627)
                        .fit('crop')
                        .url()}
                    />
                  )}
                </Head>

                <PostHeader
                  title={post.title}
                  coverImage={post.coverImage}
                  date={post.date}
                  author={post.author}
                />

                <PostBody content={post.content} />
                {post._id && <EditPost preview={preview} _id={post._id} />}
              </article>
              <SectionSeparator />
              {(morePosts as any)?.length > 0 && (
                <MoreStories posts={morePosts as any} />
              )}
            </>
          )}
        </Container>
      </Layout>
      {post?._id && (
        <StudioProvider config={config[0]} unstable_history={history} unstable_noAuthBoundary>
          <Logger documentId={post._id} />
        </StudioProvider>
      )}
    </>
  )
  // */
}

function Logger({ documentId }: { documentId: string }) {
  
  const global = useGlobalPresence()
  const presence = useDocumentPresence(documentId)

  useEffect(() => {
    console.log({presence, documentId, global})
    if (presence) {
      console.log('presence', { presence })
    }
  }, [presence, documentId, global])

  const presenceStore = usePresenceStore()
  const [presence2, setPresence2] = useState<DocumentPresence[]>([])
  useEffect(() => {
    const subscription = presenceStore.documentPresence(documentId).subscribe((nextPresence) => {
      console.log('presenceStore updated', nextPresence)
      setPresence2(nextPresence)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [documentId, presenceStore])

  return <><div className='sticky top-2 right-2'><DocumentPreviewPresence presence={presence} /></div><div className='sticky bottom-0 right-0 max-w-full p-4 text-white bg-black'>
    <p>Presence!</p>
    
    <details>
      <summary>Global</summary>
      <pre>{JSON.stringify(global, null, 2)}</pre>
    </details>
    <details>
      <summary>Document ({documentId})</summary>
      <pre>{JSON.stringify(presence, null, 2)}</pre>
    </details>
    <details>
      <summary>presenceStore ({documentId})</summary>
      <pre>{JSON.stringify(presence2, null, 2)}</pre>
    </details>
  </div>
  </>
}

export async function getStaticProps({
  params,
  preview = false,
}: {
  params: { slug?: string }
  preview?: boolean
}) {
  const client = preview ? createPreviewClient() : createClient()
  const { post, morePosts } = await client.fetch(postQuery, {
    slug: params.slug,
  })

  return {
    props: {
      preview,
      data: {
        post: post || ({} as any),
        morePosts: overlayDrafts(morePosts),
      },
    },
  }
}

export async function getStaticPaths() {
  const client = createClient()
  const paths = await client.fetch(postSlugsQuery)
  return {
    paths: paths.map((slug: any) => ({ params: { slug } })),
    fallback: true,
  }
}
