/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { catalogHref, typeSelection, type StoneType } from "@/app/_lib/catalog-url";

import { CAPTION, H3_L, H3_SB, H4_L, MOB_SB, ONE_LINE, SwapIcon, TextLink, inset } from "./ui";

/** Card (декор): 262 × 374, фото 304, подписи H3 sb / H3 l, pb 8. */
export function DecorCard({
  name = "AVORIO",
  brand = "Laminam",
  image = "/figma/bbs/decor-card.png",
  imageHeight = 304,
  width = 262,
  href = "#",
}: {
  name?: string;
  brand?: string;
  image?: string | null;
  imageHeight?: number;
  width?: number;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="flex shrink-0 flex-col items-center gap-[24px] bg-white pb-[8px]"
      style={{ width: `${width}px`, ...inset("var(--color-light-gray)") }}
    >
      <div
        className="relative w-full shrink-0 bg-[#d9d9d9]"
        style={{ height: `${imageHeight}px` }}
      >
        {image && (
          <img
            loading="lazy"
            src={image}
            alt={name}
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[8px] px-[16px]">
        <p className={`text-trim w-full ${H3_SB} text-ink`}>{name}</p>
        <p className={`text-trim w-full ${H3_L} text-card-gray`}>{brand}</p>
      </div>
    </Link>
  );
}

/** Card каталога: фото 304, название, коллекция и фактура (всё ink), pb 8. */
export function CatalogCard({
  name,
  collection,
  texture,
  image,
  href = "#",
}: {
  name: string;
  collection: string;
  texture: string;
  image: string | null;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="group flex w-[262px] shrink-0 flex-col items-center gap-[24px] bg-white pb-[8px]"
      style={inset("var(--color-light-gray)")}
    >
      <div className="relative h-[304px] w-full shrink-0 overflow-hidden bg-[#d9d9d9]">
        {image && (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="absolute inset-0 size-full max-w-none object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
        )}
      </div>
      {/* Название и коллекция капсом — так в макете (AVORIO / BLEND). */}
      <div className="flex w-full flex-col items-start gap-[8px] px-[16px] text-ink">
        <p className={`text-trim w-full uppercase ${H3_SB}`}>{name}</p>
        <p className={`text-trim w-full uppercase ${H3_L}`}>{collection}</p>
        <p className={`text-trim w-full ${H4_L}`}>{texture}</p>
      </div>
    </a>
  );
}

/** Серая плашка-тег: px 8 / py 9, подпись 14. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex shrink-0 items-start bg-back-card-gray px-[8px] py-[9px]">
      <span className={`text-trim whitespace-nowrap ${CAPTION} text-card-gray`}>
        {children}
      </span>
    </span>
  );
}

/** card_project: фото 200, заголовок, теги, ссылка «Детальніше». */
export function ProjectCard({
  title,
  subtitle,
  tags,
  image,
  width = 262,
  imageHeight = 200,
  href = "#",
}: {
  title: string;
  subtitle: string;
  tags: string[];
  image?: string;
  width?: number;
  imageHeight?: number;
  /** Куда ведёт «Детальніше». */
  href?: string;
}) {
  return (
    // relative: «Детальніше» растянута на всю карточку — открывается кликом в любом месте.
    <div
      className="relative flex shrink-0 flex-col items-center gap-[24px] bg-white"
      style={{ width: `${width}px`, ...inset("var(--color-light-gray)") }}
    >
      <div
        className="relative w-full shrink-0 bg-[#d9d9d9]"
        style={{ height: `${imageHeight}px` }}
      >
        {image && (
          <img
            loading="lazy"
            src={image}
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      {/* flex-1 + mt-auto: в ряду карточки одной высоты, «Детальніше» внизу. */}
      <div className="flex w-full flex-1 flex-col items-start gap-[24px] px-[16px]">
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className={`text-trim w-full ${ONE_LINE} ${H3_SB} text-ink`} title={title}>
            {title}
          </p>
          <p className={`text-trim w-full ${ONE_LINE} ${H3_L} text-card-gray`}>
            {subtitle}
          </p>
        </div>
        <div className="flex w-full items-center gap-[8px]">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <div className="mt-auto">
          <TextLink underline={false} href={href} stretched>
            Детальніше
          </TextLink>
        </div>
      </div>
    </div>
  );
}

/** card_project 548: фото 200, заголовок, теги; вся карточка — ссылка на изделие. */
export function ProjectCardWide({
  title,
  tags,
  image,
  href,
}: {
  title: string;
  tags: string[];
  image?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex w-[548px] shrink-0 flex-col items-center gap-[24px] bg-white pb-[16px]"
      style={inset("var(--color-light-gray)")}
    >
      <div className="relative h-[200px] w-full shrink-0 bg-[#d9d9d9]">
        {image && (
          <img
            loading="lazy"
            src={image}
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[24px] px-[16px]">
        <p className={`text-trim w-full ${ONE_LINE} ${H3_SB} text-ink`} title={title}>
          {title}
        </p>
        <div className="flex w-full items-center gap-[8px]">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}

/** Иконки плиток: базовое имя файла, у каждой есть `-red` копия для hover. */
const TILE_ICONS = {
  kitchen: "app-fork-spoon",
  countertop: "app-table",
  floor: "app-floor-plane",
  wall: "app-wall",
  facade: "app-brick",
  stairs: "app-stairs",
  furniture: "app-sink",
} as const;

export type TileIcon = keyof typeof TILE_ICONS;

/** slug применения в базе для каждой плитки (фильтр каталога ?application=…). */
export const TILE_APPLICATION: Record<TileIcon, string> = {
  kitchen: "ostrovy-kukhonni",
  countertop: "stilnytsi",
  floor: "pidloha",
  wall: "stiny",
  facade: "fasad",
  stairs: "skhody",
  furniture: "kukhonni-mebli-fasady",
};

/**
 * Фильтры плитки в едином каталоге — такие, чтобы catalogHref вёл на
 * статичный адрес подборки, а не на ?application=…: «Стільниці» — виріб
 * (/kataloh/stilnytsi/), «Підлога» и «Стіни» в базе только у керамограніту
 * (/kataloh/keramogranit-dlia-pidlohy/), «Сходи» — /kataloh/skhody/.
 * Тип каменя плитки (`type`) заменяет тип из выбора.
 */
const TILE_SELECTION: Record<TileIcon, Record<string, string[]>> = {
  kitchen: { application: ["ostrovy-kukhonni"] },
  countertop: { product: ["stilnytsi"] },
  floor: { application: ["pidloha"], type: ["keramohranit"] },
  wall: { application: ["stiny"], type: ["keramohranit"] },
  facade: { application: ["fasad"] },
  stairs: { application: ["skhody"] },
  furniture: { application: ["kukhonni-mebli-fasady"] },
};

function TileIconImg({ name }: { name: TileIcon }) {
  const file = TILE_ICONS[name];
  const src = `/figma/bbs/${file}.svg`;
  const hover = `/figma/bbs/${file}-red.svg`;
  if (name !== "floor") return <SwapIcon src={src} hover={hover} size={48} />;
  // at-icons:floor-plane — группа с отступами внутри бокса 48px, как в Figma.
  return (
    <span className="relative block size-[48px] shrink-0 overflow-clip">
      <span className="absolute inset-[0.01%_1.93%_6.25%_1.93%]">
        <img
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 block size-full max-w-none group-hover:invisible"
        />
        <img
          src={hover}
          alt=""
          aria-hidden
          className="invisible absolute inset-0 block size-full max-w-none group-hover:visible"
        />
      </span>
    </span>
  );
}

/**
 * btn_vybir: плитка 167 × 167 с иконкой 48 и подписью H3 sb.
 * Hover (Figma Variant2): фон — градиент с фото, иконка red, подпись card-gray, тень.
 */
export function TypeTile({
  icon,
  label,
  size = 167,
  type,
  catalog,
  compact = false,
}: {
  icon: TileIcon;
  label: string;
  size?: number;
  /**
   * Тип каменя: плитка открывает каталог с ним и применением (подборка
   * /kataloh/keramogranit-dlia-fasadiv/, если такая есть). Без типа — все материалы.
   */
  type?: StoneType;
  /** Свой каталог (каталог Laminam): плитка открывает его с ?application=. */
  catalog?: string;
  /** Мобильная сетка: по ширине колонки (167.5 × 167 в макете), gap 12, подпись 16mob_sb. */
  compact?: boolean;
}) {
  return (
    <a
      href={
        catalog
          ? `${catalog}?application=${TILE_APPLICATION[icon]}`
          : catalogHref({ ...TILE_SELECTION[icon], ...(type ? typeSelection(type) : {}) })
      }
      className={`group relative flex shrink-0 flex-col items-center justify-center bg-white shadow-[inset_0_0_0_1px_var(--color-light-gray)] transition-shadow duration-200 hover:shadow-[var(--lift)] ${
        compact ? "aspect-[167.5/167] w-full gap-[12px]" : "gap-[24px]"
      }`}
      style={compact ? undefined : { width: size, height: size }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(-11.99deg, var(--color-card-gray) 1.8969%, #ffffff 83.882%)",
        }}
      >
        <img
          loading="lazy"
          src="/figma/bbs/tile-hover-bg.webp"
          alt=""
          className="absolute inset-0 size-full max-w-none object-fill"
        />
      </span>
      {/* Мобильный btn_vybir в Figma отражён по горизонтали (подпись — обратно),
          поэтому иконки зеркальные; у «Сходи» отражение двойное — как есть. */}
      <span className={`relative ${compact && icon !== "stairs" ? "-scale-x-100" : ""}`}>
        <TileIconImg name={icon} />
      </span>
      <p
        className={`text-trim relative w-full text-center ${compact ? MOB_SB : H3_SB} text-[#171616] transition-colors duration-200 group-hover:text-card-gray`}
      >
        {label}
      </p>
    </a>
  );
}
