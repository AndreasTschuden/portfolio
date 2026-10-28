/**
 * Seeds the portfolio with placeholder content (EN + DE).
 * Idempotent: technologies are matched by name, projects by slug, experiences by
 * type + startYear + organisation, so running it again updates instead of duplicating.
 *
 * Run: pnpm seed
 */
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

const technologies: Pick<Technology, 'name' | 'iconSlug' | 'category'>[] = [
  { name: 'Angular', iconSlug: 'angular', category: 'frontend' },
  { name: 'React', iconSlug: 'react', category: 'frontend' },
  { name: 'Next.js', iconSlug: 'nextdotjs', category: 'frontend' },
  { name: 'TypeScript', iconSlug: 'typescript', category: 'frontend' },
  { name: 'CSS', iconSlug: 'css', category: 'frontend' },
  { name: 'FastAPI', iconSlug: 'fastapi', category: 'backend' },
  { name: 'NestJS', iconSlug: 'nestjs', category: 'backend' },
  { name: 'Laravel', iconSlug: 'laravel', category: 'backend' },
  { name: 'PHP', iconSlug: 'php', category: 'backend' },
  { name: 'Java', iconSlug: 'openjdk', category: 'backend' },
  { name: 'C#', iconSlug: 'dotnet', category: 'backend' },
  { name: 'Payload CMS', iconSlug: 'payloadcms', category: 'backend' },
  { name: 'PostgreSQL', iconSlug: 'postgresql', category: 'database' },
  { name: 'MySQL', iconSlug: 'mysql', category: 'database' },
  { name: 'SQL', iconSlug: 'sqlite', category: 'database' },
  { name: 'Git', iconSlug: 'git', category: 'tools' },
]

