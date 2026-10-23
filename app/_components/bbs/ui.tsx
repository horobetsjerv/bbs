/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
// Общие примитивы сайта BBS. Геометрия и стили сняты с компонентов
// Figma-файла BBS (десктоп 1280px, контентная колонка 1120px).
//
// Обводки у компонентов Figma внутренние — они не увеличивают размер.
// Поэтому вместо border используется inset box-shadow, иначе кнопки и
// карточки выходят выше макета на 2px.

/** Текстовые стили из переменных Figma (letterSpacing −5%). */
export const H1_SB =
  "text-[64px] font-semibold leading-[60px] tracking-[-3.2px]";
export const H1_L = "text-[64px] font-light leading-[60px] tracking-[-3.2px]";
export const H2_SB =
  "text-[32px] font-semibold leading-[32px] tracking-[-1.6px]";
export const H2_L = "text-[32px] font-light leading-[32px] tracking-[-1.6px]";
export const H3_SB = "text-[20px] font-semibold leading-[20px] tracking-[-1px]";
export const H3_L = "text-[20px] font-light leading-[20px] tracking-[-1px]";
export const H4_BTN =
  "text-[16px] font-semibold leading-[20px] tracking-[-0.8px]";
export const H4_L = "text-[16px] font-light leading-[20px] tracking-[-0.8px]";
export const MOB_L = "text-[16px] font-light leading-[16px] tracking-[-0.8px]";
export const MOB_SB =
  "text-[16px] font-semibold leading-[16px] tracking-[-0.8px]";
/**
 * Одна строка с многоточием (заголовки карточек проектов, как в макете).
 * text-wrap из Page (balance) перебивает nowrap — отсюда «!»; обрезаем только
 * по горизонтали (clip), чтобы text-trim не срезал хвосты букв у/р/щ.
 */
export const ONE_LINE = "![text-wrap-mode:nowrap] [overflow-x:clip] text-ellipsis";
export const CAPTION =
  "text-[14px] font-light leading-[14px] tracking-[-0.7px]";
/** H2_mob_sb: заголовки секций мобильной версии (24/23, letterSpacing −3%). */
export const H2_MOB_SB =
  "text-[24px] font-semibold leading-[23px] tracking-[-0.72px]";

export const inset = (color: string) => ({
  boxShadow: `inset 0 0 0 1px ${color}`,
});

