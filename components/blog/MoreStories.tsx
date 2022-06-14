import { type Image } from '@sanity/types'
import { WrappedWhoIisEditing } from 'chapters/01'
import PostPreview from './PostPreview'

export default function MoreStories({
  posts,
}: {
  posts: {
    title?: string
    coverImage?: Image
    date?: string
    author?: { name: string; picture: Image }
    slug?: string
    excerpt?: string
  }[]
}) {
  return (
    <section>
      <h2 className="mb-8 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
        More Stories
      </h2>
      <div className="grid grid-cols-1 mb-32 gap-y-20 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {posts.map((post) => (
          <div key={post.slug}>
            {(post as any)._id && (
              <WrappedWhoIisEditing documentId={(post as any)._id} />
            )}
            <PostPreview
              key={post.slug}
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
              slug={post.slug}
              excerpt={post.excerpt}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
