import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

/** Laminam / Vicostone. Отдельная таблица, а не enum: у бренда есть своя страница с контентом. */
export const brands = pgTable('brands', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }).notNull(),
  description: text('description'),
  heroImage: text('hero_image'),
  videoUrl: text('video_url'),
  sort: integer('sort').notNull().default(0),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  ogImage: text('og_image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const collections = pgTable(
  'collections',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 128 }).notNull(),
    name: varchar('name', { length: 128 }).notNull(),
    description: text('description'),
    image: text('image'),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [uniqueIndex('collections_brand_slug_uq').on(t.brandId, t.slug)],
)

/** Справочник оттенков. hex — для цветных кружочков в фильтре каталога. */
export const colors = pgTable('colors', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 64 }).notNull(),
  hex: varchar('hex', { length: 7 }),
  sort: integer('sort').notNull().default(0),
})

/** Поверхность: матовая, полированная, полуполированная, структурированная. */
export const surfaces = pgTable('surfaces', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 64 }).notNull(),
  sort: integer('sort').notNull().default(0),
})

/** Дизайн из таблицы клиента: однотон, крошка, под камень, под мрамор. */
export const designs = pgTable('designs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 64 }).notNull(),
  sort: integer('sort').notNull().default(0),
})

/** Применение: столешницы, фартуки, полы, стены, фасады, лестницы, подоконники, острова. */
export const applications = pgTable('applications', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 64 }).notNull(),
  icon: varchar('icon', { length: 64 }),
  sort: integer('sort').notNull().default(0),
})

/** Формат плиты. brandId — область значений: Jambo есть у Vicostone, 3000x1000 у Laminam. */
export const sizes = pgTable(
  'sizes',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 64 }).notNull(),
    label: varchar('label', { length: 64 }).notNull(),
    widthMm: integer('width_mm').notNull(),
    heightMm: integer('height_mm').notNull(),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [uniqueIndex('sizes_brand_slug_uq').on(t.brandId, t.slug)],
)

/**
 * Толщина плиты. valueMm — число для сортировки и фильтров «от/до»,
 * label — то, что видит менеджер: у Laminam 5 мм и 5+ мм (с армирующей подложкой)
 * это разные продукты, одним числом их не различить.
 */
export const thicknesses = pgTable(
  'thicknesses',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    valueMm: integer('value_mm').notNull(),
    label: varchar('label', { length: 32 }).notNull(),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [unique('thicknesses_brand_label_uq').on(t.brandId, t.label)],
)

/** Карточка цвета — центральная сущность каталога (~270 позиций). */
export const materials = pgTable(
  'materials',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    brandId: integer('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'restrict' }),
    collectionId: integer('collection_id').references(() => collections.id, {
      onDelete: 'set null',
    }),
    slug: varchar('slug', { length: 160 }).notNull(),
    name: varchar('name', { length: 160 }).notNull(),
    /** Артикул клиента (BQ400, BS124) — ключ повторного импорта из Excel/CSV. */
    article: varchar('article', { length: 64 }).notNull(),
    description: text('description'),
    /** Водопоглощение, твёрдость, морозостойкость — набор полей у брендов разный. */
    techSpecs: jsonb('tech_specs').$type<Record<string, string>>(),
    specPdfUrl: text('spec_pdf_url'),
    /** Ссылка на страницу производителя из выгрузки клиента. */
    sourceUrl: text('source_url'),
    inStock: boolean('in_stock').notNull().default(false),
    isPublished: boolean('is_published').notNull().default(true),
    sort: integer('sort').notNull().default(0),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    ogImage: text('og_image'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('materials_brand_slug_uq').on(t.brandId, t.slug),
    uniqueIndex('materials_brand_article_uq').on(t.brandId, t.article),
    index('materials_collection_idx').on(t.collectionId),
    index('materials_published_idx').on(t.isPublished),
    // Поиск от 2 символов по названию, артикулу и описанию (п. 4.2 ТЗ).
    index('materials_search_idx').using(
      'gin',
      sql`to_tsvector('simple', coalesce(${t.name}, '') || ' ' || coalesce(${t.article}, '') || ' ' || coalesce(${t.description}, ''))`,
    ),
  ],
)

export const materialImages = pgTable(
  'material_images',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    /** У Laminam один декор снят в каждой поверхности отдельно; null — фото всей карточки. */
    surfaceId: integer('surface_id').references(() => surfaces.id, {
      onDelete: 'set null',
    }),
    url: text('url').notNull(),
    alt: varchar('alt', { length: 255 }),
    isMain: boolean('is_main').notNull().default(false),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [
    index('material_images_material_idx').on(t.materialId),
    index('material_images_surface_idx').on(t.surfaceId),
  ],
)

export const materialColors = pgTable(
  'material_colors',
  {
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    colorId: integer('color_id')
      .notNull()
      .references(() => colors.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.materialId, t.colorId] }), index('material_colors_color_idx').on(t.colorId)],
)

export const materialSurfaces = pgTable(
  'material_surfaces',
  {
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    surfaceId: integer('surface_id')
      .notNull()
      .references(() => surfaces.id, { onDelete: 'cascade' }),
    /** У Laminam каждая поверхность декора живёт на своём якоре страницы производителя. */
    sourceUrl: text('source_url'),
  },
  (t) => [
    primaryKey({ columns: [t.materialId, t.surfaceId] }),
    index('material_surfaces_surface_idx').on(t.surfaceId),
  ],
)

