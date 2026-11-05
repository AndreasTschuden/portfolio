/**
 * Fills the CMS with the portfolio content (EN + DE). The data lives in src/seed/:
 *
 *   technologies.ts  technologies + stack groups on Home
 *   projects.ts      projects with case study and screenshots (seed-assets/projects/<slug>/)
 *   experiences.ts   work experience and education
 *   globals.ts       Home + Site Settings
 *   cv.ts            CV PDFs (seed-assets/cv/, optional)
 *
 * Every run starts from scratch: projects, experiences, technologies, media and CV are
 * deleted first (including their files in S3), then everything is created again.
 * Users and contact submissions are not touched. Changes made in the admin to the seeded
 * collections and globals are lost.
 *
 * Run: pnpm seed     In production: docker compose run --rm --build seed (see DEPLOY.md)
 */
import { getPayload } from 'payload'

import config from './payload.config'
import { seedCV } from './seed/cv'
import { seedExperiences } from './seed/experiences'
import { seedHome, seedSiteSettings } from './seed/globals'
import { clearCollections, uploadMedia } from './seed/helpers'
import { seedProjects } from './seed/projects'
import { seedTechnologies } from './seed/technologies'

const payload = await getPayload({ config })

try {
  // Projects first: they reference technologies and media
  await clearCollections(payload, ['projects', 'experiences', 'technologies', 'cv', 'media'])

  const techIds = await seedTechnologies(payload)
  payload.logger.info(`Seeded ${Object.keys(techIds).length} technologies`)

  const portrait = await uploadMedia(payload, 'hero.png', {
    en: 'Portrait of Andreas Tschuden',
    de: 'Porträt von Andreas Tschuden',
  })

  payload.logger.info(`Seeded ${await seedProjects(payload, techIds)} projects`)
  payload.logger.info(`Seeded ${await seedExperiences(payload)} experiences`)

  await seedHome(payload, techIds, portrait)
  payload.logger.info('Seeded global: home')
  await seedSiteSettings(payload, portrait)
  payload.logger.info('Seeded global: site-settings')

  payload.logger.info(`Seeded ${await seedCV(payload)} CV files`)
} catch (err) {
  payload.logger.error(err)
  process.exitCode = 1
} finally {
  await payload.destroy()
}
