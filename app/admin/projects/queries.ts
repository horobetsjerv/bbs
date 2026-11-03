import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  brands,
  materials,
  projectImages,
  projectMaterials,
  projectTagLinks,
  projectTags,
  projects,
} from "@/db/schema";

/**
 * Список проектов. Теги и число фото берутся подзапросами:
 * джойн размножил бы строки, а фильтр по тегу тогда обрезал бы остальные теги проекта.
 */
export async function getProjectList(tagSlug?: string) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      year: projects.year,
      isPublished: projects.isPublished,
      tagNames: sql<string | null>`(
        select string_agg(t.name, ', ' order by t.sort, t.name)
        from ${projectTagLinks} l
        join ${projectTags} t on t.id = l.tag_id
        where l.project_id = ${projects}.id
      )`,
      imageCount: sql<number>`(
        select count(*)::int from ${projectImages} i where i.project_id = ${projects}.id
      )`,
    })
    .from(projects)
    .where(
      tagSlug
        ? sql`exists (
            select 1 from ${projectTagLinks} l
            join ${projectTags} t on t.id = l.tag_id
            where l.project_id = ${projects}.id and t.slug = ${tagSlug}
          )`
        : undefined,
    )
    .orderBy(asc(projects.sort), desc(projects.createdAt));
}

export async function getProject(id: number) {
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) return null;

  const [tagIds, materialIds, images] = await Promise.all([
    db
      .select({ id: projectTagLinks.tagId })
      .from(projectTagLinks)
      .where(eq(projectTagLinks.projectId, id)),
    db
      .select({ id: projectMaterials.materialId })
      .from(projectMaterials)
      .where(eq(projectMaterials.projectId, id)),
    db
      .select({ url: projectImages.url, alt: projectImages.alt })
      .from(projectImages)
      .where(eq(projectImages.projectId, id))
      .orderBy(asc(projectImages.sort), asc(projectImages.id)),
  ]);

  return {
    ...project,
    tagIds: tagIds.map((row) => row.id),
    materialIds: materialIds.map((row) => row.id),
    images: images.map((image) => ({ url: image.url, alt: image.alt ?? "" })),
  };
}

/** Теги со счётчиком проектов: для фильтра списка и выбора в форме. */
export async function getProjectTags() {
  return db
    .select({
      id: projectTags.id,
      slug: projectTags.slug,
      name: projectTags.name,
      projectCount: sql<number>`count(${projectTagLinks.projectId})::int`,
    })
    .from(projectTags)
    .leftJoin(projectTagLinks, eq(projectTagLinks.tagId, projectTags.id))
    .groupBy(projectTags.id)
    .orderBy(asc(projectTags.sort), asc(projectTags.name));
}

/** Материалы для поля «Використані матеріали»: подпись «Назва — Артикул (Бренд)». */
export async function getMaterialOptions() {
  return db
    .select({
      id: materials.id,
      name: materials.name,
      article: materials.article,
      brandName: brands.name,
    })
    .from(materials)
    .innerJoin(brands, eq(materials.brandId, brands.id))
    .orderBy(asc(brands.sort), asc(materials.name));
}

export async function getProjectCount() {
  const [row] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(projects);
  return row.total;
}

export type ProjectListRow = Awaited<ReturnType<typeof getProjectList>>[number];
export type ProjectTag = Awaited<ReturnType<typeof getProjectTags>>[number];
export type MaterialOption = Awaited<
  ReturnType<typeof getMaterialOptions>
>[number];
export type ProjectWithRelations = NonNullable<
  Awaited<ReturnType<typeof getProject>>
>;
