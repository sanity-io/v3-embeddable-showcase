import Image from 'next/image'
import { type Image as SanityImage } from '@sanity/types'
import { urlForImage } from 'hooks/useSanityClient'

export default function Avatar({
  name,
  picture,
}: {
  name?: string
  picture?: SanityImage
}) {
  return (
    <div className="flex items-center">
      <div className="relative mr-4 h-12 w-12">
        <Image
          src={
            picture
              ? urlForImage(picture).height(96).width(96).fit('crop').url()
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
