/* eslint-disable @next/next/no-img-element */
// Примитивы мобильной версии (Figma ui-mobile-*, кадр 375px, колонка 343px).
// Обводки в макете внутренние — как и на десктопе, через inset box-shadow.

import Link from "next/link";

import { Tag } from "../bbs/cards";
import { Breadcrumbs, CAPTION, H2_L, H2_MOB_SB, H2_SB, H3_L, H4_L, HOVER_EASE, Icon, LINE_BASE_BLUE, LINE_FILL, MOB_L, MOB_SB, ONE_LINE, OutlineBtn, PrimaryBtn, SwapIcon, TextLink, inset } from "../bbs/ui";

/** Форма заявки мобильной главной; десктопная (#lead-form) на мобиле скрыта. */
export const LEAD_ANCHOR = "lead-form-m";

/** Ссылки на форму заявки ведут к мобильной форме. */
export const mobileHref = (href: string) =>
  href.replace(/#lead-form$/, `#${LEAD_ANCHOR}`);

const BG: Record<string, string> = {
  white: "",
  light: "bg-light-gray",
  gray: "bg-back-card-gray",
};

/** Секция: px 16, по умолчанию py 40, фон белый / light_gray / back_card_gray. */
export function MSection({
  children,
  bg = "white",
  className = "py-[40px]",
  gap = 24,
  bordered = false,
  id,
}: {
  children: React.ReactNode;
  bg?: keyof typeof BG;
  /** Вертикальные отступы (в макете py 40, у CTA и FAQ pb 60). */
  className?: string;
  gap?: number;
  /** Рамка back_card_gray (CTA-баннеры, карточки консультации). */
  bordered?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`flex w-full flex-col items-start px-[16px] ${BG[bg]} ${className}`}
      style={{
        gap,
        ...(bordered ? inset("var(--color-back-card-gray)") : {}),
      }}
    >
      {children}
    </section>
  );
}

