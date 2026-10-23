/* eslint-disable @next/next/no-img-element */
// Страница товара / изделия. Один шаблон на два фрейма Figma:
// UI_desktop_Card (1039:4357) и UI_desktop_VYRIb Card (1039:7133).
// Товар: галерея 548px, блок характеристик 453.136px. Изделие: галерея
// на всю колонку 1120px, под ней строки + «Запитати ціну» и консультация.

import Page from "../bbs/Page";
import type { CatalogCardData } from "@/app/_lib/catalog";
import { catalogHref } from "@/app/_lib/catalog-url";
import type { ProjectCardData } from "@/app/_lib/content";

import { CatalogCard, ProjectCard } from "../bbs/cards";
import { Breadcrumbs, H2_SB, H3_L, H3_SB, H4_L, HOVER_EASE, Icon, LINE_FILL, MOB_L, MOB_SB, OutlineBtn, PrimaryBtn, inset } from "../bbs/ui";
import ProductDetails from "./ProductDetails";
import ProductGallery, { type GalleryImage } from "./ProductGallery";
import MobileProduct from "../mobile/Product";
import JsonLd from "../seo/JsonLd";

const LIGHT = "var(--color-light-gray)";

/** Плитки применений: иконка и короткая подпись по slug из базы. */
export const TILES: Record<string, { icon: string; label: string; floor?: boolean }> =
  {
    fasad: { icon: "app-brick", label: "Фасади" },
    "kukhonni-mebli-fasady": { icon: "app-sink", label: "Меблі" },
    stilnytsi: { icon: "app-table", label: "Стільниці" },
    stiny: { icon: "app-wall", label: "Стіни" },
    pidloha: { icon: "app-floor-plane", label: "Підлога", floor: true },
    skhody: { icon: "app-stairs", label: "Сходи" },
    "ostrovy-kukhonni": { icon: "app-fork-spoon", label: "Острови" },
  };

/**
 * btn_vybir 62px: иконка 27.3, подпись 9.1px, обводка 0.569px.
 * `mirror` — мобильный макет: плитка там отражена по горизонтали (подпись
 * обратно), иконки зеркальные; у «Сходи» отражение двойное — как есть.
 */
export function UsageTile({ slug, mirror = false }: { slug: string; mirror?: boolean }) {
  const tile = TILES[slug];
  const src = `/figma/bbs/${tile.icon}.svg`;
  const flip = mirror && slug !== "skhody" ? "-scale-x-100" : "";
  return (
    <a
      href={catalogHref({ application: [slug] })}
      className="flex size-[62px] shrink-0 flex-col items-center justify-center gap-[8px] bg-white transition-shadow duration-250 ease-out hover:shadow-[var(--lift)]"
      style={{ boxShadow: `inset 0 0 0 0.569px ${LIGHT}` }}
    >
      {tile.floor ? (
        // at-icons:floor-plane — группа с отступами внутри бокса, как в Figma.
        <div className={`relative size-[27.303px] shrink-0 overflow-clip ${flip}`}>
          <div className="absolute inset-[0.01%_1.93%_6.25%_1.93%]">
            <img
              src={src}
              alt=""
              aria-hidden
              className="absolute inset-0 block size-full max-w-none"
            />
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt=""
          aria-hidden
          className={`block size-[27.303px] shrink-0 ${flip}`}
        />
      )}
      <p className="text-trim w-full text-center text-[9.1px] font-semibold leading-[9.101px] tracking-[-0.455px] text-ink">
        {tile.label}
      </p>
    </a>
  );
}

/**
 * Строка характеристики: название слева, значения в рамках справа.
 * В макете значение одно; у товаров из базы их бывает 2–3 — тогда рамки
 * компактнее (px 16 / py 12), чтобы строка осталась одной, как в макете.
 */
