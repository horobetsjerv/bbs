/**
 * Сидинг справочников каталога.
 * Значения взяты из выгрузки клиента по Vicostone и из ТЗ (п. 3.2).
 * Скрипт идемпотентный: повторный запуск не создаёт дублей.
 */
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import {
  applications,
  brands,
  collections,
  colors,
  designs,
  leadTopics,
  postCategories,
  projectTags,
  sizes,
  surfaces,
  thicknesses,
} from './schema/index.ts'

// Скрипт запускается вне Next, поэтому подключение своё, а не общий пул из db/index.ts.
const db = drizzle(process.env.DATABASE_URL!)

const BRANDS = [
  { slug: 'laminam', name: 'Laminam', sort: 1 },
  { slug: 'vicostone', name: 'Vicostone', sort: 2 },
]

const COLORS = [
  { slug: 'bilyi', name: 'Білий', hex: '#FFFFFF' },
  { slug: 'kremovyi', name: 'Кремовий', hex: '#F0E6D2' },
  { slug: 'bezhevyi', name: 'Бежевий', hex: '#D8C3A5' },
  { slug: 'siryi', name: 'Сірий', hex: '#8E8E8E' },
  { slug: 'chornyi', name: 'Чорний', hex: '#1C1C1C' },
  { slug: 'korychnevyi', name: 'Коричневий', hex: '#6B4F3A' },
  { slug: 'synii', name: 'Синій', hex: '#3A5A8C' },
  { slug: 'zelenyi', name: 'Зелений', hex: '#4A6B52' },
  { slug: 'chervonyi', name: 'Червоний', hex: '#8C3A32' },
]

/** Первые четыре — из выгрузки Vicostone, дальше фирменные обработки Laminam. */
const SURFACES = [
  { slug: 'matova', name: 'Матова' },
  { slug: 'napivpolirovana', name: 'Напівполірована' },
  { slug: 'polirovana', name: 'Полірована' },
  { slug: 'strukturovana', name: 'Структурована' },
  { slug: 'naturale', name: 'Naturale' },
  { slug: 'strutturato', name: 'Strutturato' },
  { slug: 'lucidato', name: 'Lucidato' },
  { slug: 'lucidato-starlit', name: 'Lucidato Starlit' },
  { slug: 'bocciardato', name: 'Bocciardato' },
  { slug: 'fiammato', name: 'Fiammato' },
  { slug: 'a-spacco', name: 'a Spacco' },
  { slug: 'soft-touch', name: 'Soft Touch' },
  { slug: 'caress', name: 'Caress' },
  { slug: 'rain', name: 'Rain' },
  { slug: 'filo', name: 'Filo' },
  { slug: 'gemini', name: 'Gemini' },
  { slug: 'ki-no-bi', name: 'Ki no bi' },
  { slug: 'dna', name: 'DNA' },
  { slug: 'dna-code', name: 'DNA Code' },
  { slug: 'slate', name: 'Slate' },
]

const DESIGNS = [
  { slug: 'odnoton', name: 'Однотон' },
  { slug: 'kroshka', name: 'Крошка' },
  { slug: 'pid-kamin', name: 'Під камінь' },
  { slug: 'pid-marmur', name: 'Під мармур' },
  { slug: 'pid-granit', name: 'Під граніт' },
  { slug: 'pid-travertyn', name: 'Під травертин' },
  { slug: 'pid-beton', name: 'Під бетон' },
  { slug: 'pid-metal', name: 'Під метал' },
  { slug: 'pid-derevo', name: 'Під дерево' },
]

/** Последние шесть добавлены из легенды Laminam: там назначение расписано по толщине плиты. */
const APPLICATIONS = [
  { slug: 'stilnytsi', name: 'Стільниці' },
  { slug: 'fartukhy', name: 'Фартухи' },
  { slug: 'ostrovy-kukhonni', name: 'Острови кухонні' },
  { slug: 'pidvikonnia', name: 'Підвіконня' },
  { slug: 'skhody', name: 'Сходи' },
  { slug: 'pidloha', name: 'Підлога' },
  { slug: 'stiny', name: 'Стіни' },
  { slug: 'fasad', name: 'Фасад' },
  { slug: 'vanna-kimnata', name: 'Ванна кімната' },
  { slug: 'kukhonni-mebli-fasady', name: 'Кухонні та меблеві фасади' },
  { slug: 'terasa', name: 'Тераса' },
  { slug: 'dveri', name: 'Двері' },
  { slug: 'kaminy', name: 'Каміни' },
  { slug: 'stoly', name: 'Столи' },
]

/** Форматы плит: у каждого бренда свои, поэтому привязаны к бренду. */
const SIZES: Record<string, Array<{ slug: string; label: string; widthMm: number; heightMm: number }>> = {
  vicostone: [
    { slug: 'normal-3000x1400', label: 'Normal (3000×1400)', widthMm: 3000, heightMm: 1400 },
    { slug: 'jambo-3300x1650', label: 'Jambo (3300×1650)', widthMm: 3300, heightMm: 1650 },
  ],
  laminam: [
    { slug: '3000x1000', label: '3000×1000', widthMm: 3000, heightMm: 1000 },
    { slug: '3000x1200', label: '3000×1200', widthMm: 3000, heightMm: 1200 },
    { slug: '3240x1620', label: '3240×1620', widthMm: 3240, heightMm: 1620 },
    { slug: '1200x1200', label: '1200×1200', widthMm: 1200, heightMm: 1200 },
    { slug: '1000x1000', label: '1000×1000', widthMm: 1000, heightMm: 1000 },
  ],
}