/** Заголовок секции H2_mob_sb. */
export function MTitle({
  children,
  as: Heading = "h2",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return <Heading className={`text-trim w-full ${H2_MOB_SB} text-ink`}>{children}</Heading>;
}

/**
 * Горизонтальная лента карточек: в макете ряд уходит за правый край кадра,
 * поэтому лента шире колонки на поля 16px и листается свайпом.
 */
export function MCarousel({
  children,
  gap = 8,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <div
      className="-mx-[16px] flex w-[calc(100%+32px)] snap-x snap-mandatory scroll-px-[16px] items-start overflow-x-auto px-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ gap }}
    >
      {children}
    </div>
  );
}

/** btn во всю ширину колонки (белый, обводка blue). */
export function MOutlineBtn({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <OutlineBtn href={href} className={`w-full justify-center ${className}`}>
      {children}
    </OutlineBtn>
  );
}

/**
 * Card декора (Figma 1247:4108): фото на всю высоту минус подписи,
 * подписи 16mob_sb / 16mob_l, gap 12, pb 8. В ленте 180×240, в сетке —
 * ширина колонки при тех же пропорциях.
 */
export function MDecorCard({
  name,
  brand,
  image,
  href,
  fill = false,
}: {
  name: string;
  brand: string;
  image: string | null;
  href: string;
  /** Карточка сетки каталога: ширина колонки, пропорции 167.5 × 240. */
  fill?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex shrink-0 snap-start flex-col items-center gap-[12px] bg-white pb-[8px] ${
        fill ? "aspect-[167.5/240] w-full" : "h-[240px] w-[180px]"
      }`}
      style={inset("var(--color-light-gray)")}
    >
      <div className="relative min-h-px w-full flex-1 bg-[#d9d9d9]">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[8px] px-[8px]">
        <p className={`text-trim w-full ${MOB_SB} text-ink`}>{name}</p>
        <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{brand}</p>
      </div>
    </Link>
  );
}

/** card_project (Variant5): 262px, фото 200, заголовок, теги, «Детальніше». */
export function MProjectCard({
  title,
  subtitle,
  tags,
  image,
  href,
}: {
  title: string;
  subtitle: string;
  tags: string[];
  image?: string | null;
  href: string;
}) {
  return (
    // relative: «Детальніше» растянута на всю карточку — открывается кликом в любом месте.
    <div
      className="relative flex w-[262px] shrink-0 snap-start flex-col items-center gap-[24px] bg-white"
      style={inset("var(--color-light-gray)")}
    >
      <div className="relative h-[200px] w-full shrink-0 bg-[#d9d9d9]">
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[12px] px-[16px]">
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className={`text-trim w-full ${ONE_LINE} ${MOB_SB} text-ink`} title={title}>
            {title}
          </p>
          {subtitle && (
            <p className={`text-trim w-full ${ONE_LINE} ${MOB_L} text-card-gray`}>{subtitle}</p>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex w-full items-center gap-[8px]">
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
        <TextLink weight="semibold" href={href} stretched>
          Детальніше
        </TextLink>
      </div>
    </div>
  );
}

/** card_project (Variant7): 240px, фото 180, название и теги; ведёт на изделие. */
export function MProjectSmallCard({
  title,
  tags,
  image,
  href,
}: {
  title: string;
  tags: string[];
  image?: string | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex w-[240px] shrink-0 snap-start flex-col items-start justify-center gap-[12px] bg-white pb-[16px]"
      style={inset("var(--color-light-gray)")}
    >
      <div className="relative h-[180px] w-full shrink-0 bg-[#d9d9d9]">
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[12px] px-[8px]">
        {/* Одна строка, как в макете: карточки в ленте одной высоты. */}
        <p className={`text-trim w-full ${ONE_LINE} ${MOB_SB} text-ink`} title={title}>
          {title}
        </p>
        {tags.length > 0 && (
          <div className="flex w-full items-center gap-[8px]">
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/** Фон героя: кроп фото Laminam (как в Figma), слои поверх, затемнение 60%. */
export type HeroBg = "laminam" | "bbs" | "overlay";

/**
 * Hero-Section внутренних страниц: pt 24, pb 40, gap 24, крошки и контент.
 * `bg`: laminam — только кроп; bbs — + фото ванной; overlay — + волны поверх.
 */
export function MHero({
  breadcrumb,
  bg = "laminam",
  gap = 32,
  children,
}: {
  breadcrumb: string[];
  bg?: HeroBg;
  /** Между блоками контента: 32, у публикаций 24. */
  gap?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex w-full flex-col items-start gap-[24px] px-[16px] pt-[24px] pb-[40px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/figma/bbs/hero-laminam.jpg"
          alt=""
          className="absolute top-[-132.39%] left-[-1.64%] h-[470.15%] w-[174.67%] max-w-none"
        />
        {bg !== "laminam" && (
          <img
            src="/figma/catalog/hero-bbs.png"
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        {bg === "overlay" && (
          <img
            src="/figma/mobile/hero-overlay.png"
            alt=""
            className="absolute inset-0 size-full max-w-none"
          />
        )}
      </div>
      <div className="relative">
        <Breadcrumbs items={breadcrumb} />
      </div>
      <div className="relative flex w-full flex-col items-start" style={{ gap }}>
        {children}
      </div>
    </section>
  );
}

/** Заголовок и подзаголовок героя: H2 (32) белый, H3_l серый 90%, gap 16. */
export function MHeroText({
  title,
  text,
  light = false,
}: {
  title: React.ReactNode;
  text?: React.ReactNode;
  /** Заголовок light с выделением semibold (каталог: «Каталог **BBS**»). */
  light?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[16px]">
      <h1 className={`text-trim w-full ${light ? H2_L : H2_SB} text-white`}>{title}</h1>
      {text && (
        <p className={`text-trim w-full ${H3_L} text-caption-gray opacity-90`}>{text}</p>
      )}
    </div>
  );
}

/**
 * CTA-баннер / карточка консультации: заголовок H2 (32), текст, Main_cta.
 * Варианты из макетов отличаются отступами, выравниванием и кеглем текста.
 */
export function MCta({
  title,
  text,
  button = "Зв’язатися з нами",
  href = `/#${LEAD_ANCHOR}`,
  center = false,
  textCenter = false,
  bigText = false,
  textInk = false,
  innerGap = 24,
  gap = 32,
  variant = "banner",
}: {
  title: React.ReactNode;
  /** Без текста — только заголовок (в SEO-таблице Vicostone текста нет). */
  text?: React.ReactNode;
  button?: string;
  href?: string;
  center?: boolean;
  /** Текст тоже по центру (карточка изделия, макет 1281:5630). */
  textCenter?: boolean;
  /** Текст H3_l (20) вместо 16mob_l. */
  bigText?: boolean;
  /** Текст цвета black (карточка товара), иначе card_gray. */
  textInk?: boolean;
  innerGap?: number;
  gap?: number;
  /** banner — pt 40 / pb 60; card — py 24; plain — py 40 без фона. */
  variant?: "banner" | "card" | "plain";
}) {
  return (
    <MSection
      bg={variant === "plain" ? "white" : "light"}
      bordered={variant !== "plain"}
      className={
        variant === "banner" ? "pt-[40px] pb-[60px]" : variant === "card" ? "py-[24px]" : "py-[40px]"
      }
      gap={gap}
    >
      <div className="flex w-full flex-col items-start" style={{ gap: innerGap }}>
        <h2 className={`text-trim w-full ${H2_SB} text-ink ${center ? "text-center" : ""}`}>
          {title}
        </h2>
        {text && (
          <p
            className={`text-trim w-full ${bigText ? H3_L : MOB_L} ${textInk ? "text-ink" : "text-card-gray"} ${textCenter ? "text-center" : ""}`}
          >
            {text}
          </p>
        )}
      </div>
      <PrimaryBtn href={href} className="w-full">
        {button}
      </PrimaryBtn>
    </MSection>
  );
}

/** FAQ (Figma 1252:4589): белая строка pl 20 / pr 10 / py 21, шеврон 24. */
export function MFaqList({
  questions,
  answers,
  heading = false,
}: {
  questions: string[];
  answers?: string[];
  /** Вопросы — заголовки h3 (в SEO-таблице помечены h3), вид тот же. */
  heading?: boolean;
}) {
  const Question = heading ? "h3" : "span";
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      {questions.map((q, i) => (
        <details
          key={q}
          className="group w-full bg-white"
          style={{
            boxShadow:
              "inset 0 1px 0 var(--color-light-gray), inset 0 -1px 0 var(--color-light-gray)",
          }}
        >
          <summary className="flex cursor-pointer list-none items-center gap-[10px] py-[21px] pr-[10px] pl-[20px] [&::-webkit-details-marker]:hidden">
            <Question className={`text-trim min-w-px flex-1 ${MOB_L} text-ink`}>{q}</Question>
            <Icon
              src="/figma/bbs/chevron-down.svg"
              size={24}
              className="transition-transform group-open:rotate-180"
            />
          </summary>
          {answers?.[i] && (
            // pre-line: пункты списка в ответе — с новой строки.
            <p className={`pr-[54px] pb-[21px] pl-[20px] whitespace-pre-line ${H4_L} text-card-gray`}>
              {answers[i]}
            </p>
          )}
        </details>
      ))}
    </div>
  );
}

