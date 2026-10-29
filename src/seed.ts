/**
 * Seeds the portfolio with the content of the design handoff (EN + DE).
 * Idempotent: technologies are matched by name, projects by slug, experiences by
 * type + startYear, media by filename, so running it again updates instead of duplicating.
 * Images are taken from design_handoff/assets when that folder exists.
 *
 * Run: pnpm seed
 *      SEED_ONLY=technologies pnpm seed   (only technologies + their icons)
 */
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'

import config from './payload.config'
import type { Experience, Project, Technology } from './payload-types'
import { slugify } from './fields/slug'

type Locale = 'en' | 'de'
type L<T = string> = Record<Locale, T>

/** Gives DE array rows the ids of the already stored EN rows so EN values are kept. */
const withIds = <T extends object>(rows: T[], stored?: { id?: string | null }[] | null) =>
  rows.map((row, i) => ({ ...row, id: stored?.[i]?.id ?? undefined }))

// ── Technologies ────────────────────────────────────────────────────────────

type TechSeed = Pick<Technology, 'name' | 'category'> & {
  /** simpleicons.org slug; its logo is in seed-assets/tech-icons/tech-<slug>.svg */
  iconSlug?: string
  /** Monochrome SVG in seed-assets/tech-icons when it isn't tech-<iconSlug>.svg */
  iconFile?: string
}

// JavaScript, TypeScript and Next.js are frontend and backend; category holds one value.
const technologies: TechSeed[] = [
  // Frontend
  { name: 'HTML5', iconSlug: 'html5', category: 'frontend' },
  { name: 'CSS3', iconSlug: 'css', category: 'frontend' },
  { name: 'SCSS', iconSlug: 'sass', category: 'frontend' },
  { name: 'JavaScript', iconSlug: 'javascript', category: 'frontend' },
  { name: 'TypeScript', iconSlug: 'typescript', category: 'frontend' },
  { name: 'Tailwind CSS', iconSlug: 'tailwindcss', category: 'frontend' },
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
  // Backend
  { name: 'PHP', iconSlug: 'php', category: 'backend' },
  { name: 'Node.js', iconSlug: 'nodedotjs', category: 'backend' },
  { name: 'NestJS', iconSlug: 'nestjs', category: 'backend' },
  { name: 'Laravel', iconSlug: 'laravel', category: 'backend' },
  { name: 'REST', iconFile: 'tech-rest.svg', category: 'backend' },
  { name: 'Prisma', iconSlug: 'prisma', category: 'backend' },
  { name: 'Drizzle', iconSlug: 'drizzle', category: 'backend' },
  { name: 'OAuth 2.0', iconFile: 'tech-oauth.svg', category: 'backend' },
  { name: 'Better Auth', iconSlug: 'betterauth', category: 'backend' },
  { name: 'Supabase Auth', iconSlug: 'supabase', category: 'backend' },
  { name: 'Payload CMS', iconSlug: 'payloadcms', category: 'backend' },
  { name: 'WordPress', iconSlug: 'wordpress', category: 'backend' },
  { name: 'FastAPI', iconSlug: 'fastapi', category: 'backend' },
  { name: 'Java', iconSlug: 'openjdk', category: 'backend' },
  { name: 'C#', iconSlug: 'dotnet', category: 'backend' },
  // Database
  { name: 'PostgreSQL', iconSlug: 'postgresql', category: 'database' },
  { name: 'MySQL', iconSlug: 'mysql', category: 'database' },
  { name: 'MariaDB', iconSlug: 'mariadb', category: 'database' },
  { name: 'SQLite', iconSlug: 'sqlite', category: 'database' },
  { name: 'MongoDB', iconSlug: 'mongodb', category: 'database' },
  { name: 'MinIO', iconSlug: 'minio', category: 'database' },
  { name: 'SeaweedFS', iconFile: 'tech-seaweedfs.svg', category: 'database' },
  { name: 'SQL', iconFile: 'tech-sql.svg', category: 'database' },
  // Tools & Deploy
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
  { name: 'Git', iconSlug: 'git', category: 'tools' },
  { name: 'GitHub', iconSlug: 'github', category: 'tools' },
  { name: 'GitLab', iconSlug: 'gitlab', category: 'tools' },
  { name: 'CI/CD', iconFile: 'tech-cicd.svg', category: 'tools' },
  { name: 'Docker', iconSlug: 'docker', category: 'tools' },
  { name: 'Traefik', iconSlug: 'traefikproxy', category: 'tools' },
  { name: 'Vercel', iconSlug: 'vercel', category: 'tools' },
  { name: 'Microsoft Azure', iconFile: 'tech-azure.svg', category: 'tools' },
]

