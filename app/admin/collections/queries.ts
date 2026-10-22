import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { brands, collections, materials } from "@/db/schema";

/** Список коллекций со счётчиком материалов: пустая коллекция — повод её убрать. */
export async function getCollectionList(brandSlug?: string) {
  return db
    .select({
      id: collections.id,
      name: collections.name,
      slug: collections.slug,
      sort: collections.sort,
      brandName: brands.name,
      brandSlug: brands.slug,
      materialCount: sql<number>`count(${materials.id})::int`,
    })
    .from(collections)
    .innerJoin(brands, eq(collections.brandId, brands.id))
    .leftJoin(materials, eq(materials.collectionId, collections.id))
    .where(brandSlug ? eq(brands.slug, brandSlug) : undefined)
    .groupBy(
      collections.id,
      collections.name,
      collections.slug,
      collections.sort,
      brands.name,
      brands.slug,
      brands.sort,
    )
    .orderBy(asc(brands.sort), asc(collections.sort), asc(collections.name));
}

export async function getCollection(id: number) {
  const [row] = await db
    .select()
    .from(collections)
    .where(eq(collections.id, id));
  return row ?? null;
}

export async function getCollectionFormOptions() {
  return { brands: await db.select().from(brands).orderBy(asc(brands.sort)) };
}

export type CollectionRow = Awaited<
  ReturnType<typeof getCollectionList>
>[number];
export type CollectionFormOptions = Awaited<
  ReturnType<typeof getCollectionFormOptions>
>;
export type Collection = NonNullable<Awaited<ReturnType<typeof getCollection>>>;
