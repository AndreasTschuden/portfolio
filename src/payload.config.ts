import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Technologies } from './collections/Technologies'
import { Experiences } from './collections/Experiences'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { CV } from './collections/CV'
import { Home } from './globals/Home'
import { SiteSettings } from './globals/SiteSettings'

import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const siteURL = process.env.NEXT_PUBLIC_SITE_URL

export default buildConfig({
  // Auth cookies are only accepted from our own origin. (No serverURL: it would make
  // upload URLs absolute, which next/image rejects.)
  csrf: siteURL ? [siteURL] : [],
  // The site reads data through the Local API and the admin uses REST; GraphQL is unused.
  graphQL: { disable: true },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Projects, Experiences, Technologies, ContactSubmissions, Media, CV, Users],
  globals: [Home, SiteSettings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Deutsch', code: 'de' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  // Without RESEND_API_KEY (e.g. in dev) Payload writes emails to the console instead.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.RESEND_FROM_EMAIL || '',
        defaultFromName: process.env.RESEND_FROM_NAME || 'Portfolio',
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true,
        cv: true,
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT!,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: process.env.S3_REGION!,
        forcePathStyle: true,
      },
    }),
  ],
})