const techIconsDir = path.resolve(process.cwd(), 'seed-assets/tech-icons')

async function seedTechnologies(payload: Payload) {
  const ids: Record<string, string> = {}

  for (const [order, { iconFile, ...tech }] of technologies.entries()) {
    const icon = await seedMedia(
      payload,
      path.join(techIconsDir, iconFile ?? `tech-${tech.iconSlug}.svg`),
      { en: `${tech.name} logo`, de: `${tech.name}-Logo` },
    )
    const data = { ...tech, iconSlug: tech.iconSlug ?? null, icon: icon ?? null, order }
    const { docs } = await payload.find({
      collection: 'technologies',
      where: { name: { equals: tech.name } },
      limit: 1,
    })
    const doc = docs[0]
      ? await payload.update({ collection: 'technologies', id: docs[0].id, data })
      : await payload.create({ collection: 'technologies', data })
    ids[tech.name] = doc.id
  }

  return ids
}

// ── Media ───────────────────────────────────────────────────────────────────
// The budgetly-laptop/phone assets are finished mockup renders, not raw screens, so the
// "A look inside" screens stay empty until real screenshots are uploaded (desktop is required).

const assetsDir = path.resolve(process.cwd(), 'design_handoff/assets')

/** Uploads a file once (matched by filename); returns its id, or undefined if the file is missing. */
async function seedMedia(payload: Payload, filePath: string, alt: L) {
  if (!fs.existsSync(filePath)) return undefined
  const file = path.basename(filePath)

  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: file } },
    limit: 1,
  })
  const doc =
    docs[0] ??
    (await payload.create({ collection: 'media', locale: 'en', data: { alt: alt.en }, filePath }))
  await payload.update({ collection: 'media', id: doc.id, locale: 'de', data: { alt: alt.de } })
  return doc.id
}

type SeedMedia = {
  portrait?: string
}

async function seedAllMedia(payload: Payload): Promise<SeedMedia> {
  return {
    portrait: await seedMedia(payload, path.join(assetsDir, 'hero.png'), {
      en: 'Portrait of Andreas Tschuden',
      de: 'Porträt von Andreas Tschuden',
    }),
  }
}

// ── Projects ────────────────────────────────────────────────────────────────

type ProjectSeed = Pick<Project, 'year' | 'type' | 'status' | 'teamSize'> & {
  title: L
  role: L
  description: L
  caseStudy: { problem: L; solution: L; outcome: L }
  stack: string[]
}

const lorem: L = {
  en: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
  de: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
}

const placeholderDescription: L = {
  en: 'Placeholder: short description of the problem and what you built.',
  de: 'Platzhalter: kurze Beschreibung des Problems und was du gebaut hast.',
}

const project = (
  title: L,
  stack: string[],
  meta: Pick<ProjectSeed, 'year' | 'type' | 'status' | 'teamSize'>,
  role: L,
  description = placeholderDescription,
): ProjectSeed => ({
  title,
  ...meta,
  role,
  description,
  caseStudy: { problem: lorem, solution: lorem, outcome: lorem },
  stack,
})

