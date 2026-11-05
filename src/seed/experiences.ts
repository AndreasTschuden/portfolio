/**
 * Work experience ("Experiences.docx") and education ("Education.docx").
 * Corrections against the source: the feratel end date 09/2025 is read as 09/2026,
 * and HTL Villach is shown as ongoing (endYear empty → "Today").
 */
import type { Payload } from 'payload'

import type { Experience } from '../payload-types'
import { type L, type Locale, withIds } from './helpers'

type Learned = { kind: 'tech' | 'soft' | 'process'; title: L; text: L }

type ExperienceSeed = Pick<Experience, 'type' | 'startYear' | 'endYear'> & {
  months?: L
  role: L
  organisation: L
  place: L
  description: L
  learned: Learned[]
}

const villach: L = { en: 'Villach · AT', de: 'Villach · AT' }
const rosental: L = { en: 'Carinthia · AT', de: 'Kärnten · AT' }

// Array order = order within the Work / Education tab (newest first)
export const experiences: ExperienceSeed[] = [
  // ── Work ──────────────────────────────────────────────────────────────────
  {
    type: 'work',
    startYear: '2026',
    endYear: '2026',
    months: { en: 'Jul – Sep', de: 'Jul – Sep' },
    role: { en: 'Summer Developer', de: 'Entwickler im Sommerpraktikum' },
    organisation: { en: 'Feratel Media Technologies AG', de: 'Feratel Media Technologies AG' },
    place: villach,
    description: {
      en: 'Summer position as a developer, connected to my diploma thesis. Worked alongside an experienced product team and laid the groundwork for the thesis project.',
      de: 'Sommerstelle als Entwickler in Verbindung mit meiner Diplomarbeit. Mitarbeit in einem erfahrenen Produktteam und die Grundlage für das Diplomarbeitsprojekt gelegt.',
    },
    learned: [
      {
        kind: 'tech',
        title: {
          en: 'Finding my way in a large codebase',
          de: 'Mich in großer Codebasis zurechtfinden',
        },
        text: {
          en: 'Reading existing code before changing it and fitting new work into established conventions.',
          de: 'Bestehenden Code lesen, bevor ich ihn ändere, und Neues in etablierte Konventionen einfügen.',
        },
      },
      {
        kind: 'process',
        title: { en: 'From thesis idea to plan', de: 'Von der Idee zum Diplomarbeitsplan' },
        text: {
          en: 'Scoping a real project with a company: requirements, milestones and what is realistic in the time.',
          de: 'Ein echtes Projekt mit einem Unternehmen abstecken: Anforderungen, Meilensteine und was in der Zeit realistisch ist.',
        },
      },
      {
        kind: 'soft',
        title: { en: 'Working independently', de: 'Selbstständig arbeiten' },
        text: {
          en: 'Owning my tasks, asking at the right moment and reporting progress without being chased.',
          de: 'Meine Aufgaben verantworten, im richtigen Moment fragen und Fortschritt melden, ohne dass jemand nachfragen muss.',
        },
      },
    ],
  },
  {
    type: 'work',
    startYear: '2025',
    endYear: '2025',
    months: { en: 'Jul – Aug', de: 'Jul – Aug' },
    role: { en: 'Mandatory Internship', de: 'Pflichtpraktikum' },
    organisation: { en: 'Elin GmbH', de: 'Elin GmbH' },
    place: villach,
    description: {
      en: 'Back at Elin for my second mandatory internship. Deepened the experience from the year before, expanded my professional expertise and took on more responsibility in daily work.',
      de: 'Zurück bei Elin für mein zweites Pflichtpraktikum. Die Erfahrung aus dem Vorjahr vertieft, mein fachliches Wissen erweitert und im Arbeitsalltag mehr Verantwortung übernommen.',
    },
    learned: [
      {
        kind: 'process',
        title: { en: 'Building on experience', de: 'Auf Erfahrung aufbauen' },
        text: {
          en: 'Starting productive from day one because the team, tools and workflows were already familiar.',
          de: 'Vom ersten Tag an produktiv, weil Team, Werkzeuge und Abläufe schon vertraut waren.',
        },
      },
      {
        kind: 'soft',
        title: { en: 'Teamwork & communication', de: 'Teamarbeit & Kommunikation' },
        text: {
          en: 'Coordinating with colleagues, giving clear updates and asking for help early.',
          de: 'Mich mit Kolleg:innen abstimmen, klare Updates geben und früh um Hilfe fragen.',
        },
      },
    ],
  },
  {
    type: 'work',
    startYear: '2024',
    endYear: '2024',
    months: { en: 'Jul – Aug', de: 'Jul – Aug' },
    role: { en: 'Mandatory Internship', de: 'Pflichtpraktikum' },
    organisation: { en: 'Elin GmbH', de: 'Elin GmbH' },
    place: villach,
    description: {
      en: 'My first real engineering team. Learned how a workday looks outside school and picked up the unwritten rules of teamwork and code review.',
      de: 'Mein erstes echtes Engineering-Team. Gelernt, wie ein Arbeitstag außerhalb der Schule aussieht, und die ungeschriebenen Regeln von Teamarbeit und Code-Reviews mitgenommen.',
    },
    learned: [
      {
        kind: 'process',
        title: { en: 'A real workday', de: 'Ein echter Arbeitstag' },
        text: {
          en: 'Fixed hours, real deadlines and work that other people rely on.',
          de: 'Feste Arbeitszeiten, echte Deadlines und Arbeit, auf die sich andere verlassen.',
        },
      },
      {
        kind: 'process',
        title: { en: 'Code reviews', de: 'Code-Reviews' },
        text: {
          en: 'Receiving feedback on my code and learning why conventions matter in a team.',
          de: 'Feedback zu meinem Code annehmen und verstehen, warum Konventionen im Team wichtig sind.',
        },
      },
      {
        kind: 'soft',
        title: { en: 'Teamwork', de: 'Teamarbeit' },
        text: {
          en: 'Communicating in a professional environment and finding my place in an existing team.',
          de: 'In einem professionellen Umfeld kommunizieren und meinen Platz in einem bestehenden Team finden.',
        },
      },
    ],
  },

  // ── Education ─────────────────────────────────────────────────────────────
  {
    type: 'edu',
    startYear: '2022',
    endYear: null,
    role: {
      en: 'IT, specialising in Advanced Web Development',
      de: 'Informationstechnologie, Schwerpunkt Advanced Web Development',
    },
    organisation: { en: 'HTL Villach', de: 'HTL Villach' },
    place: villach,
    description: {
      en: 'Five-year higher technical college finishing with the Higher Technical Education Diploma (Matura). Now in my final year (V of V), working on my diploma thesis. Software engineering, databases, networks and project management, with a focus on modern web development.',
      de: 'Fünfjährige Höhere Technische Lehranstalt mit Abschluss Reife- und Diplomprüfung (Matura). Derzeit im letzten Jahrgang (V von V) mit meiner Diplomarbeit. Softwareentwicklung, Datenbanken, Netzwerktechnik und Projektmanagement mit Fokus auf moderne Webentwicklung.',
    },
    learned: [
      {
        kind: 'tech',
        title: { en: 'Full-stack web development', de: 'Full-Stack-Webentwicklung' },
        text: {
          en: 'From Figma designs to Next.js, Angular and NestJS apps with authentication, databases and Docker.',
          de: 'Von Figma-Designs bis zu Next.js-, Angular- und NestJS-Apps mit Authentifizierung, Datenbanken und Docker.',
        },
      },
      {
        kind: 'process',
        title: { en: 'Team projects', de: 'Teamprojekte' },
        text: {
          en: 'Planning and shipping projects like Quillly, Operon and TradePortal in teams, from requirements to delivery.',
          de: 'Projekte wie Quillly, Operon und TradePortal im Team planen und umsetzen, von den Anforderungen bis zur Abgabe.',
        },
      },
      {
        kind: 'soft',
        title: { en: 'Presenting & documenting', de: 'Präsentieren & dokumentieren' },
        text: {
          en: 'Explaining technical decisions, presenting results and documenting my part of a shared codebase.',
          de: 'Technische Entscheidungen erklären, Ergebnisse präsentieren und meinen Teil einer gemeinsamen Codebasis dokumentieren.',
        },
      },
    ],
  },
  {
    type: 'edu',
    startYear: '2021',
    endYear: '2022',
    role: { en: 'Pre-vocational School', de: 'Polytechnische Schule' },
    organisation: { en: 'PTS Villach', de: 'PTS Villach' },
    place: villach,
    description: {
      en: 'A one-year bridge after middle school to explore career paths, which led me to technology and the HTL.',
      de: 'Ein Jahr zur Berufsorientierung nach der Mittelschule, das mich zur Technik und an die HTL geführt hat.',
    },
    learned: [
      {
        kind: 'soft',
        title: { en: 'Finding my direction', de: 'Meine Richtung finden' },
        text: {
          en: 'Trying out different fields and deciding on a technical education.',
          de: 'Verschiedene Bereiche ausprobieren und mich für eine technische Ausbildung entscheiden.',
        },
      },
    ],
  },
  {
    type: 'edu',
    startYear: '2017',
    endYear: '2021',
    role: { en: 'Middle School', de: 'Mittelschule' },
    organisation: {
      en: 'Middle School St. Jakob im Rosental',
      de: 'Mittelschule St. Jakob im Rosental',
    },
    place: rosental,
    description: {
      en: 'Lower secondary education in St. Jakob im Rosental.',
      de: 'Sekundarstufe I in St. Jakob im Rosental.',
    },
    learned: [],
  },
  {
    type: 'edu',
    startYear: '2013',
    endYear: '2017',
    role: { en: 'Elementary School', de: 'Volksschule' },
    organisation: {
      en: 'Elementary School St. Jakob im Rosental',
      de: 'Volksschule St. Jakob im Rosental',
    },
    place: rosental,
    description: {
      en: 'Primary education in St. Jakob im Rosental.',
      de: 'Grundschulbildung in St. Jakob im Rosental.',
    },
    learned: [],
  },
]

export async function seedExperiences(payload: Payload) {
  for (const [order, e] of experiences.entries()) {
    const localized = (locale: Locale) => ({
      role: e.role[locale],
      organisation: e.organisation[locale],
      place: e.place[locale],
      description: e.description[locale],
      months: e.months?.[locale] ?? null,
    })
    const learned = (locale: Locale) =>
      e.learned.map((l) => ({ kind: l.kind, title: l.title[locale], text: l.text[locale] }))

    const doc = await payload.create({
      collection: 'experiences',
      locale: 'en',
      data: {
        ...localized('en'),
        type: e.type,
        startYear: e.startYear,
        endYear: e.endYear ?? null,
        order,
        learned: learned('en'),
      },
    })

    await payload.update({
      collection: 'experiences',
      id: doc.id,
      locale: 'de',
      data: { ...localized('de'), learned: withIds(learned('de'), doc.learned) },
    })
  }

  return experiences.length
}
