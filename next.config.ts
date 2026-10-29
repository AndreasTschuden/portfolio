import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (see Dockerfile)
  output: 'standalone',
  // Lets phones/tablets on the local network load the dev server's JS (e.g. http://10.0.0.17:3000).
  // Without it Next blocks the dev chunks, the page never hydrates and the loader stays up.
  allowedDevOrigins: ['10.*.*.*', '192.168.*.*', '172.16.*.*'],
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // The site lives under /[locale]; / goes to the default locale.
  redirects: async () => [{ source: '/', destination: '/en', permanent: false }],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
