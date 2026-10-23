// Статичные адреса подборок каталога (таблица заказчика, лист «Детальніше по
// структурі», и SEO-таблица: «Статичні URL фільтрів»). Без базы — модуль
// нужен и серверу, и клиентскому CatalogBrowser.
//
//   /kataloh/                              — единый каталог
//   /kataloh/keramogranit/                 — тип каменя (+ его бренд)
//   /kataloh/kvartsovyi-kamin-bilyi/       — тип + цвет
//   /kataloh/keramogranit-pid-marmur/      — тип + дизайн
//   /kataloh/kvartsovyi-kamin-3000x1400/   — тип + размер
//   /kataloh/stilnytsi/                    — виріб (FIXED_LANDINGS)
//   /kataloh/stilnytsi-z-keramogranitu/    — виріб / призначення + тип
//
// Любое другое сочетание фильтров остаётся на /kataloh/?… (noindex).
// Внутренние slug фильтров (keramohranit, kvarts) — как в базе и в параметрах
// адреса; меняются только публичные пути.

export const CATALOG_PATH = "/kataloh/";

export const STONE_TYPES = ["keramohranit", "kvarts"] as const;
export type StoneType = (typeof STONE_TYPES)[number];

/** Публичная часть адреса типа каменя. */
export const TYPE_URL: Record<StoneType, string> = {
  keramohranit: "keramogranit",
  kvarts: "kvartsovyi-kamin",
};

/**
 * Бренд типа каменя (таблица: «Керамограніт» → Laminam, «Кварцовий камінь» →
 * Vicostone). В фильтры подборок не входит — как и до переезда, подборка
 * задаёт только тип; бренд выбирается в панели отдельно.
 */
export const TYPE_BRAND: Record<StoneType, string> = {
  keramohranit: "laminam",
  kvarts: "vicostone",
};

/** Группы, у которых есть своя подборка «тип + пункт» (шаблоны Title в таблице). */
export const LANDING_KEYS = ["color", "design", "size"] as const;
export type LandingKey = (typeof LANDING_KEYS)[number];

type Selection = Record<string, string[]>;

const K = { type: ["keramohranit"] };
const Q = { type: ["kvarts"] };

/**
 * /kataloh/laminam/ — каталог бренда Laminam (макет Catalog LAM, раньше
 * /laminam/catalog). Страница бренда — /laminam/. /kataloh/keramogranit/ —
 * обычная подборка «Керамограніт» единого каталога.
 */
export const LAMINAM_CATALOG_PATH = "/kataloh/laminam/";

/**
 * Подборки «виріб / призначення (+ тип)» с адресами из таблицы. `selected` —
 * пункты фильтров каталога (PRODUCTS / PURPOSES в catalog.ts).
 * `entryOnly` — страница-вход: фильтры совпадают с другой подборкой, поэтому
 * выбор в панели на неё не переводит.
 */
export const FIXED_LANDINGS: { slug: string; selected: Selection; entryOnly?: boolean }[] = [
  // Навигационные: «Вироби з каменю» → один пункт фильтра.
  { slug: "stilnytsi", selected: { product: ["stilnytsi"] } },
  { slug: "kukhonni-fartukhy", selected: { product: ["fartukhy"] } },
  { slug: "pidvikonnia", selected: { product: ["pidvikonnia"] } },
  { slug: "umyvalnyky", selected: { product: ["umyvalnyky"] } },
  { slug: "kaminy", selected: { product: ["kaminy"] } },
  // «Фасади» — сфера використання, а не виріб: пункт «Для фасадів» в «Призначенні».
  { slug: "fasady", selected: { application: ["fasad"] } },
  // «Сходи» — то же: оба материала, пункт «Для сходів» (плитка «Сходи» главной).
  { slug: "skhody", selected: { application: ["skhody"] } },
  // Виріб + матеріал.
  { slug: "stilnytsi-z-keramogranitu", selected: { product: ["stilnytsi"], ...K } },
  { slug: "stilnytsi-z-kvartsovoho-kameniu", selected: { product: ["stilnytsi"], ...Q } },
  { slug: "fartukhy-z-keramogranitu", selected: { product: ["fartukhy"], ...K } },
  { slug: "pidvikonnia-z-keramogranitu", selected: { product: ["pidvikonnia"], ...K } },
  { slug: "pidvikonnia-z-kvartsovoho-kameniu", selected: { product: ["pidvikonnia"], ...Q } },
  { slug: "umyvalnyky-z-keramogranitu", selected: { product: ["umyvalnyky"], ...K } },
  { slug: "oblytsiuvannia-kaminiv-keramogranitom", selected: { product: ["kaminy"], ...K } },
  // Керамограніт + призначення. «Для ванної кімнати» отдельного пункта
  // в фильтрах нет (применение базы «Ванна кімната» показано как «Для умивальників»).
  { slug: "keramogranit-dlia-fasadiv", selected: { application: ["fasad"], ...K } },
  { slug: "keramogranit-dlia-stin", selected: { application: ["stiny"], ...K } },
  { slug: "keramogranit-dlia-pidlohy", selected: { application: ["pidloha"], ...K } },
  { slug: "keramogranit-dlia-skhodiv", selected: { application: ["skhody"], ...K } },
  { slug: "keramogranit-dlia-vulytsi", selected: { application: ["vulytsia"], ...K } },
  { slug: "keramogranit-dlia-terasy", selected: { application: ["terasa"], ...K } },
  // Кварцовий камінь + призначення (лист «Кварцит сходи» SEO-таблицы).
  { slug: "skhody-z-kvartsovoho-kameniu", selected: { application: ["skhody"], ...Q } },
  // Страницы-входы под листы SEO-таблицы: своих пунктов в фильтрах нет,
  // фильтры — как у «Для умивальників» (применение базы «Ванна кімната»)
  // и «Для підлоги»; выбор в панели по-прежнему ведёт на те подборки.
  { slug: "keramogranit-dlia-vannoi-kimnaty", selected: { application: ["umyvalnyky"], ...K }, entryOnly: true },
  { slug: "keramogranit-dlia-plintusa", selected: { application: ["pidloha"], ...K }, entryOnly: true },
];

