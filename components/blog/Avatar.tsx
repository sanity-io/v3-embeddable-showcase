import Image from 'next/image'
import { type Image as SanityImage } from '@sanity/types'
import { useImageUrlBuilder } from 'hooks/useSanityClient'

export default function Avatar({
  name,
  picture,
}: {
  name?: string
  picture?: SanityImage
}) {
  // @ts-expect-error: Figure out if it really matters if the image-builder knows the dataset and projectId
  const urlForImage = useImageUrlBuilder()
  return (
    <div className="flex items-center">
      <div className="relative mr-4 h-12 w-12">
        <Image
          src={
            picture
              ? urlForImage
                  .image(picture)
                  .auto('format')
                  .fit('max')
                  .height(96)
                  .width(96)
                  .fit('crop')
                  .url()
              : 'https://source.unsplash.com/96x96/?face'
          }
          layout="fill"
          className="rounded-full"
          alt={name}
        />
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  )
}
