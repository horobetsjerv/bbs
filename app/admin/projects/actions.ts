"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  projectImages,
  projectMaterials,
  projectTagLinks,
  projectTags,
  projects,
} from "@/db/schema";

export type ProjectImageInput = { url: string; alt: string };

export type ProjectInput = {
  id?: number;
  name: string;
  slug: string;
  coverImage: string;
  shortDescription: string;
  body: string;
  year: number | null;
  isPublished: boolean;
  sort: number;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  tagIds: number[];
  materialIds: number[];
  images: ProjectImageInput[];
};

export type ActionResult = { ok: true } | { ok: false; error: string };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const isUniqueViolation = (e: unknown) =>
  e instanceof Error && "code" in e && e.code === "23505";

function validate(input: ProjectInput): string | null {
  if (!input.name.trim()) return "Вкажіть назву проекту";
  if (!input.slug.trim()) return "Вкажіть URL-слаг";
  if (!SLUG_RE.test(input.slug.trim())) {
    return "Слаг може містити лише малі латинські літери, цифри та дефіс";
  }
  if (!input.coverImage.trim()) return "Завантажте головне фото";
  if (input.shortDescription.trim().length > 300) {
    return "Короткий опис має бути не довшим за 300 символів";
  }
  return null;
}

/** Связи и галерея переписываются целиком: набор значений в форме — источник правды. */
async function replaceRelations(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  projectId: number,
  input: ProjectInput,
) {
  await tx.delete(projectTagLinks).where(eq(projectTagLinks.projectId, projectId));
  const tagIds = [...new Set(input.tagIds)];
  if (tagIds.length) {
    await tx
      .insert(projectTagLinks)
      .values(tagIds.map((tagId) => ({ projectId, tagId })));
  }

  await tx
    .delete(projectMaterials)
    .where(eq(projectMaterials.projectId, projectId));
  const materialIds = [...new Set(input.materialIds)];
  if (materialIds.length) {
    await tx
      .insert(projectMaterials)
      .values(materialIds.map((materialId) => ({ projectId, materialId })));
  }

  await tx.delete(projectImages).where(eq(projectImages.projectId, projectId));
  if (input.images.length) {
    await tx.insert(projectImages).values(
      input.images.map((image, index) => ({
        projectId,
        url: image.url,
        alt: trimOrNull(image.alt),
        // Порядок фото в галерее задаётся позицией в форме.
        sort: index,
      })),
    );
  }
}

export async function saveProject(input: ProjectInput): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { ok: false, error };

  const values = {
    name: input.name.trim(),
    slug: input.slug.trim(),
    coverImage: input.coverImage.trim(),
    shortDescription: trimOrNull(input.shortDescription),
    body: trimOrNull(input.body),
    year: input.year,
    isPublished: input.isPublished,
    sort: input.sort,
    seoTitle: trimOrNull(input.seoTitle),
    seoDescription: trimOrNull(input.seoDescription),
    ogImage: trimOrNull(input.ogImage),
    updatedAt: new Date(),
  };

  let projectId = input.id;

  try {
    await db.transaction(async (tx) => {
      if (projectId) {
        await tx.update(projects).set(values).where(eq(projects.id, projectId));
      } else {
        const [created] = await tx
          .insert(projects)
          .values(values)
          .returning({ id: projects.id });
        projectId = created.id;
      }
      await replaceRelations(tx, projectId, input);
    });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return { ok: false, error: "Проект з таким слагом уже існує" };
    }
    throw e;
  }

  revalidatePath("/admin/projects");
  return { ok: true };
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export type TagResult =
  | { ok: true; id: number; name: string; slug: string }
  | { ok: false; error: string };

/** Тег создаётся прямо из формы проекта, чтобы не ходить в отдельный раздел. */
export async function createProjectTag(
  name: string,
  slug: string,
): Promise<TagResult> {
  const cleanName = name.trim();
  const cleanSlug = slug.trim();
  if (!cleanName) return { ok: false, error: "Вкажіть назву тегу" };
  if (!cleanSlug || !SLUG_RE.test(cleanSlug)) {
    return {
      ok: false,
      error: "Слаг може містити лише малі латинські літери, цифри та дефіс",
    };
  }

  try {
    const [row] = await db
      .insert(projectTags)
      .values({ name: cleanName, slug: cleanSlug })
      .returning({ id: projectTags.id });
    revalidatePath("/admin/projects");
    return { ok: true, id: row.id, name: cleanName, slug: cleanSlug };
  } catch (e) {
    if (isUniqueViolation(e)) {
      return { ok: false, error: "Тег з таким слагом уже існує" };
    }
    throw e;
  }
}
