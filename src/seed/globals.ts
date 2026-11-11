/** Home and Site Settings, from "Personal Data", the CV and the project / experience data. */
import type { Payload } from 'payload'

import { type L, withIds } from './helpers'
import { stackGroups, techRefs, technologies } from './technologies'
import { projects } from './projects'

export async function seedHome(
  payload: Payload,
  techIds: Record<string, string>,
  portrait: string,
) {
  const role: L = {
    en: 'Fullstack Developer & UI/UX Designer',
    de: 'Fullstack-Entwickler & UI/UX-Designer',
  }
  // **…** is rendered bold
  const intro: L = {
    en: '― I’m **Andreas Tschuden**, a Fullstack Developer & UI/UX Designer',
    de: '― Ich bin **Andreas Tschuden**, Fullstack-Entwickler & UI/UX-Designer',
  }
  // Counted from the seed data, so they stay correct when projects or technologies change
  const stats = [
    { value: projects.length, label: { en: 'Projects completed', de: 'Umgesetzte Projekte' } },
    {
      value: technologies.length,
      label: { en: 'Technologies & tools', de: 'Technologien & Tools' },
    },
  ]
  const paragraphs: L[] = [
    {
      en: 'I’m a full-stack developer from Carinthia with a curious mindset, strong team spirit and a passion for learning new technologies and improving continuously.',
      de: 'Ich bin Fullstack-Entwickler aus Kärnten mit einer neugierigen Art, ausgeprägtem Teamgeist und Freude daran, neue Technologien zu lernen und mich ständig zu verbessern.',
    },
    {
      en: 'Currently in my final year at HTL Villach, specialising in advanced web development. I move between Next.js and Angular front-ends, NestJS and Laravel back-ends, and the Figma designs that tie them together.',
      de: 'Derzeit bin ich im letzten Jahrgang der HTL Villach mit Schwerpunkt Advanced Web Development. Ich bewege mich zwischen Next.js- und Angular-Frontends, NestJS- und Laravel-Backends und den Figma-Designs, die beides verbinden.',
    },
    {
      en: 'Two internships at Elin and a summer as a developer at feratel showed me how real teams work. My goal is software that feels as good as it works.',
      de: 'Zwei Praktika bei Elin und ein Sommer als Entwickler bei feratel haben mir gezeigt, wie echte Teams arbeiten. Mein Ziel ist Software, die sich so gut anfühlt, wie sie funktioniert.',
    },
  ]
  const services = [
    {
      title: { en: 'UI/UX Design', de: 'UI/UX Design' },
      text: {
        en: 'Wireframes, user flows and interfaces in Figma, designed around real users before the first line of code.',
        de: 'Wireframes, User Flows und Oberflächen in Figma, auf echte Nutzer ausgerichtet, bevor die erste Zeile Code entsteht.',
      },
    },
    {
      title: { en: 'Frontend Development', de: 'Frontend-Entwicklung' },
      text: {
        en: 'Responsive interfaces with Next.js, React and Angular, with validated forms, charts and smooth interactions.',
        de: 'Responsive Oberflächen mit Next.js, React und Angular, mit validierten Formularen, Diagrammen und flüssigen Interaktionen.',
      },
    },
    {
      title: { en: 'Backend & CMS', de: 'Backend & CMS' },
      text: {
        en: 'APIs with NestJS, Next.js and Laravel, secure authentication, Prisma or Drizzle on PostgreSQL, and headless CMS setups.',
        de: 'APIs mit NestJS, Next.js und Laravel, sichere Authentifizierung, Prisma oder Drizzle auf PostgreSQL und Headless-CMS-Setups.',
      },
    },
    {
      title: { en: 'Deployment', de: 'Deployment' },
      text: {
        en: 'Docker, Traefik and CI/CD pipelines that take a project from Git to a running server.',
        de: 'Docker, Traefik und CI/CD-Pipelines, die ein Projekt aus Git auf einen laufenden Server bringen.',
      },
    },
  ]
  const projectsIntro: L = {
    en: 'A selection of school and personal projects, from Figma prototypes to full-stack apps with authentication, payments and dashboards.',
    de: 'Eine Auswahl an Schul- und eigenen Projekten, von Figma-Prototypen bis zu Full-Stack-Apps mit Authentifizierung, Zahlungen und Dashboards.',
  }

  const groups = stackGroups.map((g) => ({
    label: g.label,
    technologies: techRefs(techIds, g.techs),
  }))

  const en = await payload.updateGlobal({
    slug: 'home',
    locale: 'en',
    data: {
      hero: {
        role: role.en,
        intro: intro.en,
        portrait,
        stats: stats.map((s) => ({ value: s.value, label: s.label.en })),
      },
      about: { paragraphs: paragraphs.map((p) => ({ text: p.en })) },
      services: services.map((s) => ({ title: s.title.en, text: s.text.en })),
      stackGroups: groups.map((g) => ({ label: g.label.en, technologies: g.technologies })),
      projectsIntro: projectsIntro.en,
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
        groups.map((g) => ({ label: g.label.de, technologies: g.technologies })),
        en.stackGroups,
      ),
      projectsIntro: projectsIntro.de,
    },
  })
}

export async function seedSiteSettings(payload: Payload, ogImage: string) {
  const headline = [
    { en: 'Want to', de: 'Lust auf' },
    { en: 'talk to me?', de: 'ein Gespräch?' },
    { en: 'Get in touch', de: 'Melde dich' },
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
        title: 'Andreas Tschuden · Fullstack Developer & UI/UX Designer',
        description:
          'Portfolio of Andreas Tschuden, full-stack developer and UI/UX designer from Carinthia, Austria. Projects with Next.js, Angular, NestJS and Figma.',
        ogImage,
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
        title: 'Andreas Tschuden · Fullstack-Entwickler & UI/UX-Designer',
        description:
          'Portfolio von Andreas Tschuden, Fullstack-Entwickler und UI/UX-Designer aus Kärnten. Projekte mit Next.js, Angular, NestJS und Figma.',
      },
    },
  })
}
