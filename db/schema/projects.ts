import { relations, sql } from 'drizzle-orm'
import { boolean, index, integer, pgTable, primaryKey, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { materials } from './catalog.ts'

/** Теги проектов отдельно от applications: у проектов есть «інтер'єр», которого нет в каталоге. */
export const projectTags = pgTable('project_tags', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 64 }).notNull(),
  sort: integer('sort').notNull().default(0),
})

export const projects = pgTable(
  'projects',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar('slug', { length: 160 }).notNull().unique(),
    name: varchar('name', { length: 200 }).notNull(),
    coverImage: text('cover_image').notNull(),
    /** Ограничение из ТЗ: короткое описание до 300 символов. */
    shortDescription: varchar('short_description', { length: 300 }),
    body: text('body'),
    year: integer('year'),
    isPublished: boolean('is_published').notNull().default(true),
    sort: integer('sort').notNull().default(0),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    ogImage: text('og_image'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('projects_published_idx').on(t.isPublished),
    index('projects_search_idx').using(
      'gin',
      sql`to_tsvector('simple', coalesce(${t.name}, '') || ' ' || coalesce(${t.shortDescription}, ''))`,
    ),
  ],
)

export const projectImages = pgTable(
  'project_images',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    alt: varchar('alt', { length: 255 }),
    sort: integer('sort').notNull().default(0),
  },
  (t) => [index('project_images_project_idx').on(t.projectId)],
)

export const projectTagLinks = pgTable(
  'project_tag_links',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => projectTags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.tagId] }), index('project_tag_links_tag_idx').on(t.tagId)],
)

/** «Використані матеріали» — связь проекта с карточками каталога. */
export const projectMaterials = pgTable(
  'project_materials',
  {
    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    materialId: integer('material_id')
      .notNull()
      .references(() => materials.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.materialId] }),
    index('project_materials_material_idx').on(t.materialId),
  ],
)

export const projectsRelations = relations(projects, ({ many }) => ({
  images: many(projectImages),
  tags: many(projectTagLinks),
  materials: many(projectMaterials),
}))

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, { fields: [projectImages.projectId], references: [projects.id] }),
}))

export const projectTagLinksRelations = relations(projectTagLinks, ({ one }) => ({
  project: one(projects, { fields: [projectTagLinks.projectId], references: [projects.id] }),
  tag: one(projectTags, { fields: [projectTagLinks.tagId], references: [projectTags.id] }),
}))

export const projectMaterialsRelations = relations(projectMaterials, ({ one }) => ({
  project: one(projects, { fields: [projectMaterials.projectId], references: [projects.id] }),
  material: one(materials, { fields: [projectMaterials.materialId], references: [materials.id] }),
}))
