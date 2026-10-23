// Данные публичного каталога из базы (Drizzle / Postgres).
//
// Материалов немного (~160), поэтому берём все опубликованные одним запросом
// и фильтруем в памяти: так проще считать «фасеты» — сколько материалов даст
// каждый пункт фильтра с учётом остальных выбранных. Пункт, который при
// текущем выборе ничего не найдёт, становится неактивным (ТЗ: «несумісний
// бренд не ховати, а робити неактивним»).

import { connection } from "next/server";
import { cache } from "react";

import { db } from "@/db";

import {
  CATALOG_PATH,
  FIXED_LANDINGS,
  LANDING_KEYS,
  STONE_TYPES,
  TYPE_URL,
  catalogHref,
  LAMINAM_CATALOG_PATH,
  landingPath,
  sameSelection,
  splitLanding,
  type LandingKey,
} from "./catalog-url";
import { LANDING_TEXTS, type LandingText } from "./catalog-texts";

/** Laminam — керамограніт, Vicostone — кварцовий камінь (ТЗ). */
const BRAND_TYPE: Record<string, { slug: string; label: string }> = {
  laminam: { slug: "keramohranit", label: "Керамограніт" },
  vicostone: { slug: "kvarts", label: "Кварцовий камінь" },
};

const COUNTRY: Record<string, string> = {
  laminam: "Італія",
  vicostone: "В'єтнам",
};

export type FilterKey =
  | "type"
  | "brand"
  | "color"
  | "collection"
  | "design"
  | "surface"
  | "size"
  | "thickness"
  | "application"
  | "product"
  | "stock";

export const FILTER_KEYS: FilterKey[] = [
  "type",
  "brand",
  "color",
  "collection",
  "design",
  "surface",
  "size",
  "thickness",
  "application",
  "product",
  "stock",
];

/**
 * ТЗ: «після вибору керамограніту показувати лише його дизайни, розміри й
 * кольори, після вибору кварцу — лише параметри кварцу». В этих группах
 * чужие пункты скрываются; бренд и призначення остаются неактивными с (0).
 */
const TYPE_SCOPED: FilterKey[] = [
  "color",
  "collection",
  "design",
  "surface",
  "size",
  "thickness",
];

export type Selected = Record<FilterKey, string[]>;

type Option = {
  slug: string;
  label: string;
  sort: number;
  hex?: string | null;
  /** Подзаголовок внутри группы (размеры: «Тонкий керамограніт»). */
  group?: string;
  /** Пункт вне списка ТЗ: в панели не показываем, но ссылка с ним работает. */
  hidden?: boolean;
};

type Mapped = { slug: string; label: string; from: string[] };

/**
 * «Призначення» по ТЗ; каждый пункт собирает применения из базы.
 * Умивальники — «Ванна кімната», вулиця — фасад и тераса (отдельных нет).
 * Применения базы вне списка (двері, столи) в панели не выводятся.
 */
const PURPOSES: Mapped[] = [
  { slug: "stilnytsi", label: "Для стільниць та островів", from: ["stilnytsi", "ostrovy-kukhonni"] },
  { slug: "fartukhy", label: "Для кухонних фартухів", from: ["fartukhy"] },
  { slug: "pidvikonnia", label: "Для підвіконь", from: ["pidvikonnia"] },
  { slug: "skhody", label: "Для сходів", from: ["skhody"] },
  { slug: "fasad", label: "Для фасадів", from: ["fasad"] },
  { slug: "stiny", label: "Для облицювання стін", from: ["stiny"] },
  { slug: "kukhonni-mebli-fasady", label: "Для меблевих фасадів", from: ["kukhonni-mebli-fasady"] },
  { slug: "kaminy", label: "Для камінів", from: ["kaminy"] },
  { slug: "umyvalnyky", label: "Для умивальників", from: ["vanna-kimnata"] },
  { slug: "pidloha", label: "Для підлоги", from: ["pidloha"] },
  { slug: "vulytsia", label: "Для вулиці", from: ["fasad", "terasa"] },
  { slug: "terasa", label: "Для тераси", from: ["terasa"] },
];
/** «Виріб на замовлення» по ТЗ. */
const PRODUCTS: Mapped[] = [
  { slug: "stilnytsi", label: "Стільниці", from: ["stilnytsi"] },
  { slug: "fartukhy", label: "Кухонні фартухи", from: ["fartukhy"] },
  { slug: "pidvikonnia", label: "Підвіконня", from: ["pidvikonnia"] },
  { slug: "umyvalnyky", label: "Умивальники", from: ["vanna-kimnata"] },
  { slug: "kaminy", label: "Каміни", from: ["kaminy"] },
];
/** Старые адреса (плитки, карточка товара) ведут на пункт ТЗ, который их включает. */
const PURPOSE_ALIAS: Record<string, string> = {
  "ostrovy-kukhonni": "stilnytsi",
  "vanna-kimnata": "umyvalnyky",
};

const mapped = (list: Mapped[], has: Set<string>): Option[] =>
  list.flatMap((p, i) =>
    p.from.some((s) => has.has(s))
      ? [{ slug: p.slug, label: p.label, sort: i }]
      : [],
  );

/**
 * Размеры по ТЗ: у керамограніта формат зависит от толщины, поэтому пункт
 * проверяется по вариантам материала (размер + толщина).
 */