/** Строка «иконка 32 + текст» (Переваги, Values-Section). */
export function MIconRow({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="flex w-full items-center gap-[12px]">
      <Icon src={icon} size={32} />
      <div className="flex min-w-px flex-1 flex-col items-start gap-[8px]">
        <p className={`text-trim ${MOB_SB} text-ink`}>{title}</p>
        {text && <p className={`text-trim ${CAPTION} text-card-gray`}>{text}</p>}
      </div>
    </div>
  );
}

/** Строка «Telegram»: иконка 48 и подчёркнутая ссылка со стрелкой. */
export function MTelegram({
  href,
  arrow = true,
}: {
  href: string | null;
  /** В форме заявки — со стрелкой справа; в подвале без неё. */
  arrow?: boolean;
}) {
  return (
    <a
      href={href ?? "#"}
      target={href ? "_blank" : undefined}
      rel="noreferrer"
      className={`group flex items-center gap-[8px] ${arrow ? "min-w-px flex-1" : "shrink-0"}`}
    >
      <Icon src="/figma/bbs/telegram.svg" size={48} />
      <span
        className={`flex items-start py-[16px] text-[16px] font-semibold leading-[20px] tracking-[-0.8px] text-blue ${
          arrow ? "min-w-px flex-1 justify-between" : ""
        }`}
      >
        <span className={`text-trim whitespace-nowrap transition-colors ${HOVER_EASE} group-hover:text-red ${LINE_FILL} ${LINE_BASE_BLUE}`}>
          Зв’язатися через Telegram
        </span>
        {arrow && <SwapIcon src="/figma/bbs/arrow-link-blue.svg" hover="/figma/bbs/arrow-link-hover.svg" />}
      </span>
    </a>
  );
}

