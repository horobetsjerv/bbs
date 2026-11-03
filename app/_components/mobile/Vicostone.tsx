// Мобильная страница бренда Vicostone: блоки мобильной Laminam (./Brand),
// тексты — из SEO-таблицы (../vicostone/content). Макета у страницы нет.

import { VicostoneBrandLogo } from "../bbs/blocks";
import { H2_L, PrimaryBtn } from "../bbs/ui";
import {
  ABOUT_TEXT,
  ABOUT_TITLE,
  CTA,
  DECORS_TITLE,
  FAQ,
  FAQ_TITLE,
  H1,
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
} from "../vicostone/content";
import {
  MBrandAbout,
  MBrandApplications,
  MBrandDecors,
  MBrandProjects,
  MBrandSpecs,
  MBrandWhy,
} from "./Brand";
import { MFaq } from "./Home";
import { MCta, MHero } from "./ui";

/** Логотип Vicostone высотой 32 (как логотип Laminam на мобилке). */
function Logo({ white = false }: { white?: boolean }) {
  return (
    <div className={`[zoom:0.8] ${white ? "brightness-0 invert" : ""}`}>
      <VicostoneBrandLogo />
    </div>
  );
}

function Hero() {
  return (
    <MHero breadcrumb={["Головна", "Vicostone"]} bg="bbs">
      <div className="flex w-full flex-col items-start gap-[24px]">
        <Logo white />
        {/* H1 из SEO-таблицы (лист «Vicostone»). */}
        <h1 className={`text-trim w-full ${H2_L} text-white`}>
          {H1.light} <span className="font-semibold">{H1.bold}</span>
        </h1>
      </div>
      <PrimaryBtn href={VICOSTONE_CATALOG_PATH} className="w-full">
        Перейти до каталогу
      </PrimaryBtn>
    </MHero>
  );
}

export default function MobileVicostone() {
  return (
    <>
      <Hero />
      {/* Порядок — как в SEO-таблице и на десктопе. */}
      <div className="contents" data-reveal>
        <MBrandDecors brand="vicostone" title={DECORS_TITLE} catalog={VICOSTONE_CATALOG_PATH} />
        <MBrandAbout title={ABOUT_TITLE} text={ABOUT_TEXT} logo={<Logo />} />
        <MBrandApplications title={USES_TITLE} uses={USES} catalog={VICOSTONE_CATALOG_PATH} />
        <MBrandApplications title={PRODUCTS_TITLE} tiles={TILES} catalog={VICOSTONE_CATALOG_PATH} />
        <MBrandSpecs title={SPECS_TITLE} lead={SPECS_LEAD} rows={SPECS} />
        <MBrandWhy title={WHY_TITLE} items={WHY} />
        <MBrandProjects brand="vicostone" title={PROJECTS_TITLE} />
        <MFaq
          title={FAQ_TITLE}
          questions={FAQ.map((f) => f.question)}
          answers={FAQ.map((f) => f.answer)}
          allHref={null}
          heading
        />
        <MCta title={CTA.title} button={CTA.button} innerGap={12} />
      </div>
    </>
  );
}
