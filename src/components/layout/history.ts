'use client'

/**
 * Pages visited in this tab, so "Back" knows whether the previous page is on this site.
 * Entries are full pathnames; a language switch replaces the current entry instead of adding one.
 */
const stack: string[] = []

const withoutLocale = (path: string) => path.replace(/^\/[^/]+/, '') || '/'

export const recordPath = (path: string) => {
  const page = withoutLocale(path)
  const n = stack.length
  if (n && withoutLocale(stack[n - 1]) === page) {
    stack[n - 1] = path
  } else if (n > 1 && withoutLocale(stack[n - 2]) === page) {
    // came back to the previous page
    stack.pop()
    stack[n - 2] = path
  } else {
    stack.push(path)
  }
}

export const previousPath = (): string | null => stack[stack.length - 2] ?? null
