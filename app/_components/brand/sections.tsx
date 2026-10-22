// Десктопные блоки страницы бренда (Laminam /laminam/, Vicostone /vicostone/).
// Вёрстка — из макета Laminam; тексты и данные приходят пропсами со страницы бренда.

import { getPopularDecors } from "@/app/_lib/catalog";
import { getProjects } from "@/app/_lib/content";

import { DecorCard, ProjectCardWide, TypeTile, type TileIcon } from "../bbs/cards";
import { H3_L, H3_SB, Icon, OutlineBtn, SectionHeader, inset } from "../bbs/ui";

export type Brand = "laminam" | "vicostone";

/** Вкладки getPopularDecors() идут в этом порядке. */
const DECOR_TAB: Record<Brand, number> = { laminam: 0, vicostone: 1 };

/** Четыре популярных декора бренда из базы (порядок «Популярні»). */
export async function BrandDecors({
  brand,
  title,
  catalog,
}: {
  brand: Brand;
  title: string;
  /** Каталог бренда — «Переглянути весь каталог». */
  catalog: string;
}) {
  const decors = (await getPopularDecors())[DECOR_TAB[brand]];
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title={title}
        action={<OutlineBtn href={catalog}>Переглянути весь каталог</OutlineBtn>}
      />
      <div className="flex w-full items-center gap-[24px]">
        {decors.map((d) => (
          <DecorCard
            key={d.href}
            name={d.name.toUpperCase()}
            brand={d.brand}
            image={d.image}
            href={d.href}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * «Про бренд»: панель в стиле карточки брендов главной (BrandsPanel) —
 * light_gray с обводкой back_card_gray, логотип и текст H3_L через синюю линию 2px.
 */
export function BrandAbout({
  title,
  text,
  logo,
}: {
  title: string;
  text: string;
  logo: React.ReactNode;
}) {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader title={title} />
      <div
        className="flex w-full items-stretch gap-[40px] bg-light-gray px-[71px] py-[32px]"
        style={inset("var(--color-back-card-gray)")}
      >
        {/* Логотип по центру высоты текста — без пустоты под ним. */}
        <div className="flex shrink-0 items-center">{logo}</div>
        <div className="w-[2px] shrink-0 self-stretch bg-blue" />
        <p className={`text-trim min-w-px flex-1 ${H3_L} text-card-gray`}>{text}</p>
      </div>
    </section>
  );
}

export type BrandTile = { icon: TileIcon; label: string };

/**
 * Применения: список из SEO-таблицы и/или плитки 167 × 167, ведущие в каталог
 * бренда с ?application=. У Laminam одна секция со списком и плитками,
 * у Vicostone — две (список и «Виготовлення виробів»).
 */
export function BrandApplications({
  title,
  uses,
  tiles,
  catalog,
  action = true,
}: {
  title: string;
  uses?: string[];
  tiles?: BrandTile[];
  catalog: string;
  /** Кнопка «Перейти до каталогу» в шапке секции. */
  action?: boolean;
}) {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title={title}
        action={action && <OutlineBtn href={catalog}>Перейти до каталогу</OutlineBtn>}
      />
      {/* Список из таблицы — пункты как этапы «Співпраця» главной: линия сверху, H3_L.
          Линия back_card_gray: light_gray на белом без номеров не читается. */}
      {uses && (
        <ul className="grid w-full grid-cols-3 gap-x-[24px] gap-y-[24px]">
          {uses.map((use) => (
            <li
              key={use}
              className="flex flex-col items-start pt-[24px]"
              style={{ boxShadow: "inset 0 1px 0 var(--color-back-card-gray)" }}
            >
              <span className={`text-trim ${H3_L} text-ink`}>{use}</span>
            </li>
          ))}
        </ul>
      )}
      {/* 6 × 167 + 5 × 24 = 1122: в макете ряд выходит за колонку на 2px. */}
      {tiles && (
        <div className={`${uses ? "mt-[16px] " : ""}flex w-full items-start gap-[24px]`}>
          {tiles.map((item) => (
            <TypeTile key={item.label} icon={item.icon} label={item.label} catalog={catalog} />
          ))}
        </div>
      )}
    </section>
  );
}

export type BrandSpec = { format: string; thickness: string };

/**
 * Таблица «формат — товщина» в стиле таблицы сравнения главной: линии blue 1px,
 * колонка подписей light_gray 382px (px 71), значения на белом, py 24, H3_SB.
 * Линии рисует подложка: ячейки через 1px на синем фоне.
 */
export function BrandSpecs({
  title,
  lead,
  rows,
}: {
  title: string;
  lead: string;
  rows: BrandSpec[];
}) {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader title={title} />
      <p className={`text-trim w-full ${H3_L} text-card-gray`}>{lead}</p>
      <dl className="grid w-full grid-cols-[382px_1fr] gap-px bg-blue p-px">
        {rows.map((s) => (
          <div key={s.format} className="contents">
            <dt className="flex items-center bg-light-gray px-[71px] py-[24px]">
              <p className={`text-trim whitespace-nowrap ${H3_SB} text-ink tabular-nums`}>
                {s.format}
              </p>
            </dt>
            <dd className="flex items-center bg-white px-[24px] py-[24px]">
              <p className={`text-trim ${H3_SB} text-ink tabular-nums`}>{s.thickness}</p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Пункт «Чому обирають …»: иконка из /figma/bbs (на мобилке — из /figma/mobile). */
export type BrandWhyItem = { icon: string; title: string };

/** «Чому обирають … у BBS»: колонки как у фактов главной — иконка 48, H3_SB. */
export function BrandWhy({ title, items }: { title: string; items: BrandWhyItem[] }) {
  return (
    <section className="flex w-full flex-col items-start gap-[40px]">
      <SectionHeader title={title} />
      <ul className="flex w-full items-start gap-[24px]">
        {items.map((item) => (
          <li key={item.icon} className="flex min-w-px flex-1 flex-col items-center gap-[12px]">
            <Icon src={`/figma/bbs/${item.icon}.svg`} size={48} />
            <p className={`text-trim w-full text-center ${H3_SB} text-ink`}>{item.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Два проекта с материалами бренда (карточки 548 из макета, ведут на изделие). */
export async function BrandProjects({ brand, title }: { brand: Brand; title: string }) {
  const projects = await getProjects(2, brand);
  if (projects.length === 0) return null;
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title={title}
        action={<OutlineBtn href="/proekty/">Переглянути усі проєкти</OutlineBtn>}
      />
      <div className="flex w-full items-start gap-[24px]">
        {projects.map((p) => (
          <ProjectCardWide key={p.href} {...p} />
        ))}
      </div>
    </section>
  );
}
