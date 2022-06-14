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
import { type SanityDocumentLike } from 'sanity'
import { createPreviewSubscriptionHook } from 'next-sanity'

const usePreviewSubscription = createPreviewSubscriptionHook({
  projectId,
  dataset,
})
export default function Post({
  data,
  preview,
}: {
  data?: SanityDocumentLike
  preview: boolean
}) {
  const router = useRouter()

  // @ts-expect-error - figure out how to type these unknown things
  const slug = data?.post?.slug
  const {
    data: { post: _post, morePosts },
  } = usePreviewSubscription(postQuery, {
    params: { slug },
    initialData: data,
    enabled: preview && slug,
  })
  // @TODO: fix typings
  const post: any = _post

  if (!router.isFallback && !slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
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
            </article>
            <SectionSeparator />
            {(morePosts as any).length > 0 && (
              <MoreStories posts={morePosts as any} />
            )}
          </>
        )}
      </Container>
    </Layout>
  )
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
        post,
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
