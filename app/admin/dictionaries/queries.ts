import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  applications,
  brands,
  colors,
  designs,
  materialApplications,
  materialColors,
  materialDesigns,
  materialSizes,
  materialSurfaces,
  materialThicknesses,
  sizes,
  surfaces,
  thicknesses,
} from "@/db/schema";
import type { DictionaryEntry, DictionaryType } from "./config";

const NULLS = {
  hex: sql<null>`null`,
  icon: sql<null>`null`,
  brandId: sql<null>`null`,
  brandName: sql<null>`null`,
  widthMm: sql<null>`null`,
  heightMm: sql<null>`null`,
  valueMm: sql<null>`null`,
};

/**
 * Записи справочника со счётчиком материалов: перед удалением видно,
 * сколько карточек потеряют значение.
 */
export async function getDictionary(
  type: DictionaryType,
): Promise<DictionaryEntry[]> {
  switch (type) {
    case "colors":
      return db
        .select({
          id: colors.id,
          name: colors.name,
          slug: colors.slug,
          sort: colors.sort,
          ...NULLS,
          hex: colors.hex,
          materialCount: sql<number>`count(${materialColors.materialId})::int`,
        })
        .from(colors)
        .leftJoin(materialColors, eq(materialColors.colorId, colors.id))
        .groupBy(colors.id)
        .orderBy(asc(colors.sort), asc(colors.name));

    case "surfaces":
      return db
        .select({
          id: surfaces.id,
          name: surfaces.name,
          slug: surfaces.slug,
          sort: surfaces.sort,
          ...NULLS,
          materialCount: sql<number>`count(${materialSurfaces.materialId})::int`,
        })
        .from(surfaces)
        .leftJoin(materialSurfaces, eq(materialSurfaces.surfaceId, surfaces.id))
        .groupBy(surfaces.id)
        .orderBy(asc(surfaces.sort), asc(surfaces.name));

    case "designs":
      return db
        .select({
          id: designs.id,
          name: designs.name,
          slug: designs.slug,
          sort: designs.sort,
          ...NULLS,
          materialCount: sql<number>`count(${materialDesigns.materialId})::int`,
        })
        .from(designs)
        .leftJoin(materialDesigns, eq(materialDesigns.designId, designs.id))
        .groupBy(designs.id)
        .orderBy(asc(designs.sort), asc(designs.name));

    case "applications":
      return db
        .select({
          id: applications.id,
          name: applications.name,
          slug: applications.slug,
          sort: applications.sort,
          ...NULLS,
          icon: applications.icon,
          materialCount: sql<number>`count(${materialApplications.materialId})::int`,
        })
        .from(applications)
        .leftJoin(
          materialApplications,
          eq(materialApplications.applicationId, applications.id),
        )
        .groupBy(applications.id)
        .orderBy(asc(applications.sort), asc(applications.name));

    case "sizes":
      return db
        .select({
          id: sizes.id,
          name: sizes.label,
          slug: sizes.slug,
          sort: sizes.sort,
          ...NULLS,
          brandId: sizes.brandId,
          brandName: brands.name,
          widthMm: sizes.widthMm,
          heightMm: sizes.heightMm,
          materialCount: sql<number>`count(${materialSizes.materialId})::int`,
        })
        .from(sizes)
        .innerJoin(brands, eq(sizes.brandId, brands.id))
        .leftJoin(materialSizes, eq(materialSizes.sizeId, sizes.id))
        .groupBy(sizes.id, brands.name, brands.sort)
        .orderBy(asc(brands.sort), asc(sizes.sort), asc(sizes.label));

    case "thicknesses":
      return db
        .select({
          id: thicknesses.id,
          name: thicknesses.label,
          slug: sql<null>`null`,
          sort: thicknesses.sort,
          ...NULLS,
          brandId: thicknesses.brandId,
          brandName: brands.name,
          valueMm: thicknesses.valueMm,
          materialCount: sql<number>`count(${materialThicknesses.materialId})::int`,
        })
        .from(thicknesses)
        .innerJoin(brands, eq(thicknesses.brandId, brands.id))
        .leftJoin(
          materialThicknesses,
          eq(materialThicknesses.thicknessId, thicknesses.id),
        )
        .groupBy(thicknesses.id, brands.name, brands.sort)
        .orderBy(
          asc(brands.sort),
          asc(thicknesses.sort),
          asc(thicknesses.valueMm),
          asc(thicknesses.label),
        );
  }
}

export async function getBrandOptions() {
  return db
    .select({ id: brands.id, name: brands.name })
    .from(brands)
    .orderBy(asc(brands.sort));
}
