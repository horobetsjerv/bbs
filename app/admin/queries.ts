import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  brands,
  collections,
  leadTopics,
  leads,
  materialImages,
  materials,
  pages,
  posts,
  projects,
} from "@/db/schema";

/** Сводка каталога по брендам: сколько карточек, сколько из них без фото и в черновиках. */
export async function getCatalogSummary() {
  const rows = await db
    .select({
      id: brands.id,
      name: brands.name,
      slug: brands.slug,
      materialCount: sql<number>`count(distinct ${materials.id})::int`,
      photoCount: sql<number>`count(${materialImages.id})::int`,
      draftCount: sql<number>`count(distinct ${materials.id}) filter (where ${materials.isPublished} = false)::int`,
      noPhotoCount: sql<number>`count(distinct ${materials.id}) filter (where ${materialImages.id} is null)::int`,
    })
    .from(brands)
    .leftJoin(materials, eq(materials.brandId, brands.id))
    .leftJoin(materialImages, eq(materialImages.materialId, materials.id))
    .groupBy(brands.id, brands.name, brands.slug, brands.sort)
    .orderBy(brands.sort);

  const [totals] = await db
    .select({
      collections: sql<number>`(select count(*) from ${collections})::int`,
      materials: sql<number>`(select count(*) from ${materials})::int`,
    })
    .from(sql`(select 1) as t`);

  return { brands: rows, totals };
}

/** Заявки: счётчики для шапки и недоставленные — их надо чинить руками. */
export async function getLeadsSummary() {
  const [counts] = await db
    .select({
      total: sql<number>`count(*)::int`,
      isNew: sql<number>`count(*) filter (where ${leads.status} = 'new')::int`,
      lastWeek: sql<number>`count(*) filter (where ${leads.createdAt} > now() - interval '7 days')::int`,
      undelivered: sql<number>`count(*) filter (where ${leads.telegramSentAt} is null or ${leads.sheetsSyncedAt} is null)::int`,
    })
    .from(leads);

  const latest = await db
    .select({
      id: leads.id,
      createdAt: leads.createdAt,
      formType: leads.formType,
      name: leads.name,
      phone: leads.phone,
      topicName: leadTopics.name,
      materialName: materials.name,
      message: leads.message,
      status: leads.status,
      telegramSentAt: leads.telegramSentAt,
      sheetsSyncedAt: leads.sheetsSyncedAt,
    })
    .from(leads)
    .leftJoin(leadTopics, eq(leads.topicId, leadTopics.id))
    .leftJoin(materials, eq(leads.materialId, materials.id))
    .orderBy(desc(leads.createdAt))
    .limit(5);

  return { counts, latest };
}

/** Контентные разделы: сколько записей и сколько из них опубликовано. */
export async function getContentSummary() {
  const [row] = await db
    .select({
      posts: sql<number>`(select count(*) from ${posts})::int`,
      postsWithoutCategory: sql<number>`(select count(*) from ${posts} where category_id is null)::int`,
      projects: sql<number>`(select count(*) from ${projects})::int`,
      projectsPublished: sql<number>`(select count(*) from ${projects} where is_published = true)::int`,
      pages: sql<number>`(select count(*) from ${pages})::int`,
    })
    .from(sql`(select 1) as t`);

  return row;
}
