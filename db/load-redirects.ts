/**
 * Загрузка карты 301/410 со старого сайта (WordPress + WooCommerce на bbs.in.ua)
 * из db/redirects.csv в таблицу redirects.
 *
 *   node --env-file=.env.local db/load-redirects.ts
 *
 * Идемпотентно: upsert по from_path, повторный запуск ничего не дублирует.
 * Строки, которых нет в файле, не удаляются (только сообщаем о них).
 *
 * Формат файла: from_path,to_path,status_code,type,comment
 *   301 — to_path: новый адрес (со слешем, может быть с query);
 *   410 — to_path пустой (страница удалена, отдаётся 404-разметка с кодом 410);
 *   from_path с «*» в конце — правило по префиксу.
 * type и comment — для людей (откуда строка и почему такой адрес), в базу не идут.
 * from_path нормализуется так же, как в proxy (app/_lib/redirect-path.ts).
 */
import { readFileSync } from 'node:fs'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { normalizeFromPath } from '../app/_lib/redirect-path.ts'
import { redirects } from './schema/index.ts'

// Скрипт запускается вне Next, поэтому подключение своё, а не общий пул из db/index.ts.
const db = drizzle(process.env.DATABASE_URL!)

const FILE = new URL('./redirects.csv', import.meta.url)

/** CSV по RFC 4180: поля в кавычках могут содержать запятые и "" внутри. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((f) => f.trim()))
}

const [header, ...lines] = parseCsv(readFileSync(FILE, 'utf8').replace(/^﻿/, ''))
const col = (name: string) => {
  const i = header.indexOf(name)
  if (i < 0) throw new Error(`В ${FILE.pathname} нет колонки ${name}`)
  return i
}
const [iFrom, iTo, iCode] = [col('from_path'), col('to_path'), col('status_code')]

const errors: string[] = []
const byFrom = new Map<string, { fromPath: string; toPath: string; statusCode: number }>()
lines.forEach((r, n) => {
  const line = n + 2
  const fromPath = normalizeFromPath(r[iFrom] ?? '')
  const toPath = (r[iTo] ?? '').trim()
  const statusCode = Number(r[iCode] || 301)
  if (statusCode !== 301 && statusCode !== 410) errors.push(`${line}: код ${statusCode} — допустимы 301 и 410`)
  else if (statusCode === 301 && !toPath.startsWith('/')) errors.push(`${line}: 301 без нового адреса (${toPath || 'пусто'})`)
  else if (statusCode === 410 && toPath) errors.push(`${line}: у 410 to_path должен быть пустым`)
  else if (toPath && toPath.split('?')[0] === fromPath) errors.push(`${line}: редирект сам на себя (${fromPath})`)
  else if (byFrom.has(fromPath)) errors.push(`${line}: from_path ${fromPath} повторяется`)
  else if (fromPath.length > 512 || toPath.length > 512) errors.push(`${line}: адрес длиннее 512 символов`)
  else byFrom.set(fromPath, { fromPath, toPath, statusCode })
})
// Цепочки: новый адрес не должен сам быть старым адресом из карты — редирект в один шаг.
for (const r of byFrom.values()) {
  const target = r.toPath && normalizeFromPath(r.toPath)
  if (target && byFrom.has(target)) errors.push(`цепочка: ${r.fromPath} → ${r.toPath} → ${byFrom.get(target)!.toPath}`)
}
if (errors.length) {
  console.error(`Ошибки в ${FILE.pathname}:\n${errors.join('\n')}`)
  process.exit(1)
}

const rows = [...byFrom.values()]
for (let i = 0; i < rows.length; i += 500) {
  await db
    .insert(redirects)
    .values(rows.slice(i, i + 500).map((r) => ({ ...r, isActive: true })))
    .onConflictDoUpdate({
      target: redirects.fromPath,
      set: {
        toPath: sql`excluded.to_path`,
        statusCode: sql`excluded.status_code`,
        isActive: true,
      },
    })
}

const inDb = await db.select({ fromPath: redirects.fromPath }).from(redirects)
const extra = inDb.filter((r) => !byFrom.has(r.fromPath))
const count = (code: number) => rows.filter((r) => r.statusCode === code).length
console.log(`redirects: загружено ${rows.length} (301: ${count(301)}, 410: ${count(410)}), всего в таблице ${inDb.length}`)
if (extra.length) console.log(`В таблице есть правила не из файла (${extra.length}), не трогаем:\n${extra.map((r) => r.fromPath).join('\n')}`)
process.exit(0)
