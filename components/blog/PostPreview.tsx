import { type Image } from '@sanity/types'
import Avatar from './Avatar'
import Date from './Date'
import CoverImage from './CoverImage'
import Link from 'next/link'

export default function PostPreview({
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
    <>
      <div className="mb-5">
        <CoverImage slug={slug} image={coverImage} />
      </div>
      <h3 className="mb-3 text-3xl leading-snug">
        <Link href={`/posts/${slug}`}>
          <a className="hover:underline">{title}</a>
        </Link>
      </h3>
      <div className="mb-4 text-lg">{date && <Date dateString={date} />}</div>
      <p className="mb-4 text-lg leading-relaxed">{excerpt}</p>
      {author && (
        <Avatar name={author?.name || 'No Name'} picture={author?.picture} />
      )}
    </>
  )
}
