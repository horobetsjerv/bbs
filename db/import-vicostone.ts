/**
 * Импорт каталога Vicostone из таблицы клиента.
 *
 * Источник данных — Google Sheet (лист выгрузки), фото — со страниц производителя,
 * ссылки на которые есть в той же таблице. Файлы не скачиваются: в material_images
 * пишется внешний URL.
 *
 * Скрипт идемпотентный: материал ищется по паре (бренд, артикул), связи и фото
 * добавляются только те, которых ещё нет. Ничего не удаляет.
 *
 * Запуск: node --env-file=.env.local db/import-vicostone.ts
 */
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import {
  applications,
  brands,
  colors,
  designs,
  materialApplications,
  materialColors,
  materialDesigns,
  materialImages,
  materialSizes,
  materialSurfaces,
  materialThicknesses,
  materialVariants,
  materials,
  sizes,
  surfaces,
  thicknesses,
} from './schema/index.ts'

const db = drizzle(process.env.DATABASE_URL!)

const SHEET_CSV =
  'https://docs.google.com/spreadsheets/d/1egi3OFKGS0-bB8ap2fkAi7Nj0sxHFL8h1OIaNaf9oeI/export?format=csv&gid=0'

const BRAND_SLUG = 'vicostone'

/** Назначение у всех декоров Vicostone одинаковое — так указано в первой строке выгрузки. */
const APPLICATION_SLUGS = ['stilnytsi', 'fartukhy', 'skhody', 'pidvikonnia', 'ostrovy-kukhonni']

/** Значения из таблицы приведены к slug справочников. Род в «Напівполірований» у клиента плавает. */
const SIZE_BY_LABEL: Record<string, string> = {
  'Normal (3000*1400)': 'normal-3000x1400',
  'Jambo (3300*1650)': 'jambo-3300x1650',
}

const SURFACE_BY_LABEL: Record<string, string> = {
  Матова: 'matova',
  Напівполірований: 'napivpolirovana',
  Напівполірована: 'napivpolirovana',
  Полірований: 'polirovana',
  Полірована: 'polirovana',
}

const DESIGN_BY_LABEL: Record<string, string> = {
  Однотон: 'odnoton',
  Крошка: 'kroshka',
  'Під камінь': 'pid-kamin',
  'Під мармур': 'pid-marmur',
  'Під граніт': 'pid-granit',
}

const COLOR_BY_LABEL: Record<string, string> = {
  Білий: 'bilyi',
  Кремовий: 'kremovyi',
  Бежевий: 'bezhevyi',
  Сірий: 'siryi',
  Чорний: 'chornyi',
  Коричневий: 'korychnevyi',
  Синій: 'synii',
  Зелений: 'zelenyi',
}

/** «Під граніт» есть в выгрузке, но не было в сидах справочника. */
const MISSING_DESIGNS = [{ slug: 'pid-granit', name: 'Під граніт' }]

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ie', ж: 'zh', з: 'z',
  и: 'y', і: 'i', ї: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'shch', ь: '', ю: 'iu', я: 'ia', ы: 'y', э: 'e', ё: 'e', ъ: '',
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .split('')
    .map((char) => TRANSLIT[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Минимальный CSV: кавычки и запятые внутри полей, без переносов строк внутри ячеек. */
function parseCsv(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => {
      const cells: string[] = []
      let cell = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cell += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          cells.push(cell.trim())
          cell = ''
        } else {
          cell += char
        }
      }
      cells.push(cell.trim())
      return cells
    })
}

const decodeEntities = (value: string) => value.replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))

/**
 * Фото на карточке производителя лежат в background-image слайдера и в og:image.
 * Тем же классом размечен блок «схожі кольори», поэтому оставляем только пути
 * с нашим артикулом; (?![0-9]) отсекает BQ1080 при поиске BQ100.
 */
function extractImages(html: string, article: string) {
  const found: string[] = []
  const push = (raw: string) => {
    const url = decodeEntities(raw.trim())
    const absolute = url.startsWith('http') ? url : `https://vicostone.com${url}`
    if (!found.includes(absolute)) found.push(absolute)
  }

  const belongsToProduct = new RegExp(`${article}(?![0-9])`, 'i')

  const background = /background-image:\s*url\('([^']+)'\)/g
  let match: RegExpExecArray | null
  while ((match = background.exec(html))) {
    // closeup — макро фактуры, почти неотличимое от fullslab в карточке. Берём только плиту.
    if (belongsToProduct.test(match[1]) && !/closeup/i.test(match[1])) push(match[1])
  }

  // og:image отдаётся с параметрами кропа под соцсети (?h=630&w=1200) — без них приходит оригинал.
  const og = html.match(/property="og:image"\s+content="([^"]+)"/)
  if (og && belongsToProduct.test(og[1])) push(og[1].replace(/^http:/, 'https:').split('?')[0])

  // Главным должно быть фото самого камня, а не интерьер: сперва full slab.
  const weight = (url: string) => (/fullslab/i.test(url) ? 0 : 1)
  return found
    .map((url, index) => ({ url, index }))
    .sort((a, b) => weight(a.url) - weight(b.url) || a.index - b.index)
    .map((item) => item.url)
}

async function fetchImages(sourceUrl: string, article: string) {
  const response = await fetch(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!response.ok) throw new Error(`${response.status} ${sourceUrl}`)
  return extractImages(await response.text(), article)
}

/** Запросы к сайту производителя идут пачками, чтобы не долбить его 42 соединениями сразу. */
async function mapWithConcurrency<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length)
  let cursor = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++
        results[index] = await worker(items[index])
      }
    }),
  )
  return results
}

async function dictionary<T extends { slug: string; id: number }>(rows: T[]) {
  return new Map(rows.map((row) => [row.slug, row.id]))
}

