/* eslint-disable @next/next/no-img-element */
// Мобильная главная (Figma ui-mobile-main, 1250:3292).

import type { Decor } from "@/app/_lib/catalog";
import type { StoneType } from "@/app/_lib/catalog-url";
import { getProjects, getSettings } from "@/app/_lib/content";

import { TypeTile, type TileIcon } from "../bbs/cards";
import { FACTS } from "../home/Advantages";
import {
  COOPERATION_LEAD,
  COOPERATION_STEPS,
  COOPERATION_STEPS_TITLE,
  COOPERATION_TITLE,
} from "../home/Cooperation";
import { BRAND_COPY, BRANDS_TITLE } from "../home/Hero";
import { ProjectLinks } from "../home/ProjectTypes";
import LeadFormFields, { type LeadPreset } from "../bbs/LeadFormFields";
import {
  GhostBtn,
  H2_SB,
  H3_L,
  MOB_L,
  PrimaryBtn,
  TextLink,
  inset,
} from "../bbs/ui";
import MobileDecors from "./Decors";
import {
  LEAD_ANCHOR,
  MCarousel,
  MCta,
  MFaqList,
  MIconRow,
  MOutlineBtn,
  MProjectCard,
  MSection,
  MTelegram,
  MTitle,
} from "./ui";

/** Hero (1250:3300): фото, затемнение 65%, px 16, py 48. */
function Hero() {
  return (
    <section className="relative flex w-full flex-col items-start gap-[24px] px-[16px] py-[48px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/figma/mobile/hero-home.webp"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>
      {/* Без обрезки по cap-height: в макете строки по 32px целиком. */}
      <h1 className="relative w-full text-[32px] leading-[32px] font-semibold tracking-[-1.6px] text-white">
        <span className="font-light">Штучний камінь </span>
        Laminam <span className="font-light">та </span>
        Vicostone<span className="font-light"> в Україні</span>
      </h1>
      <p className={`text-trim relative w-full ${H3_L} text-caption-gray`}>
        Оригінальні керамічні та кварцові поверхні для стільниць, меблів, підлоги,
        стін і фасадів.
      </p>
      <div className="relative flex w-full flex-col items-start gap-[12px]">
        <PrimaryBtn href="/kataloh/" className="w-full">
          Переглянути каталог
        </PrimaryBtn>
        <GhostBtn
          href={`#${LEAD_ANCHOR}`}
          icon="/figma/bbs/calculator.svg"
          className="w-full justify-center"
        >
          Розрахувати вартість проєкта
        </GhostBtn>
      </div>
    </section>
  );
}

function BrandCard({
  logo,
  text,
  link,
  href,
}: {
  logo: React.ReactNode;
  text: React.ReactNode;
  link: string;
  href: string;
}) {
  return (
    <div
      className="flex w-full flex-col items-start gap-[12px] bg-light-gray p-[16px]"
      style={inset("var(--color-back-card-gray)")}
    >
      {logo}
      <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{text}</p>
      <TextLink href={href}>{link}</TextLink>
    </div>
  );
}

/**
 * BrandsStacked (1250:3336): две карточки брендов.
 * «Про нас» (1556:11457): свой заголовок и тексты, заголовок отделён на 24.
 * «Шоурум» (1624:13605): под заголовком абзац `lead`, отступы те же titleGap.
 */
export function Brands({
  title = BRANDS_TITLE,
  copy = BRAND_COPY,
  titleGap = 12,
  lead,
}: {
  title?: string;
  copy?: { laminam: React.ReactNode; vicostone: React.ReactNode };
  /** От заголовка до карточек; между карточками всегда 12. */
  titleGap?: number;
  lead?: React.ReactNode;
} = {}) {
  return (
    <MSection gap={titleGap}>
      <MTitle>{title}</MTitle>
      {lead && <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{lead}</p>}
      <div className="flex w-full flex-col items-start gap-[12px]">
        <BrandCard
          logo={
            <img
              src="/figma/mobile/laminam-logo.svg"
              alt="Laminam"
              className="block h-[32px] w-[221.793px] shrink-0"
            />
          }
          text={copy.laminam}
          link="Перейти в каталог Laminam"
          href="/kataloh/laminam/"
        />
        <BrandCard
          logo={
            // Знак и надпись Vicostone — кропы одного спрайта, как в Figma.
            <div className="flex items-center gap-[4px]">
              <div className="relative size-[32px] shrink-0 overflow-hidden">
                <img
                  src="/figma/bbs/vicostone-sprite.png"
                  alt=""
                  aria-hidden
                  className="absolute top-[-7.93%] left-[-125.62%] h-[258.2%] w-[351.99%] max-w-none"
                />
              </div>
              <div className="relative h-[20px] w-[140px] shrink-0 overflow-hidden">
                <img
                  src="/figma/bbs/vicostone-sprite.png"
                  alt="Vicostone"
                  className="absolute top-[-248.34%] left-[-8.22%] h-[519.75%] w-[116.44%] max-w-none"
                />
              </div>
            </div>
          }
          text={copy.vicostone}
          link="Перейти в каталог Vicostone"
          href="/kataloh/kvartsovyi-kamin/"
        />
      </div>
    </MSection>
  );
}

