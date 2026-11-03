/**
 * Импорт каталога Laminam из таблицы клиента.
 *
 * Структура выгрузки отличается от Vicostone:
 *   строка с «Колекція + Назва» открывает декор, строки с «*» ниже — его варианты
 *   размера и толщины; один декор повторяется столько раз, сколько у него поверхностей,
 *   и у каждой поверхности свой якорь на странице производителя.
 *
 * Карточка каталога = декор (как в каталоге самого Laminam). Поверхности живут внутри:
 * своя ссылка в material_surfaces.source_url, свои фото (material_images.surface_id)
 * и свои сочетания формата с толщиной (material_variants).
 *
 * Назначение берётся из легенды в правом столбце таблицы — оно задано по толщине плиты.
 *
 * Файлы не скачиваются: в material_images пишется внешний URL.
 * Скрипт идемпотентный, ничего не удаляет.
 *
 * Запуск: node --env-file=.env.local db/import-laminam.ts
 */
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import {
  applications,
  brands,
  collections,
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
  'https://docs.google.com/spreadsheets/d/18OFpG9qmOvwfkzce7r-HgAFRF2BeN6ojhSSXZDg5Gjo/export?format=csv&gid=0'

const BRAND_SLUG = 'laminam'

/** Легенда из правого столбца таблицы: назначение определяется толщиной плиты. */
const APPLICATIONS_BY_THICKNESS: Record<string, string[]> = {
  '2+ мм': ['stiny', 'kukhonni-mebli-fasady', 'dveri'],
  '3+ мм': ['stiny', 'vanna-kimnata', 'kukhonni-mebli-fasady', 'terasa', 'dveri', 'fasad'],
  '5 мм': ['stiny', 'vanna-kimnata', 'terasa', 'fasad', 'kaminy', 'pidloha', 'pidvikonnia', 'skhody'],
  '5+ мм': ['stiny', 'vanna-kimnata', 'terasa', 'fasad', 'kaminy', 'pidloha', 'pidvikonnia', 'skhody'],
  '6 мм': ['stiny', 'terasa', 'fasad', 'kaminy', 'pidloha', 'pidvikonnia', 'skhody'],
  '12+ мм': ['stilnytsi', 'ostrovy-kukhonni', 'fartukhy', 'pidvikonnia', 'kaminy', 'skhody', 'terasa', 'stoly'],
  '20+ мм': ['stilnytsi', 'ostrovy-kukhonni', 'fartukhy', 'pidvikonnia', 'skhody', 'terasa', 'stoly'],
}

/** «5мм (5+мм)» в выгрузке означает обе позиции сразу — разворачиваем в две толщины. */
const THICKNESS_BY_LABEL: Record<string, string[]> = {
  '2+мм': ['2+ мм'],
  '3+мм': ['3+ мм'],
  '5мм': ['5 мм'],
  '5мм (5+мм)': ['5 мм', '5+ мм'],
  '5+мм': ['5+ мм'],
  '6мм': ['6 мм'],
  '12+мм': ['12+ мм'],
  '20+мм': ['20+ мм'],
}

const DESIGN_BY_LABEL: Record<string, string> = {
  Однотон: 'odnoton',
  'Під натур. камінь': 'pid-kamin',
  'Під мармур': 'pid-marmur',
  'Під травертин': 'pid-travertyn',
  'Під бетон': 'pid-beton',
  'Під метал': 'pid-metal',
  'Під дерево': 'pid-derevo',
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
  Червоний: 'chervonyi',
}

/** Минимальный CSV: кавычки и запятые внутри полей, без переносов строк в ячейках. */
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

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

/** «BLEND AVORIO» из таблицы — в человеческое «Blend Avorio». */
const titleCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/(^|[\s-])([a-zà-ÿ])/g, (_, prefix, letter) => prefix + letter.toUpperCase())

type SurfaceRow = {
  surface: string
  link: string
  /** Якорь ссылки: он же имя обработки в названии файлов на CDN Laminam. */
  anchor: string
  variants: Array<{ size: string; thickness: string }>
}

type Decor = {
  /** Ключ страницы производителя — заменяет артикул, которого у Laminam в выгрузке нет. */
  key: string
  collection: string
  name: string
  design: string
  color: string
  pageUrl: string
  surfaces: SurfaceRow[]
}

