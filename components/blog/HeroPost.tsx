import Avatar from './Avatar'
import Date from './Date'
import CoverImage from './CoverImage'
import Link from 'next/link'
import { type Image } from 'sanity'

export default function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: {
  title?: string
  coverImage?: Image
  date?: string
  excerpt?: string
  author?: { name?: string; picture?: Image }
  slug?: string
}) {
  return (
    <section>
      {coverImage && (
        <div className="mb-8 md:mb-16">
          <CoverImage slug={slug} image={coverImage} />
        </div>
      )}
      <div className="mb-20 md:mb-28 md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8">
        <div>
          <h3 className="mb-4 text-4xl leading-tight lg:text-6xl">
            <Link href={`/posts/${slug}`}>
              <a className="hover:underline">{title}</a>
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            {date && <Date dateString={date} />}
          </div>
        </div>
        <div>
          <p className="mb-4 text-lg leading-relaxed">{excerpt}</p>
          {author && (
            <Avatar
              name={author?.name || 'No Name'}
              picture={author?.picture}
            />
          )}
        </div>
      </div>
    </section>
  )
}
