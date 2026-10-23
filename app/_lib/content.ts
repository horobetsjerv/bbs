// Контент сайта из базы (то, что редактируется в админке): контакты,
// проекты («Вироби на замовлення»), статьи блога.
// Всё читается на каждый запрос (connection): правки в админке видны сразу,
// а сборке база не нужна.

import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";

import { clampSentences, getMaterial, getProductPaths } from "./catalog";
// Фолбэк и tel:-ссылка — в модуле без базы (нужны странице 500).
import { FALLBACK_SETTINGS as FALLBACK, telHref } from "./contacts";

export { telHref };

export const getSettings = cache(async () => {
  await connection();
  const s = await db.query.settings.findFirst();
  const socials = s?.socials ?? {};
  return {
    phones: s?.phones?.length ? s.phones : FALLBACK.phones,
    emails: s?.emails?.length ? s.emails : FALLBACK.emails,
    address: s?.address || FALLBACK.address,
    workingHours: s?.workingHours || FALLBACK.workingHours,
    /** Пустая ссылка — соцсеть не заполнена в админке. */
    socials: {
      telegram: socials.telegram ?? null,
      facebook: socials.facebook ?? null,
      instagram: socials.instagram ?? null,
    },
  };
});

export type SiteSettings = Awaited<ReturnType<typeof getSettings>>;

/**
 * Авторы проекта из текста админки: абзацы вида «Меблі: <a href>@manka_furniture</a>».
 * Остальные абзацы не трогаются.
 */
function parseCredits(html: string | null | undefined) {
  if (!html) return [];
  return [...html.matchAll(/<p>\s*([^<:]+?):\s*<a\s[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>\s*<\/p>/gi)].map(
    ([, label, href, value]) => ({ label: `${label.trim()}:`, value: value.trim(), href }),
  );
}

/** HTML из редактора админки → простой текст с абзацами. */
function htmlToText(html: string | null | undefined) {
  if (!html) return null;
  const text = html
    .replace(/<\/(p|h[1-6]|li)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text || null;
}

// ─── Проекты ────────────────────────────────────────────────────────────────

const loadProjects = cache(async () => {
  await connection();
  const rows = await db.query.projects.findMany({
    where: (p, { eq }) => eq(p.isPublished, true),
    orderBy: (p, { asc, desc }) => [asc(p.sort), desc(p.createdAt)],
    with: {
      images: true,
      tags: { with: { tag: true } },
      materials: {
        with: { material: { with: { brand: true, collection: true } } },
      },
    },
  });
  return rows.map((p) => {
    const materials = p.materials.map(({ material: m }) => m);
    // Метки карточки как в макете: бренд и коллекция («Laminam», «BLEND»).
    const tags = [
      ...new Set([
        ...materials.map((m) => m.brand.name),
        ...materials.flatMap((m) => (m.collection ? [m.collection.name.toUpperCase()] : [])),
      ]),
    ].slice(0, 2);
    return {
      id: p.id,
      slug: p.slug,
      card: {
        href: `/proekty/${p.slug}/`,
        title: p.name,
        // Как в макете card_project («Vicostone BQ200»): материал проекта, а не
        // краткое описание — оно уже есть в названии. У Laminam в базе вместо
        // артикула технический slug, поэтому бренд + декор.
        subtitle: materials[0]
          ? materials[0].brand.slug === "vicostone" && materials[0].article
            ? `${materials[0].brand.name} ${materials[0].article}`
            : `${materials[0].brand.name} ${materials[0].name}`
          : (p.shortDescription ?? ""),
        tags,
        image: p.coverImage,
      },
      row: p,
      materials,
    };
  });
});

export type ProjectCardData = Awaited<ReturnType<typeof loadProjects>>[number]["card"];

/** Проекты; с brand — только те, где есть материал этого бренда. */
export async function getProjects(limit?: number, brand?: string) {
  const all = (await loadProjects()).filter(
    (p) => !brand || p.materials.some((m) => m.brand.slug === brand),
  );
  return (limit ? all.slice(0, limit) : all).map((p) => p.card);
}

/** Страница изделия: проект + характеристики его первого материала. */
export async function getProject(slug: string) {
  const all = await loadProjects();
  const p = all.find((x) => x.slug === slug);
  if (!p) return null;
  const first = p.materials[0];
  const [material, productPaths] = await Promise.all([
    first ? getMaterial(first.id) : null,
    getProductPaths(),
  ]);
  const images = [...p.row.images].sort((a, b) => a.sort - b.sort);
  return {
    name: p.row.name,
    seoTitle: p.row.seoTitle,
    seoDescription: p.row.seoDescription,
    shortDescription: p.row.shortDescription,
    year: p.row.year,
    description: htmlToText(p.row.body) ?? p.row.shortDescription,
    credits: parseCredits(p.row.body),
    images: (images.length ? images.map((i) => i.url) : [p.row.coverImage]).map((url) => ({
      full: url,
      thumb: url,
      alt: p.row.name,
    })),
    tags: p.row.tags.map(({ tag }) => tag.name),
    materials: p.materials.map((m) => ({
      name: m.name,
      // Снятый с публикации материал своей страницы не имеет.
      href: productPaths.get(m.id) ?? null,
    })),
    material,
    similar: all
      .filter((x) => x.slug !== slug)
      .slice(0, 3)
      .map((x) => x.card),
  };
}

// ─── Блог ───────────────────────────────────────────────────────────────────

const dateFmt = new Intl.DateTimeFormat("uk-UA", {
  timeZone: "Europe/Kyiv",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const getPostCategories = cache(async () => {
  await connection();
  return db.query.postCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.sort), asc(c.name)],
  });
});

const loadPosts = cache(async () => {
  await connection();
  const rows = await db.query.posts.findMany({
    where: (p, { lte }) => lte(p.publishedAt, new Date()),
    orderBy: (p, { desc }) => [desc(p.publishedAt)],
    with: { category: true },
  });
  return rows.map((p) => ({
    row: p,
    card: {
      href: `/blog/${p.slug}/`,
      title: p.title,
      category: p.category?.name ?? "",
      categorySlug: p.category?.slug ?? null,
      date: dateFmt.format(p.publishedAt),
      image: p.coverImage,
    },
  }));
});

export type PostCardData = Awaited<ReturnType<typeof loadPosts>>[number]["card"];

/** Статьи рубрики (или все) с поиском по заголовку. */
export async function getPosts(category?: string | null, q?: string) {
  const all = await loadPosts();
  const needle = q?.trim().toLowerCase();
  return all
    .filter((p) => !category || p.card.categorySlug === category)
    .filter((p) => !needle || p.card.title.toLowerCase().includes(needle))
    .map((p) => p.card);
}

export async function getPost(slug: string) {
  const all = await loadPosts();
  const p = all.find((x) => x.row.slug === slug);
  if (!p) return null;
  return {
    ...p.card,
    body: p.row.body,
    seoTitle: p.row.seoTitle,
    seoDescription: p.row.seoDescription,
    /** Даты для Open Graph и JSON-LD (ISO). */
    publishedAt: p.row.publishedAt.toISOString(),
    updatedAt: p.row.updatedAt.toISOString(),
    /** Начало текста — Description, если в админке не задан. */
    excerpt: clampSentences(
      (htmlToText(p.row.body) ?? "")
        .split(/\n{2,}/)
        // Заголовок без точки склеился бы со следующим абзацем.
        .map((part) => part.trim().replace(/([^.!?…:])$/, "$1."))
        .filter((part) => part.length > 1)
        .join(" "),
      160,
    ),
  };
}