const SIZES: {
  slug: string;
  label: string;
  group: string;
  match: (size: string, mm: number) => boolean;
}[] = [
  { slug: "3000x1000", label: "3000 × 1000 мм", group: "Тонкий керамограніт", match: (s, t) => s === "3000x1000" && t < 12 },
  { slug: "3000x1200", label: "3000 × 1200 мм", group: "Тонкий керамограніт", match: (s, t) => s === "3000x1200" && t < 12 },
  { slug: "3240x1620", label: "3240 × 1620 мм", group: "Тонкий керамограніт", match: (s, t) => s === "3240x1620" && t < 12 },
  { slug: "3240x1620-12-20", label: "3240 × 1620 мм", group: "Керамограніт 12–20 мм", match: (s, t) => s === "3240x1620" && t >= 12 },
  { slug: "3000x1400", label: "3000 × 1400 мм", group: "Кварц", match: (s) => s === "normal-3000x1400" },
  { slug: "3300x1650", label: "3300 × 1650 мм", group: "Кварц", match: (s) => s === "jambo-3300x1650" },
];

export type CatalogItem = {
  id: number;
  slug: string;
  /** Slug в адресе /tovary/{slug}/ — уникален на весь сайт (см. publicSlugs). */
  publicSlug: string;
  href: string;
  name: string;
  article: string;
  brand: { slug: string; name: string };
  collection: { slug: string; name: string; description: string | null } | null;
  image: string | null;
  inStock: boolean;
  sort: number;
  facets: Record<FilterKey, Option[]>;
};