function readSheet(csv: string) {
  const [, ...rows] = parseCsv(csv)
  const decors = new Map<string, Decor>()
  let currentRow: SurfaceRow | null = null
  let currentDecor: Decor | null = null

  for (const cells of rows) {
    const [collection, rawName, size, thickness, surface, link, , design, color] = cells
    const name = rawName?.trim()

    if (name && name !== '*') {
      const pageUrl = link.split('#')[0]
      const key = pageUrl.replace(/\/$/, '').split('/').pop() ?? ''
      if (!key) continue

      currentDecor = decors.get(key) ?? {
        key,
        collection,
        name: titleCase(name),
        design: '',
        color: '',
        pageUrl,
        surfaces: [],
      }
      // Дизайн и цвет заполнены только в первой строке группы — они относятся ко всему декору.
      if (design) currentDecor.design = design
      if (color) currentDecor.color = color
      decors.set(key, currentDecor)

      currentRow = { surface, link, anchor: link.split('#')[1] ?? '', variants: [] }
      currentDecor.surfaces.push(currentRow)
    }

    if (currentRow && size && thickness) currentRow.variants.push({ size, thickness })
  }

  return [...decors.values()]
}

/**
 * Фото лежат на CDN Laminam, в имени файла — обработка: calacatta-black-rain-3.webp.
 * Сопоставляем с якорем ссылки (rain-2 → rain, bush-hammered → bushhammered),
 * берём вариант 2000x4000 — остальные размеры это превью того же кадра.
 */
