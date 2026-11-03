import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { postCategories, posts } from "@/db/schema";

/** Список статей, свежие сверху; фильтр по рубрике через её слаг. */
export async function getPostList(categorySlug?: string) {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      categoryName: postCategories.name,
      publishedAt: posts.publishedAt,
      hasCover: sql<boolean>`${posts.coverImage} is not null`,
    })
    .from(posts)
    .leftJoin(postCategories, eq(posts.categoryId, postCategories.id))
    .where(categorySlug ? eq(postCategories.slug, categorySlug) : undefined)
    .orderBy(desc(posts.publishedAt));
}

export async function getPost(id: number) {
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  return row ?? null;
}

/** Рубрики со счётчиком статей: для фильтра списка и выбора в форме. */
export async function getPostCategories() {
  return db
    .select({
      id: postCategories.id,
      slug: postCategories.slug,
      name: postCategories.name,
      postCount: sql<number>`count(${posts.id})::int`,
    })
    .from(postCategories)
    .leftJoin(posts, eq(posts.categoryId, postCategories.id))
    .groupBy(postCategories.id)
    .orderBy(asc(postCategories.sort), asc(postCategories.name));
}

export async function getPostCount() {
  const [row] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(posts);
  return row.total;
}

export type PostListRow = Awaited<ReturnType<typeof getPostList>>[number];
export type PostCategory = Awaited<ReturnType<typeof getPostCategories>>[number];
export type Post = NonNullable<Awaited<ReturnType<typeof getPost>>>;