const projects: ProjectSeed[] = [
  project(
    { en: 'Booking Portal', de: 'Buchungsportal' },
    ['Angular', 'FastAPI', 'PostgreSQL'],
    { year: '2025', type: 'school', status: 'live', teamSize: 4 },
    { en: 'Full-stack', de: 'Full-Stack' },
    {
      en: 'Placeholder: online booking for appointments with an admin dashboard for managing slots and customers.',
      de: 'Platzhalter: Online-Terminbuchung mit Admin-Dashboard zur Verwaltung von Zeitfenstern und Kund:innen.',
    },
  ),
  project(
    { en: 'Project 02', de: 'Projekt 02' },
    ['Next.js', 'Laravel', 'MySQL'],
    { year: '2025', type: 'work', status: 'done', teamSize: 3 },
    { en: 'Front-end', de: 'Frontend' },
  ),
  project(
    { en: 'Project 03', de: 'Projekt 03' },
    ['React', 'NestJS'],
    { year: '2024', type: 'school', status: 'done', teamSize: 2 },
    { en: 'Back-end', de: 'Backend' },
  ),
  project(
    { en: 'Project 04', de: 'Projekt 04' },
    ['Next.js', 'Payload CMS'],
    { year: '2024', type: 'personal', status: 'wip', teamSize: 1 },
    { en: 'Design & Dev', de: 'Design & Dev' },
  ),
  project(
    { en: 'Project 05', de: 'Projekt 05' },
    ['Laravel', 'MySQL'],
    { year: '2023', type: 'school', status: 'done', teamSize: 3 },
    { en: 'Full-stack', de: 'Full-Stack' },
  ),
]

async function seedProjects(payload: Payload, techIds: Record<string, string>) {
  for (const [order, p] of projects.entries()) {
    const slug = slugify(p.title.en)
    const localized = (locale: Locale) => ({
      title: p.title[locale],
      role: p.role[locale],
      description: p.description[locale],
      caseStudy: {
        problem: p.caseStudy.problem[locale],
        solution: p.caseStudy.solution[locale],
        outcome: p.caseStudy.outcome[locale],
      },
    })

    const { docs } = await payload.find({
      collection: 'projects',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const en = {
      ...localized('en'),
      slug,
      order,
      year: p.year,
      type: p.type,
      status: p.status,
      teamSize: p.teamSize,
      technologies: p.stack.map((name) => techIds[name]),
      screens: [],
    }
    const doc = docs[0]
      ? await payload.update({ collection: 'projects', id: docs[0].id, locale: 'en', data: en })
      : await payload.create({ collection: 'projects', locale: 'en', data: en })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'de',
      data: localized('de'),
    })
  }
}

// ── Experiences ─────────────────────────────────────────────────────────────

type ExperienceSeed = Pick<Experience, 'type' | 'startYear' | 'endYear'> & {
  months?: L
  role: L
  organisation: L
  place: L
  description: L
  learned: { kind: 'tech' | 'soft' | 'process'; title: L; text: L }[]
  stack: string[]
}

