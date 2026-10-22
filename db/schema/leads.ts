import { relations } from 'drizzle-orm'
import { index, integer, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { materials } from './catalog.ts'

/** Тип формы попадает в Telegram отдельной строкой с emoji-маркером (п. 4.1.2 ТЗ). */
export const leadFormTypeEnum = pgEnum('lead_form_type', ['feedback', 'sample_order', 'price_request'])

/** Клиент ведёт статус вручную в Google Таблице; в админке — то же значение. */
export const leadStatusEnum = pgEnum('lead_status', ['new', 'in_progress', 'closed'])

/** «Тема звернення» — выпадающий список, редактируется в админке. */
export const leadTopics = pgTable('lead_topics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 128 }).notNull(),
  sort: integer('sort').notNull().default(0),
})

export const leads = pgTable(
  'leads',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    formType: leadFormTypeEnum('form_type').notNull().default('feedback'),
    name: varchar('name', { length: 160 }).notNull(),
    phone: varchar('phone', { length: 32 }).notNull(),
    topicId: integer('topic_id').references(() => leadTopics.id, { onDelete: 'set null' }),
    message: text('message'),
    /** Заполняется, когда заявка отправлена с карточки цвета («Замовити зразок»). */
    materialId: integer('material_id').references(() => materials.id, { onDelete: 'set null' }),
    pageUrl: text('page_url'),
    utmSource: varchar('utm_source', { length: 128 }),
    utmMedium: varchar('utm_medium', { length: 128 }),
    utmCampaign: varchar('utm_campaign', { length: 128 }),
    utmTerm: varchar('utm_term', { length: 128 }),
    utmContent: varchar('utm_content', { length: 128 }),
    ip: varchar('ip', { length: 64 }),
    userAgent: text('user_agent'),
    status: leadStatusEnum('status').notNull().default('new'),
    // Доставка отслеживается по каждому каналу: Telegram и Sheets падают независимо,
    // без этих полей потерянная заявка не видна.
    telegramSentAt: timestamp('telegram_sent_at', { withTimezone: true }),
    telegramError: text('telegram_error'),
    sheetsSyncedAt: timestamp('sheets_synced_at', { withTimezone: true }),
    sheetsError: text('sheets_error'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('leads_created_idx').on(t.createdAt),
    index('leads_status_idx').on(t.status),
    index('leads_phone_idx').on(t.phone),
  ],
)

export const leadsRelations = relations(leads, ({ one }) => ({
  topic: one(leadTopics, { fields: [leads.topicId], references: [leadTopics.id] }),
  material: one(materials, { fields: [leads.materialId], references: [materials.id] }),
}))
