// Подборки каталога по типу каменя: выпадающее меню «Каталог» в шапке и
// ссылки на подкатегории на страницах типа (/kataloh/keramogranit/,
// /kataloh/kvartsovyi-kamin/) — одни и те же подписи и адреса.
// Без базы и без "use client": нужен шапке и шаблону каталога.

import { CATALOG_PATH, TYPE_URL, catalogHref, landingHref, type StoneType } from "./catalog-url";

export type MenuLinkData = { label: string; href: string };

const K = { type: ["keramohranit"] };
const Q = { type: ["kvarts"] };

/** «Каталог»: разделы по типу каменя, пункты — подборки «призначення + тип». */
export const CATALOG_MENU: {
  key: StoneType;
  title: string;
  href: string;
  cols: number;
  items: MenuLinkData[];
}[] = [
  {
    key: "keramohranit",
    title: "Керамограніт",
    href: `${CATALOG_PATH}${TYPE_URL.keramohranit}/`,
    cols: 3,
    items: [
      { label: "Для стільниць та островів", href: catalogHref({ product: ["stilnytsi"], ...K }) },
      { label: "Для кухонних фартухів", href: catalogHref({ product: ["fartukhy"], ...K }) },
      { label: "Для підвіконь", href: catalogHref({ product: ["pidvikonnia"], ...K }) },
      { label: "Для фасадів", href: catalogHref({ application: ["fasad"], ...K }) },
      { label: "Для облицювання стін", href: catalogHref({ application: ["stiny"], ...K }) },
      { label: "Для камінів", href: catalogHref({ product: ["kaminy"], ...K }) },
      // Свои страницы-входы из SEO-таблицы (фильтры совпадают с другими подборками).
      { label: "Для ванної кімнати", href: landingHref("keramogranit-dlia-vannoi-kimnaty") },
      { label: "Для умивальників", href: catalogHref({ product: ["umyvalnyky"], ...K }) },
      { label: "Для підлоги", href: catalogHref({ application: ["pidloha"], ...K }) },
      { label: "Для вулиці", href: catalogHref({ application: ["vulytsia"], ...K }) },
      { label: "Для тераси", href: catalogHref({ application: ["terasa"], ...K }) },
      { label: "Для сходів", href: catalogHref({ application: ["skhody"], ...K }) },
      { label: "Для плінтуса", href: landingHref("keramogranit-dlia-plintusa") },
    ],
  },
  {
    key: "kvarts",
    title: "Кварцовий камінь",
    href: `${CATALOG_PATH}${TYPE_URL.kvarts}/`,
    cols: 1,
    items: [
      { label: "Для стільниць, островів та кухонних фартухів", href: catalogHref({ product: ["stilnytsi"], ...Q }) },
      { label: "Для підвіконь", href: catalogHref({ product: ["pidvikonnia"], ...Q }) },
      { label: "Для сходів", href: catalogHref({ ...Q, application: ["skhody"] }) },
    ],
  },
];

/**
 * «Вироби на замовлення» по схеме из SEO-аудита: группа — виріб, внутри —
 * подборки по материалу (те же адреса, что в каталоге). Группа без `href`
 * («Кухонні фартухи», «Каміни») — не посадочная страница, только заголовок.
 * Отдельной подборки «фартухи з кварцу» нет: кварц для фартухов — в подборке
 * «Стільниці з кварцового каменю» (её H1 — «…для стільниць та кухонних фартухів»).
 */
export const VYROBY_MENU: { title: string; href: string | null; items: MenuLinkData[] }[] = [
  {
    title: "Стільниці",
    href: landingHref("stilnytsi"),
    items: [
      { label: "Стільниці з керамограніту", href: landingHref("stilnytsi-z-keramogranitu") },
      { label: "Стільниці з кварцового каменю", href: landingHref("stilnytsi-z-kvartsovoho-kameniu") },
    ],
  },
  {
    title: "Кухонні фартухи",
    href: null,
    items: [
      { label: "Фартухи з керамограніту", href: landingHref("fartukhy-z-keramogranitu") },
      { label: "Фартухи з кварцового каменю", href: landingHref("stilnytsi-z-kvartsovoho-kameniu") },
    ],
  },
  {
    title: "Підвіконня",
    href: landingHref("pidvikonnia"),
    items: [
      { label: "Підвіконня з керамограніту", href: landingHref("pidvikonnia-z-keramogranitu") },
      { label: "Підвіконня з кварцового каменю", href: landingHref("pidvikonnia-z-kvartsovoho-kameniu") },
    ],
  },
  {
    title: "Умивальники",
    href: landingHref("umyvalnyky"),
    items: [{ label: "Умивальники з керамограніту", href: landingHref("umyvalnyky-z-keramogranitu") }],
  },
  {
    title: "Каміни",
    href: null,
    items: [
      { label: "Облицювання камінів керамогранітом", href: landingHref("oblytsiuvannia-kaminiv-keramogranitom") },
    ],
  },
];
