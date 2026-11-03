/**
 * Описание справочников каталога: какие есть, как называются и какие поля у записи.
 * Общий для сервера и клиента файл — без импортов из db.
 */

export const DICTIONARY_TYPES = [
  "colors",
  "surfaces",
  "designs",
  "applications",
  "sizes",
  "thicknesses",
] as const;

export type DictionaryType = (typeof DICTIONARY_TYPES)[number];

export type DictionaryMeta = {
  label: string;
  /** Заголовок диалога: «Новий колір», «Нова поверхня». */
  singularNew: string;
  hint: string;
  /** Значения привязаны к бренду (форматы и толщины у Laminam и Vicostone разные). */
  hasBrand: boolean;
  /** Слаг попадает в параметры фильтра каталога; у толщин его нет. */
  hasSlug: boolean;
};

export const DICTIONARY_META: Record<DictionaryType, DictionaryMeta> = {
  colors: {
    label: "Кольори",
    singularNew: "Новий колір",
    hint: "Відтінки для фільтра «Колір» з кольоровими кружечками",
    hasBrand: false,
    hasSlug: true,
  },
  surfaces: {
    label: "Поверхні",
    singularNew: "Нова поверхня",
    hint: "Обробка поверхні: матова, полірована, фірмові фактури Laminam",
    hasBrand: false,
    hasSlug: true,
  },
  designs: {
    label: "Дизайни",
    singularNew: "Новий дизайн",
    hint: "Малюнок матеріалу: однотон, під мармур, під бетон",
    hasBrand: false,
    hasSlug: true,
  },
  applications: {
    label: "Призначення",
    singularNew: "Нове призначення",
    hint: "Вироби та застосування: стільниці, фартухи, підвіконня",
    hasBrand: false,
    hasSlug: true,
  },
  sizes: {
    label: "Розміри",
    singularNew: "Новий розмір",
    hint: "Формати плит, у кожного бренду свої",
    hasBrand: true,
    hasSlug: true,
  },
  thicknesses: {
    label: "Товщини",
    singularNew: "Нова товщина",
    hint: "Товщина плити, у кожного бренду своя. «5 мм» і «5+ мм» — різні позиції",
    hasBrand: true,
    hasSlug: false,
  },
};

export function isDictionaryType(value: unknown): value is DictionaryType {
  return (
    typeof value === "string" &&
    (DICTIONARY_TYPES as readonly string[]).includes(value)
  );
}

/** Единая форма записи для всех справочников: лишние поля — null. */
export type DictionaryEntry = {
  id: number;
  name: string;
  slug: string | null;
  sort: number;
  hex: string | null;
  icon: string | null;
  brandId: number | null;
  brandName: string | null;
  widthMm: number | null;
  heightMm: number | null;
  valueMm: number | null;
  materialCount: number;
  [key: string]: unknown;
};

export type DictionaryEntryInput = {
  id?: number;
  name: string;
  slug: string;
  sort: number;
  hex: string;
  icon: string;
  brandId: number | null;
  widthMm: number | null;
  heightMm: number | null;
  valueMm: number | null;
};

export type BrandOption = { id: number; name: string };

const UK_TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh",
  з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n",
  о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ю: "iu", я: "ia", ь: "", "’": "", "'": "",
  ы: "y", э: "e", ё: "e", ъ: "",
};

/** Слаг из названия: значения справочников вводятся українською, латиниця — транслітом. */
export function slugifyName(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((ch) => UK_TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