export function Icon({
  src,
  size = 16,
  width,
  height,
  className = "",
}: {
  src: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const w = width ?? size;
  const h = height ?? size;
  return (
    <img
      src={src}
      alt=""
      width={w}
      height={h}
      aria-hidden
      className={`block shrink-0 ${className}`}
      style={{ width: `${w}px`, height: `${h}px` }}
    />
  );
}

/**
 * Иконка с заменой на hover родителя (родитель — `group`): в Figma hover-вариант
 * кнопки меняет контурную стрелку на залитую другого цвета.
 * `menu` — родитель `group/menu` (пункт шапки с выпадающей панелью): иконка
 * остаётся залитой, пока курсор на панели или фокус с клавиатуры внутри.
 */
export function SwapIcon({
  src,
  hover,
  size = 16,
  menu = false,
}: {
  src: string;
  hover: string;
  size?: number;
  menu?: boolean;
}) {
  return (
    <span
      className="relative block shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        className={`block size-full ${
          menu
            ? "group-hover/menu:invisible group-has-[:focus-visible]/menu:invisible"
            : "group-hover:invisible"
        }`}
      />
      <img
        src={hover}
        alt=""
        aria-hidden
        className={`invisible absolute inset-0 block size-full ${
          menu
            ? "group-hover/menu:visible group-has-[:focus-visible]/menu:visible"
            : "group-hover:visible"
        }`}
      />
    </span>
  );
}

// Hover всех кнопок по Figma: заливка red, светлая обводка, многослойная тень.
const BTN_BASE =
  "group flex cursor-pointer items-center gap-[8px] transition-[background-color,color,box-shadow] duration-200";
const HOVER_RED = "hover:bg-red hover:text-back-card-gray";

/** btn: белая заливка, обводка blue, px 24 / py 14, высота 44. */
export function OutlineBtn({
  children,
  icon = "/figma/bbs/arrow-btn-blue.svg",
  hoverIcon = "/figma/bbs/arrow-btn-hover.svg",
  className = "",
  href = "#",
  newTab = false,
}: {
  children: React.ReactNode;
  icon?: string;
  hoverIcon?: string;
  className?: string;
  href?: string;
  /** Внешняя ссылка (карта и т. п.) — в новой вкладке. */
  newTab?: boolean;
}) {
  return (
    <a
      href={href}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={`${BTN_BASE} shrink-0 bg-white px-[24px] py-[14px] ${H4_BTN} text-blue shadow-[inset_0_0_0_1px_var(--color-blue)] ${HOVER_RED} hover:shadow-[inset_0_0_0_1px_var(--color-light-gray),var(--lift)] ${className}`}
    >
      <span className="text-trim whitespace-nowrap">{children}</span>
      <SwapIcon src={icon} hover={hoverIcon} />
    </a>
  );
}

/** Main_cta: заливка blue, px 24 / py 16, высота 48 (btn с заливкой — py 14). */
export function PrimaryBtn({
  children,
  icon = "/figma/bbs/arrow-cta-white.svg",
  hoverIcon,
  className = "",
  py = 16,
  type = "button",
  href,
  disabled,
  loading = false,
}: {
  children: React.ReactNode;
  icon?: string;
  /** По умолчанию: для стрелки — залитая, для остальных иконок — та же. */
  hoverIcon?: string;
  className?: string;
  py?: 14 | 16;
  type?: "button" | "submit";
  /** Если задан — кнопка рендерится ссылкой. */
  href?: string;
  /** Форма отправляется — кнопка неактивна. */
  disabled?: boolean;
  /** Идёт запрос — вместо иконки крутится индикатор. */
  loading?: boolean;
}) {
  const hover =
    hoverIcon ??
    (icon === "/figma/bbs/arrow-cta-white.svg"
      ? "/figma/bbs/arrow-cta-hover.svg"
      : icon);
  const cls = `${BTN_BASE} justify-center bg-blue px-[24px] ${
    py === 14
      ? "py-[14px] hover:shadow-[inset_0_0_0_1px_var(--color-back-card-gray),var(--lift)]"
      : "py-[16px] hover:shadow-[inset_0_0_0_1px_#ffffff,var(--lift)]"
  } ${H4_BTN} text-white shadow-[inset_0_0_0_1px_var(--color-blue)] hover:bg-red ${className}`;
  const content = (
    <>
      <span className="text-trim whitespace-nowrap">{children}</span>
      {loading ? (
        <svg viewBox="0 0 16 16" aria-hidden className="size-[16px] shrink-0 animate-spin motion-reduce:animate-none">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M8 1.5A6.5 6.5 0 0 1 14.5 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <SwapIcon src={icon} hover={hover} />
      )}
    </>
  );
  // Ссылка на якорь (#lead-form) — обычный <a>: Link на тот же адрес с тем же
  // хешем повторно не прокручивает, и кнопка «никуда не шла» со второго клика.
  if (href?.includes("#")) {
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${cls} disabled:cursor-wait disabled:opacity-60 disabled:hover:bg-blue disabled:hover:shadow-[inset_0_0_0_1px_var(--color-blue)]`}
    >
      {content}
    </button>
  );
}

/** Main_cta без заливки (на фото героя): светлая обводка, на hover — red. */
export function GhostBtn({
  children,
  icon,
  hoverIcon,
  href = "#",
  className = "",
}: {
  children: React.ReactNode;
  icon: string;
  hoverIcon?: string;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`${BTN_BASE} shrink-0 px-[24px] py-[16px] ${H4_BTN} text-white shadow-[inset_0_0_0_1px_var(--color-light-gray)] hover:bg-red hover:shadow-[inset_0_0_0_1px_#ffffff,var(--lift)] ${className}`}
    >
      <span className="text-trim whitespace-nowrap">{children}</span>
      <SwapIcon src={icon} hover={hoverIcon ?? icon} />
    </a>
  );
}

