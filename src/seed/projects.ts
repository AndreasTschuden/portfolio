/**
 * Projects from the "ProjectDetails-*.docx" files. Screenshots live in
 * seed-assets/projects/<slug>/; the first screen is also the cover image.
 *
 * Mapping from the docs: Shipped → live, In Progress → wip, Archived → done;
 * "Educational Project" → type school; "Team build" → teamSize 3 (exact size not documented).
 */
import type { Payload } from 'payload'

import type { Project } from '../payload-types'
import { type L, type Locale, uploadMedia, withIds } from './helpers'
import { techRefs } from './technologies'

type Screen = {
  label: L
  /** File in seed-assets/projects/<slug>/ */
  desktop: string
  mobile?: string
}

type ProjectSeed = Pick<Project, 'slug' | 'year' | 'type' | 'status' | 'teamSize'> & {
  title: L
  role: L
  description: L
  caseStudy: { problem: L; solution: L; outcome: L }
  stack: string[]
  screens: Screen[]
  liveUrl?: string
  repoUrl?: string
}

const fullStack: L = { en: 'Full-stack', de: 'Full-Stack' }
const TEAM = 3

// Array order = order on the site
export const projects: ProjectSeed[] = [
  {
    slug: 'tradeportal',
    title: { en: 'TradePortal', de: 'TradePortal' },
    year: '2026',
    type: 'school',
    status: 'done',
    teamSize: TEAM,
    role: fullStack,
    description: {
      en: 'A multi-vendor online marketplace where customers buy products from verified companies. Businesses connect their Stripe account, complete a verification process and can then sell products of any category through the platform.',
      de: 'Ein Multi-Vendor-Marktplatz, auf dem Kund:innen Produkte von verifizierten Unternehmen kaufen. Firmen verbinden ihr Stripe-Konto, durchlaufen eine Verifizierung und verkaufen danach Produkte jeder Kategorie über die Plattform.',
    },
    caseStudy: {
      problem: {
        en: 'An academic assignment to explore the architecture of modern online marketplaces: customers should be able to buy from many vendors in one place, while every business gets a secure and independent way to manage its own sales and payouts.',
        de: 'Eine Schulaufgabe, um die Architektur moderner Online-Marktplätze zu erforschen: Kund:innen sollen an einem Ort bei vielen Anbietern einkaufen können, und jedes Unternehmen braucht einen sicheren, unabhängigen Weg, seine eigenen Verkäufe und Auszahlungen zu verwalten.',
      },
      solution: {
        en: 'Separate onboarding flows for customers and companies. Companies must pass a verification and connect a Stripe account before they can sell; once approved, they create and manage products of any category in their own dashboard. Customers browse, filter and buy from different sellers in one unified cart and checkout, paid through Stripe Connect.',
        de: 'Getrennte Onboarding-Abläufe für Kund:innen und Unternehmen. Firmen müssen eine Verifizierung bestehen und ein Stripe-Konto verbinden, bevor sie verkaufen dürfen; danach legen sie in ihrem eigenen Dashboard Produkte jeder Kategorie an. Kund:innen stöbern, filtern und kaufen bei verschiedenen Anbietern über einen gemeinsamen Warenkorb und Checkout, bezahlt mit Stripe Connect.',
      },
      outcome: {
        en: 'A working marketplace built as a team in 10 weeks: role-based onboarding, vendor verification with Stripe Connect payments and payouts, and a product management system for any category. Designed in Figma first, then built with Next.js, Prisma and PostgreSQL, with images on MinIO and deployed with Docker and Traefik.',
        de: 'Ein funktionierender Marktplatz, im Team in 10 Wochen umgesetzt: rollenbasiertes Onboarding, Anbieter-Verifizierung mit Zahlungen und Auszahlungen über Stripe Connect und eine Produktverwaltung für jede Kategorie. Zuerst in Figma entworfen, dann mit Next.js, Prisma und PostgreSQL gebaut, Bilder auf MinIO, deployt mit Docker und Traefik.',
      },
    },
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'React Hook Form',
      'Zod',
      'Prisma',
      'Better Auth',
      'PostgreSQL',
      'Stripe',
      'MinIO',
      'Docker',
      'Traefik',
      'Figma',
      'Git',
    ],
    screens: [
      { label: { en: 'Home', de: 'Startseite' }, desktop: 'tradeportal-01-home.webp' },
      {
        label: { en: 'New arrivals', de: 'Neuheiten' },
        desktop: 'tradeportal-02-new-arrivals.webp',
      },
      {
        label: { en: 'Product catalogue', de: 'Produktkatalog' },
        desktop: 'tradeportal-03-products.webp',
      },
      { label: { en: 'Product page', de: 'Produktseite' }, desktop: 'tradeportal-04-product.webp' },
      { label: { en: 'Cart', de: 'Warenkorb' }, desktop: 'tradeportal-05-cart.webp' },
      { label: { en: 'Checkout', de: 'Checkout' }, desktop: 'tradeportal-06-checkout.webp' },
      {
        label: { en: 'Stripe payment', de: 'Zahlung mit Stripe' },
        desktop: 'tradeportal-07-stripe-payment.webp',
      },
      { label: { en: 'Orders', de: 'Bestellungen' }, desktop: 'tradeportal-08-orders.webp' },
      {
        label: { en: 'Customer profile', de: 'Kundenprofil' },
        desktop: 'tradeportal-09-customer-profile.webp',
      },
      {
        label: { en: 'Company profile', de: 'Firmenprofil' },
        desktop: 'tradeportal-10-company-profile.webp',
      },
      {
        label: { en: 'Verification & Stripe Connect', de: 'Verifizierung & Stripe Connect' },
        desktop: 'tradeportal-11-verification.webp',
      },
      { label: { en: 'Sign in', de: 'Anmeldung' }, desktop: 'tradeportal-12-login.webp' },
    ],
    repoUrl: 'https://github.com/AndreasTschuden/tradeportal',
  },
  {
    slug: 'budgetly',
    title: { en: 'Budgetly', de: 'Budgetly' },
    year: '2026',
    type: 'school',
    status: 'wip',
    teamSize: 1,
    role: fullStack,
    description: {
      en: 'A personal finance dashboard to track income and expenses, organise transactions by category, visualise spending, manage saving goals and automate recurring transactions in a secure, authenticated workspace.',
      de: 'Ein Finanz-Dashboard, um Einnahmen und Ausgaben zu erfassen, Transaktionen nach Kategorien zu ordnen, Ausgaben zu visualisieren, Sparziele zu verwalten und wiederkehrende Buchungen zu automatisieren, in einem sicheren, geschützten Workspace.',
    },
    caseStudy: {
      problem: {
        en: 'An academic assignment to explore how modern finance tracking platforms are structured. The goal: one dashboard where users record income and expenses, assign categories, understand their spending through charts and keep long-term saving goals in view.',
        de: 'Eine Schulaufgabe, um den Aufbau moderner Finanz-Tracking-Plattformen zu erforschen. Das Ziel: ein Dashboard, in dem man Einnahmen und Ausgaben erfasst, Kategorien zuordnet, das eigene Ausgabeverhalten über Diagramme versteht und langfristige Sparziele im Blick behält.',
      },
      solution: {
        en: 'Sign-up with email and password or Google, email verification and password reset via Better Auth. Users create dated transactions with separate income and expense categories, validated with Zod and scoped to their own account. Line and doughnut charts show recent income and expense trends and where the money goes by category.',
        de: 'Registrierung mit E-Mail und Passwort oder Google, E-Mail-Bestätigung und Passwort-Reset über Better Auth. Nutzer:innen legen datierte Transaktionen mit getrennten Einnahmen- und Ausgabenkategorien an, mit Zod validiert und auf das eigene Konto beschränkt. Linien- und Ringdiagramme zeigen die aktuellen Trends und wohin das Geld nach Kategorie fließt.',
      },
      outcome: {
        en: 'Saving goals with progress cards, and recurring transactions that a scheduled daily job processes automatically, with controls to activate or pause them. A solo build over 7 weeks as a Turborepo monorepo with Next.js, Prisma and PostgreSQL in Docker, still being extended.',
        de: 'Sparziele mit Fortschrittskarten und wiederkehrende Transaktionen, die ein täglicher Job automatisch verbucht und die sich aktivieren oder pausieren lassen. Ein Solo-Projekt über 7 Wochen als Turborepo-Monorepo mit Next.js, Prisma und PostgreSQL in Docker, das ich weiter ausbaue.',
      },
    },
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Prisma',
      'PostgreSQL',
      'Better Auth',
      'Zod',
      'Chart.js',
      'Docker',
      'Turborepo',
    ],
    screens: [
      { label: { en: 'Dashboard', de: 'Dashboard' }, desktop: 'budgetly-01-dashboard.webp' },
      {
        label: { en: 'Sign in', de: 'Anmeldung' },
        desktop: 'budgetly-02-login.webp',
        mobile: 'budgetly-02-login-mobile.webp',
      },
      {
        label: { en: 'Saving goals & recurring costs', de: 'Sparziele & wiederkehrende Kosten' },
        desktop: 'budgetly-03-goals-recurring.webp',
      },
      {
        label: { en: 'New transaction', de: 'Neue Transaktion' },
        desktop: 'budgetly-04-new-transaction.webp',
      },
      {
        label: { en: 'Recurring transaction', de: 'Wiederkehrende Transaktion' },
        desktop: 'budgetly-05-recurring-transaction.webp',
      },
      {
        label: { en: 'New saving goal', de: 'Neues Sparziel' },
        desktop: 'budgetly-06-saving-goal.webp',
      },
    ],
    repoUrl: 'https://github.com/AndreasTschuden/budgetly',
  },
  {
    slug: 'quillly',
    title: { en: 'Quillly', de: 'Quillly' },
    year: '2025',
    type: 'school',
    status: 'done',
    teamSize: TEAM,
    role: fullStack,
    description: {
      en: 'A blog platform to discover, read and publish articles across categories. Users write posts with images, manage their profile, search and filter content, like and comment, and get AI summaries of longer articles.',
      de: 'Eine Blog-Plattform, um Artikel aus verschiedenen Kategorien zu entdecken, zu lesen und selbst zu veröffentlichen. Nutzer:innen schreiben Beiträge mit Bildern, verwalten ihr Profil, suchen und filtern, liken und kommentieren und bekommen KI-Zusammenfassungen längerer Artikel.',
    },
    caseStudy: {
      problem: {
        en: 'An academic assignment to explore how modern content publishing platforms work. The goal was a clear, user-friendly place where people publish their own posts, discover content from others, interact with articles and manage their profile.',
        de: 'Eine Schulaufgabe, um die Funktionsweise moderner Publishing-Plattformen zu erforschen. Das Ziel war ein übersichtlicher, nutzerfreundlicher Ort, an dem man eigene Beiträge veröffentlicht, Inhalte anderer entdeckt, mit Artikeln interagiert und das eigene Profil verwaltet.',
      },
      solution: {
        en: 'Secure authentication with email and password or Google, CAPTCHA protection, email verification and password reset. Users write posts, upload images, pick a category and publish; posts can be searched, filtered, liked, commented on and read in a detailed view, and authors edit or delete their own.',
        de: 'Sichere Anmeldung mit E-Mail und Passwort oder Google, CAPTCHA-Schutz, E-Mail-Bestätigung und Passwort-Reset. Nutzer:innen schreiben Beiträge, laden Bilder hoch, wählen eine Kategorie und veröffentlichen; Beiträge lassen sich suchen, filtern, liken, kommentieren und in einer Detailansicht lesen, eigene Beiträge können bearbeitet oder gelöscht werden.',
      },
      outcome: {
        en: 'A complete blog platform built as a team over 15 weeks: post management with search, filters, likes and comments, an editable profile with picture upload, AI-powered article summaries and a dark mode. Built with Next.js on a Supabase backend, with Drizzle and PostgreSQL.',
        de: 'Eine vollständige Blog-Plattform, im Team über 15 Wochen umgesetzt: Beitragsverwaltung mit Suche, Filtern, Likes und Kommentaren, ein bearbeitbares Profil mit Bild-Upload, KI-Zusammenfassungen und ein Dark Mode. Gebaut mit Next.js auf einem Supabase-Backend, mit Drizzle und PostgreSQL.',
      },
    },
    stack: [
      'Next.js',
      'Supabase',
      'TypeScript',
      'Tailwind CSS',
      'Zod',
      'Drizzle',
      'PostgreSQL',
      'Git',
    ],
    screens: [
      { label: { en: 'Landing page', de: 'Landingpage' }, desktop: 'quillly-01-landing.webp' },
      { label: { en: 'Sign in', de: 'Anmeldung' }, desktop: 'quillly-02-login.webp' },
      { label: { en: 'Blog feed', de: 'Blog-Übersicht' }, desktop: 'quillly-03-blog-feed.webp' },
      {
        label: { en: 'Article & comments', de: 'Artikel & Kommentare' },
        desktop: 'quillly-04-article.webp',
      },
      { label: { en: 'Discover', de: 'Entdecken' }, desktop: 'quillly-05-discover.webp' },
      { label: { en: 'Dark mode', de: 'Dark Mode' }, desktop: 'quillly-06-discover-dark.webp' },
      {
        label: { en: 'Write a post', de: 'Beitrag schreiben' },
        desktop: 'quillly-07-create-post.webp',
      },
      { label: { en: 'My posts', de: 'Meine Beiträge' }, desktop: 'quillly-08-my-posts.webp' },
      { label: { en: 'Profile', de: 'Profil' }, desktop: 'quillly-09-profile.webp' },
      { label: { en: 'Contact', de: 'Kontakt' }, desktop: 'quillly-10-contact.webp' },
    ],
    repoUrl: 'https://github.com/AndreasTschuden/quillly',
  },
  {
    slug: 'planit',
    title: { en: 'PlanIt', de: 'PlanIt' },
    year: '2025',
    type: 'school',
    status: 'done',
    teamSize: 3,
    role: { en: 'Lead & Full-stack', de: 'Projektleitung & Full-Stack' },
    description: {
      en: 'A school planner for HTL Villach. Students sign in with their WebUntis account, see their current weekly timetable and manage homework, tests, grades and notes, with reminders before upcoming deadlines.',
      de: 'Ein Schulplaner für die HTL Villach. Schüler:innen melden sich mit ihrem WebUntis-Konto an, sehen ihren aktuellen Wochenstundenplan und verwalten Hausübungen, Tests, Noten und Notizen, mit Erinnerungen an anstehende Abgaben.',
    },
    caseStudy: {
      problem: {
        en: 'Built as a team project at HTL Villach in the 2024/25 school year. The timetable lives in WebUntis, while homework, tests and grades are scattered across notebooks, chats and note apps. PlanIt brings both together in one place.',
        de: 'Im Schuljahr 2024/25 als Teamprojekt an der HTL Villach entstanden. Der Stundenplan liegt in WebUntis, Hausübungen, Tests und Noten dagegen verteilt in Heften, Chats und Notiz-Apps. PlanIt bringt beides an einem Ort zusammen.',
      },
      solution: {
        en: 'Students sign in directly with their WebUntis credentials, without a separate password. The app fetches the weekly timetable live from the WebUntis JSON-RPC API, merges double and multiple lessons and highlights cancellations and changes. Clicking a lesson opens a lesson view where homework for that subject can be added right away. Separate sections cover homework, tests and exams, grades and notes, plus an overview and a timeline of everything coming up.',
        de: 'Angemeldet wird direkt mit den WebUntis-Zugangsdaten, ein eigenes Passwort gibt es nicht. Die App holt den Wochenstundenplan live über die WebUntis-JSON-RPC-API, fasst Doppel- und Mehrfachstunden zusammen und markiert Entfälle und Änderungen farblich. Ein Klick auf eine Stunde öffnet die Stundenansicht, in der man gleich eine Hausübung für dieses Fach einträgt. Dazu kommen eigene Bereiche für Hausübungen, Tests und Schularbeiten, Noten und Notizen sowie eine Übersicht und eine Timeline mit allen anstehenden Terminen.',
      },
      outcome: {
        en: 'Built by a team of three from March to June 2025 with Laravel, Blade, Tailwind CSS and daisyUI on MariaDB. Every new homework or test automatically creates a reminder two days before the due date, and the responsive interface comes in four colour themes. I led the project and did most of the development: the timetable, homework, tests, grades and notes, and the UI design.',
        de: 'Zu dritt von März bis Juni 2025 mit Laravel, Blade, Tailwind CSS und daisyUI auf MariaDB umgesetzt. Jede neue Hausübung und jeder Test erzeugt automatisch eine Erinnerung zwei Tage vor dem Termin, und die responsive Oberfläche gibt es in vier Farbthemes. Ich habe das Projekt geleitet und den Großteil entwickelt: Stundenplan, Hausübungen, Tests, Noten und Notizen sowie das UI-Design.',
      },
    },
    stack: ['Laravel', 'PHP', 'Tailwind CSS', 'daisyUI', 'JavaScript', 'MariaDB', 'Git', 'GitLab'],
    screens: [
      {
        label: { en: 'Weekly timetable', de: 'Wochenstundenplan' },
        desktop: 'planit-01-timetable.webp',
        mobile: 'planit-01-timetable-mobile.webp',
      },
      {
        label: { en: 'Lesson view', de: 'Stundenansicht' },
        desktop: 'planit-02-lesson.webp',
        mobile: 'planit-02-lesson-mobile.webp',
      },
      { label: { en: 'Overview', de: 'Übersicht' }, desktop: 'planit-03-overview.webp' },
      { label: { en: 'Timeline', de: 'Timeline' }, desktop: 'planit-04-timeline.webp' },
      {
        label: { en: 'Notifications', de: 'Benachrichtigungen' },
        desktop: 'planit-05-notifications.webp',
        mobile: 'planit-05-notifications-mobile.webp',
      },
      {
        label: { en: 'Homework', de: 'Hausübungen' },
        desktop: 'planit-06-homework.webp',
        mobile: 'planit-06-homework-mobile.webp',
      },
      {
        label: { en: 'Tests & exams', de: 'Tests & Schularbeiten' },
        desktop: 'planit-07-tests.webp',
        mobile: 'planit-07-tests-mobile.webp',
      },
      {
        label: { en: 'Grades', de: 'Noten' },
        desktop: 'planit-08-grades.webp',
        mobile: 'planit-08-grades-mobile.webp',
      },
      {
        label: { en: 'Notes', de: 'Notizen' },
        desktop: 'planit-09-notes.webp',
        mobile: 'planit-09-notes-mobile.webp',
      },
      {
        label: { en: 'Theme: violet', de: 'Theme: Violett' },
        desktop: 'planit-10-theme-violet.webp',
        mobile: 'planit-10-theme-violet-mobile.webp',
      },
      {
        label: { en: 'Theme: red', de: 'Theme: Rot' },
        desktop: 'planit-11-theme-red.webp',
        mobile: 'planit-11-theme-red-mobile.webp',
      },
      {
        label: { en: 'Theme: orange', de: 'Theme: Orange' },
        desktop: 'planit-12-theme-orange.webp',
        mobile: 'planit-12-theme-orange-mobile.webp',
      },
      {
        label: { en: 'Sign in with WebUntis', de: 'Anmeldung mit WebUntis' },
        desktop: 'planit-13-login.webp',
        mobile: 'planit-13-login-mobile.webp',
      },
    ],
    repoUrl: 'https://gitlab.com/tschudea07/planit',
  },
  {
    slug: 'operon',
    title: { en: 'Operon', de: 'Operon' },
    year: '2026',
    type: 'school',
    status: 'done',
    teamSize: TEAM,
    role: fullStack,
    description: {
      en: 'A project management platform where teams organise work across shared projects: tasks, members, milestones, labels and comments, with dashboards and Kanban boards for planning, priorities and progress.',
      de: 'Eine Projektmanagement-Plattform, in der Teams ihre Arbeit über gemeinsame Projekte organisieren: Aufgaben, Mitglieder, Meilensteine, Labels und Kommentare, mit Dashboards und Kanban-Boards für Planung, Prioritäten und Fortschritt.',
    },
    caseStudy: {
      problem: {
        en: 'An academic assignment to explore how modern project management platforms are built. Teams needed one collaborative workspace to organise projects, assign tasks, manage members and track progress, without losing the overview.',
        de: 'Eine Schulaufgabe, um den Aufbau moderner Projektmanagement-Plattformen zu erforschen. Teams brauchten einen gemeinsamen Workspace, um Projekte zu organisieren, Aufgaben zu verteilen, Mitglieder zu verwalten und den Fortschritt zu verfolgen, ohne den Überblick zu verlieren.',
      },
      solution: {
        en: 'Role-based permissions: project managers create projects, add members, define milestones and labels, and assign tasks to one or more people with status, priority, deadline and description. Members see their assigned work, follow upcoming milestones, use the dashboard and Kanban board, and discuss projects and tasks in comments.',
        de: 'Rollenbasierte Berechtigungen: Projektmanager:innen legen Projekte an, fügen Mitglieder hinzu, definieren Meilensteine und Labels und weisen Aufgaben einer oder mehreren Personen zu, mit Status, Priorität, Deadline und Beschreibung. Mitglieder sehen ihre Aufgaben, verfolgen anstehende Meilensteine, nutzen Dashboard und Kanban-Board und tauschen sich in Kommentaren aus.',
      },
      outcome: {
        en: 'Built as a team in 7 weeks: role-based project management, a task system with status, priority, deadlines, labels, milestones and comments, plus dashboard, Kanban board and milestone timeline. Angular front-end on a NestJS API with Prisma, Better Auth and PostgreSQL, running in Docker.',
        de: 'Im Team in 7 Wochen umgesetzt: rollenbasiertes Projektmanagement, ein Aufgabensystem mit Status, Priorität, Deadlines, Labels, Meilensteinen und Kommentaren, dazu Dashboard, Kanban-Board und Meilenstein-Timeline. Angular-Frontend auf einer NestJS-API mit Prisma, Better Auth und PostgreSQL, betrieben in Docker.',
      },
    },
    stack: [
      'Angular',
      'NestJS',
      'TypeScript',
      'SCSS',
      'Zod',
      'Prisma',
      'Better Auth',
      'PostgreSQL',
      'Docker',
      'Git',
      'Codex',
    ],
    screens: [{ label: { en: 'Dashboard', de: 'Dashboard' }, desktop: 'operon-01-dashboard.webp' }],
  },
  {
    slug: 'tradeportal-figma',
    title: { en: 'TradePortal Figma', de: 'TradePortal Figma' },
    year: '2025',
    type: 'school',
    status: 'done',
    teamSize: 1,
    role: { en: 'UI/UX Design', de: 'UI/UX Design' },
    description: {
      en: 'A desktop marketplace prototype designed in Figma, with vendor onboarding, product management and customer shopping flows for a multi-vendor platform.',
      de: 'Ein Desktop-Prototyp für einen Marktplatz, gestaltet in Figma, mit Anbieter-Onboarding, Produktverwaltung und Einkaufsabläufen für eine Multi-Vendor-Plattform.',
    },
    caseStudy: {
      problem: {
        en: 'Before writing any code, the multi-vendor marketplace needed a clear structure: two very different user groups, customers and businesses, sharing one platform without getting in each other’s way.',
        de: 'Bevor eine Zeile Code entstand, brauchte der Multi-Vendor-Marktplatz eine klare Struktur: zwei sehr unterschiedliche Nutzergruppen, Kund:innen und Unternehmen, auf einer Plattform, ohne sich gegenseitig im Weg zu stehen.',
      },
      solution: {
        en: 'Desktop-first wireframes and UI designed entirely in Figma, covering the complete platform: onboarding and sign-in, product catalogue with filters, product pages, cart, and the vendor side with product publishing, product lists and company profile including verification.',
        de: 'Desktop-first Wireframes und UI, komplett in Figma gestaltet, für die gesamte Plattform: Onboarding und Anmeldung, Produktkatalog mit Filtern, Produktseiten, Warenkorb und die Anbieterseite mit Produkt-Upload, Produktliste und Firmenprofil samt Verifizierung.',
      },
      outcome: {
        en: 'Complete user journeys for vendors and customers, designed solo over 15 weeks with a focus on usability, navigation and marketplace workflows. The design became the blueprint for the TradePortal implementation in 2026.',
        de: 'Vollständige User Journeys für Anbieter und Kund:innen, allein über 15 Wochen gestaltet, mit Fokus auf Usability, Navigation und Marktplatz-Abläufe. Das Design wurde zur Vorlage für die Umsetzung von TradePortal 2026.',
      },
    },
    stack: ['Figma'],
    screens: [
      { label: { en: 'Home', de: 'Startseite' }, desktop: 'tradeportal-figma-01-home.webp' },
      {
        label: { en: 'Product catalogue', de: 'Produktkatalog' },
        desktop: 'tradeportal-figma-02-products.webp',
      },
      {
        label: { en: 'Product page', de: 'Produktseite' },
        desktop: 'tradeportal-figma-03-product.webp',
      },
      { label: { en: 'Cart', de: 'Warenkorb' }, desktop: 'tradeportal-figma-04-cart.webp' },
      { label: { en: 'Sign in', de: 'Anmeldung' }, desktop: 'tradeportal-figma-05-login.webp' },
      {
        label: { en: 'Add product', de: 'Produkt anlegen' },
        desktop: 'tradeportal-figma-06-add-product.webp',
      },
      {
        label: { en: 'Vendor products', de: 'Produkte des Anbieters' },
        desktop: 'tradeportal-figma-07-vendor-products.webp',
      },
      {
        label: { en: 'Company profile', de: 'Firmenprofil' },
        desktop: 'tradeportal-figma-08-company-profile.webp',
      },
    ],
    liveUrl: 'https://www.figma.com/design/pvMu1KX1MQFXX8fowTpVVi/TradePortal?node-id=0-1',
  },
]

