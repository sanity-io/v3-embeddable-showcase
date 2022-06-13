import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { type Image as SanityImage } from '@sanity/types'
import { urlForImage } from 'hooks/useSanityClient'

export default function CoverImage({
  title,
  slug,
  image: source,
}: {
  slug?: string
  title?: string
  image?: SanityImage
}) {
  const image = source ? (
    <div
      className={cn('shadow-small', {
        'transition-shadow duration-200 hover:shadow-medium': slug,
      })}
    >
      <Image
        layout="responsive"
        width={2000}
        height={1000}
        alt={`Cover Image for ${title}`}
        src={urlForImage(source).height(1000).width(2000).url()}
      />
    </div>
  ) : (
    <div style={{ paddingTop: '50%', backgroundColor: '#ddd' }} />
  )

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={`/posts/${slug}`}>
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
