/**
 * Ссылки «Завантажити специфікацію (PDF)» со страниц товаров производителя
 * (materials.source_url):
 *   Laminam — техлист коллекции, ссылка «Download technical details»
 *     на laminam-cdn.thron.com;
 *   Vicostone — отдельного PDF на декор нет, берётся «Download Ebrochure»
 *     (общая брошюра, одна на все товары).
 *
 *   node --env-file=.env.local db/load-spec-pdfs.ts
 *
 * Заполняет только пустой spec_pdf_url — ссылки, внесённые в админке, не трогает.
 * Повторный запуск дозаполняет то, что не нашлось в прошлый раз.
 */
import { and, eq, isNull, or, like } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { brands, materials } from './schema/index.ts'

// Скрипт запускается вне Next, поэтому подключение своё, а не общий пул из db/index.ts.
const db = drizzle(process.env.DATABASE_URL!)

/** Laminam: техлист коллекции …/WEB/technical-sheet-blend. */
const LAMINAM_SHEET = /href="(https:\/\/laminam-cdn\.thron\.com\/[^"]*technical-sheet[^"]*)"/
/** Vicostone: <a href="/-/media/….ashx" title="Download Ebrochure">. */
const VICOSTONE_BROCHURE = /href="([^"]+)"[^>]*title="Download Ebrochure"/

async function findSheet(pageUrl: string): Promise<string | null> {
  const response = await fetch(pageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!response.ok) throw new Error(`${response.status} ${pageUrl}`)
  const html = await response.text()
  const link = (html.match(LAMINAM_SHEET) ?? html.match(VICOSTONE_BROCHURE))?.[1]
  return link ? new URL(link, pageUrl).href : null
}

const rows = await db
  .select({ id: materials.id, slug: materials.slug, sourceUrl: materials.sourceUrl })
  .from(materials)
  .innerJoin(brands, eq(brands.id, materials.brandId))
  .where(
    and(
      isNull(materials.specPdfUrl),
      or(
        and(eq(brands.slug, 'laminam'), like(materials.sourceUrl, 'https://www.laminam.com/%')),
        and(eq(brands.slug, 'vicostone'), like(materials.sourceUrl, 'https://vicostone.com/%')),
      ),
    ),
  )

let filled = 0
const missing: string[] = []
// По 4 страницы за раз — не нагружать сайт производителя.
for (let i = 0; i < rows.length; i += 4) {
  await Promise.all(
    rows.slice(i, i + 4).map(async (row) => {
      try {
        const sheet = await findSheet(row.sourceUrl!)
        if (!sheet) return void missing.push(`${row.slug}: ссылки на PDF нет`)
        await db.update(materials).set({ specPdfUrl: sheet }).where(eq(materials.id, row.id))
        filled++
      } catch (error) {
        missing.push(`${row.slug}: ${(error as Error).message}`)
      }
    }),
  )
}

console.log(`Без PDF: ${rows.length}, заполнено: ${filled}`)
for (const line of missing) console.log(`  не найдено — ${line}`)
process.exit(0)
