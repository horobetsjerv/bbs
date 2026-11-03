// Мобильные блоки страницы бренда (Laminam, Vicostone): вёрстка из макета
// ui-mobile-main-laminam, тексты и данные — пропсами со страницы бренда.

import { getPopularDecors } from "@/app/_lib/catalog";
import { getProjects } from "@/app/_lib/content";

import { TypeTile } from "../bbs/cards";
import { MOB_L, MOB_SB, inset } from "../bbs/ui";
import type { Brand, BrandSpec, BrandTile, BrandWhyItem } from "../brand/sections";
import {
  MCarousel,
  MDecorCard,
  MIconRow,
  MOutlineBtn,
  MProjectSmallCard,
  MSection,
  MTitle,
} from "./ui";

/** Вкладки getPopularDecors() идут в этом порядке. */
const DECOR_TAB: Record<Brand, number> = { laminam: 0, vicostone: 1 };

/** Популярные декоры бренда лентой + «Переглянути весь каталог». */
export async function MBrandDecors({
  brand,
  title,
  catalog,
}: {
  brand: Brand;
  title: string;
  catalog: string;
}) {
  const decors = (await getPopularDecors())[DECOR_TAB[brand]];
  return (
    <MSection>
      <MTitle>{title}</MTitle>
      <div className="flex w-full flex-col items-start gap-[32px]">
        <MCarousel>
          {decors.map((d) => (
            <MDecorCard
              key={d.href}
              name={d.name.toUpperCase()}
              brand={d.brand}
              image={d.image}
              href={d.href}
            />
          ))}
        </MCarousel>
        <MOutlineBtn href={catalog}>Переглянути весь каталог</MOutlineBtn>
      </div>
    </MSection>
  );
}

/** «Про бренд»: карточка как у брендов мобильной главной — логотип и текст на light_gray. */
export function MBrandAbout({
  title,
  text,
  logo,
}: {
  title: string;
  text: string;
  logo: React.ReactNode;
}) {
  return (
    <MSection>
      <MTitle>{title}</MTitle>
      <div
        className="flex w-full flex-col items-start gap-[12px] bg-light-gray p-[16px]"
        style={inset("var(--color-back-card-gray)")}
      >
        {logo}
        <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{text}</p>
      </div>
    </MSection>
  );
}

/** Применения: список из таблицы (как этапы «Співпраця») и/или плитки 2 в ряд. */
export function MBrandApplications({
  title,
  uses,
  tiles,
  catalog,
}: {
  title: string;
  uses?: string[];
  tiles?: BrandTile[];
  catalog: string;
}) {
  return (
    <MSection bg="light">
      <MTitle>{title}</MTitle>
      {uses && (
        <ul className="flex w-full flex-col items-start">
          {uses.map((use) => (
            <li
              key={use}
              className="flex w-full items-start py-[16px]"
              // На light_gray фоне линия light_gray не видна — back_card_gray.
              style={{ boxShadow: "inset 0 1px 0 var(--color-back-card-gray)" }}
            >
              <span className={`text-trim min-w-px flex-1 ${MOB_L} text-ink`}>{use}</span>
            </li>
          ))}
        </ul>
      )}
      {tiles && (
        <div className="grid w-full grid-cols-2 gap-[8px]">
          {tiles.map((t) => (
            <TypeTile key={t.label} icon={t.icon} label={t.label} catalog={catalog} compact />
          ))}
        </div>
      )}
    </MSection>
  );
}

/** «Технічні характеристики»: таблица формат — товщина, линии blue (подложка через 1px). */
export function MBrandSpecs({
  title,
  lead,
  rows,
}: {
  title: string;
  lead: string;
  rows: BrandSpec[];
}) {
  return (
    <MSection>
      <MTitle>{title}</MTitle>
      <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{lead}</p>
      <dl className="grid w-full grid-cols-2 gap-px bg-blue p-px">
        {rows.map((s) => (
          <div key={s.format} className="contents">
            <dt className="flex items-center bg-light-gray p-[16px]">
              <p className={`text-trim ${MOB_SB} text-ink tabular-nums`}>{s.format}</p>
            </dt>
            <dd className="flex items-center bg-white p-[16px]">
              <p className={`text-trim ${MOB_SB} text-ink tabular-nums`}>{s.thickness}</p>
            </dd>
          </div>
        ))}
      </dl>
    </MSection>
  );
}

// Иконки мобильного набора; кисти в нём нет — берётся десктопная (как у фактов главной).
const whyIcon = (icon: string) =>
  icon === "brush" ? "/figma/bbs/brush.svg" : `/figma/mobile/${icon}.svg`;

/** «Чому обирають … у BBS»: строки «иконка 32 + текст». */
export function MBrandWhy({ title, items }: { title: string; items: BrandWhyItem[] }) {
  return (
    <MSection>
      <MTitle>{title}</MTitle>
      <div className="flex w-full flex-col items-start gap-[16px]">
        {items.map((w) => (
          <MIconRow key={w.icon} icon={whyIcon(w.icon)} title={w.title} />
        ))}
      </div>
    </MSection>
  );
}

/** Проекты с материалами бренда лентой + «Переглянути усі проєкти». */
export async function MBrandProjects({ brand, title }: { brand: Brand; title: string }) {
  const projects = await getProjects(6, brand);
  if (projects.length === 0) return null;
  return (
    <MSection bg="light" gap={32}>
      <div className="flex w-full flex-col items-start gap-[24px]">
        <MTitle>{title}</MTitle>
        <MCarousel>
          {projects.map((p) => (
            <MProjectSmallCard key={p.href} {...p} />
          ))}
        </MCarousel>
      </div>
      <MOutlineBtn href="/proekty/">Переглянути усі проєкти</MOutlineBtn>
    </MSection>
  );
}
