import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const LOGO_PATH =
  'M 2.949 34.884 C 4.61 34.599 10.595 35.587 11.794 34.084 L 20.415 25.983 C 21.796 24.681 24.039 25.008 24.985 26.644 L 28.959 33.492 C 30.024 35.907 35.134 34.64 37.089 34.891 C 39.36 34.863 40.748 32.399 39.577 30.465 L 26.989 9.621 C 23.709 5.285 20.702 11.514 19.139 13.963 C 17.583 16.309 21.396 19.538 18.004 21.236 C 15.425 22.635 12.6 19.823 14.016 17.269 L 21.011 4.617 C 22.91 1.276 17.317 -2.037 15.488 1.554 L 0.334 30.618 C -0.682 32.56 0.741 34.884 2.949 34.884 Z'

export const Logo = ({ width = 40, height = 35, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 40.002 35.004"
    fill="currentColor"
    aria-hidden
    {...props}
  >
    <path d={LOGO_PATH} />
  </svg>
)

/** ↗ in a 17×17 box, used for most links. */
export const ArrowUpRight = ({ size = 17, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 17"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    aria-hidden
    {...props}
  >
    <path d="M5 12L12 5M6 5h6v6" />
  </svg>
)

/** Large ↗ of the "Next" teaser. */
export const ArrowUpRightLarge = (props: IconProps) => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden
    {...props}
  >
    <path d="M14.583 35.416L35.416 14.583M18 14.583h17.416V32" />
  </svg>
)

export const ArrowDown = (props: IconProps) => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    aria-hidden
    {...props}
  >
    <path d="M8.5 3.5v10M4 9l4.5 4.5L13 9" />
  </svg>
)

export const ArrowBack = (props: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <path d="M22 12H2M6 8l-4 4 4 4" />
  </svg>
)