async function seedTechnologies(payload: Payload) {
  const ids: Record<string, string> = {}

  for (const [order, tech] of technologies.entries()) {
    const data = { ...tech, order }
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

// ── Projects ────────────────────────────────────────────────────────────────

type ProjectSeed = Pick<Project, 'year' | 'type' | 'status' | 'teamSize' | 'featured'> & {
  title: L
  role: L
  description: L
  caseStudy: { problem: L; solution: L; outcome: L }
  screens: { label: L }[]
  stack: string[]
}

const placeholderProject = (n: number, stack: string[], year: string): ProjectSeed => ({
  title: { en: `Project ${String(n).padStart(2, '0')}`, de: `Projekt ${String(n).padStart(2, '0')}` },
  year,
  type: n % 2 === 0 ? 'school' : 'personal',
  status: 'done',
  teamSize: n % 2 === 0 ? 3 : 1,
  featured: n <= 3,
  role: { en: 'Full-stack', de: 'Full-Stack' },
  description: {
    en: 'Placeholder description. A short summary of the project for cards and the intro.',
    de: 'Platzhalter-Beschreibung. Eine kurze Zusammenfassung des Projekts für Karten und Intro.',
  },
  caseStudy: {
    problem: { en: 'Placeholder: the problem.', de: 'Platzhalter: das Problem.' },
    solution: { en: 'Placeholder: the solution.', de: 'Platzhalter: die Lösung.' },
    outcome: { en: 'Placeholder: the outcome.', de: 'Platzhalter: das Ergebnis.' },
  },
  screens: [],
  stack,
})

const projects: ProjectSeed[] = [
  {
    title: { en: 'Booking Portal', de: 'Buchungsportal' },
    year: '2025',
    type: 'work',
    status: 'live',
    teamSize: 1,
    featured: true,
    role: { en: 'Full-stack', de: 'Full-Stack' },
    description: {
      en: 'A booking portal that lets guests check availability and reserve in a few steps.',
      de: 'Ein Buchungsportal, über das Gäste Verfügbarkeiten prüfen und in wenigen Schritten reservieren.',
    },
    caseStudy: {
      problem: {
        en: 'Bookings were handled by phone and email, which was slow and error-prone.',
        de: 'Buchungen liefen über Telefon und E-Mail – langsam und fehleranfällig.',
      },
      solution: {
        en: 'A web app with live availability, an admin dashboard and automatic confirmations.',
        de: 'Eine Web-App mit Live-Verfügbarkeit, Admin-Dashboard und automatischen Bestätigungen.',
      },
      outcome: {
        en: 'Fewer manual requests and a clear overview of all bookings.',
        de: 'Weniger manuelle Anfragen und ein klarer Überblick über alle Buchungen.',
      },
    },
    screens: [
      { label: { en: 'Booking flow', de: 'Buchungsablauf' } },
      { label: { en: 'Admin dashboard', de: 'Admin-Dashboard' } },
    ],
    stack: ['Next.js', 'TypeScript', 'Payload CMS', 'PostgreSQL'],
  },
  placeholderProject(2, ['Angular', 'NestJS', 'PostgreSQL'], '2025'),
  placeholderProject(3, ['React', 'FastAPI', 'PostgreSQL'], '2024'),
  placeholderProject(4, ['Laravel', 'PHP', 'MySQL'], '2024'),
  placeholderProject(5, ['Java', 'SQL'], '2023'),
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
      featured: p.featured,
      year: p.year,
      type: p.type,
      status: p.status,
      teamSize: p.teamSize,
      technologies: p.stack.map((name) => techIds[name]),
      screens: p.screens.map((s) => ({ label: s.label.en })),
    }
    const doc = docs[0]
      ? await payload.update({ collection: 'projects', id: docs[0].id, locale: 'en', data: en })
      : await payload.create({ collection: 'projects', locale: 'en', data: en })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'de',
      data: {
        ...localized('de'),
        screens: withIds(
          p.screens.map((s) => ({ label: s.label.de })),
          doc.screens,
        ),
      },
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
    role: { en: 'Software Development Intern', de: 'Praktikant Softwareentwicklung' },
    organisation: { en: 'Company (placeholder)', de: 'Firma (Platzhalter)' },
    place: { en: 'Villach, Austria', de: 'Villach, Österreich' },
    description: {
      en: 'Placeholder: worked on a full-stack web application in a small team.',
      de: 'Platzhalter: Mitarbeit an einer Full-Stack-Webanwendung in einem kleinen Team.',
    },
    learned: [
      {
        kind: 'tech',
        title: { en: 'Production code', de: 'Produktivcode' },
        text: {
          en: 'Shipping features in an existing codebase.',
          de: 'Features in einer bestehenden Codebasis ausliefern.',
        },
      },
      {
        kind: 'process',
        title: { en: 'Code reviews', de: 'Code Reviews' },
        text: {
          en: 'Working with pull requests and feedback.',
          de: 'Arbeiten mit Pull Requests und Feedback.',
        },
      },
    ],
    stack: ['Next.js', 'TypeScript', 'Git'],
  },
  {
    type: 'work',
    startYear: '2024',
    endYear: '2024',
    months: { en: 'Jul – Aug', de: 'Jul – Aug' },
    role: { en: 'Web Development Intern', de: 'Praktikant Webentwicklung' },
    organisation: { en: 'Company (placeholder)', de: 'Firma (Platzhalter)' },
    place: { en: 'Carinthia, Austria', de: 'Kärnten, Österreich' },
    description: {
      en: 'Placeholder: built and maintained websites and internal tools.',
      de: 'Platzhalter: Websites und interne Tools gebaut und gewartet.',
    },
    learned: [
      {
        kind: 'soft',
        title: { en: 'Communication', de: 'Kommunikation' },
        text: {
          en: 'Clarifying requirements directly with the team.',
          de: 'Anforderungen direkt mit dem Team abklären.',
        },
      },
    ],
    stack: ['Laravel', 'PHP', 'MySQL'],
  },
  {
    type: 'edu',
    startYear: '2022',
    endYear: '2027',
    role: { en: 'Information Technology', de: 'Informationstechnologie' },
    organisation: { en: 'HTBLuVA Villach', de: 'HTBLuVA Villach' },
    place: { en: 'Villach, Austria', de: 'Villach, Österreich' },
    description: {
      en: 'Advanced Web Development · Diploma underway.',
      de: 'Advanced Web Development · Diplom in Arbeit.',
    },
    learned: [],
    stack: ['Java', 'C#', 'SQL', 'Angular'],
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
        organisation: { equals: e.organisation.en },
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

async function seedHome(payload: Payload, techIds: Record<string, string>) {
  const stats = [
    { value: 4, label: { en: 'Years of coding', de: 'Jahre Programmieren' } },
    { value: 5, label: { en: 'Projects', de: 'Projekte' } },
    { value: 2, label: { en: 'Internships', de: 'Praktika' } },
  ]
  const paragraphs = [
    {
      en: 'Placeholder: who I am and what I care about when building for the web.',
      de: 'Platzhalter: wer ich bin und worauf ich beim Entwickeln fürs Web achte.',
    },
    {
      en: 'Placeholder: what I am currently learning and working on.',
      de: 'Platzhalter: was ich gerade lerne und woran ich arbeite.',
    },
  ]
  const services = [
    {
      title: { en: 'Web Apps', de: 'Web-Apps' },
      text: { en: 'Full-stack applications from idea to deployment.', de: 'Full-Stack-Anwendungen von der Idee bis zum Deployment.' },
    },
    {
      title: { en: 'Websites', de: 'Websites' },
      text: { en: 'Fast, responsive sites with a CMS.', de: 'Schnelle, responsive Websites mit CMS.' },
    },
    {
      title: { en: 'APIs', de: 'APIs' },
      text: { en: 'Clean REST APIs and database design.', de: 'Saubere REST-APIs und Datenbankdesign.' },
    },
    {
      title: { en: 'UI Design', de: 'UI-Design' },
      text: { en: 'Interfaces that are clear and easy to use.', de: 'Oberflächen, die klar und einfach zu bedienen sind.' },
    },
  ]
  const stackGroups = [
    { label: { en: 'Frontend', de: 'Frontend' }, category: 'frontend' },
    { label: { en: 'Backend', de: 'Backend' }, category: 'backend' },
    { label: { en: 'Database', de: 'Datenbank' }, category: 'database' },
    { label: { en: 'Tools', de: 'Tools' }, category: 'tools' },
  ]
  const techIdsByCategory = (category: string) =>
    technologies.filter((t) => t.category === category).map((t) => techIds[t.name])

  const en = await payload.updateGlobal({
    slug: 'home',
    locale: 'en',
    data: {
      hero: {
        role: 'Full-stack Developer',
        intro: 'Placeholder intro: I build web applications with a focus on clean code and good UX.',
        stats: stats.map((s) => ({ value: s.value, label: s.label.en })),
      },
      about: { paragraphs: paragraphs.map((p) => ({ text: p.en })) },
      services: services.map((s) => ({ title: s.title.en, text: s.text.en })),
      stackGroups: stackGroups.map((g) => ({
        label: g.label.en,
        technologies: techIdsByCategory(g.category),
      })),
      projectsIntro: 'Placeholder: a selection of school, work and personal projects.',
    },
  })

  await payload.updateGlobal({
    slug: 'home',
    locale: 'de',
    data: {
      hero: {
        role: 'Full-Stack-Entwickler',
        intro:
          'Platzhalter-Intro: Ich entwickle Webanwendungen mit Fokus auf sauberen Code und gute UX.',
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
          technologies: techIdsByCategory(g.category),
        })),
        en.stackGroups,
      ),
      projectsIntro: 'Platzhalter: eine Auswahl an Schul-, Arbeits- und privaten Projekten.',
    },
  })
}