// Факты — общие с десктопом; кисти в мобильном наборе нет, берётся десктопная.
const factIcon = (icon: string) =>
  icon === "brush" ? "/figma/bbs/brush.svg" : `/figma/mobile/${icon}.svg`;

function Advantages() {
  return (
    <MSection>
      <MTitle>Переваги роботи з BBS</MTitle>
      <div className="flex w-full flex-col items-start gap-[16px]">
        {FACTS.map((a) => (
          <MIconRow key={a.icon} icon={factIcon(a.icon)} title={a.title} text={a.text} />
        ))}
      </div>
    </MSection>
  );
}

const TYPES: { icon: TileIcon; label: string }[] = [
  { icon: "kitchen", label: "Кухонні острови" },
  { icon: "countertop", label: "Стільниці" },
  { icon: "floor", label: "Підлога" },
  { icon: "wall", label: "Стіни" },
  { icon: "facade", label: "Фасади" },
  { icon: "stairs", label: "Сходи" },
];

/** Сетка 2×3 плиток применения (ProjectSolutions / Applications-Section). */
export function MTiles({
  title,
  items,
  type,
  bg,
  children,
}: {
  title: string;
  items: { icon: TileIcon; label: string }[];
  /** Тип каменя плиток (без него — все материалы). */
  type?: StoneType;
  bg: "light" | "gray";
  /** Под плитками (главная: список ссылок из SEO-таблицы). */
  children?: React.ReactNode;
}) {
  return (
    <MSection bg={bg}>
      <MTitle>{title}</MTitle>
      <div className="grid w-full grid-cols-2 gap-[8px]">
        {items.map((t) => (
          <TypeTile key={t.label} icon={t.icon} label={t.label} type={type} compact />
        ))}
      </div>
      {children}
    </MSection>
  );
}

async function Projects() {
  const projects = await getProjects(4);
  if (projects.length === 0) return null;
  return (
    <MSection>
      <MTitle>Реалізовані проєкти</MTitle>
      <MCarousel gap={16}>
        {projects.map((p) => (
          <MProjectCard key={p.href} {...p} />
        ))}
      </MCarousel>
    </MSection>
  );
}

/** Consultation (1250:3493): форма заявки — якорь всех «Залишити заявку». */
async function Consultation({ preset }: { preset: LeadPreset }) {
  const { socials } = await getSettings();
  return (
    // scroll-mt: шапка закреплена (68px) и иначе перекрыла бы заголовок формы.
    <MSection bg="light" id={LEAD_ANCHOR} className="scroll-mt-[68px] py-[40px]">
      <h2 className={`text-trim w-full ${H2_SB} text-ink`}>
        Оберіть свою ідеальну поверхню
      </h2>
      <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
        <span className="font-semibold">Залиште заявку </span>— наші менеджери
        зв’яжуться з вами та <span className="font-semibold">допоможуть з вибором.</span>
      </p>
      {/* key: новый пресет из адреса — форма пересоздаётся с новым сообщением. */}
      <LeadFormFields key={JSON.stringify(preset)} preset={preset} compact />
      <div className="flex w-full px-[32px]">
        <MTelegram href={socials.telegram} />
      </div>
    </MSection>
  );
}

function WhyBbs() {
  return (
    <MSection>
      <MTitle>Чому обирають BBS</MTitle>
      <div className="relative h-[322px] w-full shrink-0">
        <img
          src="/figma/bbs/why-bbs.webp"
          alt="Шоурум BBS"
          loading="lazy"
          className="absolute inset-0 size-full max-w-none object-cover"
        />
      </div>
      <div className="flex w-full flex-col items-start gap-[32px]">
        <div className={`text-trim w-full ${MOB_L} text-card-gray`}>
          <p>
            <span className="font-semibold">
              BBS — офіційний дистриб’ютор Laminam та Vicostone
            </span>
            , тому ви отримуєте оригінальні матеріали від виробників і консультацію від
            професіоналів під час вибору. Ми допоможемо визначитися з матеріалом, декором
            і форматом відповідно до особливостей вашого проєкту, а також розрахувати
            необхідну кількість матеріалу. Широкий вибір керамограніту та кварцового каменю
            дає змогу підібрати оптимальне рішення для різних проєктів. На матеріали діє{" "}
            <span className="font-semibold">гарантія 25 років</span>, що забезпечує
            впевненість в їх тривалому використанні. Завдяки комплексному супроводу ви
            зможете зосередитися на реалізації своїх ідей, не витрачаючи зайвий час на
            пошуки і розрахунки.{" "}
            <span className="font-semibold">
              Ми врахуємо особливості проєкту на кожному етапі, щоб ви отримали якісний
              результат без зайвого клопоту.
            </span>
          </p>
          <p className="mt-[16px]">
            Відвідайте шоурум BBS, щоб переглянути декор наживо, отримати консультацію та
            замовити матеріал!
          </p>
        </div>
        <MOutlineBtn href="/kontakty/">Детальніше про шоурум</MOutlineBtn>
      </div>
    </MSection>
  );
}

