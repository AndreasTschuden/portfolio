import Image from 'next/image'

import type { MediaImage } from '@/lib/media'

type Props = {
  image: MediaImage
  alt: string
  sizes: string
  priority?: boolean
}

/** Laptop mockup as wide as its parent; the screen takes the image's aspect ratio, so it is shown whole. */
export function LaptopFrame({ image, alt, sizes, priority = false }: Props) {
  return (
    <div className="relative w-full pt-[2%]">
      <div className="relative mx-[7%] rounded-[10px_10px_3px_3px] bg-device px-[1.4%] pt-[1.4%] pb-[1.9%] shadow-[inset_0_0_0_1.5px_var(--color-bezel)] md:rounded-[18px_18px_4px_4px]">
        <div className="absolute top-[.45%] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-bezel" />
        <div
          className="relative overflow-hidden rounded-[4px] bg-mist"
          style={{ aspectRatio: image.ratio ?? 16 / 10 }}
        >
          <Image
            src={image.src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </div>
      <div className="relative aspect-[929/17] w-full rounded-b-[8px] bg-[linear-gradient(rgb(214_220_228),rgb(168_178_192))] shadow-[0_30px_40px_-18px_rgb(17_42_70/.35)] md:rounded-b-[14px]">
        <div className="absolute top-0 left-1/2 h-[45%] w-[15%] -translate-x-1/2 rounded-b-lg bg-[rgb(150_160_175)]" />
      </div>
    </div>
  )
}