const active = (s: Selection) =>
  Object.entries(s).filter(([, v]) => v && v.length > 0) as [string, string[]][];

/** Одинаковый набор пунктов фильтров (порядок не важен). */
export function sameSelection(a: Selection, b: Selection) {
  const x = active(a);
  const y = active(b);
  return (
    x.length === y.length &&
    x.every(([k, v]) => {
      const w = b[k] ?? [];
      return v.length === w.length && v.every((s) => w.includes(s));
    })
  );
}

const isStone = (s: string): s is StoneType => (STONE_TYPES as readonly string[]).includes(s);

/** Выбор совпадает с подборкой → её адрес (со слешем), иначе null. */
export function landingPath(selected: Selection): string | null {
  const fixed = FIXED_LANDINGS.find((l) => !l.entryOnly && sameSelection(selected, l.selected));
  if (fixed) return `${CATALOG_PATH}${fixed.slug}/`;

  const type = selected.type ?? [];
  if (type.length !== 1 || !isStone(type[0])) return null;
  const t = type[0];
  const rest = active(selected).filter(([k]) => k !== "type");
  if (rest.length === 0) return `${CATALOG_PATH}${TYPE_URL[t]}/`;
  if (rest.length > 1) return null;
  const [key, values] = rest[0];
  if (!(LANDING_KEYS as readonly string[]).includes(key) || values.length !== 1) return null;
  return `${CATALOG_PATH}${TYPE_URL[t]}-${values[0]}/`;
}

/** Адрес подборки → тип и остаток (что за остаток — решает сервер по базе). */
export function splitLanding(slug: string): { type: StoneType; rest: string | null } | null {
  for (const t of STONE_TYPES) {
    const prefix = TYPE_URL[t];
    if (slug === prefix) return { type: t, rest: null };
    if (slug.startsWith(`${prefix}-`)) return { type: t, rest: slug.slice(prefix.length + 1) };
  }
  return null;
}

/** ?color=bilyi,siryi&sort=name-asc&page=2 — общий формат параметров каталога. */
export function catalogQuery(selected: Selection, sort?: string, page?: number) {
  const q = new URLSearchParams();
  for (const [k, v] of active(selected)) q.set(k, v.join(","));
  if (sort && sort !== "popular") q.set("sort", sort);
  if (page && page > 1) q.set("page", String(page));
  const s = q.toString().replaceAll("%2C", ",");
  return s ? `?${s}` : "";
}

/**
 * Ссылка на каталог с выбранными фильтрами: статичный адрес подборки, если
 * выбор с ней совпадает, иначе /kataloh/?… Для плиток, списков и фильтров.
 */
export function catalogHref(selected: Selection, sort?: string, page?: number) {
  const landing = landingPath(selected);
  if (landing) return landing + catalogQuery({}, sort, page);
  return CATALOG_PATH + catalogQuery(selected, sort, page);
}

/**
 * Адрес подборки по slug — для страниц-входов (entryOnly): catalogHref на них
 * не ведёт, потому что их фильтры совпадают с другой подборкой.
 */
export const landingHref = (slug: string) => `${CATALOG_PATH}${slug}/`;

/** Выбор типа каменя для ссылок на каталог (бренд не добавляется). */
export const typeSelection = (type: StoneType) => ({ type: [type] });