/** Подчёркнутая ссылка со стрелкой, py 16. На hover — semibold red, стрелка залитая. */
export function TextLink({
  children,
  weight = "light",
  underline = true,
  href = "#",
  stretched = false,
}: {
  children: React.ReactNode;
  weight?: "light" | "semibold";
  underline?: boolean;
  href?: string;
  /** Кликабельна вся карточка: ::after ссылки растягивается на ближайший relative-предок. */
  stretched?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group flex shrink-0 items-start gap-[8px] py-[16px] ${
        weight === "light" ? H4_L : H4_BTN
      } text-blue hover:font-semibold hover:text-red ${
        stretched ? "after:absolute after:inset-0 after:content-['']" : ""
      }`}
    >
      <span
        className={`text-trim whitespace-nowrap ${
          underline
            ? "underline decoration-solid [text-underline-position:from-font]"
            : ""
        }`}
      >
        {children}
      </span>
      <SwapIcon
        src="/figma/bbs/arrow-link-blue.svg"
        hover="/figma/bbs/arrow-link-hover.svg"
      />
    </a>
  );
}

/** Шапка секции: заголовок H2 слева, кнопка справа. */
export function SectionHeader({
  title,
  action,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className={`text-trim whitespace-nowrap ${H2_SB} text-ink`}>
        {title}
      </h2>
      {action}
    </div>
  );
}

/** Подзаголовок секции с тонкой линией снизу (H3 light, card-gray). */
export function SectionLead({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-full items-start"
      style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
    >
      <p className={`text-trim ${H3_L} text-card-gray`}>{children}</p>
    </div>
  );
}

/**
 * Frame 4590: табы с подчёркиванием активного. Каждый таб держит ширину своей
 * жирной версии (невидимая копия), поэтому при переключении ряд не прыгает.
 * В Figma неактивным табам заданы фиксированные ширины, но они не совпадают
 * с жирным текстом, и «Опис» сдвигался на 7px. С `onSelect` табы — кнопки.
 */
export function Tabs({
  items,
  active = 0,
  onSelect,
}: {
  items: { label: string }[];
  active?: number;
  onSelect?: (index: number) => void;
}) {
  return (
    <div
      className="flex w-full items-start gap-[24px]"
      style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
      role={onSelect ? "tablist" : undefined}
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = onSelect ? "button" : "div";
        return (
          <Tag
            key={item.label}
            {...(onSelect
              ? {
                  type: "button" as const,
                  role: "tab",
                  "aria-selected": isActive,
                  onClick: () => onSelect(i),
                }
              : {})}
            className={`flex shrink-0 items-center pb-[8px] ${onSelect && !isActive ? "cursor-pointer" : ""}`}
            style={{
              boxShadow: isActive
                ? "inset 0 -1px 0 var(--color-blue)"
                : undefined,
            }}
          >
            <span className="grid">
              <span
                aria-hidden
                className={`text-trim invisible col-start-1 row-start-1 whitespace-nowrap ${H3_SB}`}
              >
                {item.label}
              </span>
              <span
                className={`text-trim col-start-1 row-start-1 whitespace-nowrap ${
                  isActive ? `${H3_SB} text-blue` : `${H3_L} text-card-gray`
                }`}
              >
                {item.label}
              </span>
            </span>
          </Tag>
        );
      })}
    </div>
  );
}

/** Куда ведут промежуточные пункты хлебных крошек. */
const CRUMB_HREF: Record<string, string> = {
  Головна: "/",
  Каталог: "/kataloh/",
  Laminam: "/laminam/",
  Публікації: "/blog/",
  "Вироби на замовлення": "/proekty/",
  // Родители подборок каталога (крошки из getCatalogSeo).
  "Каталог керамограніту": "/kataloh/keramogranit/",
  "Каталог кварцового каменю": "/kataloh/kvartsovyi-kamin/",
  Стільниці: "/kataloh/stilnytsi/",
  "Кухонні фартухи": "/kataloh/kukhonni-fartukhy/",
  Підвіконня: "/kataloh/pidvikonnia/",
  Умивальники: "/kataloh/umyvalnyky/",
  Каміни: "/kataloh/kaminy/",
};

/**
 * Хлебные крошки: py 16 (высота 48), стрелки 16px, gap 8.
 * На фото (light): предыдущие пункты light #c5c5c5, текущий — белый semibold.
 * На белом (dark): все semibold, предыдущие #c5c5c5, текущий — blue.
 * Стрелка перед текущим пунктом — цвета текущего, остальные — серые.
 */
export function Breadcrumbs({
  items,
  tone = "light",
  wrap = false,
}: {
  items: string[];
  tone?: "light" | "dark";
  /** Мобильная версия: длинные крошки переносятся, стрелка — вместе с пунктом. */
  wrap?: boolean;
}) {
  const last = items.length - 1;
  const muted = `${tone === "light" ? H4_L : H4_BTN} text-caption-gray`;
  const current = `${H4_BTN} ${tone === "light" ? "text-white" : "text-blue"}`;
  const currentArrow =
    tone === "light"
      ? "/figma/bbs/breadcrumb-arrow-light.svg"
      : "/figma/bbs/breadcrumb-arrow-blue.svg";
  return (
    <nav
      className={`flex items-center gap-[8px] ${wrap ? "flex-wrap" : "py-[16px]"}`}
    >
      {items.map((item, i) => (
        <span
          key={item}
          className={
            !wrap
              ? "contents"
              : i === last
                ? "flex min-w-0 items-start gap-[8px]"
                : "flex items-center gap-[8px]"
          }
        >
          {i > 0 && (
            <Icon
              src={
                i === last
                  ? currentArrow
                  : "/figma/bbs/breadcrumb-arrow-muted.svg"
              }
              // Длинный текущий пункт в wrap переносится: стрелка — по центру
              // первой строки (cap 11.6px против иконки 16px).
              className={wrap && i === last ? "-mt-[2px]" : ""}
            />
          )}
          {i === last ? (
            <span
              aria-current="page"
              className={`text-trim ${wrap ? "min-w-0" : "whitespace-nowrap"} ${current}`}
            >
              {item}
            </span>
          ) : (
            <Link
              href={CRUMB_HREF[item] ?? "#"}
              className={`text-trim whitespace-nowrap ${muted} transition-colors ${
                tone === "dark" ? "hover:text-blue" : "hover:text-white"
              }`}
            >
              {item}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