export async function seedProjects(payload: Payload, techIds: Record<string, string>) {
  // Home shows the newest first (by year, then creation date), so create in reverse order:
  // within a year the project listed first here is created last and leads on Home.
  for (const [i, p] of [...projects.entries()].reverse()) {
    const dir = `projects/${p.slug}`
    const screens: { label: L; desktop: string; mobile?: string }[] = []
    for (const s of p.screens) {
      const alt = (locale: Locale) => `${p.title[locale]} – ${s.label[locale]}`
      screens.push({
        label: s.label,
        desktop: await uploadMedia(payload, `${dir}/${s.desktop}`, {
          en: alt('en'),
          de: alt('de'),
        }),
        mobile: s.mobile
          ? await uploadMedia(payload, `${dir}/${s.mobile}`, {
              en: `${alt('en')} (mobile)`,
              de: `${alt('de')} (mobil)`,
            })
          : undefined,
      })
    }

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
    const screenRows = (locale: Locale) =>
      screens.map((s) => ({ label: s.label[locale], desktop: s.desktop, mobile: s.mobile ?? null }))

    const doc = await payload.create({
      collection: 'projects',
      locale: 'en',
      data: {
        ...localized('en'),
        slug: p.slug,
        order: i,
        year: p.year,
        type: p.type,
        status: p.status,
        teamSize: p.teamSize,
        technologies: techRefs(techIds, p.stack),
        coverImage: screens[0]?.desktop ?? null,
        screens: screenRows('en'),
        liveUrl: p.liveUrl ?? null,
        repoUrl: p.repoUrl ?? null,
      },
    })

    await payload.update({
      collection: 'projects',
      id: doc.id,
      locale: 'de',
      data: { ...localized('de'), screens: withIds(screenRows('de'), doc.screens) },
    })
  }

  return projects.length
}