/** Размер фото с CDN производителя: карточке не нужен оригинал на 2–5 МБ. */
export function imageUrl(url: string | null | undefined, width: number) {
  if (!url) return null;
  // Laminam (thron): размер «вписать в рамку» задаётся в пути.
  if (url.includes("thron.com")) {
    return url.replace(/\/std\/\d+x\d+\//, `/std/${width}x${width * 2}/`);
  }
  // Vicostone (Sitecore): ширина — параметром.
  if (url.includes("vicostone.com")) {
    return `${url}${url.includes("?") ? "&" : "?"}w=${width}`;
  }
  return url;
}

/** 12+ мм → 12plus (плюс в адресе превратился бы в пробел). */
const thicknessSlug = (label: string) =>
  label.replace(/\s*мм\s*/i, "").replace("+", "plus").trim();

/** Адрес карточки товара: один постоянный URL вне вложенности каталога. */
export const productPath = (publicSlug: string) => `/tovary/${publicSlug}/`;

/**
 * Публичные slug товаров. Slug в базе уникален только внутри бренда
 * (taj-mahal есть и у Laminam, и у Vicostone), а /tovary/{slug}/ — общий
 * для сайта. Правило: slug из базы, если среди опубликованных он один;
 * при совпадении — {бренд}-{slug}. Базу не меняем — считаем здесь, в одном месте.
 */
function publicSlugs(rows: { id: number; slug: string; brand: { slug: string } }[]) {
  const count = new Map<string, number>();
  for (const r of rows) count.set(r.slug, (count.get(r.slug) ?? 0) + 1);
  const taken = new Set(rows.filter((r) => count.get(r.slug) === 1).map((r) => r.slug));
  return new Map(
    rows.map((r) => {
      if (count.get(r.slug) === 1) return [r.id, r.slug];
      let slug = `${r.brand.slug}-${r.slug}`;
      // {бренд}-{slug} совпал с чьим-то slug — добавляем id, чтобы адрес не задвоился.
      if (taken.has(slug)) slug = `${slug}-${r.id}`;
      taken.add(slug);
      return [r.id, slug];
    }),
  );
}

const loadMaterials = cache(async (): Promise<CatalogItem[]> => {
  const rows = await db.query.materials.findMany({
    where: (m, { eq }) => eq(m.isPublished, true),
    with: {
      brand: true,
      collection: true,
      images: true,
      colors: { with: { color: true } },
      surfaces: { with: { surface: true } },
      designs: { with: { design: true } },
      applications: { with: { application: true } },
      thicknesses: { with: { thickness: true } },
      variants: { with: { size: true, thickness: true } },
    },
  });

  const slugs = publicSlugs(rows);
  return rows.map((m) => {
    const appSlugs = new Set(m.applications.map(({ application: a }) => a.slug));
    const covered = new Set(PURPOSES.flatMap((p) => p.from));
    const type = BRAND_TYPE[m.brand.slug];
    const main =
      m.images.find((i) => i.isMain) ??
      [...m.images].sort((a, b) => a.sort - b.sort)[0];
    return {
      id: m.id,
      slug: m.slug,
      publicSlug: slugs.get(m.id)!,
      href: productPath(slugs.get(m.id)!),
      name: m.name,
      article: m.article,
      brand: { slug: m.brand.slug, name: m.brand.name },
      collection: m.collection
        ? { slug: m.collection.slug, name: m.collection.name, description: m.collection.description }
        : null,
      image: main?.url ?? null,
      inStock: m.inStock,
      sort: m.sort,
      facets: {
        type: type ? [{ ...type, sort: m.brand.sort }] : [],
        brand: [{ slug: m.brand.slug, label: m.brand.name, sort: m.brand.sort }],
        color: m.colors.map(({ color: c }) => ({
          slug: c.slug,
          label: c.name,
          sort: c.sort,
          hex: c.hex,
        })),
        collection: m.collection
          ? [{ slug: m.collection.slug, label: m.collection.name, sort: m.collection.sort }]
          : [],
        design: m.designs.map(({ design: d }) => ({ slug: d.slug, label: d.name, sort: d.sort })),
        surface: m.surfaces.map(({ surface: s }) => ({ slug: s.slug, label: s.name, sort: s.sort })),
        size: SIZES.flatMap((o, i) =>
          m.variants.some((v) => o.match(v.size.slug, v.thickness.valueMm))
            ? [{ slug: o.slug, label: o.label, group: o.group, sort: i }]
            : [],
        ),
        thickness: m.thicknesses.map(({ thickness: t }) => ({
          slug: thicknessSlug(t.label),
          label: t.label,
          sort: t.valueMm * 10 + (t.label.includes("+") ? 1 : 0),
        })),
        application: [
          ...mapped(PURPOSES, appSlugs),
          ...m.applications
            .filter(({ application: a }) => !covered.has(a.slug))
            .map(({ application: a }) => ({
              slug: a.slug,
              label: a.name,
              sort: 100 + a.sort,
              hidden: true,
            })),
        ],
        product: mapped(PRODUCTS, appSlugs),
        stock: [
          m.inStock
            ? { slug: "in-stock", label: "В наявності", sort: 0 }
            : { slug: "on-order", label: "Під замовлення", sort: 1 },
        ],
      },
    };
  });
});

const matches = (item: CatalogItem, selected: Selected, except?: FilterKey) =>
  FILTER_KEYS.every(
    (key) =>
      key === except ||
      selected[key].length === 0 ||
      item.facets[key].some((o) => selected[key].includes(o.slug)),
  );

export type FacetOption = {
  slug: string;
  label: string;
  count: number;
  selected: boolean;
  disabled: boolean;
  hex?: string | null;
  group?: string;
};

export type Facet = { key: FilterKey; options: FacetOption[] };

export type SortKey = "popular" | "name-asc" | "name-desc";

export type CatalogQuery = {
  selected: Selected;
  sort: SortKey;
  page: number;
  /** Каталог бренда (Laminam) — всегда отфильтрован по нему. */
  brand?: string;
  /** Карточек на страницу: 15 на десктопе, 10 в мобильной сетке 2×5. */
  perPage?: number;
};

export const PER_PAGE = 15;
export const PER_PAGE_MOBILE = 10;

/** Порядок «Популярні»: поле sort из админки, затем бренд и название. */
const byPopular = (a: CatalogItem, b: CatalogItem) =>
  a.sort - b.sort || a.brand.slug.localeCompare(b.brand.slug) || a.name.localeCompare(b.name);

export async function getCatalog({ selected, sort, page, brand, perPage = PER_PAGE }: CatalogQuery) {
  const all = (await loadMaterials()).filter((m) => !brand || m.brand.slug === brand);

  // Выбран тип каменя — параметры (TYPE_SCOPED) берём только из его материалов.
  const ofType = selected.type.length
    ? all.filter((m) => m.facets.type.some((t) => selected.type.includes(t.slug)))
    : all;

  // Фасеты: пункты, которые вообще встречаются в этом каталоге, и сколько
  // материалов даст каждый при остальных выбранных фильтрах.
  const facets: Facet[] = FILTER_KEYS.map((key) => {
    const options = new Map<string, Option>();
    const source = TYPE_SCOPED.includes(key) ? ofType : all;
    for (const m of source) for (const o of m.facets[key]) options.set(o.slug, o);
    // Выбранный пункт чужого типа не прячем — иначе его не снять.
    for (const m of all)
      for (const o of m.facets[key])
        if (selected[key].includes(o.slug)) options.set(o.slug, o);
    // Тип и бренд считаем без параметров (коллекция, цвет, размер…): при их
    // смене параметры сбрасываются, поэтому второй тип/бренд не должен
    // становиться неактивным из-за них. Бренд при этом учитывает выбранный тип.
    const scopedOff = Object.fromEntries(TYPE_SCOPED.map((k) => [k, []]));
    const basis =
      key === "type"
        ? { ...selected, brand: [], ...scopedOff }
        : key === "brand"
          ? { ...selected, ...scopedOff }
          : selected;
    const pool = all.filter((m) => matches(m, basis, key));
    return {
      key,
      options: [...options.values()]
        .filter((o) => !o.hidden || selected[key].includes(o.slug))
        .sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label))
        .map((o) => {
          const count = pool.filter((m) => m.facets[key].some((x) => x.slug === o.slug)).length;
          const isSelected = selected[key].includes(o.slug);
          return {
            slug: o.slug,
            label: o.label,
            hex: o.hex,
            group: o.group,
            count,
            selected: isSelected,
            disabled: count === 0 && !isSelected,
          };
        }),
    };
  });

  const found = all.filter((m) => matches(m, selected));
  found.sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return byPopular(a, b);
  });

  const pages = Math.max(1, Math.ceil(found.length / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const items = found.slice((current - 1) * perPage, current * perPage).map((m) => ({
    href: m.href,
    name: m.name,
    subtitle: m.collection?.name ?? m.brand.name,
    detail: m.facets.design.map((d) => d.label).join(", ") || m.brand.name,
    brand: m.brand.name,
    image: imageUrl(m.image, 800),
  }));

  // typeScoped — клиенту: при смене типа эти группы сбрасываются.
  return { facets, items, total: found.length, page: current, pages, typeScoped: TYPE_SCOPED };
}

export type CatalogCardData = Awaited<ReturnType<typeof getCatalog>>["items"][number];

export type SearchParams = Record<string, string | string[] | undefined>;

/** Разбор адреса каталога: ?color=bilyi,siryi&sort=name-asc&page=2 */
export function parseCatalogParams(params: SearchParams, preset?: Partial<Selected>) {
  const selected = Object.fromEntries(
    FILTER_KEYS.map((k) => {
      const v = params[k];
      const raw = Array.isArray(v) ? v.join(",") : v;
      const fromQuery = raw ? raw.split(",").filter(Boolean) : [];
      // Подборка (/kataloh/kvartsovyi-kamin-bilyi/) задаёт фильтры адресом, остальное — из query.
      return [k, [...new Set([...(preset?.[k] ?? []), ...fromQuery])]];
    }),
  ) as Selected;
  selected.application = [
    ...new Set(selected.application.map((s) => PURPOSE_ALIAS[s] ?? s)),
  ];
  // Тип каменя — один (в ТЗ переключатель ● / ○); бренд тоже один.
  selected.type = selected.type.slice(0, 1);
  selected.brand = selected.brand.slice(0, 1);
  const s = params.sort;
  const sort: SortKey = s === "name-asc" || s === "name-desc" ? s : "popular";
  const page = Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1;
  return { selected, sort, page };
}

/** id опубликованного материала по публичному slug (/tovary/{slug}/). */
export async function findMaterialId(publicSlug: string) {
  return (await loadMaterials()).find((m) => m.publicSlug === publicSlug)?.id ?? null;
}

/** Новый адрес товара по старому /catalog/{brand}/{slug} (для 301). */
export async function findProductPath(brandSlug: string, slug: string) {
  return (await loadMaterials()).find((m) => m.brand.slug === brandSlug && m.slug === slug)?.href ?? null;
}

/** Адреса карточек опубликованных материалов по id (ссылки из проектов). */
export async function getProductPaths() {
  return new Map((await loadMaterials()).map((m) => [m.id, m.href]));
}

/** Карточка материала для страницы товара. */
export const getMaterial = cache(async (id: number) => {
  const m = await db.query.materials.findFirst({
    where: (t, { and, eq }) => and(eq(t.id, id), eq(t.isPublished, true)),
    with: {
      brand: true,
      collection: true,
      images: { with: { surface: true } },
      surfaces: { with: { surface: true } },
      designs: { with: { design: true } },
      applications: { with: { application: true } },
      variants: { with: { size: true, thickness: true } },
      sizes: { with: { size: true } },
      thicknesses: { with: { thickness: true } },
    },
  });
  if (!m) return null;

  const images = [...m.images].sort(
    (a, b) => Number(b.isMain) - Number(a.isMain) || a.sort - b.sort,
  );
  const sizes = [...m.sizes].sort((a, b) => a.size.sort - b.size.sort);
  const thicknesses = [...m.thicknesses].sort(
    (a, b) => a.thickness.valueMm - b.thickness.valueMm,
  );
  const href = (await getProductPaths()).get(m.id) ?? productPath(m.slug);
  return {
    id: m.id,
    slug: m.slug,
    href,
    name: m.name,
    article: m.article,
    brand: m.brand,
    collection: m.collection,
    country: COUNTRY[m.brand.slug] ?? null,
    typeLabel: BRAND_TYPE[m.brand.slug]?.label ?? null,
    description: m.description,
    techSpecs: m.techSpecs,
    specPdfUrl: m.specPdfUrl,
    inStock: m.inStock,
    images: images.map((i) => ({
      full: imageUrl(i.url, 1200)!,
      thumb: imageUrl(i.url, 300)!,
      alt: i.alt ?? m.name,
    })),
    sizes: sizes.map(({ size: s }) => `${s.widthMm}×${s.heightMm} мм`),
    thicknesses: thicknesses.map(({ thickness: t }) => t.label),
    surfaces: m.surfaces.map(({ surface: s }) => s.name),
    designs: m.designs.map(({ design: d }) => d.name),
    applications: m.applications
      .map(({ application: a }) => a)
      .sort((a, b) => a.sort - b.sort)
      .map((a) => ({ slug: a.slug, name: a.name })),
  };
});

/** «Схожі кольори»: та же коллекция, иначе тот же бренд и дизайн. */
export async function getSimilar(id: number, limit = 3) {
  const all = await loadMaterials();
  const self = all.find((m) => m.id === id);
  if (!self) return [];
  const designs = new Set(self.facets.design.map((d) => d.slug));
  const score = (m: CatalogItem) =>
    (self.collection && m.collection?.slug === self.collection.slug ? 10 : 0) +
    (m.brand.slug === self.brand.slug ? 2 : 0) +
    m.facets.design.filter((d) => designs.has(d.slug)).length;
  return all
    .filter((m) => m.id !== self.id)
    .sort((a, b) => score(b) - score(a) || a.sort - b.sort)
    .slice(0, limit)
    .map((m) => ({
      href: m.href,
      name: m.name,
      subtitle: m.collection?.name ?? m.brand.name,
      detail: m.facets.design.map((d) => d.label).join(", ") || m.brand.name,
      brand: m.brand.name,
      image: imageUrl(m.image, 800),
    }));
}

/** «Популярні декори»: вкладки керамограніт (Laminam) и кварц (Vicostone). */
export async function getPopularDecors(limit = 4) {
  await connection(); // не пререндерить: данные меняются в админке
  const all = await loadMaterials();
  return ["laminam", "vicostone"].map((brand) =>
    all
      .filter((m) => m.brand.slug === brand)
      .sort(byPopular)
      .slice(0, limit)
      .map((m) => ({
        href: m.href,
        name: m.name,
        brand: m.brand.name,
        image: imageUrl(m.image, 600),
      })),
  );
}

export type Decor = Awaited<ReturnType<typeof getPopularDecors>>[number][number];

// ─── SEO каталога (таблица SEO: шаблоны Title / Description, индексация) ──────

/** Родительный падеж для H1 «Каталог …». */
const TYPE_GENITIVE: Record<string, string> = {
  keramohranit: "керамограніту",
  kvarts: "кварцового каменю",
};

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Обрезка по слову до max символов (ориентир таблицы — до 160 для Description). */
export function clampText(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]+$/, "")}…`;
}

/** Все группы фильтров, пустые — кроме заданных. */
const toSelected = (partial: Partial<Selected>) =>
  Object.fromEntries(FILTER_KEYS.map((k) => [k, [...(partial[k] ?? [])]])) as Selected;

/** Фильтры подборки по её адресу (/kataloh/{slug}/); null — такой подборки нет. */
export async function resolveLanding(slug: string): Promise<Partial<Selected> | null> {
  const fixed = FIXED_LANDINGS.find((l) => l.slug === slug);
  if (fixed) return toSelected(fixed.selected);
  const parts = splitLanding(slug);
  if (!parts) return null;
  const all = (await loadMaterials()).filter((m) =>
    m.facets.type.some((t) => t.slug === parts.type),
  );
  if (all.length === 0) return null;
  // Как до переезда: подборка задаёт только тип, бренд в панели не отмечается.
  const base = { type: [parts.type] };
  if (!parts.rest) return base;
  for (const key of LANDING_KEYS) {
    if (all.some((m) => m.facets[key].some((o) => o.slug === parts.rest))) {
      return { ...base, [key]: [parts.rest] };
    }
  }
  return null;
}

/** Крошка подборки типа — она же родитель у подборок «тип + …». */
const TYPE_CRUMB: Record<string, string> = {
  keramohranit: "Каталог керамограніту",
  kvarts: "Каталог кварцового каменю",
};

/**
 * Подборки «виріб / призначення» (FIXED_LANDINGS): название (крошка), H1,
 * основа Title и начало Description. Формулировки — по листу «Каталог»:
 * BBS постачає плити для виготовлення виробів, а не самі вироби.
 * `lead` без значения — навигационная страница обоих материалов: перечень
 * материалов подставляется по фактическим товарам подборки.
 * `parent` — промежуточная крошка (навигационная страница или тип).
 * Подборки с листом в SEO-таблице берут Title / Description / H1 и тексты
 * из LANDING_TEXTS (catalog-texts.ts).
 */
const FIXED_SEO: Record<
  string,
  { label: string; h1: [light: string, bold: string]; name: string; lead?: string; parent?: string }
> = {
  stilnytsi: { label: "Стільниці", h1: ["Плити для", "стільниць"], name: "Плити для стільниць" },
  "kukhonni-fartukhy": { label: "Кухонні фартухи", h1: ["Матеріали для", "кухонних фартухів"], name: "Матеріали для кухонних фартухів" },
  pidvikonnia: { label: "Підвіконня", h1: ["Плити для", "підвіконь"], name: "Плити для підвіконь" },
  umyvalnyky: { label: "Умивальники", h1: ["Плити для", "умивальників"], name: "Плити для умивальників" },
  kaminy: { label: "Каміни", h1: ["Матеріали для", "облицювання камінів"], name: "Матеріали для облицювання камінів" },
  fasady: { label: "Фасади", h1: ["Матеріали для", "фасадів"], name: "Матеріали для фасадів" },
  skhody: { label: "Сходи", h1: ["Матеріали для", "сходів"], name: "Матеріали для сходів" },
  "stilnytsi-z-keramogranitu": {
    label: "Стільниці з керамограніту",
    h1: ["Стільниці з", "керамограніту"],
    name: "Стільниці з керамограніту",
    lead: "Плити керамограніту Laminam для виготовлення стільниць",
    parent: "Стільниці",
  },
  "stilnytsi-z-kvartsovoho-kameniu": {
    label: "Стільниці з кварцового каменю",
    h1: ["Стільниці з", "кварцового каменю"],
    name: "Стільниці з кварцового каменю",
    lead: "Плити кварцового каменю Vicostone для виготовлення стільниць",
    parent: "Стільниці",
  },
  "fartukhy-z-keramogranitu": {
    label: "Кухонні фартухи з керамограніту",
    h1: ["Кухонні фартухи з", "керамограніту"],
    name: "Кухонні фартухи з керамограніту",
    lead: "Керамограніт Laminam для кухонних фартухів",
    parent: "Кухонні фартухи",
  },
  "pidvikonnia-z-keramogranitu": {
    label: "Підвіконня з керамограніту",
    h1: ["Підвіконня з", "керамограніту"],
    name: "Підвіконня з керамограніту",
    lead: "Плити керамограніту Laminam для виготовлення підвіконь",
    parent: "Підвіконня",
  },
  "pidvikonnia-z-kvartsovoho-kameniu": {
    label: "Підвіконня з кварцового каменю",
    h1: ["Підвіконня з", "кварцового каменю"],
    name: "Підвіконня з кварцового каменю",
    lead: "Плити кварцового каменю Vicostone для виготовлення підвіконь",
    parent: "Підвіконня",
  },
  "umyvalnyky-z-keramogranitu": {
    label: "Умивальники з керамограніту",
    h1: ["Умивальники з", "керамограніту"],
    name: "Умивальники з керамограніту",
    lead: "Плити керамограніту Laminam для виготовлення умивальників",
    parent: "Умивальники",
  },
  "oblytsiuvannia-kaminiv-keramogranitom": {
    label: "Облицювання камінів керамогранітом",
    h1: ["Облицювання камінів", "керамогранітом"],
    name: "Облицювання камінів керамогранітом",
    lead: "Керамограніт Laminam для облицювання камінів",
    parent: "Каміни",
  },
  "keramogranit-dlia-fasadiv": {
    label: "Керамограніт для фасадів",
    h1: ["Керамограніт", "для фасадів"],
    name: "Керамограніт для фасадів",
    lead: "Великоформатний керамограніт Laminam для облицювання фасадів",
    parent: TYPE_CRUMB.keramohranit,
  },
  "keramogranit-dlia-stin": {
    label: "Керамограніт для стін",
    h1: ["Керамограніт", "для стін"],
    name: "Керамограніт для стін",
    lead: "Великоформатний керамограніт Laminam для облицювання стін",
    parent: TYPE_CRUMB.keramohranit,
  },
  "keramogranit-dlia-pidlohy": {
    label: "Керамограніт для підлоги",
    h1: ["Керамограніт", "для підлоги"],
    name: "Керамограніт для підлоги",
    lead: "Великоформатний керамограніт Laminam для підлоги",
    parent: TYPE_CRUMB.keramohranit,
  },
  "keramogranit-dlia-skhodiv": {
    label: "Керамограніт для сходів",
    h1: ["Керамограніт", "для сходів"],
    name: "Керамограніт для сходів",
    lead: "Керамограніт Laminam для облицювання сходів",
    parent: TYPE_CRUMB.keramohranit,
  },
  "keramogranit-dlia-vulytsi": {
    label: "Керамограніт для вулиці",
    h1: ["Керамограніт", "для вулиці"],
    name: "Керамограніт для вулиці",
    // Пункт «Для вулиці» в фильтрах = применения «Фасад» и «Тераса».
    lead: "Керамограніт Laminam для фасадів і терас",
    parent: TYPE_CRUMB.keramohranit,
  },
  "keramogranit-dlia-terasy": {
    label: "Керамограніт для тераси",
    h1: ["Керамограніт", "для тераси"],
    name: "Керамограніт для тераси",
    lead: "Керамограніт Laminam для тераси",
    parent: TYPE_CRUMB.keramohranit,
  },
  "skhody-z-kvartsovoho-kameniu": {
    label: "Сходи з кварцового каменю",
    h1: ["Кварцовий камінь", "для сходів"],
    name: "Кварцовий камінь для сходів",
    lead: "Кварцовий камінь Vicostone для сходів",
    parent: TYPE_CRUMB.kvarts,
  },
  "keramogranit-dlia-vannoi-kimnaty": {
    label: "Керамограніт для ванної кімнати",
    h1: ["Керамограніт", "для ванної кімнати"],
    name: "Керамограніт для ванної кімнати",
    lead: "Керамограніт Laminam для ванної кімнати",
    parent: TYPE_CRUMB.keramohranit,
  },
  "keramogranit-dlia-plintusa": {
    label: "Керамограніт для плінтуса",
    h1: ["Керамограніт", "для плінтуса"],
    name: "Керамограніт для плінтуса",
    lead: "Керамограніт Laminam для плінтуса",
    parent: TYPE_CRUMB.keramohranit,
  },
};

/** Хвост Description по шаблону таблицы. */
const DESCRIPTION_TAIL = "Переглядайте декори, розміри, характеристики й актуальні ціни в каталозі BBS.";
const DESCRIPTION_TAIL_SHORT = "Декори, розміри й актуальні ціни в каталозі BBS.";

const description = (lead: string) => {
  const full = `${lead}. ${DESCRIPTION_TAIL}`;
  return clampText(full.length <= 160 ? full : `${lead}. ${DESCRIPTION_TAIL_SHORT}`, 160);
};

/** Title не длиннее 65 (ориентир таблицы): при длинном названии — короткий хвост. */
const titleFor = (name: string) =>
  [`${name} — купити, каталог і ціни | BBS`, `${name} — каталог і ціни | BBS`].find(
    (t) => t.length <= 65,
  ) ?? `${name} | BBS`;

type CatalogSeo = {
  title: string;
  description: string;
  h1: { light: string; bold: string };
  /** Крошки подборки после «Головна / Каталог» — с путями для BreadcrumbList. */
  crumbs: { name: string; path: string }[];
  /** Путь для canonical. */
  canonical: string;
  index: boolean;
  /**
   * Тексты подборки из SEO-таблицы (catalog-texts.ts) — только у «чистой»
   * подборки, без добавленных фильтров; страницу (page > 1) проверяет шаблон.
   */
  text?: LandingText;
};

/** Родитель подборки (FIXED_SEO.parent) — другая подборка или каталог типа. */
function parentCrumb(name: string) {
  const fixed = Object.entries(FIXED_SEO).find(([, f]) => f.label === name)?.[0];
  const type = STONE_TYPES.find((t) => TYPE_CRUMB[t] === name);
  const path = fixed ? `${CATALOG_PATH}${fixed}/` : type ? `${CATALOG_PATH}${TYPE_URL[type]}/` : CATALOG_PATH;
  return { name, path };
}

/**
 * Title / Description / H1 / canonical / robots страницы каталога.
 * `landing` — slug подборки из адреса (/kataloh/{landing}/), у /kataloh/ — нет.
 * Подборка индексируется при 3+ товарах; любое другое сочетание фильтров —
 * noindex с canonical на корень каталога (или на подборку с тем же выбором).
 */
export async function getCatalogSeo({
  selected,
  page,
  landing,
  brand,
}: {
  selected: Selected;
  page: number;
  landing?: string;
  /** Каталог бренда (Laminam) — своя страница со своим H1 и canonical. */
  brand?: string;
}): Promise<CatalogSeo> {
  const pageSuffix = page > 1 ? `?page=${page}` : "";
  const filtered = FILTER_KEYS.some((k) => selected[k].length > 0);

  // Каталог Laminam (макет Catalog LAM, раньше /laminam/catalog) на
  // /kataloh/laminam/: Title, H1 и описание — как были. Title отличается от
  // подборки «Керамограніт» и страницы бренда /laminam/ (без дублей).
  // Фильтры поверх — noindex.
  if (brand === "laminam") {
    return {
      title: "Каталог Laminam — великоформатний керамограніт, ціни | BBS",
      description:
        "Усі декори Laminam в одному каталозі: колекції, фактури, розміри й товщини плит. Оберіть керамограніт для стільниці, фасаду чи підлоги разом з BBS.",
      h1: { light: "Каталог", bold: "Laminam" },
      crumbs: [],
      canonical: `${LAMINAM_CATALOG_PATH}${filtered ? "" : pageSuffix}`,
      index: !filtered,
    };
  }

  const preset = landing ? await resolveLanding(landing) : null;
  // Подборка — только если к её фильтрам ничего не добавили параметрами.
  const own = landing && preset && sameSelection(selected, preset) ? landing : null;
  if (!own) {
    return {
      title: "Каталог керамограніту та кварцового каменю — ціни | BBS",
      description:
        "Каталог керамограніту Laminam і кварцового каменю Vicostone: фільтри за кольором, дизайном, розміром і призначенням. Характеристики й актуальні ціни BBS.",
      h1: { light: "Каталог", bold: "BBS" },
      crumbs: [],
      canonical: filtered ? (landingPath(selected) ?? CATALOG_PATH) : `${CATALOG_PATH}${pageSuffix}`,
      index: !filtered,
    };
  }

  const path = `${CATALOG_PATH}${own}/`;
  const all = await loadMaterials();
  const found = all.filter((m) => matches(m, selected));
  // Таблица: статичный адрес фильтра открываем для индексации только при 3+ товарах.
  const index = found.length >= 3;
  const canonical = `${path}${pageSuffix}`;

  const fixed = FIXED_SEO[own];
  if (fixed) {
    // Навигационная страница: материалы — по фактическим товарам подборки.
    const materials = [...new Map(found.map((m) => [m.brand.slug, m])).values()]
      .sort((a, b) => a.brand.slug.localeCompare(b.brand.slug))
      .map((m) => `${lower(m.facets.type[0]?.label ?? "")} ${m.brand.name}`.trim());
    const lead = fixed.lead ?? (materials.length ? `${fixed.name}: ${materials.join(" і ")}` : fixed.name);
    // Лист подборки в SEO-таблице: Title / Description / H1 — ровно из него.
    const text = LANDING_TEXTS[own];
    return {
      title: text?.title ?? titleFor(fixed.name),
      description: text?.description ?? description(lead),
      h1: text?.h1 ?? { light: fixed.h1[0], bold: fixed.h1[1] },
      crumbs: [...(fixed.parent ? [parentCrumb(fixed.parent)] : []), { name: fixed.label, path }],
      canonical,
      index,
      text,
    };
  }

  // Подборки типа: тип, тип + цвет / дизайн / размер.
  const type = selected.type[0];
  const typeLabel = found[0]?.facets.type[0]?.label ?? upper(TYPE_GENITIVE[type] ?? "");
  const option = (key: LandingKey) =>
    found.flatMap((m) => m.facets[key]).find((o) => selected[key].includes(o.slug));

  // Две самых частых «Призначення» среди товаров подборки.
  const counts = new Map<string, { label: string; n: number }>();
  for (const m of found)
    for (const o of m.facets.application)
      // «Для вулиці» — сумма фасадов и терас, в описании перебивала бы всё.
      if (!o.hidden && o.slug !== "vulytsia") counts.set(o.slug, { label: o.label, n: (counts.get(o.slug)?.n ?? 0) + 1 });
  const uses = [...counts.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, 2)
    .map((u) => lower(u.label.replace(/^Для\s+/i, "")));
  const forUses = uses.length ? ` для ${uses.join(" і ")}` : "";

  let name: string; // «Білий кварцовий камінь»
  let tail: string; // хвост Title по шаблону
  let heading: { light: string; bold: string }; // название подборки — в хлебных крошках
  const color = option("color");
  const design = option("design");
  const size = option("size");
  if (color) {
    name = `${color.label} ${lower(typeLabel)}`;
    tail = "купити, каталог і ціни";
    heading = { light: color.label, bold: lower(typeLabel) };
  } else if (design) {
    name = `${typeLabel} ${lower(design.label)}`;
    tail = "каталог і ціни";
    heading = { light: typeLabel, bold: lower(design.label) };
  } else if (size) {
    // «Керамограніт 12–20 мм» — у толстых плит свой подзаголовок размера.
    const material = size.group?.startsWith("Керамограніт ") ? size.group : typeLabel;
    name = `${material} ${size.label}`;
    tail = "каталог і ціни";
    heading = { light: material, bold: size.label };
  } else {
    // Тип целиком: «Керамограніт Laminam» — точнее и не короче ориентира Title.
    const brandName = found[0]?.brand.name;
    name = brandName ? `${typeLabel} ${brandName}` : typeLabel;
    tail = "купити, каталог і ціни";
    heading = { light: "Каталог", bold: TYPE_GENITIVE[type] ?? lower(typeLabel) };
  }
  const typeUrl = (TYPE_URL as Record<string, string | undefined>)[type];
  const typeCrumb = {
    name: TYPE_CRUMB[type] ?? `${heading.light} ${heading.bold}`,
    path: typeUrl ? `${CATALOG_PATH}${typeUrl}/` : path,
  };

  // Подборка типа целиком с листом в SEO-таблице («Каталог керамограніт» /
  // «Каталог кварцовий камінь»): Title / Description / H1 и тексты — из него.
  const text = !color && !design && !size ? LANDING_TEXTS[own] : undefined;
  if (text) {
    return {
      title: text.title,
      description: text.description,
      h1: text.h1,
      crumbs: [typeCrumb],
      canonical,
      index,
      text,
    };
  }

  return {
    title: `${name} — ${tail} | BBS`,
    description: (() => {
      const full = `${name}${forUses}. ${DESCRIPTION_TAIL}`;
      const short = `${name}${forUses}. ${DESCRIPTION_TAIL_SHORT}`;
      return clampText(full.length <= 160 ? full : short, 160);
    })(),
    // В SEO-таблице для подборок «тип + …» заданы только Title / Description;
    // H1 — название подборки («Чорний керамограніт»), как в крошке, чтобы
    // заголовки страниц не повторялись.
    h1: heading,
    // Подборка «тип + …» — под крошкой своего типа.
    crumbs: color || design || size ? [typeCrumb, { name: `${heading.light} ${heading.bold}`, path }] : [typeCrumb],
    canonical,
    index,
  };
}

/**
 * SEO карточки товара. Шаблон таблицы: «{Назва товару} — купити, характеристики
 * й ціна | BBS». В названии бренд и коллекция: у Laminam Avorio/Nero повторяются
 * в разных коллекциях, а Title не должны дублироваться.
 */
export function materialSeo(m: NonNullable<Awaited<ReturnType<typeof getMaterial>>>) {
  const name = [m.brand.name, m.collection?.name, m.name].filter(Boolean).join(" ");
  // Длинные названия (I Naturali … Book Match) — укорачиваем хвост, а не имя.
  const title =
    [
      `${name} — купити, характеристики й ціна | BBS`,
      `${name} — характеристики й ціна | BBS`,
    ].find((t) => t.length <= 65) ?? `${name} | BBS`;
  const kind = [m.typeLabel && lower(m.typeLabel), m.designs[0] && lower(m.designs[0])]
    .filter(Boolean)
    .join(" ");
  const facts = [
    m.sizes.length ? `Розміри ${m.sizes.join(", ")}` : null,
    m.thicknesses.length ? `товщина ${m.thicknesses.join(", ")}` : null,
  ].filter(Boolean);
  const lead = `${name}${kind ? ` — ${kind}` : ""}.${facts.length ? ` ${facts.join(", ")}.` : ""}`;
  const description = clampText(
    [`${lead} Фото, характеристики, застосування й ціна в каталозі BBS.`, `${lead} Ціна в каталозі BBS.`].find(
      (d) => d.length <= 160,
    ) ?? lead,
    160,
  );
  return { title, description, canonical: m.href };
}

/**
 * Для sitemap.xml: подборки с 3+ товарами (остальные noindex) и все товары.
 * Состав подборок — тот же, что у resolveLanding / getCatalogSeo.
 */
export async function getSitemapCatalog() {
  const all = await loadMaterials();
  const count = (preset: Partial<Selected>) => {
    const selected = toSelected(preset);
    return all.filter((m) => matches(m, selected)).length;
  };
  const landings: string[] = [];
  for (const type of STONE_TYPES) {
    const base = { type: [type] };
    if (count(base) >= 3) landings.push(`${CATALOG_PATH}${TYPE_URL[type]}/`);
    const ofType = all.filter((m) => m.facets.type.some((t) => t.slug === type));
    for (const key of LANDING_KEYS) {
      const slugs = new Set(ofType.flatMap((m) => m.facets[key].map((o) => o.slug)));
      for (const slug of slugs)
        if (count({ ...base, [key]: [slug] }) >= 3) landings.push(`${CATALOG_PATH}${TYPE_URL[type]}-${slug}/`);
    }
  }
  for (const l of FIXED_LANDINGS)
    if (count(l.selected) >= 3) landings.push(`${CATALOG_PATH}${l.slug}/`);
  return { landings, products: all.map((m) => m.href) };
}

/** 1 декор, 2 декори, 5 декорів. */
function decorsWord(n: number) {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return "декор";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "декори";
  return "декорів";
}

/**
 * «Колекції Laminam»: самые большие коллекции бренда. Фото и описаний у
 * коллекций в базе нет — фото берём у первого декора, вместо описания —
 * число декоров, кружки — самые частые цвета коллекции.
 */
export async function getTopCollections(brand: string, limit = 4) {
  const all = (await loadMaterials()).filter((m) => m.brand.slug === brand && m.collection);
  const brandType = BRAND_TYPE[brand]?.slug;
  const groups = new Map<string, CatalogItem[]>();
  for (const m of all) groups.set(m.collection!.slug, [...(groups.get(m.collection!.slug) ?? []), m]);
  return [...groups.values()]
    .sort((a, b) => b.length - a.length)
    .slice(0, limit)
    .map((items) => {
      const sorted = [...items].sort(byPopular);
      const c = sorted[0].collection!;
      const colors = new Map<string, number>();
      for (const m of items)
        for (const o of m.facets.color) if (o.hex) colors.set(o.hex, (colors.get(o.hex) ?? 0) + 1);
      return {
        slug: c.slug,
        name: c.name.toUpperCase(),
        text: c.description || `${items.length} ${decorsWord(items.length)} у колекції`,
        image: imageUrl(sorted.find((m) => m.image)?.image, 600),
        colors: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([hex]) => hex),
        // Как до переезда: каталог бренда с выбранной коллекцией.
        href:
          brand === "laminam"
            ? `${LAMINAM_CATALOG_PATH}?collection=${c.slug}`
            : catalogHref({
                ...(brandType ? { type: [brandType] } : {}),
                brand: [brand],
                collection: [c.slug],
              }),
      };
    });
}