/** «Професійні умови співпраці з BBS»: тот же текст, что на десктопе, шаги столбиком. */
function Cooperation() {
  return (
    <MSection>
      <MTitle>{COOPERATION_TITLE}</MTitle>
      <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{COOPERATION_LEAD}</p>
      <p className={`text-trim w-full ${MOB_L} text-ink`}>{COOPERATION_STEPS_TITLE}</p>
      <MStepList steps={COOPERATION_STEPS} />
    </MSection>
  );
}

/** Нумерованные этапы столбиком: номер H3_L blue, текст 16mob_l, линия сверху (и в текстах подборок). */
export function MStepList({ steps }: { steps: string[] }) {
  return (
    <ol className="flex w-full flex-col items-start">
      {steps.map((step, i) => (
        <li
          key={step}
          className="flex w-full items-start gap-[16px] py-[16px]"
          style={{ boxShadow: "inset 0 1px 0 var(--color-light-gray)" }}
        >
          <span className={`text-trim w-[28px] shrink-0 ${H3_L} text-blue tabular-nums`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={`text-trim min-w-px flex-1 ${MOB_L} text-ink`}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Reviews() {
  return (
    <MSection>
      <MTitle>Відгуки клієнтів і партнерів BBS</MTitle>
      <MCarousel gap={16}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[379px] w-[262px] shrink-0 snap-start bg-back-card-gray" />
        ))}
      </MCarousel>
    </MSection>
  );
}

/** FAQSection (1250:3512): серый фон, pb 60, список и «Всі запитання». */
export function MFaq({
  title,
  questions,
  answers,
  bg = "gray",
  allHref = null,
  heading = false,
}: {
  title: string;
  questions: string[];
  /** Ответы по порядку вопросов; без них строки только раскрывают шеврон. */
  answers?: string[];
  bg?: "gray" | "white";
  /** Куда ведёт «Всі запитання»; по умолчанию кнопки нет (страницы FAQ нет). */
  allHref?: string | null;
  /** Вопросы — заголовки h3 (см. MFaqList). */
  heading?: boolean;
}) {
  const gray = bg === "gray";
  return (
    <MSection bg={bg} className="pt-[40px] pb-[60px]">
      <MTitle>{title}</MTitle>
      {/* Секция контактов: кнопка через 24px и подпись слева, как в макете. */}
      <div className="flex w-full flex-col items-start" style={{ gap: gray ? 32 : 24 }}>
        <MFaqList questions={questions} answers={answers} heading={heading} />
        {allHref && (
          <MOutlineBtn href={allHref} className={`font-medium! ${gray ? "" : "justify-start!"}`}>
            Всі запитання
          </MOutlineBtn>
        )}
      </div>
    </MSection>
  );
}

export default function MobileHome({
  decors,
  preset,
  faq,
}: {
  decors: Decor[][];
  preset: LeadPreset;
  faq: { question: string; answer: string }[];
}) {
  return (
    <>
      <Hero />
      <div className="contents" data-reveal>
        <Brands />
        <Advantages />
        <MobileDecors decors={decors} />
        <MTiles title="Штучний камінь і керамограніт для вашого проєкту" items={TYPES} bg="gray">
          <ProjectLinks onGray />
        </MTiles>
        <Projects />
        <Consultation preset={preset} />
        <WhyBbs />
        <Cooperation />
        <Reviews />
        <MFaq
          title="Часті запитання"
          questions={faq.map((f) => f.question)}
          answers={faq.map((f) => f.answer)}
        />
        <MCta
          variant="plain"
          title="Розрахуйте вартість матеріалу для вашого проєкту"
          text={
            <>
              <span className="font-semibold">Залиште заявку </span>— наші менеджери
              зв’яжуться з вами та{" "}
              <span className="font-semibold">допоможуть з вибором.</span>
            </>
          }
          button="Залишити заявку"
          href={`#${LEAD_ANCHOR}`}
        />
      </div>
    </>
  );
}
