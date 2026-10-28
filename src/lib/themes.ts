/** Project card themes, rotating i % 3 (design_handoff/README.md → Projektkarten-Themen). */
export const cardThemes = [
  { bg: 'bg-mist', img: 'bg-ice', ink: 'text-black', num: 'text-white/60', light: true },
  { bg: 'bg-secondary', img: 'bg-navy', ink: 'text-white', num: 'text-mist/25', light: false },
  { bg: 'bg-navy', img: 'bg-secondary', ink: 'text-white', num: 'text-mist/25', light: false },
] as const

export const cardTheme = (i: number) => cardThemes[i % cardThemes.length]
