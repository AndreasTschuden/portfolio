/**
 * Technologies and the four stack groups on Home (Frontend, Backend, Database,
 * Tools & Deploy), based on "Technologies & Tools" plus the technologies used in the projects.
 */
import type { Payload } from 'payload'

import type { Technology } from '../payload-types'
import { type L, uploadMedia } from './helpers'

type TechSeed = Pick<Technology, 'name' | 'category'> & {
  /** simpleicons.org slug; its logo is seed-assets/tech-icons/tech-<slug>.svg */
  iconSlug?: string
  /** Monochrome SVG in seed-assets/tech-icons when it isn't tech-<iconSlug>.svg */
  iconFile?: string
}

// Array order = order on the site. JavaScript, TypeScript and Next.js are used on both
// sides; their category is frontend, but they also appear in the Backend group below.
export const technologies: TechSeed[] = [
  // Frontend
  { name: 'HTML5', iconSlug: 'html5', category: 'frontend' },
  { name: 'CSS3', iconSlug: 'css', category: 'frontend' },
  { name: 'SCSS', iconSlug: 'sass', category: 'frontend' },
  { name: 'JavaScript', iconSlug: 'javascript', category: 'frontend' },
  { name: 'TypeScript', iconSlug: 'typescript', category: 'frontend' },
  { name: 'Tailwind CSS', iconSlug: 'tailwindcss', category: 'frontend' },
  { name: 'daisyUI', iconSlug: 'daisyui', category: 'frontend' },
  { name: 'React', iconSlug: 'react', category: 'frontend' },
  { name: 'Next.js', iconSlug: 'nextdotjs', category: 'frontend' },
  { name: 'Angular', iconSlug: 'angular', category: 'frontend' },
  { name: 'shadcn/ui', iconSlug: 'shadcnui', category: 'frontend' },
  { name: 'Radix UI', iconSlug: 'radixui', category: 'frontend' },
  { name: 'React Hook Form', iconSlug: 'reacthookform', category: 'frontend' },
  { name: 'TanStack Form', iconSlug: 'tanstack', category: 'frontend' },
  { name: 'Zod', iconSlug: 'zod', category: 'frontend' },
  { name: 'Motion (Framer Motion)', iconFile: 'tech-motion.svg', category: 'frontend' },
  { name: 'Chart.js', iconSlug: 'chartdotjs', category: 'frontend' },
  // Backend (incl. auth, payments and CMS)
  { name: 'PHP', iconSlug: 'php', category: 'backend' },
  { name: 'Node.js', iconSlug: 'nodedotjs', category: 'backend' },
  { name: 'NestJS', iconSlug: 'nestjs', category: 'backend' },
  { name: 'Laravel', iconSlug: 'laravel', category: 'backend' },
  { name: 'REST', iconFile: 'tech-rest.svg', category: 'backend' },
  { name: 'Prisma', iconSlug: 'prisma', category: 'backend' },
  { name: 'Drizzle', iconSlug: 'drizzle', category: 'backend' },
  { name: 'Supabase', iconSlug: 'supabase', category: 'backend' },
  { name: 'OAuth 2.0', iconFile: 'tech-oauth.svg', category: 'backend' },
  { name: 'Better Auth', iconSlug: 'betterauth', category: 'backend' },
  { name: 'Supabase Auth', iconSlug: 'supabase', category: 'backend' },
  { name: 'Stripe', iconSlug: 'stripe', category: 'backend' },
  { name: 'Payload CMS', iconSlug: 'payloadcms', category: 'backend' },
  { name: 'WordPress', iconSlug: 'wordpress', category: 'backend' },
  // Database (incl. object storage)
  { name: 'PostgreSQL', iconSlug: 'postgresql', category: 'database' },
  { name: 'MySQL', iconSlug: 'mysql', category: 'database' },
  { name: 'MariaDB', iconSlug: 'mariadb', category: 'database' },
  { name: 'SQLite', iconSlug: 'sqlite', category: 'database' },
  { name: 'MongoDB', iconSlug: 'mongodb', category: 'database' },
  { name: 'MinIO', iconSlug: 'minio', category: 'database' },
  { name: 'SeaweedFS', iconFile: 'tech-seaweedfs.svg', category: 'database' },
  // Tools & Deploy (design, AI, code quality, version control, infrastructure)
  { name: 'Figma', iconSlug: 'figma', category: 'tools' },
  {
    name: 'Claude Design',
    iconSlug: 'claude',
    iconFile: 'tech-claude-design.svg',
    category: 'tools',
  },
  { name: 'Claude Code', iconSlug: 'claude', iconFile: 'tech-claude-code.svg', category: 'tools' },
  { name: 'Codex', iconFile: 'tech-codex.svg', category: 'tools' },
  { name: 'ESLint', iconSlug: 'eslint', category: 'tools' },
  { name: 'Biome', iconSlug: 'biome', category: 'tools' },
  { name: 'Prettier', iconSlug: 'prettier', category: 'tools' },
  { name: 'Turborepo', iconSlug: 'turborepo', category: 'tools' },
  { name: 'Git', iconSlug: 'git', category: 'tools' },
  { name: 'GitHub', iconSlug: 'github', category: 'tools' },
  { name: 'GitLab', iconSlug: 'gitlab', category: 'tools' },
  { name: 'CI/CD', iconFile: 'tech-cicd.svg', category: 'tools' },
  { name: 'Docker', iconSlug: 'docker', category: 'tools' },
  { name: 'Traefik', iconSlug: 'traefikproxy', category: 'tools' },
  { name: 'Vercel', iconSlug: 'vercel', category: 'tools' },
  { name: 'Microsoft Azure', iconFile: 'tech-azure.svg', category: 'tools' },
]

const groupLabels: Record<NonNullable<TechSeed['category']>, L> = {
  frontend: { en: 'Frontend', de: 'Frontend' },
  backend: { en: 'Backend', de: 'Backend' },
  database: { en: 'Database', de: 'Datenbank' },
  tools: { en: 'Tools & Deploy', de: 'Tools & Deploy' },
}

/** Technologies that also show up in a second group on Home. */
const alsoIn: Partial<Record<NonNullable<TechSeed['category']>, string[]>> = {
  backend: ['JavaScript', 'TypeScript', 'Next.js'],
}

/** The four groups on Home, built from the categories above. */
export const stackGroups: { label: L; techs: string[] }[] = (
  Object.keys(groupLabels) as NonNullable<TechSeed['category']>[]
).map((category) => ({
  label: groupLabels[category],
  techs: [
    ...(alsoIn[category] ?? []),
    ...technologies.filter((t) => t.category === category).map((t) => t.name),
  ],
}))

/** Creates all technologies with their logos; returns name → id. */
export async function seedTechnologies(payload: Payload) {
  const ids: Record<string, string> = {}

  for (const [order, { iconFile, ...tech }] of technologies.entries()) {
    const icon = await uploadMedia(
      payload,
      `tech-icons/${iconFile ?? `tech-${tech.iconSlug}.svg`}`,
      {
        en: `${tech.name} logo`,
        de: `${tech.name}-Logo`,
      },
    )
    const doc = await payload.create({
      collection: 'technologies',
      data: { ...tech, iconSlug: tech.iconSlug ?? null, icon, order },
    })
    ids[tech.name] = doc.id
  }

  return ids
}

/** Looks up technology ids by name and fails loudly on a typo. */
export const techRefs = (ids: Record<string, string>, names: string[]) =>
  names.map((name) => {
    const id = ids[name]
    if (!id) throw new Error(`Unknown technology "${name}" (add it to src/seed/technologies.ts)`)
    return id
  })
