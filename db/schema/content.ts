import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

/** Рубрики блога: «Огляди», «Рекомендації». Клиент заводит их сам из формы статьи. */
export const postCategories = pgTable('post_categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }).notNull(),
  sort: integer('sort').notNull().default(0),
})

export const posts = pgTable(
  'posts',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    slug: varchar('slug', { length: 160 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    categoryId: integer('category_id').references(() => postCategories.id, {
      onDelete: 'set null',
    }),
    body: text('body'),
    coverImage: text('cover_image'),
    /** Черновиков нет: статья видна на сайте сразу после сохранения. */
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: text('seo_description'),
    ogImage: text('og_image'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('posts_published_idx').on(t.publishedAt),
    index('posts_category_idx').on(t.categoryId),
  ],
)

export const postCategoriesRelations = relations(postCategories, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  category: one(postCategories, { fields: [posts.categoryId], references: [postCategories.id] }),
}))

/** Редактируемые страницы: «Про нас», «Контакти», тексты главной. */
export const pages = pgTable('pages', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  /** Блоки страницы; структура задаётся типом блока, поэтому jsonb, а не колонки. */
  blocks: jsonb('blocks').$type<Array<Record<string, unknown>>>(),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: text('seo_description'),
  ogImage: text('og_image'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/** 301-редиректы со старого WordPress-сайта (п. 6.4 ТЗ). */
export const redirects = pgTable(
  'redirects',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    fromPath: varchar('from_path', { length: 512 }).notNull().unique(),
    toPath: varchar('to_path', { length: 512 }).notNull(),
    statusCode: smallint('status_code').notNull().default(301),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('redirects_active_idx').on(t.isActive)],
)

/** Контакты и глобальные настройки — одна строка, id всегда 1. */
export const settings = pgTable('settings', {
  id: smallint('id').primaryKey().default(1),
  phones: jsonb('phones').$type<string[]>(),
  emails: jsonb('emails').$type<string[]>(),
  address: text('address'),
  mapLat: varchar('map_lat', { length: 32 }),
  mapLng: varchar('map_lng', { length: 32 }),
  workingHours: text('working_hours'),
  socials: jsonb('socials').$type<Record<string, string>>(),
  telegramChatId: varchar('telegram_chat_id', { length: 64 }),
  googleSheetId: varchar('google_sheet_id', { length: 128 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

/** Библиотека загруженных файлов: фото материалов, проектов, PDF-спецификации. */
export const media = pgTable(
  'media',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    url: text('url').notNull(),
    filename: varchar('filename', { length: 255 }).notNull(),
    mime: varchar('mime', { length: 128 }).notNull(),
    sizeBytes: integer('size_bytes'),
    width: integer('width'),
    height: integer('height'),
    alt: varchar('alt', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('media_created_idx').on(sql`${t.createdAt} desc`)],
)
