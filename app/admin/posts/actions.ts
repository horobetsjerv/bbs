"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { postCategories, posts } from "@/db/schema";

export type PostInput = {
  id?: number;
  title: string;
  slug: string;
  categoryId: number | null;
  /** YYYY-MM-DD или пустая строка. */
  publishedAt: string;
  coverImage: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const isUniqueViolation = (e: unknown) =>
  e instanceof Error && "code" in e && e.code === "23505";

function validate(input: PostInput): string | null {
  if (!input.title.trim()) return "Вкажіть заголовок статті";
  if (!input.slug.trim()) return "Вкажіть URL-слаг";
  if (!SLUG_RE.test(input.slug.trim())) {
    return "Слаг може містити лише малі латинські літери, цифри та дефіс";
  }
  if (input.publishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(input.publishedAt)) {
    return "Дата публікації має бути у форматі РРРР-ММ-ДД";
  }
  return null;
}

export async function savePost(input: PostInput): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { ok: false, error };

  const values = {
    title: input.title.trim(),
    slug: input.slug.trim(),
    categoryId: input.categoryId,
    // Без даты — сегодня: сортировка блога идёт по ней.
    publishedAt: input.publishedAt
      ? new Date(`${input.publishedAt}T00:00:00`)
      : new Date(),
    coverImage: trimOrNull(input.coverImage),
    body: trimOrNull(input.body),
    seoTitle: trimOrNull(input.seoTitle),
    seoDescription: trimOrNull(input.seoDescription),
    ogImage: trimOrNull(input.ogImage),
    updatedAt: new Date(),
  };

  try {
    if (input.id) {
      await db.update(posts).set(values).where(eq(posts.id, input.id));
    } else {
      await db.insert(posts).values(values);
    }
  } catch (e) {
    if (isUniqueViolation(e)) {
      return { ok: false, error: "Стаття з таким слагом уже існує" };
    }
    throw e;
  }

  revalidatePath("/admin/posts");
  return { ok: true };
}

export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export type CategoryResult =
  | { ok: true; id: number; name: string; slug: string }
  | { ok: false; error: string };

/** Рубрика создаётся прямо из формы статьи, чтобы не ходить в отдельный раздел. */
export async function createPostCategory(
  name: string,
  slug: string,
): Promise<CategoryResult> {
  const cleanName = name.trim();
  const cleanSlug = slug.trim();
  if (!cleanName) return { ok: false, error: "Вкажіть назву рубрики" };
  if (!cleanSlug || !SLUG_RE.test(cleanSlug)) {
    return {
      ok: false,
      error: "Слаг може містити лише малі латинські літери, цифри та дефіс",
    };
  }

  try {
    const [row] = await db
      .insert(postCategories)
      .values({ name: cleanName, slug: cleanSlug })
      .returning({ id: postCategories.id });
    revalidatePath("/admin/posts");
    return { ok: true, id: row.id, name: cleanName, slug: cleanSlug };
  } catch (e) {
    if (isUniqueViolation(e)) {
      return { ok: false, error: "Рубрика з таким слагом уже існує" };
    }
    throw e;
  }
}
