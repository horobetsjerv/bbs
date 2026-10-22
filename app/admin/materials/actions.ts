"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  materialApplications,
  materialColors,
  materialDesigns,
  materialSizes,
  materialSurfaces,
  materialThicknesses,
  materials,
} from "@/db/schema";

export type MaterialInput = {
  id?: number;
  brandId: number;
  collectionId: number | null;
  name: string;
  article: string;
  slug: string;
  description: string;
  sourceUrl: string;
  specPdfUrl: string;
  inStock: boolean;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
  colorIds: number[];
  surfaceIds: number[];
  designIds: number[];
  applicationIds: number[];
  sizeIds: number[];
  thicknessIds: number[];
};

export type ActionResult = { ok: true } | { ok: false; error: string };

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

function validate(input: MaterialInput): string | null {
  if (!input.name.trim()) return "Вкажіть назву матеріалу";
  if (!input.article.trim()) return "Вкажіть артикул";
  if (!input.slug.trim()) return "Вкажіть URL-слаг";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())) {
    return "Слаг може містити лише малі латинські літери, цифри та дефіс";
  }
  if (!input.brandId) return "Оберіть бренд";
  return null;
}

/** Связи переписываются целиком: набор значений в форме — источник правды. */
async function replaceLinks(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  materialId: number,
  input: MaterialInput,
) {
  const links = [
    {
      table: materialColors,
      column: materialColors.materialId,
      key: "colorId" as const,
      ids: input.colorIds,
    },
    {
      table: materialSurfaces,
      column: materialSurfaces.materialId,
      key: "surfaceId" as const,
      ids: input.surfaceIds,
    },
    {
      table: materialDesigns,
      column: materialDesigns.materialId,
      key: "designId" as const,
      ids: input.designIds,
    },
    {
      table: materialApplications,
      column: materialApplications.materialId,
      key: "applicationId" as const,
      ids: input.applicationIds,
    },
    {
      table: materialSizes,
      column: materialSizes.materialId,
      key: "sizeId" as const,
      ids: input.sizeIds,
    },
    {
      table: materialThicknesses,
      column: materialThicknesses.materialId,
      key: "thicknessId" as const,
      ids: input.thicknessIds,
    },
  ];

  for (const link of links) {
    await tx.delete(link.table).where(eq(link.column, materialId));
    const unique = [...new Set(link.ids)];
    if (!unique.length) continue;
    await tx
      .insert(link.table)
      .values(unique.map((id) => ({ materialId, [link.key]: id })));
  }
}

export async function saveMaterial(
  input: MaterialInput,
): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { ok: false, error };

  const values = {
    brandId: input.brandId,
    collectionId: input.collectionId,
    name: input.name.trim(),
    article: input.article.trim(),
    slug: input.slug.trim(),
    description: trimOrNull(input.description),
    sourceUrl: trimOrNull(input.sourceUrl),
    specPdfUrl: trimOrNull(input.specPdfUrl),
    inStock: input.inStock,
    isPublished: input.isPublished,
    seoTitle: trimOrNull(input.seoTitle),
    seoDescription: trimOrNull(input.seoDescription),
    updatedAt: new Date(),
  };

  let materialId = input.id;

  try {
    await db.transaction(async (tx) => {
      if (materialId) {
        await tx
          .update(materials)
          .set(values)
          .where(eq(materials.id, materialId));
      } else {
        const [created] = await tx
          .insert(materials)
          .values(values)
          .returning({ id: materials.id });
        materialId = created.id;
      }
      await replaceLinks(tx, materialId, input);
    });
  } catch (e) {
    // Артикул и слаг уникальны в рамках бренда — самая частая ошибка при ручном вводе.
    if (e instanceof Error && "code" in e && e.code === "23505") {
      return {
        ok: false,
        error: "Матеріал з таким артикулом або слагом у цього бренду вже існує",
      };
    }
    throw e;
  }

  revalidatePath("/admin/materials");
  return { ok: true };
}

export async function deleteMaterial(id: number) {
  await db.delete(materials).where(eq(materials.id, id));
  revalidatePath("/admin/materials");
  redirect("/admin/materials");
}
