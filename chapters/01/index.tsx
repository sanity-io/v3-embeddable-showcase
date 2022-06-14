import { type SanityDocument, type Image } from '@sanity/types'
import Head from 'next/head'
import Container from 'components/blog/Container'
import MoreStories from 'components/blog/MoreStories'
import HeroPost from 'components/blog/HeroPost'
import Intro from 'components/blog/Intro'
import Layout from 'components/blog/Layout'
import Link from 'next/link'

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
        <Link href="/manage/blog"><a className="inline-flex w-auto items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[color:#101112]">
        <svg
                  aria-label="Sanity"
                  className="mr-0.5 inline-block h-6 w-6 -translate-x-1 scale-125"
                  viewBox="0 0 512 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M161.527 136.723C161.527 179.76 187.738 205.443 240.388 219.095L296 232.283C345.687 243.852 376 272.775 376 319.514C376 341.727 369.162 360.931 357.538 375.971C357.538 329.232 333.607 303.78 276.171 288.74L221.47 276.246C177.709 266.065 143.977 242.464 143.977 191.56C143.977 170.505 150.359 151.994 161.527 136.723Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M323.35 308.176C347.054 323.679 357.538 345.197 357.538 376.202C337.709 401.654 303.293 416 262.724 416C194.575 416 146.484 381.756 136 322.753H201.641C210.074 350.056 232.41 362.551 262.268 362.551C298.735 362.32 322.895 342.652 323.35 308.176Z"
                    fill="white"
                  ></path>
                  <path
                    opacity="0.5"
                    d="M195.715 200.816C172.923 186.007 161.527 165.183 161.527 136.954C180.672 111.503 213.493 96 253.835 96C323.35 96 363.692 133.252 373.721 185.776H310.359C303.293 165.183 285.971 148.986 254.291 148.986C220.33 148.986 197.311 169.116 195.715 200.816Z"
                    fill="white"
                  ></path>
                </svg>
                Launch Studio (iframe embedded)
              </></a></Link>
      </Layout>
    </>
  )
}
