import Page from "../_components/bbs/Page";
import MobileSpivpratsia from "../_components/mobile/Spivpratsia";
import HeroBand from "../_components/bbs/HeroBand";
import { H1_SB, H2_L, H3_L, H3_SB, PrimaryBtn } from "../_components/bbs/ui";
import {
  AdvantagesSection,
  ContactsSection,
  PhotoPairSection,
  ProjectsSection,
  SectionTitle,
  TextPhotoSection,
  type AdvantageItem,
} from "../_components/about/sections";
import { Fragment } from "react";

import { getProjects } from "@/app/_lib/content";
import JsonLd, { breadcrumbLd } from "@/app/_components/seo/JsonLd";

// SEO-текстов для «Співпраця» нет (docs/seo-texts.md: лист пустой) —
// title и description собраны из текстов макета.
export const metadata = {
  title: "Співпраця з BBS — офіційний дистриб’ютор Laminam і Vicostone",
  description:
    "Сильне партнерство починається там, де можливості доповнюють одна одну. Ми забезпечуємо дистрибуцію каменю, ви — його професійну обробку. Розвиваймося разом!",
  alternates: { canonical: "/spivpratsia/" },
};

/** Заявка с темой «Співпраця» — форма открывается модалкой (LeadModal). */
const LEAD_HREF = "/?about=Співпраця#lead-form";

/**
 * «Нині BBS це:»: строка-подзаголовок и строки текста — как в Figma
 * (Chrome переносит пункты 2 и 3 иначе, при той же высоте).
 */
const NOW: { title: string; lines: string[] }[] = [
  {
    title: "- Понад 100 декорів штучного каменю",
    lines: [
      "Різноманіття кольорів і текстур Laminam та Vicostone: від",
      "стриманих однотонних відтінків до виразних мармурових",
      "візерунків і фактур, що відтворюють природний камінь.",
    ],
  },
  {
    title: "- 1000+ реалізованих проєктів",
    lines: [
      "Стільниці, підвіконня, фасади та інші вироби з штучного",
      "каменю для житлових і комерційних просторів.",
      "Досвід роботи з різними матеріалами й запитами",
      "допомагає знаходити рішення для кожного проєкту.",
    ],
  },
  {
    title: "- Офіційне партнерство з Laminam і Vicostone",
    lines: [
      "Працюємо з провідними виробниками керамограніту",
      "та кварцового агломерату, забезпечуючи постачання",
      "оригінальних матеріалів з офіційною гарантією.",
    ],
  },
];

/** «BBS — надійний партнер»: карточки Content без текста, только заголовок. */
const PARTNER: AdvantageItem[] = [
  {
    icon: "/figma/bbs/palette.svg",
    title: "Понад 100 декорів каменю та керамічних плит у постійній складській наявності у великих обсягах.",
  },
  { icon: "/figma/bbs/medal.svg", title: "Офіційне партнерство з Laminam і Vicostone." },
  { icon: "/figma/spivpratsia/tile-small.svg", title: "Більше 1000 реалізованих проєктів." },
  {
    icon: "/figma/spivpratsia/handshake.svg",
    title: "Індивідуальні умови співпраці, що допомагають партнерам розвивати бізнес і отримувати прибуток.",
  },
  {
    icon: "/figma/bbs/truck.svg",
    title: "Регулярне оновлення асортименту відповідно до актуальних потреб ринку.",
  },
  { icon: "/figma/bbs/support.svg", title: "Комплексна підтримка партнерів персональним менеджером." },
];

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);
const L = ({ children }: { children: React.ReactNode }) => (
  <span className="font-light">{children}</span>
);

export default async function CooperationPage() {
  const projects = await getProjects(2);
  return (
    // До подвала в макете 60px (About / 5 кончается на 4093, подвал — 4153).
    <Page footerGap={60} mobile={<MobileSpivpratsia advantages={PARTNER} />}>
      <JsonLd data={breadcrumbLd(["Головна", "Співпраця"], "/spivpratsia/")} />
      <HeroBand
        breadcrumb={["Головна", "Співпраця"]}
        overlay={{ src: "/figma/bbs/hero-blog-overlay.png", above: true }}
      >
        <div className="flex w-full flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_SB} text-white`}>Співпраця з BBS</h1>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>
            BBS — <B>офіційний дистриб’ютор Laminam</B> і{" "}
            <B>представник Vicostone</B> в Україні. З 2012 року працюємо з
            керамогранітом і кварцовим агломератом, забезпечуючи постачання
            оригінальних матеріалів без посередників.
          </p>
          {/* CTA_HOVER: одна кнопка; ширина экземпляра в Figma — 250, содержимое слева. */}
          <PrimaryBtn
            icon="/figma/bbs/support-white.svg"
            className="w-[250px] justify-start"
            href={LEAD_HREF}
          >
            Отримати консультацію
          </PrimaryBtn>
        </div>
      </HeroBand>

      {/* Секции About / 5 — первая сразу под полосой героя (y = 464). */}
      <div className="mt-[34px] flex w-full flex-col items-center" data-reveal>
        {/* Layout / 1: «Нині BBS це:» — пункты одним текстом с пустой строкой
            между ними (от базовой линии до заглавных следующего — 40 − 15). */}
        <TextPhotoSection image="/figma/spivpratsia/showroom-table.jpg" alt="Шоурум BBS у Києві">
          <SectionTitle>Нині BBS це:</SectionTitle>
          <div className={`flex w-full flex-col items-start gap-[25px] ${H3_L} text-card-gray`}>
            {NOW.map((it) => (
              <p key={it.title} className="text-trim w-full">
                <B>{it.title}</B>
                {it.lines.map((line) => (
                  <Fragment key={line}>
                    <br />
                    {line}
                  </Fragment>
                ))}
              </p>
            ))}
          </div>
        </TextPhotoSection>

        {/* Frame 4748: заголовок и абзац на всю ширину, gap 10. */}
        <section className="flex w-[1120px] flex-col items-center gap-[10px] py-[80px]">
          <SectionTitle>Працюйте з командою спеціалістів</SectionTitle>
          <p className={`text-trim w-full ${H3_SB} text-card-gray`}>
            Фахівці BBS щодня забезпечують високий рівень сервісу для партнерів,{" "}
            <L>
              дотримуючись професійних стандартів у постачанні матеріалів і
              виготовленні виробів із каменю.
            </L>{" "}
            Ми допомагаємо{" "}
            <L>втілювати проєкти, знаходити оптимальні рішення та</L>{" "}
            створювати можливості для розвитку вашого бізнесу.
          </p>
        </section>

        {/* Layout / 118: «BBS — надійний партнер». */}
        <AdvantagesSection title="BBS — надійний партнер" items={PARTNER} />

        {/* Header / 76: «Співпраця з BBS» и Main_cta слева, два фото справа. */}
        <PhotoPairSection
          cta={
            <PrimaryBtn href={LEAD_HREF} className="w-full">
              Надіслати заявку
            </PrimaryBtn>
          }
        >
          <SectionTitle>Співпраця з BBS</SectionTitle>
          <p className={`text-trim w-full ${H3_L} text-card-gray`}>
            Сильне партнерство починається там, де можливості доповнюють одна
            одну.{" "}
            <B>Ми забезпечуємо дистрибуцію каменю, ви — його професійну обробку.</B>{" "}
            Розвиваймося разом!
          </p>
        </PhotoPairSection>

        {/* Frame 46: «Наші проєкти» — два последних изделия из админки. */}
        <ProjectsSection projects={projects} />

        {/* Frame 4742: «Наші контакти». */}
        <ContactsSection />
      </div>
    </Page>
  );
}
