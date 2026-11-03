"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  applications,
  colors,
  designs,
  sizes,
  surfaces,
  thicknesses,
} from "@/db/schema";
import {
  DICTIONARY_META,
  isDictionaryType,
  type DictionaryEntryInput,
  type DictionaryType,
} from "./config";

export type ActionResult = { ok: true } | { ok: false; error: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_RE = /^#[0-9a-f]{6}$/i;

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

function validate(
  type: DictionaryType,
  input: DictionaryEntryInput,
): string | null {
  const meta = DICTIONARY_META[type];
  if (!input.name.trim()) return "Вкажіть назву";
  if (meta.hasSlug) {
    if (!input.slug.trim()) return "Вкажіть слаг";
    if (!SLUG_RE.test(input.slug.trim())) {
      return "Слаг може містити лише малі латинські літери, цифри та дефіс";
    }
  }
  if (meta.hasBrand && !input.brandId) return "Оберіть бренд";
  if (type === "colors" && input.hex.trim() && !HEX_RE.test(input.hex.trim())) {
    return "Колір вказується як #RRGGBB";
  }
  if (type === "sizes") {
    if (!input.widthMm || input.widthMm <= 0) return "Вкажіть ширину в мм";
    if (!input.heightMm || input.heightMm <= 0) return "Вкажіть висоту в мм";
  }
  if (type === "thicknesses" && (!input.valueMm || input.valueMm <= 0)) {
    return "Вкажіть товщину в мм";
  }
  return null;
}

/** Сохранение записи любого справочника: вставка или обновление по id. */
export async function saveDictionaryEntry(
  type: DictionaryType,
  input: DictionaryEntryInput,
): Promise<ActionResult> {
  if (!isDictionaryType(type)) return { ok: false, error: "Невідомий довідник" };
  const error = validate(type, input);
  if (error) return { ok: false, error };

  const name = input.name.trim();
  const slug = input.slug.trim();
  const sort = input.sort;

  try {
    switch (type) {
      case "colors": {
        const values = { name, slug, sort, hex: trimOrNull(input.hex) };
        if (input.id) await db.update(colors).set(values).where(eq(colors.id, input.id));
        else await db.insert(colors).values(values);
        break;
      }
      case "surfaces": {
        const values = { name, slug, sort };
        if (input.id) await db.update(surfaces).set(values).where(eq(surfaces.id, input.id));
        else await db.insert(surfaces).values(values);
        break;
      }
      case "designs": {
        const values = { name, slug, sort };
        if (input.id) await db.update(designs).set(values).where(eq(designs.id, input.id));
        else await db.insert(designs).values(values);
        break;
      }
      case "applications": {
        const values = { name, slug, sort, icon: trimOrNull(input.icon) };
        if (input.id) await db.update(applications).set(values).where(eq(applications.id, input.id));
        else await db.insert(applications).values(values);
        break;
      }
      case "sizes": {
        const values = {
          label: name,
          slug,
          sort,
          brandId: input.brandId!,
          widthMm: input.widthMm!,
          heightMm: input.heightMm!,
        };
        if (input.id) await db.update(sizes).set(values).where(eq(sizes.id, input.id));
        else await db.insert(sizes).values(values);
        break;
      }
      case "thicknesses": {
        const values = {
          label: name,
          sort,
          brandId: input.brandId!,
          valueMm: input.valueMm!,
        };
        if (input.id) await db.update(thicknesses).set(values).where(eq(thicknesses.id, input.id));
        else await db.insert(thicknesses).values(values);
        break;
      }
    }
  } catch (e) {
    // Слаг (или назва товщини в межах бренду) унікальні — типова помилка ручного вводу.
    if (e instanceof Error && "code" in e && e.code === "23505") {
      return {
        ok: false,
        error:
          type === "thicknesses"
            ? "Товщина з такою назвою у цього бренду вже є"
            : "Запис з таким слагом уже існує",
      };
    }
    throw e;
  }

  revalidatePath("/admin/dictionaries");
  return { ok: true };
}

/**
 * Удаление записи. Связи с материалами в схеме каскадные: значение просто
 * пропадёт из карточек, сами материалы останутся.
 */
export async function deleteDictionaryEntry(
  type: DictionaryType,
  id: number,
): Promise<ActionResult> {
  if (!isDictionaryType(type)) return { ok: false, error: "Невідомий довідник" };

  switch (type) {
    case "colors":
      await db.delete(colors).where(eq(colors.id, id));
      break;
    case "surfaces":
      await db.delete(surfaces).where(eq(surfaces.id, id));
      break;
    case "designs":
      await db.delete(designs).where(eq(designs.id, id));
      break;
    case "applications":
      await db.delete(applications).where(eq(applications.id, id));
      break;
    case "sizes":
      await db.delete(sizes).where(eq(sizes.id, id));
      break;
    case "thicknesses":
      await db.delete(thicknesses).where(eq(thicknesses.id, id));
      break;
  }

  revalidatePath("/admin/dictionaries");
  return { ok: true };
}
