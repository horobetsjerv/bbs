// Шаблон страницы каталога. Один макет на два фрейма Figma:
// UI_desktop_Catalog_LAM (1039:2836) и UI_desktop_Catalog BBS (1039:3697).
// Отличия вынесены в пропсы: хлебные крошки, заголовок, фон героя,
// группа «Тип матеріалу» в фильтрах и отступ до подвала.

import Page from "../bbs/Page";
import HeroBand from "../bbs/HeroBand";
import { H1_L, H2_L } from "../bbs/ui";
import type { Metadata } from "next";

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
import { MHero, MHeroText } from "../mobile/ui";
import JsonLd, { breadcrumbLd } from "../seo/JsonLd";

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
    robots: seo.index ? undefined : { index: false, follow: true },
  };
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
      >
        <div className="flex w-[834px] flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_L} text-white`}>
            {title.light} <span className="font-semibold">{title.bold}</span>
          </h1>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>
            Оберіть колір, фактуру та параметри, щоб знайти ідеальний матеріал
            для вашого проєкту.
          </p>
        </div>
      </HeroBand>
      <JsonLd data={breadcrumbLd([...breadcrumb, ...seo.crumbs], seo.canonical)} />

      {/* Фильтры начинаются на 20px ниже полосы героя (y = 484).
          Без data-reveal: переход на подборку (/kataloh/ → /kataloh/kvartsovyi-kamin/) —
          другая страница Next, и анимация появления гасила весь каталог;
          при смене фильтра должны меняться только товары. */}
      <div className="mt-[174px] flex w-[1120px] items-start gap-[24px]">
        <CatalogBrowser bbs={bbs} sort={query.sort} {...catalog} />
      </div>

      {text && <CatalogLandingText text={text} />}
    </Page>
  );
}