const experiences: ExperienceSeed[] = [
  {
    type: 'work',
    startYear: '2025',
    endYear: '2025',
    months: { en: 'Jul – Aug', de: 'Jul – Aug' },
    role: { en: 'Web Development Intern', de: 'Praktikant Webentwicklung' },
    organisation: { en: 'Company name', de: 'Firmenname' },
    place: { en: 'City', de: 'Ort' },
    description: {
      en: 'Summer internship in a product team, working on the customer-facing web app and its Laravel API.',
      de: 'Sommerpraktikum in einem Produktteam, Mitarbeit an der Web-App für Kund:innen und der zugehörigen Laravel-API.',
    },
    learned: [
      {
        kind: 'tech',
        title: { en: 'Designing REST APIs', de: 'REST-APIs entwerfen' },
        text: {
          en: 'Structuring endpoints, validation and migrations so the front-end can rely on them.',
          de: 'Endpunkte, Validierung und Migrationen so aufbauen, dass sich das Frontend darauf verlassen kann.',
        },
      },
      {
        kind: 'process',
        title: { en: 'Working in sprints', de: 'Arbeiten in Sprints' },
        text: {
          en: 'Estimating tickets, daily stand-ups and shipping in small, reviewable steps.',
          de: 'Tickets schätzen, Daily Stand-ups und in kleinen, prüfbaren Schritten liefern.',
        },
      },
      {
        kind: 'soft',
        title: { en: 'Asking the right questions', de: 'Die richtigen Fragen stellen' },
        text: {
          en: 'Clarifying requirements early instead of guessing and rebuilding later.',
          de: 'Anforderungen früh klären, statt zu raten und später neu zu bauen.',
        },
      },
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Git'],
  },
  {
    type: 'work',
    startYear: '2024',
    endYear: '2024',
    months: { en: 'Jul – Aug', de: 'Jul – Aug' },
    role: { en: 'Front-end Intern', de: 'Praktikant Frontend' },
    organisation: { en: 'Company name', de: 'Firmenname' },
    place: { en: 'City', de: 'Ort' },
    description: {
      en: 'First professional internship, translating designs into responsive, accessible interfaces.',
      de: 'Erstes Praktikum, Designs in responsive und barrierearme Oberflächen übersetzt.',
    },
    learned: [
      {
        kind: 'tech',
        title: { en: 'Component thinking', de: 'In Komponenten denken' },
        text: {
          en: 'Breaking Figma designs into reusable React components with clear props.',
          de: 'Figma-Designs in wiederverwendbare React-Komponenten mit klaren Props zerlegen.',
        },
      },
      {
        kind: 'process',
        title: { en: 'Code reviews', de: 'Code-Reviews' },
        text: {
          en: 'Giving and receiving feedback on pull requests and keeping commits readable.',
          de: 'Feedback zu Pull Requests geben und annehmen, Commits nachvollziehbar halten.',
        },
      },
    ],
    stack: ['React', 'TypeScript', 'CSS3'],
  },
  {
    type: 'edu',
    startYear: '2022',
    endYear: '2027',
    role: {
      en: 'IT, specialising in advanced web development',
      de: 'Informationstechnologie, Schwerpunkt Webentwicklung',
    },
    organisation: { en: 'HTBLuVA Villach', de: 'HTBLuVA Villach' },
    place: { en: 'Villach', de: 'Villach' },
    description: {
      en: 'Currently in my fourth year. Software engineering, databases, networks and project management, with a focus on modern web development.',
      de: 'Derzeit im vierten Jahrgang. Softwareentwicklung, Datenbanken, Netzwerktechnik und Projektmanagement mit Fokus auf moderne Webentwicklung.',
    },
    learned: [
      {
        kind: 'tech',
        title: { en: 'Software fundamentals', de: 'Software-Grundlagen' },
        text: {
          en: 'Object-oriented programming, data structures and relational databases.',
          de: 'Objektorientierte Programmierung, Datenstrukturen und relationale Datenbanken.',
        },
      },
      {
        kind: 'process',
        title: { en: 'Project management', de: 'Projektmanagement' },
        text: {
          en: 'Planning team projects with real clients, from requirements to delivery.',
          de: 'Teamprojekte mit echten Auftraggebern planen, von den Anforderungen bis zur Abgabe.',
        },
      },
      {
        kind: 'soft',
        title: { en: 'Teamwork', de: 'Teamarbeit' },
        text: {
          en: 'Splitting work, presenting results and owning my part of a shared codebase.',
          de: 'Aufgaben aufteilen, Ergebnisse präsentieren und meinen Teil einer gemeinsamen Codebasis verantworten.',
        },
      },
    ],
    stack: ['Java', 'C#', 'SQL', 'Laravel', 'Next.js'],
  },
]

async function seedExperiences(payload: Payload, techIds: Record<string, string>) {
  for (const [order, e] of experiences.entries()) {
    const localized = (locale: Locale) => ({
      role: e.role[locale],
      organisation: e.organisation[locale],
      place: e.place[locale],
      description: e.description[locale],
      months: e.months?.[locale],
    })
    const learned = (locale: Locale) =>
      e.learned.map((l) => ({ kind: l.kind, title: l.title[locale], text: l.text[locale] }))

    const { docs } = await payload.find({
      collection: 'experiences',
      locale: 'en',
      where: {
        type: { equals: e.type },
        startYear: { equals: e.startYear },
      },
      limit: 1,
    })

    const en = {
      ...localized('en'),
      type: e.type,
      startYear: e.startYear,
      endYear: e.endYear,
      order,
      learned: learned('en'),
      technologies: e.stack.map((name) => techIds[name]),
    }
    const doc = docs[0]
      ? await payload.update({ collection: 'experiences', id: docs[0].id, locale: 'en', data: en })
      : await payload.create({ collection: 'experiences', locale: 'en', data: en })

    await payload.update({
      collection: 'experiences',
      id: doc.id,
      locale: 'de',
      data: { ...localized('de'), learned: withIds(learned('de'), doc.learned) },
    })
  }
}

// ── Globals ─────────────────────────────────────────────────────────────────

async function seedHome(payload: Payload, techIds: Record<string, string>, media: SeedMedia) {
  const role: L = { en: 'UI/UX Designer & Web Developer', de: 'UI/UX-Designer & Webentwickler' }
  // **…** is rendered bold
  const intro: L = {
    en: '― I’m **Tschuden Andreas** a UI/UX Designer & Web Developer',
    de: '― Ich bin **Tschuden Andreas**, UI/UX-Designer & Webentwickler',
  }
  const stats = [
    { value: 5, label: { en: 'Projects completed', de: 'Abgeschlossene Projekte' } },
    { value: 25, label: { en: 'Technologies learned', de: 'Erlernte Technologien' } },
  ]
  const p2: L = {
    en: 'Currently in my fourth year at HTBLuVA Villach, specialising in advanced web development. I move easily between Laravel back‑ends, Next.js front‑ends, and the design layer that ties them together.',
    de: 'Derzeit bin ich im vierten Jahrgang an der HTBLuVA Villach mit Schwerpunkt auf fortgeschrittener Webentwicklung. Ich bewege mich sicher zwischen Laravel-Backends, Next.js-Frontends und der Designebene, die beides verbindet.',
  }
  const paragraphs: L[] = [
    {
      en: "I'm a fullstack developer in training, based in Villach, with three years already spent learning the trade end‑to‑end.",
      de: 'Ich bin Fullstack-Entwickler in Ausbildung aus Villach und lerne das Handwerk seit drei Jahren von Grund auf.',
    },
    p2,
    {
      en: 'Currently in my fourth year at HTBLuVA Villach, specialising in advanced web development. I move easily betw‑ends, Next.js front‑ends, and the design layer that ties them together.',
      de: 'Derzeit bin ich im vierten Jahrgang an der HTBLuVA Villach mit Schwerpunkt auf fortgeschrittener Webentwicklung. Ich bewege mich sicher zwischen Backends, Next.js-Frontends und der Designebene, die beides verbindet.',
    },
  ]
  const serviceText: L = {
    en: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
    de: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed',
  }
  const services = [
    { title: { en: 'Web Development', de: 'Webentwicklung' }, text: serviceText },
    { title: { en: 'UI/UX Design', de: 'UI/UX Design' }, text: serviceText },
    { title: { en: 'Responsive Design', de: 'Responsive Design' }, text: serviceText },
    { title: { en: 'Performance', de: 'Performance' }, text: serviceText },
  ]
  const stackGroups = [
    {
      label: { en: 'Frontend', de: 'Frontend' },
      techs: [
        'HTML5',
        'CSS3',
        'SCSS',
        'JavaScript',
        'TypeScript',
        'Tailwind CSS',
        'React',
        'Next.js',
        'Angular',
        'shadcn/ui',
        'Radix UI',
        'React Hook Form',
        'TanStack Form',
        'Zod',
        'Motion (Framer Motion)',
        'Chart.js',
      ],
    },
    {
      label: { en: 'Backend', de: 'Backend' },
      techs: [
        'JavaScript',
        'TypeScript',
        'PHP',
        'Node.js',
        'NestJS',
        'Next.js',
        'Laravel',
        'REST',
        'Prisma',
        'Drizzle',
        'OAuth 2.0',
        'Better Auth',
        'Supabase Auth',
        'Payload CMS',
        'WordPress',
      ],
    },
    {
      label: { en: 'Database', de: 'Datenbank' },
      techs: ['PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'MongoDB', 'MinIO', 'SeaweedFS'],
    },
    {
      label: { en: 'Tools & Deploy', de: 'Tools & Deploy' },
      techs: [
        'Figma',
        'Claude Design',
        'Claude Code',
        'Codex',
        'ESLint',
        'Biome',
        'Prettier',
        'Git',
        'GitHub',
        'GitLab',
        'CI/CD',
        'Docker',
        'Traefik',
        'Vercel',
        'Microsoft Azure',
      ],
    },
  ]

  const en = await payload.updateGlobal({
    slug: 'home',
    locale: 'en',
    data: {
      hero: {
        role: role.en,
        intro: intro.en,
        portrait: media.portrait,
        stats: stats.map((s) => ({ value: s.value, label: s.label.en })),
      },
      about: { paragraphs: paragraphs.map((p) => ({ text: p.en })) },
      services: services.map((s) => ({ title: s.title.en, text: s.text.en })),
      stackGroups: stackGroups.map((g) => ({
        label: g.label.en,
        technologies: g.techs.map((name) => techIds[name]),
      })),
      projectsIntro: p2.en,
    },
  })

  await payload.updateGlobal({
    slug: 'home',
    locale: 'de',
    data: {
      hero: {
        role: role.de,
        intro: intro.de,
        stats: withIds(
          stats.map((s) => ({ value: s.value, label: s.label.de })),
          en.hero?.stats,
        ),
      },
      about: {
        paragraphs: withIds(
          paragraphs.map((p) => ({ text: p.de })),
          en.about?.paragraphs,
        ),
      },
      services: withIds(
        services.map((s) => ({ title: s.title.de, text: s.text.de })),
        en.services,
      ),
      stackGroups: withIds(
        stackGroups.map((g) => ({
          label: g.label.de,
          technologies: g.techs.map((name) => techIds[name]),
        })),
        en.stackGroups,
      ),
      projectsIntro: p2.de,
    },
  })
}

async function seedSiteSettings(payload: Payload) {
  const headline = [
    { en: 'Want to', de: 'Lust auf' },
    { en: 'talk to me?', de: 'ein Gespräch?' },
    { en: 'Get in touch.', de: 'Melde dich.' },
  ]

  const en = await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      name: 'Andreas Tschuden',
      phone: '+43 680 1201010',
      email: 'atschuden62@gmail.com',
      contactHeadline: headline.map((h) => ({ line: h.en })),
      contactFormNote: 'I aim to reply within 1 business day.',
      seo: {
        title: 'Andreas Tschuden · UI/UX Designer & Web Developer',
        description:
          'Portfolio of Andreas Tschuden, UI/UX designer and web developer from Villach, Austria.',
      },
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'de',
    data: {
      contactHeadline: withIds(
        headline.map((h) => ({ line: h.de })),
        en.contactHeadline,
      ),
      contactFormNote: 'Ich antworte innerhalb von 1 Werktag.',
      seo: {
        title: 'Andreas Tschuden · UI/UX-Designer & Webentwickler',
        description:
          'Portfolio von Andreas Tschuden, UI/UX-Designer und Webentwickler aus Villach, Österreich.',
      },
    },
  })
}

// ── Run ─────────────────────────────────────────────────────────────────────

const payload = await getPayload({ config })

try {
  const techIds = await seedTechnologies(payload)
  payload.logger.info(`Seeded ${Object.keys(techIds).length} technologies`)
  if (process.env.SEED_ONLY !== 'technologies') {
    const media = await seedAllMedia(payload)
    payload.logger.info(`Seeded ${Object.values(media).filter(Boolean).length} media files`)
    await seedProjects(payload, techIds)
    payload.logger.info(`Seeded ${projects.length} projects`)
    await seedExperiences(payload, techIds)
    payload.logger.info(`Seeded ${experiences.length} experiences`)
    await seedHome(payload, techIds, media)
    await seedSiteSettings(payload)
    payload.logger.info('Seeded globals: home, site-settings')
  }
} catch (err) {
  payload.logger.error(err)
  process.exitCode = 1
} finally {
  await payload.destroy()
}
