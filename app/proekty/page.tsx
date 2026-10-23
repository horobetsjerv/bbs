import Page from "../_components/bbs/Page";
import MobileVyroby from "../_components/mobile/Vyroby";
import HeroBand from "../_components/bbs/HeroBand";
import { CtaBanner } from "../_components/bbs/blocks";
import DecorsSection from "../_components/bbs/DecorsSection";
import { ProjectCard } from "../_components/bbs/cards";
import { GhostBtn, H1_L, PrimaryBtn } from "../_components/bbs/ui";
import { getPopularDecors } from "@/app/_lib/catalog";
import { getProjects } from "@/app/_lib/content";
import JsonLd, { breadcrumbLd } from "@/app/_components/seo/JsonLd";

export const metadata = {
  title: "Вироби на замовлення з Laminam і Vicostone | BBS",
  description:
    "Стільниці, фартухи, підвіконня та інші вироби на замовлення з керамограніту Laminam і кварцу Vicostone. Реалізовані проєкти BBS і розрахунок вартості.",
  alternates: { canonical: "/proekty/" },
};

export default async function VyrobyPage() {
  const [decors, projects] = await Promise.all([getPopularDecors(), getProjects()]);
  return (
    // До подвала в макете 131px.
    <Page footerGap={131} mobile={<MobileVyroby decors={decors} />}>
      <JsonLd data={breadcrumbLd(["Головна", "Вироби на замовлення"], "/proekty/")} />
      <HeroBand
        breadcrumb={["Головна", "Вироби на замовлення"]}
        overlay={{ src: "/figma/bbs/hero-blog-overlay.png", above: true }}
      >
        <div className="flex w-full flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_L} text-white`}>
            <span className="font-semibold">Вироби з матеріалу</span> Laminam і
            Vicostone
          </h1>
          <div className="flex items-start gap-[24px]">
            {/* Как в контактах: форма заявки (модалка), для партнёров — с темой. */}
            <PrimaryBtn
              icon="/figma/bbs/support-white.svg"
              className="w-[228px] justify-start"
              href="/#lead-form"
            >
              Швидка консультація
            </PrimaryBtn>
            <GhostBtn
              icon="/figma/bbs/arrow-cta-white.svg"
              hoverIcon="/figma/bbs/arrow-cta-hover.svg"
              href="/?about=Співпраця#lead-form"
            >
              Дизайнерам і обробникам
            </GhostBtn>
          </div>
        </div>
      </HeroBand>

      {/* Frame 4700: карточки заезжают на полосу героя (y = 435). */}
      <div
        className="relative mt-[72px] flex w-[1120px] flex-col items-start gap-[80px]"
        data-reveal
      >
        {/* Проекты из админки, по четыре в ряд; items-stretch — карточки ряда одной высоты. */}
        {projects.length > 0 ? (
          <div className="flex w-full flex-wrap items-stretch gap-[24px]">
            {projects.map((p) => (
              <ProjectCard key={p.href} {...p} />
            ))}
          </div>
        ) : (
          <p className="text-[20px] font-semibold leading-[20px] tracking-[-1px] text-ink">
            Виробів не знайдено
          </p>
        )}
        <CtaBanner
          title="Бажаєте замовити виріб на замовлення?"
          text="Наша команда допоможе підібрати ідеальний матеріал для вашого проекту."
          button="Зв’язатися з нами"
        />
        <DecorsSection decors={decors} title="Популярні декори" />
      </div>
    </Page>
  );
}
