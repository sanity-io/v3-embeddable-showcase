import { type SanityDocument, type Image } from '@sanity/types'
import Head from 'next/head'
import Container from 'components/blog/Container'
import MoreStories from 'components/blog/MoreStories'
import HeroPost from 'components/blog/HeroPost'
import Intro from 'components/blog/Intro'
import Layout from 'components/blog/Layout'

export default function Index({
  allPosts,
  preview,
}: {
  allPosts: {
    title?: string
    coverImage?: Image
    date?: string
    author?: { name: string; picture: Image }
    slug?: string
    excerpt?: string
  }[]
  preview: boolean
}) {
  const [heroPost, ...morePosts] = allPosts
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with Sanity</title>
        </Head>
        <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </Layout>
    </>
  )
}