async function importCatalog() {
  const csv = await fetch(SHEET_CSV).then((response) => response.text())
  const [, ...rows] = parseCsv(csv)
  const items = rows
    .filter((cells) => cells[0] && cells[1])
    .map((cells) => ({
      name: cells[0],
      article: cells[1],
      size: cells[2],
      thickness: Number.parseInt(cells[3], 10),
      surface: cells[4],
      sourceUrl: cells[5],
      design: cells[7],
      color: cells[8],
    }))

  console.log(`Позицій у таблиці: ${items.length}`)

  const [brand] = await db.select().from(brands).where(eq(brands.slug, BRAND_SLUG))
  if (!brand) throw new Error(`Бренд ${BRAND_SLUG} не знайдено — спочатку db:seed`)

  for (const [index, design] of MISSING_DESIGNS.entries()) {
    await db
      .insert(designs)
      .values({ ...design, sort: 100 + index })
      .onConflictDoNothing({ target: designs.slug })
  }

  const colorIds = await dictionary(await db.select().from(colors))
  const surfaceIds = await dictionary(await db.select().from(surfaces))
  const designIds = await dictionary(await db.select().from(designs))
  const applicationIds = await dictionary(await db.select().from(applications))
  const sizeIds = await dictionary(await db.select().from(sizes).where(eq(sizes.brandId, brand.id)))
  const thicknessRows = await db.select().from(thicknesses).where(eq(thicknesses.brandId, brand.id))
  const thicknessIds = new Map(thicknessRows.map((row) => [row.valueMm, row.id]))

  console.log('Читаю сторінки виробника…')
  const images = await mapWithConcurrency(items, 5, async (item) => {
    try {
      return await fetchImages(item.sourceUrl, item.article)
    } catch (error) {
      console.warn(`  ${item.article}: ${(error as Error).message}`)
      return []
    }
  })

  const warnings: string[] = []
  let created = 0
  let updated = 0
  let insertedImages = 0
  let insertedVariants = 0

  for (const [index, item] of items.entries()) {
    const [existing] = await db
      .select({ id: materials.id })
      .from(materials)
      .where(and(eq(materials.brandId, brand.id), eq(materials.article, item.article)))

    const values = {
      brandId: brand.id,
      name: item.name,
      article: item.article,
      slug: slugify(item.name),
      sourceUrl: item.sourceUrl,
      sort: index + 1,
      updatedAt: new Date(),
    }

    let materialId: number
    if (existing) {
      await db.update(materials).set(values).where(eq(materials.id, existing.id))
      materialId = existing.id
      updated++
    } else {
      const [row] = await db.insert(materials).values(values).returning({ id: materials.id })
      materialId = row.id
      created++
    }

    const link = async (
      table: typeof materialColors | typeof materialSurfaces | typeof materialDesigns | typeof materialApplications | typeof materialSizes | typeof materialThicknesses,
      column: string,
      id: number | undefined,
      label: string,
    ) => {
      if (!id) {
        warnings.push(`${item.article}: немає в довіднику — ${label}`)
        return
      }
      await db
        .insert(table)
        .values({ materialId, [column]: id } as never)
        .onConflictDoNothing()
    }

    const surfaceId = surfaceIds.get(SURFACE_BY_LABEL[item.surface])
    const sizeId = sizeIds.get(SIZE_BY_LABEL[item.size])
    const thicknessId = thicknessIds.get(item.thickness)

    await link(materialColors, 'colorId', colorIds.get(COLOR_BY_LABEL[item.color]), `колір «${item.color}»`)
    await link(materialSurfaces, 'surfaceId', surfaceId, `поверхня «${item.surface}»`)
    await link(materialDesigns, 'designId', designIds.get(DESIGN_BY_LABEL[item.design]), `дизайн «${item.design}»`)
    await link(materialSizes, 'sizeId', sizeId, `розмір «${item.size}»`)
    await link(materialThicknesses, 'thicknessId', thicknessId, `товщина «${item.thickness}»`)
    for (const slug of APPLICATION_SLUGS) {
      await link(materialApplications, 'applicationId', applicationIds.get(slug), `призначення «${slug}»`)
    }

    // У Vicostone на позицию приходится одно сочетание формата и толщины, но храним его
    // так же, как у Laminam: фильтр по паре должен работать одинаково для обоих брендов.
    if (sizeId && thicknessId) {
      const inserted = await db
        .insert(materialVariants)
        .values({ materialId, surfaceId: surfaceId ?? null, sizeId, thicknessId, sort: 1 })
        .onConflictDoNothing()
        .returning({ id: materialVariants.id })
      if (inserted.length) insertedVariants++
    }

    const existingImages = await db
      .select({ url: materialImages.url })
      .from(materialImages)
      .where(eq(materialImages.materialId, materialId))
    const knownUrls = new Set(existingImages.map((row) => row.url))
    const hasMain = existingImages.length > 0

    for (const [position, url] of images[index].entries()) {
      if (knownUrls.has(url)) continue
      await db.insert(materialImages).values({
        materialId,
        url,
        alt: `${item.name} ${item.article}`,
        isMain: !hasMain && position === 0,
        sort: position + 1,
      })
      insertedImages++
    }

    if (!images[index].length) warnings.push(`${item.article}: не знайдено жодного фото`)
  }

  console.log(`Матеріали: створено ${created}, оновлено ${updated}`)
  console.log(`Варіантів додано: ${insertedVariants}, фото додано: ${insertedImages}`)
  if (warnings.length) {
    console.log(`\nПопередження (${warnings.length}):`)
    for (const warning of warnings) console.log(`  ${warning}`)
  }
}

importCatalog()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
