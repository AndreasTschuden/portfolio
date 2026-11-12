import type { ReactNode } from 'react'

import { ArrowDown, ArrowUpRight, BookOpen, Logo } from '../icons'

/*
 * Corporate-Design-Styleguide: three A4 landscape pages (297 × 210 mm). Every value shown
 * here is the one the site uses (globals.css, design_handoff/README.md), so the guide and
 * the product cannot drift apart.
 */

const TOTAL = 3

const Label = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`font-mono text-[9.5px] tracking-[.08em] uppercase ${className}`}>
    {children}
  </span>
)

/** Section heading inside a page: mono number + bold title, with a rule above */
const Section = ({
  n,
  title,
  className = '',
  children,
}: {
  n: string
  title: string
  className?: string
  children: ReactNode
}) => (
  <section className={`flex flex-col border-t border-navy pt-[10px] ${className}`}>
    <div className="mb-[14px] flex items-baseline gap-[10px]">
      <Label className="text-steel">{n}</Label>
      <h3 className="m-0 text-[15px] leading-none font-bold">{title}</h3>
    </div>
    {children}
  </section>
)

const Text = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`m-0 text-[11px] leading-[1.5] text-steel ${className}`}>{children}</p>
)

function Page({
  n,
  chapter,
  title,
  lead,
  children,
}: {
  n: number
  chapter: string
  title: string
  lead: string
  children: ReactNode
}) {
  return (
    <div className="relative flex h-[210mm] w-[297mm] flex-col overflow-hidden bg-white px-[56px] pt-[44px] pb-[40px] font-sans text-navy">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <Logo width={20} height={17.5} />
          <Label>Corporate Design · Styleguide</Label>
        </div>
        <Label className="text-steel">{chapter}</Label>
      </header>

      <div className="mt-[26px] mb-[24px] grid grid-cols-12 items-end gap-x-[20px]">
        <h2 className="col-span-7 m-0 text-[44px] leading-[.95] font-bold tracking-[-0.01em] text-black">
          {title}
        </h2>
        <p className="col-span-5 col-start-8 m-0 text-[12px] leading-[1.5] text-steel">{lead}</p>
      </div>

      <div className="grid flex-1 grid-cols-12 gap-x-[20px] gap-y-[22px]">{children}</div>

      <footer className="absolute right-[56px] bottom-[20px] left-[56px] flex justify-between text-steel">
        <Label>Andreas Tschuden · 2026</Label>
        <Label>
          {String(n).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </Label>
      </footer>
    </div>
  )
}

/** The favicon: negative signet on a navy square, corner radius 7/32 (public/favicon.svg) */
const AppIcon = ({ size }: { size: number }) => (
  <span
    className="flex items-center justify-center bg-navy text-white"
    style={{ width: size, height: size, borderRadius: (size * 7) / 32 }}
  >
    <Logo width={size * 0.625} height={size * 0.547} />
  </span>
)

/* ───────────────────────── 01 Logo ───────────────────────── */

const LogoTile = ({
  label,
  note,
  className,
  children,
}: {
  label: string
  note: string
  className: string
  children: ReactNode
}) => (
  <div className="flex flex-col gap-[8px]">
    <div className={`flex h-[118px] items-center justify-center rounded-[16px] ${className}`}>
      {children}
    </div>
    <div className="flex flex-col gap-[2px]">
      <span className="text-[11px] font-bold">{label}</span>
      <span className="text-[10px] leading-[1.4] text-steel">{note}</span>
    </div>
  </div>
)

export function LogoPage() {
  // Clear-space demo: signet 120 × 105 px, x = half the signet height
  const w = 120
  const h = 105
  const x = h / 2

  return (
    <Page
      n={1}
      chapter="01 — Logo"
      title="Logo & Signet"
      lead="Das Signet ist ein abstrahiertes „A“ aus meinen Initialen, gezeichnet aus einer einzigen Fläche. Es steht allein (Favicon, Seitenkopf, Booklet) oder zusammen mit dem Namen. Es wird nur in den drei Varianten unten verwendet und nie verzerrt, gedreht oder mit Effekten versehen."
    >
      <Section n="1.1" title="Schutzzone" className="col-span-5">
        <div className="flex items-center gap-[26px]">
          <div
            className="relative shrink-0 rounded-[4px] bg-mist"
            style={{ width: w + 2 * x, height: h + 2 * x }}
          >
            {/* dashed clear-space frame = the bounding box of the area */}
            <div className="absolute inset-0 rounded-[4px] border border-dashed border-steel/60" />
            <div
              className="absolute border border-navy/25"
              style={{ left: x, top: x, width: w, height: h }}
            />
            <Logo width={w} height={h} className="absolute" style={{ left: x, top: x }} />
            {/* x markers */}
            <div
              className="absolute flex items-center justify-center border-r border-b border-dashed border-steel/60"
              style={{ left: 0, top: 0, width: x, height: x }}
            >
              <span className="font-mono text-[11px] text-steel">x</span>
            </div>
            <div
              className="absolute flex items-center justify-center border-t border-l border-dashed border-steel/60"
              style={{ right: 0, bottom: 0, width: x, height: x }}
            >
              <span className="font-mono text-[11px] text-steel">x</span>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            <Text>
              Rund um das Signet bleibt eine Fläche frei von Text, Bildkanten und anderen Elementen.
            </Text>
            <Text>
              <b className="text-navy">x = ½ Signethöhe.</b> Bei einem Signet von 35 px Höhe sind
              das 17,5 px auf jeder Seite.
            </Text>
          </div>
        </div>

        <div className="mt-[22px] mb-[12px] flex items-baseline gap-[10px] border-t border-line pt-[10px]">
          <Label className="text-steel">1.2</Label>
          <h3 className="m-0 text-[15px] leading-none font-bold">Mindestgröße</h3>
        </div>
        <div className="flex items-end gap-[28px]">
          {[
            { size: '8 mm', note: 'Print', px: 30 },
            { size: '24 px', note: 'Web', px: 24 },
            { size: '16 px', note: 'Favicon, nur als App-Icon', px: 16, icon: true },
          ].map((s) => (
            <div key={s.size} className="flex flex-col gap-[8px]">
              <div className="flex h-[34px] items-end">
                {s.icon ? (
                  <AppIcon size={s.px} />
                ) : (
                  <Logo width={(s.px * 40) / 35} height={s.px} />
                )}
              </div>
              <div className="flex flex-col gap-[2px]">
                <span className="font-mono text-[11px]">{s.size} Höhe</span>
                <span className="text-[10px] text-steel">{s.note}</span>
              </div>
            </div>
          ))}
        </div>
        <Text className="mt-[12px]">
          Kleiner wird das Signet unleserlich, die Spitze und die innere Kerbe laufen zu.
        </Text>
      </Section>

      <Section n="1.3" title="Varianten" className="col-span-7">
        <div className="grid grid-cols-4 gap-[14px]">
          <LogoTile
            label="Farbig"
            note="Navy auf Weiß oder Mist. Standard für alle Anwendungen."
            className="border border-line bg-white text-navy"
          >
            <Logo width={64} height={56} />
          </LogoTile>
          <LogoTile
            label="Einfarbig"
            note="Schwarz, wenn nur eine Druckfarbe zur Verfügung steht."
            className="border border-line bg-white text-black"
          >
            <Logo width={64} height={56} />
          </LogoTile>
          <LogoTile
            label="Negativ"
            note="Weiß auf Navy oder Secondary, z. B. Booklet-Cover."
            className="bg-navy text-white"
          >
            <Logo width={64} height={56} />
          </LogoTile>
          <LogoTile
            label="App-Icon"
            note="Negativ auf Navy-Fläche mit 7/32 Radius. Favicon, Homescreen."
            className="bg-mist"
          >
            <AppIcon size={64} />
          </LogoTile>
        </div>

        <div className="mt-[22px] mb-[12px] flex items-baseline gap-[10px] border-t border-line pt-[10px]">
          <Label className="text-steel">1.4</Label>
          <h3 className="m-0 text-[15px] leading-none font-bold">Signet mit Namen</h3>
        </div>
        <div className="grid grid-cols-2 gap-[14px]">
          <div className="flex h-[92px] items-center gap-[14px] rounded-[16px] border border-line px-[24px]">
            <Logo width={40} height={35} />
            <span className="text-[22px] leading-none font-bold tracking-[-0.01em] whitespace-nowrap">
              Andreas Tschuden
            </span>
          </div>
          <div className="flex h-[92px] items-center gap-[14px] rounded-[16px] bg-navy px-[24px] text-white">
            <Logo width={40} height={35} />
            <span className="text-[22px] leading-none font-bold tracking-[-0.01em] whitespace-nowrap">
              Andreas Tschuden
            </span>
          </div>
        </div>
        <Text className="mt-[10px]">
          Satoshi Bold, Schrifthöhe ≈ 0,7 × Signethöhe, Abstand zum Signet = x. Name nie über oder
          unter das Signet stellen.
        </Text>

        <div className="mt-[18px] grid grid-cols-4 gap-[14px]">
          {[
            { t: 'Nicht verzerren', s: 'scale-x-[1.45]' },
            { t: 'Nicht drehen', s: 'rotate-[-18deg]' },
            { t: 'Keine Fremdfarben', s: 'text-[#d9822b]' },
            { t: 'Keine Effekte', s: 'drop-shadow-[3px_4px_0_rgba(17,42,70,.35)] blur-[0.6px]' },
          ].map((d) => (
            <div key={d.t} className="flex flex-col gap-[6px]">
              <div className="relative flex h-[56px] items-center justify-center overflow-hidden rounded-[8px] bg-mist">
                <Logo width={32} height={28} className={d.s} />
                <span className="absolute inset-0 m-auto h-px w-[70%] rotate-[-28deg] bg-navy" />
              </div>
              <span className="text-[10px] text-steel">{d.t}</span>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}

/* ───────────────────────── 02 Farben & Elemente ───────────────────────── */

type Swatch = {
  name: string
  role: string
  hex: string
  rgb: string
  cmyk: string
  ink?: 'light'
  border?: boolean
}

const main: Swatch[] = [
  {
    name: 'Navy',
    role: 'Primärfarbe · Text, Logo, Buttons',
    hex: '#112A46',
    rgb: '17 · 42 · 70',
    cmyk: '76 · 40 · 0 · 73',
    ink: 'light',
  },
  {
    name: 'Secondary',
    role: 'Sekundärfarbe · Flächen, Hover',
    hex: '#34506D',
    rgb: '52 · 80 · 109',
    cmyk: '52 · 27 · 0 · 57',
    ink: 'light',
  },
  {
    name: 'Ice',
    role: 'Akzentfarbe · Bildflächen, Markierung',
    hex: '#C5D7EC',
    rgb: '197 · 215 · 236',
    cmyk: '17 · 9 · 0 · 7',
  },
]

const neutrals: Swatch[] = [
  { name: 'Mist', role: 'Hintergrund', hex: '#E1E8F0', rgb: '225 · 232 · 240', cmyk: '6 · 3 · 0 · 6' },
  { name: 'Haze', role: 'Inaktiv', hex: '#C4D2E1', rgb: '196 · 210 · 225', cmyk: '13 · 7 · 0 · 12' },
  {
    name: 'Steel',
    role: 'Zweittext',
    hex: '#5A6C84',
    rgb: '90 · 108 · 132',
    cmyk: '32 · 18 · 0 · 48',
    ink: 'light',
  },
  { name: 'Line', role: 'Linien', hex: '#E5E7EB', rgb: '229 · 231 · 235', cmyk: '3 · 2 · 0 · 8' },
  { name: 'Weiß', role: 'Grund', hex: '#FFFFFF', rgb: '255 · 255 · 255', cmyk: '0 · 0 · 0 · 0', border: true },
  {
    name: 'Schwarz',
    role: 'Headlines',
    hex: '#000000',
    rgb: '0 · 0 · 0',
    cmyk: '0 · 0 · 0 · 100',
    ink: 'light',
  },
]

const Codes = ({ s }: { s: Swatch }) => (
  <dl className="m-0 grid grid-cols-[34px_1fr] gap-y-[3px] font-mono text-[9.5px] leading-none">
    {(
      [
        ['HEX', s.hex],
        ['RGB', s.rgb],
        ['CMYK', s.cmyk],
      ] as const
    ).map(([k, v]) => (
      <div key={k} className="contents">
        <dt className="opacity-60">{k}</dt>
        <dd className="m-0">{v}</dd>
      </div>
    ))}
  </dl>
)

export function ColorPage() {
  return (
    <Page
      n={2}
      chapter="02 — Farbe & Elemente"
      title="Farbpalette"
      lead="Eine ruhige, kühle Palette aus Blautönen: Navy trägt die Marke, Secondary und Ice setzen Flächen ab, Neutraltöne strukturieren. Navy auf Weiß erreicht 14,5 : 1 Kontrast (WCAG AAA). CMYK-Werte sind rechnerisch umgerechnet und vor dem Druck mit dem Proof (FOGRA39) abzustimmen."
    >
      <Section n="2.1" title="Primär-, Sekundär- und Akzentfarbe" className="col-span-12">
        <div className="grid grid-cols-[2fr_1.4fr_1.4fr] gap-[14px]">
          {main.map((s) => (
            <div
              key={s.name}
              className={`flex h-[138px] flex-col justify-between rounded-[16px] p-[16px] ${
                s.ink === 'light' ? 'text-white' : 'text-navy'
              }`}
              style={{ background: s.hex }}
            >
              <div className="flex flex-col gap-[3px]">
                <span className="text-[18px] leading-none font-bold">{s.name}</span>
                <span className="text-[10px] opacity-75">{s.role}</span>
              </div>
              <Codes s={s} />
            </div>
          ))}
        </div>
        <div className="mt-[14px] grid grid-cols-6 gap-[14px]">
          {neutrals.map((s) => (
            <div key={s.name} className="flex flex-col gap-[8px]">
              <div
                className={`h-[46px] rounded-[8px] ${s.border ? 'border border-line' : ''}`}
                style={{ background: s.hex }}
              />
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-bold">{s.name}</span>
                <span className="text-[9.5px] text-steel">{s.role}</span>
              </div>
              <Codes s={s} />
            </div>
          ))}
        </div>
        {/* Rough share of each colour in a typical layout */}
        <div className="mt-[14px] flex items-center gap-[14px]">
          <Label className="shrink-0 text-steel">Farbanteile</Label>
          <div className="flex h-[10px] flex-1 overflow-hidden rounded-full">
            <span className="w-[55%] border border-line bg-white" />
            <span className="w-[18%] bg-mist" />
            <span className="w-[15%] bg-navy" />
            <span className="w-[7%] bg-secondary" />
            <span className="w-[5%] bg-ice" />
          </div>
          <Label className="shrink-0 text-steel">Weiß 55 · Mist 18 · Navy 15 · Sec. 7 · Ice 5</Label>
        </div>
      </Section>

      <Section n="2.2" title="Formen & Radien" className="col-span-3">
        <div className="flex items-end gap-[10px]">
          {[
            { r: 999, l: 'Pill', w: 56, h: 26 },
            { r: 20, l: '20', w: 46, h: 46 },
            { r: 16, l: '16', w: 40, h: 40 },
            { r: 8, l: '8', w: 32, h: 32 },
            { r: 4, l: '4', w: 26, h: 26 },
          ].map((f) => (
            <div key={f.l} className="flex flex-col items-center gap-[6px]">
              <span
                className="block bg-mist ring-1 ring-navy/30 ring-inset"
                style={{ width: f.w, height: f.h, borderRadius: f.r }}
              />
              <span className="font-mono text-[9px] text-steel">{f.l}</span>
            </div>
          ))}
        </div>
        <Text className="mt-[12px]">
          Pills für Buttons und Filter, 20 px für Karten, 16 px für Bilder. Linien 1 px in Line,
          Trennlinien vor Abschnitten 1 px Navy.
        </Text>
      </Section>

      <Section n="2.3" title="Buttons & Indikatoren" className="col-span-3">
        <div className="flex flex-col items-start gap-[10px]">
          <span className="flex items-center gap-[10px] rounded-full bg-navy py-[5px] pr-[5px] pl-[16px] text-[11px] text-white">
            Get in Touch
            <span className="flex size-[24px] items-center justify-center rounded-full bg-white/14">
              <ArrowUpRight size={13} />
            </span>
          </span>
          <span className="flex rounded-full bg-mist p-[3px] font-mono text-[9.5px]">
            <span className="rounded-full bg-navy px-[10px] py-[4px] text-white">EN</span>
            <span className="px-[10px] py-[4px]">DE</span>
          </span>
          <span className="flex items-center gap-[6px]">
            <span className="h-[3px] w-[46px] rounded-full bg-navy" />
            <span className="h-[3px] w-[24px] rounded-full bg-haze" />
            <span className="h-[3px] w-[24px] rounded-full bg-haze" />
            <span className="ml-[6px] font-mono text-[9.5px]">1 / 5</span>
          </span>
        </div>
        <Text className="mt-[12px]">
          Aktiv immer Navy, inaktiv Haze. Zahlen und Zähler stehen in JetBrains Mono.
        </Text>
      </Section>

      <Section n="2.4" title="Icons" className="col-span-3">
        <div className="flex items-center gap-[16px]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
          </svg>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <path d="M9 20h6M12 16v4M9 10l2 2 4-4" />
          </svg>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="6" y="2.5" width="12" height="19" rx="2" />
            <path d="M11.5 18h1" />
          </svg>
          <ArrowUpRight size={22} />
          <ArrowDown width={22} height={22} />
          <BookOpen width={22} height={22} />
        </div>
        <Text className="mt-[12px]">
          Outline-Icons auf 24-px-Raster, Strich 1,4–1,5 px, runde Enden, keine Füllungen. Der Pfeil
          ↗ markiert jeden Link.
        </Text>
      </Section>

      <Section n="2.5" title="Kartenthemen" className="col-span-3">
        <div className="flex gap-[8px]">
          {[
            ['bg-mist', 'bg-ice', 'text-black'],
            ['bg-secondary', 'bg-navy', 'text-white'],
            ['bg-navy', 'bg-secondary', 'text-white'],
          ].map(([bg, img, ink], i) => (
            <div key={i} className={`flex flex-1 flex-col gap-[5px] rounded-[10px] p-[5px] ${bg} ${ink}`}>
              <span className={`block h-[30px] rounded-[6px] ${img}`} />
              <span className="px-[2px] font-mono text-[8px] opacity-70">0{i + 1}</span>
            </div>
          ))}
        </div>
        <Text className="mt-[12px]">
          Projektkarten wechseln der Reihe nach zwischen drei festen Kombinationen aus Fläche,
          Bildgrund und Schrift.
        </Text>
      </Section>
    </Page>
  )
}

/* ───────────────────────── 03 Typografie & Raster ───────────────────────── */

const scale = [
  { tag: 'Display', spec: '200 px · Regular · −2 %', size: 34, cls: 'font-normal tracking-[-0.02em]', sample: 'Hello' },
  { tag: 'H1', spec: '100 px · Bold', size: 27, cls: 'font-bold', sample: 'All Projects' },
  { tag: 'H2', spec: '60 px · Bold', size: 22, cls: 'font-bold', sample: 'What I work with' },
  { tag: 'H3', spec: '36 px · Bold', size: 18, cls: 'font-bold', sample: 'Budgetly' },
  { tag: 'Lead', spec: '20 px · Regular · 1,5', size: 14, cls: 'font-normal', sample: 'UI/UX Designer & Web Developer aus Kärnten.' },
  { tag: 'Body', spec: '16 px · Regular · 1,5', size: 12, cls: 'font-normal', sample: 'Fließtext für Beschreibungen, Lebenslauf und Website.' },
  { tag: 'Caption', spec: '14 px · Regular · Steel', size: 10.5, cls: 'font-normal text-steel', sample: 'Bildunterschrift: Dashboard, Desktop-Ansicht' },
]

export function TypePage() {
  return (
    <Page
      n={3}
      chapter="03 — Typografie & Raster"
      title="Typografie & Raster"
      lead="Zwei Schriftfamilien: Satoshi für Headlines und Fließtext, JetBrains Mono für Zahlen und Labels. Beide sind selbst gehostet und dürfen in Print und Web frei verwendet werden. Ein 12-Spalten-Raster ordnet jede Seite, im Druck wie im Web."
    >
      <Section n="3.1" title="Schriften" className="col-span-7">
        <div className="grid grid-cols-[1.35fr_1fr] gap-[14px]">
          <div className="flex flex-col justify-between gap-[8px] rounded-[16px] bg-mist p-[14px]">
            <div className="flex items-end justify-between">
              <span className="text-[60px] leading-[.8] font-bold">Aa</span>
              <div className="flex flex-col items-end gap-[3px] text-[12px] leading-none">
                <span className="font-normal">Regular 400</span>
                <span className="font-medium">Medium 500</span>
                <span className="font-bold">Bold 700</span>
              </div>
            </div>
            <div>
              <span className="text-[18px] font-bold">Satoshi</span>
              <p className="m-0 mt-[4px] text-[11px] leading-[1.45] break-all">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ ÄÖÜ abcdefghijklmnopqrstuvwxyz äöüß 0123456789 &amp;?!→
              </p>
            </div>
            <Text>
              Indian Type Foundry · Fontshare. <b className="text-navy">Lizenz:</b> ITF Free Font
              License, kostenlos für private und kommerzielle Nutzung in Print und Web.
            </Text>
          </div>
          <div className="flex flex-col justify-between gap-[8px] rounded-[16px] bg-navy p-[14px] text-white">
            <div className="flex items-end justify-between">
              <span className="font-mono text-[50px] leading-[.8]">01</span>
              <span className="font-mono text-[12px] leading-none">Regular 400</span>
            </div>
            <div>
              <span className="text-[18px] font-bold">JetBrains Mono</span>
              <p className="m-0 mt-[4px] font-mono text-[10.5px] leading-[1.45] break-all">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 / · + %
              </p>
            </div>
            <p className="m-0 text-[11px] leading-[1.5] text-mist/75">
              JetBrains · Google Fonts. <b className="text-white">Lizenz:</b> SIL Open Font License
              1.1, frei für Print und Web.
            </p>
          </div>
        </div>

        <div className="mt-[14px] mb-[4px] flex items-baseline gap-[10px] border-t border-line pt-[10px]">
          <Label className="text-steel">3.2</Label>
          <h3 className="m-0 text-[15px] leading-none font-bold">Hierarchie</h3>
          <span className="ml-auto text-[9.5px] text-steel">Muster verkleinert, Werte für Desktop</span>
        </div>
        <div className="flex flex-col">
          {scale.map((s) => (
            <div
              key={s.tag}
              className="grid grid-cols-[54px_1fr_150px] items-baseline gap-[12px] border-b border-line py-[3px] last:border-b-0"
            >
              <Label className="text-steel">{s.tag}</Label>
              <span
                className={`truncate leading-[1.05] text-black ${s.cls}`}
                style={{ fontSize: s.size }}
              >
                {s.sample}
              </span>
              <span className="text-right font-mono text-[9.5px] text-steel">{s.spec}</span>
            </div>
          ))}
          <div className="grid grid-cols-[54px_1fr_150px] items-baseline gap-[12px] py-[4px]">
            <Label className="text-steel">Label</Label>
            <Label>Year · Role · Team</Label>
            <span className="text-right font-mono text-[9.5px] text-steel">12 px · Mono · +8 % · CAPS</span>
          </div>
        </div>
      </Section>

      <Section n="3.3" title="Gestaltungsraster" className="col-span-5">
        <div className="grid grid-cols-[auto_1fr] gap-x-[16px] gap-y-[16px]">
          {/* A4 booklet: 210 × 297 mm, scaled to 0.42 px per mm */}
          <div className="relative h-[126px] w-[89px] bg-white ring-1 ring-navy/40">
            <div className="absolute top-[6.3px] right-[6.3px] bottom-[8.8px] left-[6.3px] bg-ice/60 ring-1 ring-navy/30 ring-inset">
              <div className="absolute right-[4px] bottom-[4px] left-[4px] grid h-[10px] grid-cols-3 gap-[2px]">
                <span className="bg-navy/25" />
                <span className="bg-navy/25" />
                <span className="bg-navy/25" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[11px] font-bold">Print · Booklet A4</span>
            <Text>
              210 × 297 mm, hoch. Satzspiegel mit 15 mm Rand oben und seitlich, 21 mm unten für
              die Seitenzahl. Einspaltig, Metadaten (Jahr, Rolle, Team) in drei Spalten.
            </Text>
          </div>

          {/* A4 landscape: 297 × 210 mm at 0.42 px per mm */}
          <div className="relative h-[88px] w-[125px] bg-white ring-1 ring-navy/40">
            <div className="absolute inset-[6.3px] grid grid-cols-12 gap-[2.1px]">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="bg-ice/70" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[11px] font-bold">Print · Styleguide & Lebenslauf A4</span>
            <Text>
              Rand 15 mm, 12 Spalten, Spaltenabstand 5 mm. Abschnitte beginnen mit einer
              Navy-Linie und Nummer in Mono.
            </Text>
          </div>

          {/* Web: browser with 12 columns */}
          <div className="relative h-[80px] w-[125px] overflow-hidden rounded-[4px] bg-white ring-1 ring-navy/40">
            <div className="flex h-[10px] items-center gap-[2px] border-b border-line px-[4px]">
              <span className="size-[3px] rounded-full bg-haze" />
              <span className="size-[3px] rounded-full bg-haze" />
              <span className="size-[3px] rounded-full bg-haze" />
            </div>
            <div className="absolute top-[10px] right-[9px] bottom-0 left-[9px] grid grid-cols-12 gap-[2px]">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="bg-ice/70" />
              ))}
            </div>
            <span className="absolute top-[10px] bottom-0 left-0 w-[9px] bg-mist" />
            <span className="absolute top-[10px] right-0 bottom-0 w-[9px] bg-mist" />
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[11px] font-bold">Web · Grid</span>
            <Text>
              12 Spalten, Abstand 20 px. Seitenrand fließend{' '}
              <span className="font-mono text-[10px] text-navy">clamp(24px, 5vw, 96px)</span>.
              Textblöcke höchstens 560–820 px breit. Umbrüche bei 640, 768 und 1024 px.
            </Text>
          </div>
        </div>

        <div className="mt-[16px] flex flex-col gap-[6px] rounded-[16px] bg-mist p-[14px]">
          <Label className="text-steel">Abstände</Label>
          <div className="flex items-end gap-[10px]">
            {[4, 8, 12, 16, 20, 24, 32, 48].map((s) => (
              <div key={s} className="flex flex-col items-center gap-[4px]">
                <span className="block w-[10px] bg-navy" style={{ height: s * 0.6 }} />
                <span className="font-mono text-[8.5px] text-steel">{s}</span>
              </div>
            ))}
          </div>
          <Text>Abstände in Vielfachen von 4 px, Karten innen 13–22 px.</Text>
        </div>
      </Section>
    </Page>
  )
}
