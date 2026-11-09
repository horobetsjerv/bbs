// Шаблон страницы каталога. Один макет на два фрейма Figma:
// UI_desktop_Catalog_LAM (1039:2836) и UI_desktop_Catalog BBS (1039:3697).
// Отличия вынесены в пропсы: хлебные крошки, заголовок, фон героя,
// группа «Тип матеріалу» в фильтрах и отступ до подвала.

import Page from "../bbs/Page";
import HeroBand from "../bbs/HeroBand";
import { H1_L, H2_L, H3_SB, HOVER_EASE, Heading, MOB_SB } from "../bbs/ui";
import type { Metadata } from "next";

import { CATALOG_MENU } from "@/app/_lib/catalog-menu";
import { TYPE_URL, landingPath } from "@/app/_lib/catalog-url";

import {
  clampSentences,
  getCatalog,
  getCatalogSeo,
  parseCatalogParams,
  PER_PAGE_MOBILE,
  type SearchParams,
  type Selected,
} from "@/app/_lib/catalog";

import CatalogBrowser from "./CatalogBrowser";
import { CatalogLandingText, MobileCatalogLandingText } from "./LandingText";
import MobileCatalogBrowser from "../mobile/Catalog";
import { MHero, MHeroText, MSection, MTitle } from "../mobile/ui";
import JsonLd, { breadcrumbLd, collectionLd } from "../seo/JsonLd";

export type CatalogTemplateProps = {
  /** Крошки до текущей страницы; у подборки добавляется её название. */
  breadcrumb: string[];
  /** Фото поверх базового кропа (общий каталог — ванная, object-cover). */
  heroOverlay?: string;
  /** Общий каталог: группы «Тип каменю» и «Бренд», подпись «Фактура / поверхня». */
  bbs?: boolean;
  /** Каталог бренда — выдача всегда ограничена им. */
  brand?: string;
  /** Параметры адреса: фильтры (?application=…&collection=…) и сортировка. */
  params: SearchParams;
  /** Фильтры подборки из пути (/kataloh/kvartsovyi-kamin-bilyi/). */
  preset?: Partial<Selected>;
  /** Slug подборки из пути — для её Title / H1 / canonical. */
  landing?: string;
  /** Отступ от низа фильтров до подвала: 56px в LAM, 20px в BBS. */
  bottomGap: number;
};

/** Метаданные страницы каталога: Title / Description по шаблонам, canonical, robots. */
export async function catalogMetadata(
  params: SearchParams,
  {
    preset,
    landing,
    brand,
  }: { preset?: Partial<Selected>; landing?: string; brand?: string } = {},
): Promise<Metadata> {
  const { selected, page } = parseCatalogParams(params, preset);
  const seo = await getCatalogSeo({ selected, page, landing, brand });
  // Страницы 2+ — свой Title и Description, иначе дубли с первой страницей.
  const base = seo.title.replace(/ \| BBS$/, "");
  const title =
    page > 1
      ? [`${base}, сторінка ${page} | BBS`, `${base}, сторінка ${page}`].find((t) => t.length <= 65) ??
        `${base}, сторінка ${page}`
      : seo.title;
  const description = page > 1 ? clampSentences(`Сторінка ${page}. ${seo.description}`, 160) : seo.description;
  return {
    title,
    description,
    alternates: { canonical: seo.canonical },
    // Явно: undefined здесь стёр бы index, follow из layout.
    robots: seo.index ? { index: true, follow: true } : { index: false, follow: true },
  };
}

/**
 * Подкатегории страницы типа (/kataloh/keramogranit/): подборки
 * «призначення + тип» — те же подписи и адреса, что в меню «Каталог» шапки.
 * Только на «чистой» странице типа: с добавленными фильтрами — нет.
 */
function typeSubcategories(landing: string | undefined, selected: Selected) {
  const section = CATALOG_MENU.find((s) => landing === TYPE_URL[s.key]);
  return section && landingPath(selected) === section.href ? section : null;
}

type Subcategories = NonNullable<ReturnType<typeof typeSubcategories>>;

/**
 * Десктоп: заголовок H3 и подборки чипами в обводке с переносом строк —
 * тот же чип, что на мобилке (вариант A, согласован с клиентом).
 */
