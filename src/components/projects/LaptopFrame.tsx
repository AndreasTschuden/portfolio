import Image from 'next/image'

type Props = {
  src: string | null
  alt: string
  sizes: string
  priority?: boolean
}

/** Laptop mockup filling its (absolutely positioned) parent, ~929/603. Screen shows `src`. */
export function LaptopFrame({ src, alt, sizes, priority = false }: Props) {
  return (
    <>
      <div className="absolute top-[3%] left-[7%] h-[85%] w-[86%] rounded-[10px_10px_3px_3px] bg-device md:rounded-[18px_18px_4px_4px] px-[1.6%] pt-[1.6%] pb-[2.2%] shadow-[inset_0_0_0_1.5px_var(--color-bezel)]">
        <div className="absolute top-[.8%] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-bezel" />
        <div className="relative size-full overflow-hidden rounded-[4px] bg-mist">
          {src && (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover"
            />
          )}
        </div>
      </div>
      <div className="absolute inset-x-0 top-[88%] h-[3.2%] rounded-b-[8px] md:h-[2.4%] md:rounded-b-[14px] bg-[linear-gradient(rgb(214_220_228),rgb(168_178_192))] shadow-[0_30px_40px_-18px_rgb(17_42_70/.35)]">
        <div className="absolute top-0 left-1/2 h-[45%] w-[15%] -translate-x-1/2 rounded-b-lg bg-[rgb(150_160_175)]" />
      </div>
    </>
  )
}
