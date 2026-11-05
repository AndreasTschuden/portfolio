/**
 * CV PDFs from seed-assets/cv/ (not in git, the repo is public). Both are optional;
 * with only one, the site links it in both languages.
 */
import fs from 'fs'
import path from 'path'
import type { Payload } from 'payload'

import { assetsDir, type Locale } from './helpers'

const cvFiles: { language: Locale; file: string; title: string }[] = [
  { language: 'en', file: 'cv-en.pdf', title: 'CV (English)' },
  { language: 'de', file: 'cv-de.pdf', title: 'Lebenslauf (Deutsch)' },
]

export async function seedCV(payload: Payload) {
  let count = 0
  for (const { language, file, title } of cvFiles) {
    const filePath = path.join(assetsDir, 'cv', file)
    if (!fs.existsSync(filePath)) continue
    await payload.create({ collection: 'cv', data: { title, language }, filePath })
    count++
  }
  return count
}