async function seedSiteSettings(payload: Payload) {
  const headline = [
    { en: "Let's build", de: 'Lass uns' },
    { en: 'something together.', de: 'gemeinsam etwas bauen.' },
  ]

  const en = await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: {
      name: 'Andreas Tschuden',
      phone: '+43 000 0000000',
      email: 'hello@example.com',
      contactHeadline: headline.map((h) => ({ line: h.en })),
      contactFormNote: 'I usually reply within two working days.',
      seo: {
        title: 'Andreas Tschuden · Full-stack Developer',
        description: 'Portfolio of Andreas Tschuden, full-stack developer from Villach, Austria.',
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
      contactFormNote: 'Ich antworte normalerweise innerhalb von zwei Werktagen.',
      seo: {
        title: 'Andreas Tschuden · Full-Stack-Entwickler',
        description: 'Portfolio von Andreas Tschuden, Full-Stack-Entwickler aus Villach, Österreich.',
      },
    },
  })
}

// ── Run ─────────────────────────────────────────────────────────────────────

const payload = await getPayload({ config })

try {
  const techIds = await seedTechnologies(payload)
  payload.logger.info(`Seeded ${Object.keys(techIds).length} technologies`)
  await seedProjects(payload, techIds)
  payload.logger.info(`Seeded ${projects.length} projects`)
  await seedExperiences(payload, techIds)
  payload.logger.info(`Seeded ${experiences.length} experiences`)
  await seedHome(payload, techIds)
  await seedSiteSettings(payload)
  payload.logger.info('Seeded globals: home, site-settings')
} catch (err) {
  payload.logger.error(err)
  process.exitCode = 1
} finally {
  await payload.destroy()
}