/**
 * label — то, что видно менеджеру. У Laminam «5 мм» и «5+ мм» (с армирующей подложкой)
 * это разные позиции, поэтому одного числа мало. Значения — из выгрузок клиента.
 */
const THICKNESSES: Record<string, Array<{ valueMm: number; label: string }>> = {
  vicostone: [{ valueMm: 20, label: '20 мм' }],
  laminam: [
    { valueMm: 2, label: '2+ мм' },
    { valueMm: 3, label: '3+ мм' },
    { valueMm: 5, label: '5 мм' },
    { valueMm: 5, label: '5+ мм' },
    { valueMm: 6, label: '6 мм' },
    { valueMm: 12, label: '12+ мм' },
    { valueMm: 20, label: '20+ мм' },
  ],
}

/** Коллекции Laminam — из выгрузки клиента. */
const COLLECTIONS: Record<string, Array<{ slug: string; name: string }>> = {
  laminam: [
    { slug: 'blend', name: 'Blend' },
    { slug: 'calce', name: 'Calce' },
    { slug: 'collection', name: 'Collection' },
    { slug: 'diamond', name: 'Diamond' },
    { slug: 'filo', name: 'Filo' },
    { slug: 'fluidosolido', name: 'Fluidosolido' },
    { slug: 'fokos', name: 'Fokos' },
    { slug: 'gemini', name: 'Gemini' },
    { slug: 'hado', name: 'Hado' },
    { slug: 'i-naturali', name: 'I Naturali' },
    { slug: 'in-side', name: 'In-Side' },
    { slug: 'ki-no-bi', name: 'Ki No Bi' },
    { slug: 'legno-venezia', name: 'Legno Venezia' },
    { slug: 'ossido', name: 'Ossido' },
    { slug: 'oxide', name: 'Oxide' },
    { slug: 'rare', name: 'Rare' },
    { slug: 'seta', name: 'Seta' },
    { slug: 'slate', name: 'Slate' },
  ],
}

const PROJECT_TAGS = [
  { slug: 'stilnytsia', name: 'Стільниця' },
  { slug: 'fasad', name: 'Фасад' },
  { slug: 'interier', name: "Інтер'єр" },
  { slug: 'pidloha', name: 'Підлога' },
]

/** Стартовые рубрики блога; остальные клиент заводит из формы статьи. */
const POST_CATEGORIES = [
  { slug: 'ohliady', name: 'Огляди' },
  { slug: 'rekomendatsii', name: 'Рекомендації' },
]

const LEAD_TOPICS = [
  { slug: 'zamovyty-zrazok', name: 'Замовити зразок' },
  { slug: 'zapytaty-tsinu', name: 'Запитати ціну' },
  { slug: 'spivpratsia', name: 'Співпраця' },
  { slug: 'inshe', name: 'Інше' },
]

async function seed() {
  for (const [i, brand] of BRANDS.entries()) {
    await db.insert(brands).values({ ...brand, sort: i + 1 }).onConflictDoNothing({ target: brands.slug })
  }

  for (const [i, color] of COLORS.entries()) {
    await db.insert(colors).values({ ...color, sort: i + 1 }).onConflictDoNothing({ target: colors.slug })
  }

  for (const [i, surface] of SURFACES.entries()) {
    await db.insert(surfaces).values({ ...surface, sort: i + 1 }).onConflictDoNothing({ target: surfaces.slug })
  }

  for (const [i, design] of DESIGNS.entries()) {
    await db.insert(designs).values({ ...design, sort: i + 1 }).onConflictDoNothing({ target: designs.slug })
  }

  for (const [i, application] of APPLICATIONS.entries()) {
    await db
      .insert(applications)
      .values({ ...application, sort: i + 1 })
      .onConflictDoNothing({ target: applications.slug })
  }

  for (const [i, tag] of PROJECT_TAGS.entries()) {
    await db.insert(projectTags).values({ ...tag, sort: i + 1 }).onConflictDoNothing({ target: projectTags.slug })
  }

  for (const [i, category] of POST_CATEGORIES.entries()) {
    await db
      .insert(postCategories)
      .values({ ...category, sort: i + 1 })
      .onConflictDoNothing({ target: postCategories.slug })
  }
  for (const [i, topic] of LEAD_TOPICS.entries()) {
    await db.insert(leadTopics).values({ ...topic, sort: i + 1 }).onConflictDoNothing({ target: leadTopics.slug })
  }

  for (const brand of BRANDS) {
    const [row] = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, brand.slug))
    if (!row) continue

    for (const [i, size] of (SIZES[brand.slug] ?? []).entries()) {
      await db
        .insert(sizes)
        .values({ ...size, brandId: row.id, sort: i + 1 })
        .onConflictDoNothing()
    }

    for (const [i, thickness] of (THICKNESSES[brand.slug] ?? []).entries()) {
      await db
        .insert(thicknesses)
        .values({ ...thickness, brandId: row.id, sort: i + 1 })
        .onConflictDoNothing()
    }

    for (const [i, collection] of (COLLECTIONS[brand.slug] ?? []).entries()) {
      await db
        .insert(collections)
        .values({ ...collection, brandId: row.id, sort: i + 1 })
        .onConflictDoNothing()
    }
  }

  console.log('Довідники заповнено')
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
