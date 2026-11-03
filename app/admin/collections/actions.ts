"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { collections } from "@/db/schema";

export type CollectionInput = {
  id?: number;
  brandId: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  sort: number;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

function validate(input: CollectionInput): string | null {
  if (!input.name.trim()) return "Вкажіть назву колекції";
  if (!input.slug.trim()) return "Вкажіть URL-слаг";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())) {
    return "Слаг може містити лише малі латинські літери, цифри та дефіс";
  }
  if (!input.brandId) return "Оберіть бренд";
  return null;
}

export async function saveCollection(
  input: CollectionInput,
): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { ok: false, error };

  const values = {
    brandId: input.brandId,
    name: input.name.trim(),
    slug: input.slug.trim(),
    description: trimOrNull(input.description),
    image: trimOrNull(input.image),
    sort: input.sort,
  };

  try {
    if (input.id) {
      await db
        .update(collections)
        .set(values)
        .where(eq(collections.id, input.id));
    } else {
      await db.insert(collections).values(values);
    }
  } catch (e) {
    // Слаг уникален в рамках бренда — самая частая ошибка при ручном вводе.
    if (e instanceof Error && "code" in e && e.code === "23505") {
      return {
        ok: false,
        error: "Колекція з таким слагом у цього бренду вже існує",
      };
    }
    throw e;
  }

  revalidatePath("/admin/collections");
  return { ok: true };
}

/**
 * Материалы не удаляются вместе с коллекцией: в схеме у них collection_id
 * с onDelete: set null, поэтому позиции просто останутся без коллекции.
 */
export async function deleteCollection(id: number) {
  await db.delete(collections).where(eq(collections.id, id));
  revalidatePath("/admin/collections");
  redirect("/admin/collections");
}
