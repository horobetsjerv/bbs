/* eslint-disable @next/next/no-img-element */
// Мобильная страница Laminam (Figma ui-mobile-main-laminam, 1255:3919).

import Link from "next/link";

import { getTopCollections } from "@/app/_lib/catalog";

import { GhostBtn, H2_L, H3_L, Icon, MOB_L, MOB_SB, PrimaryBtn, TextLink, inset } from "../bbs/ui";
import { ABOUT_TEXT, ABOUT_TITLE } from "../laminam/About";
import { TILES, USES, USES_TITLE } from "../laminam/Applications";
import { SPECS, SPECS_LEAD, SPECS_TITLE } from "../laminam/Specs";
import { WHY, WHY_TITLE } from "../laminam/WhyBbs";
import {
  MBrandAbout,
  MBrandApplications,
  MBrandDecors,
  MBrandProjects,
  MBrandSpecs,
  MBrandWhy,
} from "./Brand";
import { MFaq } from "./Home";
import { MCarousel, MCta, MHero, MIconRow, MOutlineBtn, MSection, MTitle } from "./ui";
import { LAMINAM_CATALOG_PATH } from "@/app/_lib/catalog-url";

function Hero() {
  return (
    <MHero breadcrumb={["Головна", "Laminam"]}>
      <div className="flex w-full flex-col items-start gap-[24px]">
        <img
          src="/figma/mobile/laminam-logo-white.svg"
          alt="Laminam"
          className="block h-[31.968px] w-[221.57px] shrink-0"
        />
        {/* H1 из SEO-таблицы (лист «Laminam»). */}
        <h1 className={`text-trim w-full ${H2_L} text-white`}>
          Керамограніт <span className="font-semibold">Laminam</span>
        </h1>
        <p className={`text-trim w-full ${H3_L} text-caption-gray opacity-90`}>
          Laminam - італійський виробник великоформатної кераміки для архітектури та
          дизайну. Інновації, естетика та довговічність у кожній плиті.
        </p>
      </div>
      <div className="flex w-full flex-col items-start gap-[12px]">
        <PrimaryBtn href={LAMINAM_CATALOG_PATH} className="w-full">
          Перейти до каталогу
        </PrimaryBtn>
        <GhostBtn icon="/figma/bbs/download-white.svg" className="w-full justify-center">
          Завантажити каталог (PDF)
        </GhostBtn>
      </div>
    </MHero>
  );
}

const VALUES = [
  { icon: "flag", title: "Італійське виробництво" },
  { icon: "techno", title: "Інноваційні технології виробництва" },
  { icon: "scratch", title: "Стійкість до подряпин та пошкоджень" },
  { icon: "water", title: "Стійкість до вологи, плям та хімікатів" },
  { icon: "temp", title: "Стійкість до УФ та температур" },
  { icon: "eco", title: "Екологічність та безпека" },
];

/** Светлые оттенки с серой обводкой, как в макете (иначе сливаются с фоном). */
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 225;
}

/** card_project Variant6 (1257:6481): 180px, фото 188, текст в боксе 64, цвета 32. */
async function Collections() {
  const collections = await getTopCollections("laminam");
  if (collections.length === 0) return null;
  return (
    <MSection>
      <MTitle>Колекції Laminam</MTitle>
      <div className="flex w-full flex-col items-start gap-[32px]">
        <MCarousel>
          {collections.map((c) => (
            <div
              key={c.slug}
              className="flex w-[180px] shrink-0 snap-start flex-col items-center gap-[12px] bg-white"
              style={inset("var(--color-light-gray)")}
            >
              <Link href={c.href} className="relative block h-[188px] w-full shrink-0 bg-[#d9d9d9]">
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 size-full max-w-none object-cover"
                  />
                )}
              </Link>
              <div className="flex w-full flex-col items-start gap-[12px] px-[8px]">
                <div className="flex h-[64px] w-full flex-col items-start gap-[8px]">
                  <p className={`text-trim w-full ${MOB_SB} text-ink`}>{c.name}</p>
                  <p className={`text-trim line-clamp-3 w-full ${MOB_L} text-card-gray`}>{c.text}</p>
                </div>
                {/* В макете ряд цветов в одну строку, лишние уходят за край карточки. */}
                <div className="flex w-full items-center gap-[8px] overflow-hidden">
                  {c.colors.map((color) => (
                    <span
                      key={color}
                      className="size-[32px] shrink-0"
                      style={{
                        background: color,
                        boxShadow: isLight(color) ? "inset 0 0 0 1px #959090" : undefined,
                      }}
                    />
                  ))}
                </div>
                <TextLink weight="semibold" underline href={c.href}>
                  Детальніше
                </TextLink>
              </div>
            </div>
          ))}
        </MCarousel>
        <MOutlineBtn href={LAMINAM_CATALOG_PATH}>Переглянути усі колекції</MOutlineBtn>
      </div>
    </MSection>
  );
}

function Video() {
  return (
    <MSection>
      <MTitle>Відео з виробництва</MTitle>
      <div className="relative h-[200px] w-full shrink-0 overflow-clip">
        <img
          src="/figma/mobile/video.webp"
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(249,249,249,0.2)]" />
        <div className="absolute inset-0 bg-black/30" />
        <button
          type="button"
          aria-label="Відтворити відео"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        >
          <Icon src="/figma/mobile/play.svg" size={48} />
        </button>
      </div>
      <p className={`text-trim w-full ${MOB_L} text-ink`}>
        Кераміка Laminam - це інновації, технології та дизайн у кожній деталі.
      </p>
    </MSection>
  );
}

export default function MobileLaminam({
  faq,
  cta,
}: {
  faq: { question: string; answer: string }[];
  cta: { title: string; text: string; button: string };
}) {
  return (
    <>
      <Hero />
      <div className="contents" data-reveal>
        <MSection gap={12}>
          {VALUES.map((v) => (
            <MIconRow key={v.icon} icon={`/figma/mobile/${v.icon}.svg`} title={v.title} />
          ))}
        </MSection>
        {/* Порядок — как в SEO-таблице и на десктопе. */}
        <MBrandDecors
          brand="laminam"
          title="Каталог керамограніту Laminam"
          catalog={LAMINAM_CATALOG_PATH}
        />
        <Collections />
        <MBrandAbout
          title={ABOUT_TITLE}
          text={ABOUT_TEXT}
          logo={
            <img
              src="/figma/mobile/laminam-logo.svg"
              alt="Laminam"
              className="block h-[32px] w-[221.793px] shrink-0"
            />
          }
        />
        {/* «Де використовують»: список из таблицы, под ним плитки 2×3. */}
        <MBrandApplications
          title={USES_TITLE}
          uses={USES}
          tiles={TILES}
          catalog={LAMINAM_CATALOG_PATH}
        />
        <MBrandSpecs title={SPECS_TITLE} lead={SPECS_LEAD} rows={SPECS} />
        <MBrandWhy title={WHY_TITLE} items={WHY} />
        <MBrandProjects brand="laminam" title="Наші проєкти" />
        <Video />
        {/* Страницы со всеми вопросами нет — без кнопки «Всі запитання». */}
        <MFaq
          title="Часті запитання"
          questions={faq.map((f) => f.question)}
          answers={faq.map((f) => f.answer)}
          allHref={null}
        />
        <MCta title={cta.title} text={cta.text} button={cta.button} innerGap={12} />
      </div>
    </>
  );
}