function SubcategoryLinks({ section }: { section: Subcategories }) {
  return (
    <nav
      aria-label={`${section.title} за призначенням`}
      // По 40px от полосы героя (её низ — 154px от начала колонки) и до фильтров.
      className="mt-[194px] flex w-[1120px] flex-col items-start gap-[20px]"
    >
      <Heading level={2} className={`text-trim whitespace-nowrap ${H3_SB} text-ink`}>
        {section.title} за призначенням
      </Heading>
      <ul className="flex w-full flex-wrap items-start gap-[8px]">
        {section.items.map((l) => (
          <li key={l.label} className="flex">
            <a
              href={l.href}
              className={`flex items-center bg-white px-[16px] py-[12px] text-blue shadow-[inset_0_0_0_1px_var(--color-blue)] transition-colors ${HOVER_EASE} hover:bg-red hover:text-back-card-gray`}
            >
              <span className={`text-trim whitespace-nowrap ${MOB_SB}`}>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Мобилка: заголовок секции и лента ссылок-чипов (как ряд фильтров ниже, но с обводкой). */
function MobileSubcategoryLinks({ section }: { section: Subcategories }) {
  return (
    <MSection className="pt-[24px] pb-[4px]" gap={16}>
      <MTitle>{section.title} за призначенням</MTitle>
      <ul className="-mx-[16px] flex w-[calc(100%+32px)] items-start gap-[8px] overflow-x-auto px-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {section.items.map((l) => (
          <li key={l.label} className="flex shrink-0">
            <a
              href={l.href}
              className={`flex items-center bg-white px-[8px] py-[10px] text-blue shadow-[inset_0_0_0_1px_var(--color-blue)] transition-colors ${HOVER_EASE} hover:bg-red hover:text-back-card-gray`}
            >
              <span className={`text-trim whitespace-nowrap ${MOB_SB}`}>{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </MSection>
  );
}

export default async function CatalogTemplate({
  breadcrumb,
  heroOverlay,
  bbs = false,
  brand,
  params,
  preset,
  landing,
  bottomGap,
}: CatalogTemplateProps) {
  const query = parseCatalogParams(params, preset);
  const [catalog, mobileCatalog, seo] = await Promise.all([
    getCatalog({ ...query, brand }),
    getCatalog({ ...query, brand, perPage: PER_PAGE_MOBILE }),
    getCatalogSeo({ selected: query.selected, page: query.page, landing, brand }),
  ]);
  const title = seo.h1;
  // Тексты подборки из SEO-таблицы — только на её первой странице без
  // добавленных фильтров (getCatalogSeo отдаёт их лишь «чистой» подборке).
  const text = query.page === 1 ? seo.text : undefined;
  const crumbs = [...breadcrumb, ...seo.crumbs.map((c) => c.name)];
  // Мобильные крошки не переносятся (MHero): промежуточного родителя
  // подборки не показываем, только её название — как было до него.
  const mobileCrumbs = [...breadcrumb, ...seo.crumbs.slice(-1).map((c) => c.name)];
  const subcategories = typeSubcategories(landing, query.selected);
  const mobile = (
    <>
      <MHero breadcrumb={mobileCrumbs} bg={heroOverlay ? "bbs" : "laminam"}>
        <MHeroText
          light
          title={
            <>
              {title.light} <span className="font-semibold">{title.bold}</span>
            </>
          }
          text="Оберіть колір, фактуру та параметри, щоб знайти ідеальний матеріал для вашого проєкту."
        />
      </MHero>
      {subcategories && <MobileSubcategoryLinks section={subcategories} />}
      <MobileCatalogBrowser bbs={bbs} sort={query.sort} {...mobileCatalog} />
      {text && <MobileCatalogLandingText text={text} />}
    </>
  );
  return (
    // После текстов подборки (FAQ) до подвала 120px, как у страниц с FAQ.
    <Page footerGap={text ? 120 : bottomGap} mobile={mobile}>
      <HeroBand
        breadcrumb={crumbs}
        overlay={heroOverlay ? { src: heroOverlay } : undefined}
        // Длинный H1 подборки (3 строки) не вылезает за полосу и не отодвигает
        // фильтры от неё: полоса тянется по тексту (только с фото-overlay).
        fit={Boolean(heroOverlay)}
      >
        <div className="flex w-[834px] flex-col items-start gap-[40px]">
          <Heading level={1} className={`text-trim w-full ${H1_L} text-white`}>
            {title.light} <span className="font-semibold">{title.bold}</span>
          </Heading>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>
            Оберіть колір, фактуру та параметри, щоб знайти ідеальний матеріал
            для вашого проєкту.
          </p>
        </div>
      </HeroBand>
      <JsonLd data={breadcrumbLd([...breadcrumb, ...seo.crumbs], seo.canonical)} />
      {/* CollectionPage + ItemList: товары текущей страницы выдачи (SEO-аудит). */}
      <JsonLd
        data={collectionLd({
          name: seo.title.replace(/ \| BBS$/, ""),
          path: seo.canonical,
          description: seo.description,
          items: catalog.items,
        })}
      />

      {/* Фильтры начинаются на 20px ниже полосы героя (y = 484).
          Без data-reveal: переход на подборку (/kataloh/ → /kataloh/kvartsovyi-kamin/) —
          другая страница Next, и анимация появления гасила весь каталог;
          при смене фильтра должны меняться только товары. */}
      {subcategories && <SubcategoryLinks section={subcategories} />}
      <div className={`${subcategories ? "mt-[40px]" : "mt-[174px]"} flex w-[1120px] items-start gap-[24px]`}>
        <CatalogBrowser bbs={bbs} sort={query.sort} {...catalog} />
      </div>

      {text && <CatalogLandingText text={text} />}
    </Page>
  );
}
