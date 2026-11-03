import Page from "@/app/_components/bbs/Page";
import { CtaBanner, FaqSection, VicostoneBrandLogo } from "@/app/_components/bbs/blocks";
import {
  BrandAbout,
  BrandApplications,
  BrandDecors,
  BrandProjects,
  BrandSpecs,
  BrandWhy,
} from "@/app/_components/brand/sections";
import MobileVicostone from "@/app/_components/mobile/Vicostone";
import Hero from "@/app/_components/vicostone/Hero";
import {
  ABOUT_TEXT,
  ABOUT_TITLE,
  CTA,
  DECORS_TITLE,
  FAQ,
  FAQ_TITLE,
  META,
  PRODUCTS_TITLE,
  PROJECTS_TITLE,
  SPECS,
  SPECS_LEAD,
  SPECS_TITLE,
  TILES,
  USES,
  USES_TITLE,
  VICOSTONE_CATALOG_PATH,
  WHY,
  WHY_TITLE,
} from "@/app/_components/vicostone/content";
import JsonLd, { breadcrumbLd } from "@/app/_components/seo/JsonLd";

// Страница бренда Vicostone. Тексты — из SEO-таблицы клиента, лист «Vicostone»
// (app/_components/vicostone/content.ts); блоки — со страницы Laminam.
// Каталог Vicostone — /kataloh/kvartsovyi-kamin/ (каталог BBS, «Кварцовий камінь»).
export const metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: "/vicostone/" },
};

export default function VicostonePage() {
  return (
    // До подвала — как у Laminam.
    <Page footerGap={121} mobile={<MobileVicostone />}>
      <JsonLd data={breadcrumbLd(["Головна", "Vicostone"], "/vicostone/")} />
      <Hero />

      {/* Колонка 1120px, между секциями 120px, порядок блоков — как в таблице. */}
      <div className="mt-[80px] flex w-[1120px] flex-col items-start gap-[120px]" data-reveal>
        <BrandDecors brand="vicostone" title={DECORS_TITLE} catalog={VICOSTONE_CATALOG_PATH} />
        <BrandAbout title={ABOUT_TITLE} text={ABOUT_TEXT} logo={<VicostoneBrandLogo />} />
        <BrandApplications
          title={USES_TITLE}
          uses={USES}
          catalog={VICOSTONE_CATALOG_PATH}
          action={false}
        />
        <BrandApplications title={PRODUCTS_TITLE} tiles={TILES} catalog={VICOSTONE_CATALOG_PATH} />
        <BrandSpecs title={SPECS_TITLE} lead={SPECS_LEAD} rows={SPECS} />
        <BrandWhy title={WHY_TITLE} items={WHY} />
        <BrandProjects brand="vicostone" title={PROJECTS_TITLE} />
        {/* Страницы со всеми вопросами нет — без кнопки «Всі запитання». */}
        <FaqSection
          title={FAQ_TITLE}
          questions={FAQ.map((f) => f.question)}
          answers={FAQ.map((f) => f.answer)}
          allHref={null}
          heading
        />
        <CtaBanner title={CTA.title} button={CTA.button} />
      </div>
    </Page>
  );
}
