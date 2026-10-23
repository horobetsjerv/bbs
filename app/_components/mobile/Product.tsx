// Мобильная карточка товара и изделия (Figma 1260:9821 — товар,
// 1281:5533 — виріб). Пропсы те же, что у десктопного ProductPage.

import { Breadcrumbs, H4_BTN, H4_L, Icon, MOB_L, MOB_SB, inset } from "../bbs/ui";
import {
  SERVICES,
  TILES,
  UsageTile,
  type InfoRowData,
  type ProductPageProps,
} from "../product/ProductPage";
import MAccordion from "./Accordion";
import MobileGallery from "./Gallery";
import {
  LEAD_ANCHOR,
  MCarousel,
  MCta,
  MDecorCard,
  MOutlineBtn,
  MProjectSmallCard,
  MSection,
  MTitle,
} from "./ui";

const LIGHT = "var(--color-light-gray)";

/** Строка без рамки: название 16mob_l, значение semibold, по краям. */
function InfoRow({ label, value, href }: InfoRowData) {
  return (
    <div className="flex w-full items-center justify-between gap-[16px] text-ink">
      <p className={`text-trim shrink-0 whitespace-nowrap ${MOB_L}`}>{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-trim text-right ${H4_BTN} text-blue transition-colors hover:text-red`}
        >
          {value}
        </a>
      ) : (
        <p className={`text-trim text-right ${H4_BTN}`}>{value}</p>
      )}
    </div>
  );
}

/** Строка со значениями в рамках light_gray: px 16 / py 8. */
function SpecRow({ label, values }: { label: string; values: string[] }) {
  // В макете значение одно — справа от подписи. Несколько значений (2 размера,
  // 3 толщины) на 375 рядом с подписью не помещаются — ставим их строкой под
  // подписью, там они влезают в одну линию.
  const many = values.length > 1;
  return (
    <div
      className={`flex w-full gap-[16px] ${many ? "flex-col items-start gap-y-[12px]" : "items-center justify-between"}`}
    >
      <p className={`text-trim shrink-0 whitespace-nowrap ${MOB_L} text-ink`}>{label}</p>
      <div className={`flex min-w-0 flex-wrap gap-[8px] ${many ? "" : "justify-end"}`}>
        {values.map((v) => (
          <div key={v} className="flex items-start px-[16px] py-[8px]" style={inset(LIGHT)}>
            <p className={`text-trim whitespace-nowrap ${H4_BTN} text-ink`}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MobileProduct({
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
}: ProductPageProps) {
  const item = variant === "item";
  const tiles = applications.filter((slug) => TILES[slug]);
  // Заявки принимает мобильная форма на главной; тип, материал и тема — в адресе.
  const leadHref = (lead?: string) => {
    const q = new URLSearchParams();
    if (lead) q.set("lead", lead);
    if (materialId) q.set("material", String(materialId));
    q.set("about", brand ? `${title} (${brand})` : title);
    return `/?${q}#${LEAD_ANCHOR}`;
  };
  // У изделия в макете одна кнопка — «Запитати ціну».
  // Без ссылки на PDF кнопки спецификации нет.
  const services = item
    ? SERVICES.filter((s) => s.lead === "price_request")
    : SERVICES.filter((s) => !s.pdf || specPdfUrl);

  return (
    <>
      <div className="w-full p-[16px]">
        <Breadcrumbs items={breadcrumb} tone="dark" wrap />
      </div>
      <MobileGallery images={images} title={title} />

      <div className="contents" data-reveal>
        <MSection gap={16}>
          {/* Единственный H1 мобильной страницы: название. У изделия в макете
              (1281:5533) заголовка нет — только строки, H1 скрытый. */}
          {item ? (
            <h1 className="sr-only">{title}</h1>
          ) : (
            <div className="flex w-full items-start justify-between gap-[16px] text-ink">
              <p className={`text-trim shrink-0 whitespace-nowrap uppercase ${MOB_L}`}>{brand}</p>
              <h1 className={`text-trim text-right ${MOB_SB}`}>{title}</h1>
            </div>
          )}
          {info.map((r) => (
            <InfoRow key={r.label} {...r} />
          ))}
          {specs
            .filter((r) => r.values.length > 0)
            .map((r) => (
              <SpecRow key={r.label} label={r.label} values={r.values} />
            ))}
          {!item && tiles.length > 0 && (
            <div className="flex w-full flex-col items-start gap-[16px]">
              <p className={`text-trim whitespace-nowrap ${MOB_L} text-ink`}>Застосування</p>
              <div className="grid w-full grid-cols-5 gap-[8px]">
                {tiles.map((slug) => (
                  <UsageTile key={slug} slug={slug} mirror />
                ))}
              </div>
            </div>
          )}
        </MSection>

        <div className="flex w-full flex-col items-start gap-[24px] px-[16px]">
          {services.map((s) => (
            <a
              key={s.title}
              href={s.pdf ? (specPdfUrl ?? "#") : leadHref(s.lead)}
              target={s.pdf && specPdfUrl ? "_blank" : undefined}
              className="flex w-full items-center gap-[8px] p-[16px] text-blue"
              style={inset("var(--color-blue)")}
            >
              <Icon src={s.icon} size={48} />
              <span className="flex flex-col items-start justify-center gap-[8px] whitespace-nowrap">
                <span className={`text-trim ${MOB_SB}`}>{s.title}</span>
                {s.text && <span className={`text-trim ${H4_L}`}>{s.text}</span>}
              </span>
            </a>
          ))}
        </div>

        {/* У изделия в макете аккордеонов нет. */}
        {!item && (
          <MAccordion title="Характеристики" defaultOpen>
            <div className="flex w-full flex-col items-start text-ink">
              {details.map((r) => (
                <div
                  key={r.label}
                  className="flex w-full items-center justify-between gap-[16px] py-[14px]"
                  style={{ boxShadow: `inset 0 -1px 0 ${LIGHT}` }}
                >
                  <p className={`text-trim shrink-0 ${MOB_SB}`}>{r.label}</p>
                  <p className={`text-trim text-right ${MOB_L}`}>{r.value}</p>
                </div>
              ))}
            </div>
          </MAccordion>
        )}
        {!item && description && (
          <MAccordion title="Опис">
            <p className={`w-full whitespace-pre-line ${H4_L} text-ink`}>{description}</p>
          </MAccordion>
        )}

        <MCta
          variant="card"
          center
          // Изделие: текст по центру и свой, как в мобильном макете (1281:5630).
          textCenter={item}
          bigText
          textInk={!item}
          gap={item ? 20 : 32}
          title={consult.title}
          text={item ? "Наші менеджери допоможуть підібрати матеріал під ваш проєкт" : consult.text}
          href={leadHref()}
        />

        <MSection gap={20}>
          <MTitle>{similar.title}</MTitle>
          {item ? (
            <>
              <MCarousel>
                {similar.projects?.map((p) => (
                  <MProjectSmallCard key={p.href} {...p} />
                ))}
              </MCarousel>
              <MOutlineBtn href={similar.href}>Переглянути усі вироби</MOutlineBtn>
            </>
          ) : (
            <div className="flex w-full flex-col items-start gap-[32px]">
              <MCarousel>
                {similar.cards?.map((c) => (
                  <MDecorCard
                    key={c.href}
                    name={c.name.toUpperCase()}
                    brand={c.brand}
                    image={c.image}
                    href={c.href}
                  />
                ))}
              </MCarousel>
              <MOutlineBtn href={similar.href}>Переглянути весь каталог</MOutlineBtn>
            </div>
          )}
        </MSection>
      </div>
    </>
  );
}