function SpecRow({ label, values }: { label: string; values: string[] }) {
  const many = values.length > 1;
  return (
    <div className="flex w-full items-center justify-between gap-[16px]">
      {/* shrink-0: иначе подпись сжимается и text-balance из Page её переносит. */}
      <p className={`text-trim shrink-0 whitespace-nowrap ${MOB_L} text-ink`}>{label}</p>
      <div className="flex min-w-0 flex-wrap justify-end gap-[8px]">
        {values.map((v) => (
          <div
            key={v}
            className={`flex items-start ${many ? "px-[16px] py-[12px]" : "px-[24px] py-[16px]"}`}
            style={inset(LIGHT)}
          >
            <p className={`text-trim whitespace-nowrap ${MOB_SB} text-ink`}>
              {v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Строка без рамки: название light, значение semibold, по краям. Длинное значение переносится справа. */
function InfoRow({ label, value, href }: InfoRowData) {
  return (
    <div className="flex w-full items-center justify-between gap-[16px] text-ink">
      <p className={`text-trim shrink-0 whitespace-nowrap ${MOB_L}`}>{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group text-trim text-right ${MOB_SB} text-blue transition-colors ${HOVER_EASE} hover:text-red ${LINE_FILL}`}
        >
          {value}
        </a>
      ) : (
        <p className={`text-trim text-right ${MOB_SB}`}>{value}</p>
      )}
    </div>
  );
}

/** Строка «название / значение»; с href значение — внешняя ссылка (автор проекта). */
export type InfoRowData = { label: string; value: string; href?: string };

export const SERVICES = [
  {
    icon: "/figma/bbs/samples.svg",
    title: "Замовити зразок",
    text: "Безкоштовно",
    lead: "sample_order",
  },
  {
    icon: "/figma/bbs/support.svg",
    title: "Запитати ціну",
    text: "Швидка відповідь",
    lead: "price_request",
  },
  {
    icon: "/figma/product/download.svg",
    title: "Завантажити специфікацію(PDF)",
    pdf: true,
  },
];

export type ProductPageProps = {
  variant: "material" | "item";
  breadcrumb: string[];
  title: string;
  /** Бренд слева от названия (LAMINAM). */
  brand: string;
  images: GalleryImage[];
  /** Строки без рамки: колекція, країна; у изделия — материал и авторы. */
  info: InfoRowData[];
  /** Строки со значениями в рамках: розміри, товщини, фактура. */
  specs: { label: string; values: string[] }[];
  /** slug применений из базы — показываются те, для которых есть иконка. */
  applications: string[];
  /** Вкладка «Характеристики». */
  details: { label: string; value: string }[];
  description?: string | null;
  specPdfUrl?: string | null;
  /** Материал для заявки («Замовити зразок», «Запитати ціну»). */
  materialId?: number | null;
  consult: { title: string; text: string };
  /** Структурированные данные страницы (крошки, товар) — JSON-LD. */
  ld?: Record<string, unknown>[];
  similar: {
    title: string;
    button: string;
    href: string;
    cards?: CatalogCardData[];
    /** «Схожі вироби» у изделия — проекты из админки. */
    projects?: ProjectCardData[];
  };
};

export default function ProductPage(props: ProductPageProps) {
  const {
    variant,
    breadcrumb,
    title,
    brand,
    images,
    info,
    specs,
    applications,
    details,
    description,
    specPdfUrl,
    materialId,
    consult,
    similar,
  } = props;
  const item = variant === "item";
  const tiles = applications.filter((slug) => TILES[slug]);
  // Заявки принимает форма на главной; тип, материал и тема — в адресе.
  const leadHref = (lead?: string) => {
    const q = new URLSearchParams();
    if (lead) q.set("lead", lead);
    if (materialId) q.set("material", String(materialId));
    q.set("about", brand ? `${title} (${brand})` : title);
    return `/?${q}#lead-form`;
  };
  const service = (s: (typeof SERVICES)[number], className: string) => (
    <a
      key={s.title}
      href={s.pdf ? (specPdfUrl ?? "#") : leadHref(s.lead)}
      target={s.pdf && specPdfUrl ? "_blank" : undefined}
      className={`flex items-center gap-[8px] text-blue ${className}`}
      style={inset("var(--color-blue)")}
    >
      <Icon src={s.icon} size={48} />
      <span className="flex flex-col items-start justify-center gap-[8px] whitespace-nowrap">
        <span className="text-trim text-[16px] font-semibold leading-[16px] tracking-[-0.8px]">
          {s.title}
        </span>
        {s.text && <span className={`text-trim ${H4_L}`}>{s.text}</span>}
      </span>
    </a>
  );
  const consultCard = (
    <div
      className="flex w-[548px] shrink-0 flex-col items-start justify-center gap-[24px] bg-light-gray px-[71px] py-[32px]"
      style={inset("var(--color-back-card-gray)")}
    >
      <div className="flex w-full flex-col items-center gap-[24px]">
        <p className={`text-trim w-full ${H2_SB} text-ink`}>{consult.title}</p>
        <p className={`text-trim w-full ${H3_L} text-card-gray`}>{consult.text}</p>
      </div>
      <PrimaryBtn className="w-full" href={leadHref()}>
        Зв’язатися з нами
      </PrimaryBtn>
    </div>
  );
  const priceService = SERVICES.find((s) => s.lead === "price_request")!;

  return (
    // До подвала в макете 199px (товар) и 65px (изделие).
    <Page footerGap={item ? 65 : 199} mobile={<MobileProduct {...props} />}>
      {props.ld && <JsonLd data={props.ld} />}
      <div className="mt-[12px] flex w-[1120px] flex-col items-start">
        <Breadcrumbs items={breadcrumb} tone="dark" />

        <div
          className="mt-[16px] flex w-full flex-col items-start gap-[40px]"
          data-reveal
        >
          {item ? (
            <div className="flex w-full flex-col items-start gap-[24px]">
              <ProductGallery
                images={images}
                title={title}
                thumbsTop={278}
                lightRightArrow
                wide
              />
              <div className="flex w-full items-start gap-[24px]">
                <div className="flex min-w-px flex-1 flex-col items-start gap-[16px]">
                  {/* Единственный H1 страницы (таблица SEO): в макете названия
                      изделия на странице нет, кроме крошек — заголовок скрытый. */}
                  <h1 className="sr-only">{title}</h1>
                  {info.map((r) => (
                    <InfoRow key={r.label} {...r} />
                  ))}
                  <div className="flex w-full flex-col items-start px-[16px]">
                    {service(priceService, "w-full p-[16px]")}
                  </div>
                </div>
                {consultCard}
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-start gap-[24px]">
              {/* items-start: колонка характеристик бывает выше галереи — фото остаётся наверху. */}
              <div className="flex w-full items-start gap-[24px]">
                {/* Галерея: превью лежат поверх фото на y 298. */}
                <ProductGallery images={images} title={title} thumbsTop={298} />

                {/* Характеристики: 453px, строки «название / значение». */}
                <div className="flex w-[453px] shrink-0 flex-col items-start gap-[24px]">
                  {/* Длинное название переносится справа и не наезжает на бренд. */}
                  <div className="flex w-full items-start justify-between gap-[16px]">
                    <p className={`text-trim shrink-0 whitespace-nowrap uppercase ${H3_L} text-ink`}>
                      {brand}
                    </p>
                    {/* Единственный H1 страницы (таблица SEO): название товара. */}
                    <h1
                      className={`text-trim text-right ${H3_SB} text-ink`}
                    >
                      {title}
                    </h1>
                  </div>
                  {info.map((r) => (
                    <InfoRow key={r.label} label={r.label} value={r.value} />
                  ))}
                  {specs
                    .filter((r) => r.values.length > 0)
                    .map((r) => (
                      <SpecRow key={r.label} label={r.label} values={r.values} />
                    ))}

                  <div className="flex w-full flex-col items-start gap-[8px]">
                    <p
                      className={`text-trim whitespace-nowrap ${MOB_L} text-ink`}
                    >
                      Застосування
                    </p>
                    {/* В макете 5 плиток растянуты по ширине (шаг ≈36px). Меньше пяти —
                        тот же шаг слева; 6 — по ширине; 7 — перенос на вторую строку. */}
                    <div
                      className={`flex w-full ${
                        tiles.length < 5
                          ? "gap-[36px]"
                          : tiles.length <= 6
                            ? "justify-between"
                            : "flex-wrap gap-[8px]"
                      }`}
                    >
                      {tiles.map((slug) => (
                        <UsageTile key={slug} slug={slug} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Быстрые действия; без ссылки на PDF кнопки спецификации нет. */}
              <div className="flex w-full items-center gap-[24px]">
                {SERVICES.filter((s) => !s.pdf || specPdfUrl).map((s) =>
                  service(s, "min-w-px flex-1 justify-center px-[32px] py-[16px]"),
                )}
              </div>

              {/* Свойства и консультация */}
              <div className="flex w-full items-start gap-[24px]">
                <ProductDetails rows={details} description={description} />
                {consultCard}
              </div>
            </div>
          )}

          {/* Схожі кольори / вироби */}
          <section
            className="flex w-full flex-col items-start gap-[24px] pt-[40px]"
            style={{ boxShadow: `inset 0 1px 0 ${LIGHT}` }}
          >
            <div className="flex w-full items-center justify-between">
              <h2 className={`text-trim whitespace-nowrap ${H2_SB} text-black`}>
                {similar.title}
              </h2>
              <OutlineBtn href={similar.href}>{similar.button}</OutlineBtn>
            </div>
            {/* items-stretch: карточки разной длины текста — одной высоты, верх на одном уровне. */}
            <div className="flex w-full items-stretch justify-center gap-[24px]">
              {item
                ? similar.projects?.map((p) => (
                    <ProjectCard key={p.href} {...p} />
                  ))
                : similar.cards?.map((c) => (
                    <CatalogCard
                      key={c.href}
                      name={c.name}
                      collection={c.subtitle}
                      texture={c.detail}
                      image={c.image}
                      href={c.href}
                    />
                  ))}
            </div>
          </section>
        </div>
      </div>
    </Page>
  );
}
