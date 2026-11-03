import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
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
  materials,
  sizes,
  surfaces,
  thicknesses,
} from "@/db/schema";

export type MaterialListFilters = {
  brandSlug?: string;
  query?: string;
  page?: number;
  perPage?: number;
};

export async function getMaterialList({
  brandSlug,
  query,
  page = 1,
  perPage = 25,
}: MaterialListFilters) {
  const conditions = [];
  if (brandSlug) conditions.push(eq(brands.slug, brandSlug));
  if (query && query.length >= 2) {
    const pattern = `%${query}%`;
    conditions.push(
      or(ilike(materials.name, pattern), ilike(materials.article, pattern)),
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: materials.id,
      name: materials.name,
      article: materials.article,
      slug: materials.slug,
      inStock: materials.inStock,
      isPublished: materials.isPublished,
      brandName: brands.name,
      collectionName: collections.name,
    })
    .from(materials)
    .innerJoin(brands, eq(materials.brandId, brands.id))
    .leftJoin(collections, eq(materials.collectionId, collections.id))
    .where(where)
    .orderBy(asc(brands.sort), asc(materials.name))
    .limit(perPage)
    .offset((page - 1) * perPage);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(materials)
    .innerJoin(brands, eq(materials.brandId, brands.id))
    .where(where);

  return { rows, total: count, page, perPage };
}

/** Справочники для формы. Один запрос на таблицу — данных мало, джойны тут только мешают. */
export async function getMaterialFormOptions() {
  const [
    brandRows,
    collectionRows,
    colorRows,
    surfaceRows,
    designRows,
    applicationRows,
    sizeRows,
    thicknessRows,
  ] = await Promise.all([
    db.select().from(brands).orderBy(asc(brands.sort)),
    db.select().from(collections).orderBy(asc(collections.sort)),
    db.select().from(colors).orderBy(asc(colors.sort)),
    db.select().from(surfaces).orderBy(asc(surfaces.sort)),
    db.select().from(designs).orderBy(asc(designs.sort)),
    db.select().from(applications).orderBy(asc(applications.sort)),
    db.select().from(sizes).orderBy(asc(sizes.sort)),
    db.select().from(thicknesses).orderBy(asc(thicknesses.sort)),
  ]);

  return {
    brands: brandRows,
    collections: collectionRows,
    colors: colorRows,
    surfaces: surfaceRows,
    designs: designRows,
    applications: applicationRows,
    sizes: sizeRows,
    thicknesses: thicknessRows,
  };
}

export async function getMaterial(id: number) {
  const [material] = await db
    .select()
    .from(materials)
    .where(eq(materials.id, id));
  if (!material) return null;

  const [
    colorIds,
    surfaceIds,
    designIds,
    applicationIds,
    sizeIds,
    thicknessIds,
    images,
  ] = await Promise.all([
    db
      .select({ id: materialColors.colorId })
      .from(materialColors)
      .where(eq(materialColors.materialId, id)),
    db
      .select({ id: materialSurfaces.surfaceId })
      .from(materialSurfaces)
      .where(eq(materialSurfaces.materialId, id)),
    db
      .select({ id: materialDesigns.designId })
      .from(materialDesigns)
      .where(eq(materialDesigns.materialId, id)),
    db
      .select({ id: materialApplications.applicationId })
      .from(materialApplications)
      .where(eq(materialApplications.materialId, id)),
    db
      .select({ id: materialSizes.sizeId })
      .from(materialSizes)
      .where(eq(materialSizes.materialId, id)),
    db
      .select({ id: materialThicknesses.thicknessId })
      .from(materialThicknesses)
      .where(eq(materialThicknesses.materialId, id)),
    db
      .select()
      .from(materialImages)
      .where(eq(materialImages.materialId, id))
      .orderBy(desc(materialImages.isMain), asc(materialImages.sort)),
  ]);

  return {
    ...material,
    colorIds: colorIds.map((r) => r.id),
    surfaceIds: surfaceIds.map((r) => r.id),
    designIds: designIds.map((r) => r.id),
    applicationIds: applicationIds.map((r) => r.id),
    sizeIds: sizeIds.map((r) => r.id),
    thicknessIds: thicknessIds.map((r) => r.id),
    images,
  };
}

export type MaterialWithRelations = NonNullable<
  Awaited<ReturnType<typeof getMaterial>>
>;
export type MaterialFormOptions = Awaited<
  ReturnType<typeof getMaterialFormOptions>
>;