export const materialDesigns = pgTable(
  'material_designs',
  {
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    designId: integer('design_id')
      .notNull()
      .references(() => designs.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.materialId, t.designId] }), index('material_designs_design_idx').on(t.designId)],
)

export const materialApplications = pgTable(
  'material_applications',
  {
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    applicationId: integer('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.materialId, t.applicationId] }),
    index('material_applications_application_idx').on(t.applicationId),
  ],
)

export const materialSizes = pgTable(
  'material_sizes',
  {
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    sizeId: integer('size_id')
      .notNull()
      .references(() => sizes.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.materialId, t.sizeId] }), index('material_sizes_size_idx').on(t.sizeId)],
)

export const materialThicknesses = pgTable(
  'material_thicknesses',
  {
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    thicknessId: integer('thickness_id')
      .notNull()
      .references(() => thicknesses.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.materialId, t.thicknessId] }),
    index('material_thicknesses_thickness_idx').on(t.thicknessId),
  ],
)

/**
 * Реально существующие сочетания формата и толщины.
 * material_sizes и material_thicknesses по отдельности дают декартово произведение:
 * у Laminam 3240×1620 бывает только в 5+ мм, и фильтр не должен предлагать 3+ мм.
 */
export const materialVariants = pgTable(
  'material_variants',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    /** Набор форматов зависит от обработки: у Laminam Rain идёт в 3+ мм, а Bocciardato в 5+ мм. */
    surfaceId: integer('surface_id').references(() => surfaces.id, {
      onDelete: 'cascade',
    }),
    sizeId: integer('size_id')
      .notNull()
      .references(() => sizes.id, { onDelete: 'cascade' }),
    thicknessId: integer('thickness_id')
      .notNull()
      .references(() => thicknesses.id, { onDelete: 'cascade' }),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [
    unique('material_variants_uq').on(
      t.materialId,
      t.surfaceId,
      t.sizeId,
      t.thicknessId,
    ),
    index('material_variants_size_idx').on(t.sizeId),
    index('material_variants_thickness_idx').on(t.thicknessId),
  ],
)

/** «Схожі кольори» на карточке — ручной подбор менеджером. */
export const materialRelated = pgTable(
  'material_related',
  {
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    relatedId: integer('related_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.materialId, t.relatedId] })],
)

export const brandsRelations = relations(brands, ({ many }) => ({
  collections: many(collections),
  materials: many(materials),
  sizes: many(sizes),
  thicknesses: many(thicknesses),
}))

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  brand: one(brands, { fields: [collections.brandId], references: [brands.id] }),
  materials: many(materials),
}))

export const materialsRelations = relations(materials, ({ one, many }) => ({
  brand: one(brands, { fields: [materials.brandId], references: [brands.id] }),
  collection: one(collections, { fields: [materials.collectionId], references: [collections.id] }),
  images: many(materialImages),
  colors: many(materialColors),
  surfaces: many(materialSurfaces),
  designs: many(materialDesigns),
  applications: many(materialApplications),
  sizes: many(materialSizes),
  thicknesses: many(materialThicknesses),
  variants: many(materialVariants),
}))

export const materialImagesRelations = relations(materialImages, ({ one }) => ({
  material: one(materials, { fields: [materialImages.materialId], references: [materials.id] }),
  surface: one(surfaces, { fields: [materialImages.surfaceId], references: [surfaces.id] }),
}))

export const materialVariantsRelations = relations(materialVariants, ({ one }) => ({
  material: one(materials, { fields: [materialVariants.materialId], references: [materials.id] }),
  size: one(sizes, { fields: [materialVariants.sizeId], references: [sizes.id] }),
  thickness: one(thicknesses, {
    fields: [materialVariants.thicknessId],
    references: [thicknesses.id],
  }),
}))

export const materialColorsRelations = relations(materialColors, ({ one }) => ({
  material: one(materials, { fields: [materialColors.materialId], references: [materials.id] }),
  color: one(colors, { fields: [materialColors.colorId], references: [colors.id] }),
}))

export const materialSurfacesRelations = relations(materialSurfaces, ({ one }) => ({
  material: one(materials, { fields: [materialSurfaces.materialId], references: [materials.id] }),
  surface: one(surfaces, { fields: [materialSurfaces.surfaceId], references: [surfaces.id] }),
}))

export const materialDesignsRelations = relations(materialDesigns, ({ one }) => ({
  material: one(materials, { fields: [materialDesigns.materialId], references: [materials.id] }),
  design: one(designs, { fields: [materialDesigns.designId], references: [designs.id] }),
}))

export const materialApplicationsRelations = relations(materialApplications, ({ one }) => ({
  material: one(materials, { fields: [materialApplications.materialId], references: [materials.id] }),
  application: one(applications, {
    fields: [materialApplications.applicationId],
    references: [applications.id],
  }),
}))

export const materialSizesRelations = relations(materialSizes, ({ one }) => ({
  material: one(materials, { fields: [materialSizes.materialId], references: [materials.id] }),
  size: one(sizes, { fields: [materialSizes.sizeId], references: [sizes.id] }),
}))

export const materialThicknessesRelations = relations(materialThicknesses, ({ one }) => ({
  material: one(materials, { fields: [materialThicknesses.materialId], references: [materials.id] }),
  thickness: one(thicknesses, { fields: [materialThicknesses.thicknessId], references: [thicknesses.id] }),
}))
