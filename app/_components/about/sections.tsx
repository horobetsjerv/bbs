/* eslint-disable @next/next/no-img-element */
// Секции десктопа «Про компанію» (app/pro-nas), общие со «Співпраця»
// (app/spivpratsia): в Figma это одни и те же фреймы About / 5 с другими
// текстами. Колонка 1120, отступы секций — py 80 (кроме Header / 76).

import { ProjectCardWide } from "../bbs/cards";
import { H2_SB, H3_L, H3_SB, Icon, MOB_L, OutlineBtn, SectionHeader, inset } from "../bbs/ui";
import ContactsInfo from "../contacts/ContactsInfo";
import type { ProjectCardData } from "@/app/_lib/content";

/** Заголовок секции: H2 sb, в этих макетах — чёрный #000 (стиль Black). */
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={`text-trim w-full ${H2_SB} text-black`}>{children}</h2>;
}

/** Layout / 1: текст слева, фото справа по высоте текста. */
export function TextPhotoSection({
  image,
  alt,
  children,
}: {
  image: string;
  alt: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-[1120px] items-center gap-[24px] py-[80px]">
      <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">{children}</div>
      <div className="relative min-w-px flex-1 self-stretch">
        <img src={image} alt={alt} className="absolute inset-0 size-full max-w-none object-cover" />
      </div>
    </section>
  );
}

/** Content: иконка 48, заголовок H3 sb, текст 16 light (необязателен). */
export type AdvantageItem = { icon: string; title: string; text?: string };

/**
 * Layout / 118: заголовок слева, карточки Content справа — фон-текстура,
 * внутренняя обводка light_gray. Без текста заголовок карточки переносится
 * по ширине (в «Співпраця» пункты длиннее строки).
 */
export function AdvantagesSection({ title, items }: { title: string; items: AdvantageItem[] }) {
  return (
    <section className="flex w-[1120px] items-start gap-[24px] py-[80px]">
      <div className="min-w-px flex-1">
        <SectionTitle>{title}</SectionTitle>
      </div>
      <div className="flex min-w-px flex-1 flex-col items-start gap-[32px]">
        {items.map((a) => (
          <div
            key={a.title}
            className="relative flex w-full flex-col items-start gap-[16px] p-[32px]"
          >
            {/* Фон-заливка карточки (в Figma — растянут во весь бокс). */}
            <img
              src="/figma/about/advantage-bg.png"
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full max-w-none object-fill"
            />
            {/* Внутренняя обводка поверх фона. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={inset("var(--color-light-gray)")}
            />
            <div className="relative flex w-full items-center gap-[12px]">
              <Icon src={a.icon} size={48} />
              <h3
                className={`text-trim ${a.text ? "shrink-0 whitespace-nowrap" : "min-w-px flex-1"} ${H3_SB} text-black`}
              >
                {a.title}
              </h3>
            </div>
            {a.text && (
              <p className={`text-trim relative w-full ${MOB_L} text-card-gray`}>{a.text}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Header / 76: текст и кнопка по центру слева (pr 80), два фото шоуруму
 * справа (548 × 440, gap 16) — в обоих макетах одни и те же кадры.
 */
export function PhotoPairSection({
  children,
  cta,
}: {
  children: React.ReactNode;
  /** Main_cta во всю ширину колонки. */
  cta: React.ReactNode;
}) {
  return (
    <section className="flex w-[1120px] items-stretch gap-[24px]">
      {/* 548 вместе с pr 80 (flex-1 прибавил бы паддинг к доле колонки). */}
      <div className="flex w-[548px] shrink-0 flex-col items-start justify-center gap-[24px] pr-[80px]">
        <div className="flex w-full flex-col items-start gap-[24px]">{children}</div>
        {cta}
      </div>
      <div className="flex h-[900px] min-w-px flex-1 flex-col items-start gap-[16px]">
        <img
          src="/figma/about/showroom-counter.jpg"
          alt="Стійка шоуруму BBS"
          className="block h-[440px] w-full shrink-0 object-cover"
        />
        <img
          src="/figma/about/showroom-shelf.jpg"
          alt="Зразки матеріалів у шоурумі BBS"
          className="block h-[440px] w-full shrink-0 object-cover"
        />
      </div>
    </section>
  );
}

/** Frame 46: «Наші проєкти» — изделия из админки; без изделий секции нет. */
export function ProjectsSection({ projects }: { projects: ProjectCardData[] }) {
  if (projects.length === 0) return null;
  return (
    <section className="flex w-[1120px] flex-col items-start gap-[24px] py-[80px]">
      <SectionHeader
        title="Наші проєкти"
        action={<OutlineBtn href="/proekty/">Переглянути усі проєкти</OutlineBtn>}
      />
      <p className={`text-trim w-full ${H3_L} text-card-gray`}>Реалізовано понад 1000 проєктів</p>
      <div className="flex w-full items-start gap-[24px]">
        {projects.map((p) => (
          <ProjectCardWide key={p.href} {...p} />
        ))}
      </div>
    </section>
  );
}

/** Frame 4742: «Наші контакти» — тот же блок, что на странице контактов. */
export function ContactsSection() {
  return (
    <section className="flex w-[1120px] flex-col items-start gap-[24px] py-[80px]">
      <SectionTitle>Наші контакти</SectionTitle>
      <ContactsInfo />
    </section>
  );
}
