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
