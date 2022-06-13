import { type Image } from '@sanity/types'
import Avatar from './Avatar'
import Date from './Date'
import CoverImage from './CoverImage'
import PostTitle from './PostTitle'

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
}: {
  title?: string
  coverImage?: Image
  date?: string
  author?: { name?: string; picture?: Image }
}) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:mb-12 md:block">
        {author && <Avatar name={author?.name || 'No Name'} picture={author?.picture} /> }
      </div>
      <div className="mb-8 sm:mx-0 md:mb-16">
        <CoverImage title={title} image={coverImage} />
      </div>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 block md:hidden">
          {author && <Avatar name={author?.name || 'No Name'} picture={author?.picture} />}
        </div>
        <div className="mb-6 text-lg">{date && <Date dateString={date} />}</div>
      </div>
    </>
  )
}