function extractImages(html: string) {
  // Только CDN: og:image — тот же кадр в трети разрешения (417×1253 против 1331×4000).
  const urls = [
    ...new Set(
      [...html.matchAll(/https:\/\/laminam-cdn[^"' )]+\.webp/g)]
        .map((match) => match[0])
        .filter((url) => url.includes('/2000x4000/')),
    ),
  ]
  return urls.map((url) => ({ url, file: normalize(url.split('/').pop() ?? '') }))
}

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

async function importCatalog() {
  const csv = await fetch(SHEET_CSV).then((response) => response.text())
  const decors = readSheet(csv)
  console.log(
    `Декорів: ${decors.length}, поверхонь: ${decors.reduce((sum, d) => sum + d.surfaces.length, 0)}`,
  )

  const [brand] = await db.select().from(brands).where(eq(brands.slug, BRAND_SLUG))
  if (!brand) throw new Error(`Бренд ${BRAND_SLUG} не знайдено — спочатку db:seed`)

  const bySlug = <T extends { slug: string; id: number }>(rows: T[]) =>
    new Map(rows.map((row) => [row.slug, row.id]))
  const colorIds = bySlug(await db.select().from(colors))
  const designIds = bySlug(await db.select().from(designs))
  const applicationIds = bySlug(await db.select().from(applications))
  const surfaceRows = await db.select().from(surfaces)
  const surfaceByName = new Map(surfaceRows.map((row) => [normalize(row.name), row.id]))
  const collectionRows = await db.select().from(collections).where(eq(collections.brandId, brand.id))
  const collectionByName = new Map(collectionRows.map((row) => [normalize(row.name), row.id]))
  const sizeRows = await db.select().from(sizes).where(eq(sizes.brandId, brand.id))
  const sizeBySlug = bySlug(sizeRows)
  const thicknessRows = await db.select().from(thicknesses).where(eq(thicknesses.brandId, brand.id))
  const thicknessByLabel = new Map(thicknessRows.map((row) => [row.label, row.id]))

  console.log('Читаю сторінки виробника…')
  const pages = await mapWithConcurrency(decors, 5, async (decor) => {
    try {
      const response = await fetch(decor.pageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!response.ok) throw new Error(String(response.status))
      return extractImages(await response.text())
    } catch (error) {
      console.warn(`  ${decor.key}: ${(error as Error).message}`)
      return []
    }
  })

  const warnings: string[] = []
  let created = 0
  let updated = 0
  let insertedImages = 0
  let insertedVariants = 0

  for (const [index, decor] of decors.entries()) {
    const [existing] = await db
      .select({ id: materials.id })
      .from(materials)
      .where(and(eq(materials.brandId, brand.id), eq(materials.article, decor.key)))

    const collectionId = collectionByName.get(normalize(decor.collection)) ?? null
    if (!collectionId) warnings.push(`${decor.key}: немає колекції «${decor.collection}»`)

    const values = {
      brandId: brand.id,
      collectionId,
      name: decor.name,
      article: decor.key,
      slug: decor.key,
      sourceUrl: decor.pageUrl,
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

    const colorId = colorIds.get(COLOR_BY_LABEL[decor.color])
    if (colorId) {
      await db.insert(materialColors).values({ materialId, colorId }).onConflictDoNothing()
    } else if (decor.color) {
      warnings.push(`${decor.key}: немає кольору «${decor.color}»`)
    }

    const designId = designIds.get(DESIGN_BY_LABEL[decor.design])
    if (designId) {
      await db.insert(materialDesigns).values({ materialId, designId }).onConflictDoNothing()
    } else if (decor.design) {
      warnings.push(`${decor.key}: немає дизайну «${decor.design}»`)
    }

    const usedThicknessLabels = new Set<string>()
    const surfaceIdByAnchor = new Map<string, number>()

    for (const row of decor.surfaces) {
      const surfaceId = surfaceByName.get(normalize(row.surface))
      if (!surfaceId) {
        warnings.push(`${decor.key}: немає поверхні «${row.surface}»`)
        continue
      }
      surfaceIdByAnchor.set(row.anchor, surfaceId)

      await db
        .insert(materialSurfaces)
        .values({ materialId, surfaceId, sourceUrl: row.link })
        .onConflictDoNothing()
      await db
        .update(materialSurfaces)
        .set({ sourceUrl: row.link })
        .where(
          and(eq(materialSurfaces.materialId, materialId), eq(materialSurfaces.surfaceId, surfaceId)),
        )

      for (const [position, variant] of row.variants.entries()) {
        const sizeId = sizeBySlug.get(variant.size.replace('*', 'x'))
        if (!sizeId) {
          warnings.push(`${decor.key}: немає розміру «${variant.size}»`)
          continue
        }
        for (const label of THICKNESS_BY_LABEL[variant.thickness] ?? []) {
          const thicknessId = thicknessByLabel.get(label)
          if (!thicknessId) {
            warnings.push(`${decor.key}: немає товщини «${label}»`)
            continue
          }
          usedThicknessLabels.add(label)
          const inserted = await db
            .insert(materialVariants)
            .values({ materialId, surfaceId, sizeId, thicknessId, sort: position + 1 })
            .onConflictDoNothing()
            .returning({ id: materialVariants.id })
          if (inserted.length) insertedVariants++

          // Плоские связи держим заполненными: на них опираются форма и простые фильтры.
          await db.insert(materialSizes).values({ materialId, sizeId }).onConflictDoNothing()
          await db
            .insert(materialThicknesses)
            .values({ materialId, thicknessId })
            .onConflictDoNothing()
        }
        if (!THICKNESS_BY_LABEL[variant.thickness]) {
          warnings.push(`${decor.key}: невідома товщина «${variant.thickness}»`)
        }
      }
    }

    // Назначение собирается из легенды по всем толщинам декора.
    const applicationSlugs = new Set(
      [...usedThicknessLabels].flatMap((label) => APPLICATIONS_BY_THICKNESS[label] ?? []),
    )
    for (const slug of applicationSlugs) {
      const applicationId = applicationIds.get(slug)
      if (!applicationId) {
        warnings.push(`${decor.key}: немає призначення «${slug}»`)
        continue
      }
      await db
        .insert(materialApplications)
        .values({ materialId, applicationId })
        .onConflictDoNothing()
    }

    const existingImages = await db
      .select({ url: materialImages.url, surfaceId: materialImages.surfaceId })
      .from(materialImages)
      .where(eq(materialImages.materialId, materialId))
    const knownUrls = new Set(existingImages.map((row) => row.url))
    // Кадров одной обработки производитель даёт до восьми — это варианты рисунка плиты.
    // В каталог берём первый: карточке хватает по одному снимку на обработку.
    const coveredSurfaces = new Set(existingImages.map((row) => row.surfaceId))
    let position = existingImages.length

    // У декора с единственной обработкой ссылка идёт без якоря — все фото и так её.
    const soleSurfaceId =
      surfaceIdByAnchor.size === 1 ? [...surfaceIdByAnchor.values()][0] : null

    for (const image of pages[index]) {
      if (knownUrls.has(image.url)) continue
      // Обработка в имени файла: rain-2 → rain, bush-hammered → bushhammered.
      const anchor = [...surfaceIdByAnchor.keys()].find((candidate) => {
        const token = normalize(candidate.replace(/-\d+$/, ''))
        return token && image.file.includes(token)
      })
      const surfaceId = anchor ? surfaceIdByAnchor.get(anchor)! : soleSurfaceId
      if (coveredSurfaces.has(surfaceId)) continue
      coveredSurfaces.add(surfaceId)

      await db.insert(materialImages).values({
        materialId,
        surfaceId,
        url: image.url,
        alt: decor.name,
        isMain: position === 0,
        sort: ++position,
      })
      insertedImages++
    }

    if (!pages[index].length) warnings.push(`${decor.key}: не знайдено жодного фото`)
  }

  console.log(`Матеріали: створено ${created}, оновлено ${updated}`)
  console.log(`Варіантів додано: ${insertedVariants}, фото додано: ${insertedImages}`)
  if (warnings.length) {
    const unique = [...new Set(warnings)]
    console.log(`\nПопередження (${unique.length}):`)
    for (const warning of unique.slice(0, 40)) console.log(`  ${warning}`)
    if (unique.length > 40) console.log(`  … ще ${unique.length - 40}`)
  }
}

importCatalog()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
