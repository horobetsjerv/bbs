"use client";

/* eslint-disable @next/next/no-img-element */
// Мобильный каталог (Figma 1260:7588 — Laminam, 1260:8621 — BBS):
// чипы фильтров с панелью выбора, переключатели наличия, сетка 2 колонки.

import { Fragment, useEffect, useRef, useState } from "react";

import type { CatalogCardData, Facet, FilterKey, SortKey } from "@/app/_lib/catalog";

import { SORTS, useCatalogState } from "../catalog/CatalogBrowser";
import { ColorGrid, CompactCheck, CountedCheck } from "../catalog/filters";
import { H4_BTN, H4_L, Icon, MOB_L, MOB_SB } from "../bbs/ui";
import { MDecorCard } from "./ui";

type Chip = { key: FilterKey | "sort"; label: string };

// Чипы из макета: у общего каталога вместо «Колір» — «Матеріал» (тип каменю).
const CHIPS = (bbs: boolean): Chip[] => [
  { key: "sort", label: "Популярні" },
  bbs ? { key: "type", label: "Матеріал" } : { key: "color", label: "Колір" },
  { key: "collection", label: "Колекція" },
  { key: "surface", label: "Фактура" },
  { key: "size", label: "Розмір" },
  { key: "thickness", label: "Товщина" },
  { key: "application", label: "Застосування" },
];

/** Стрелка weui:arrow-filled 8×16, повёрнутая в бокс 16×8 (вниз / вверх). */
function ChipArrow({ open }: { open: boolean }) {
  return (
    <span className="flex h-[8px] w-[16px] shrink-0 items-center justify-center">
      <img
        src="/figma/mobile/chip-arrow.svg"
        alt=""
        aria-hidden
        className={`block h-[16px] w-[8px] max-w-none ${open ? "rotate-90" : "-rotate-90"}`}
      />
    </span>
  );
}

/** Переключатель наличия: material-symbols:toggle-on / toggle-on-outline. */
function StockToggle({
  on,
  label,
  disabled,
  onClick,
}: {
  on: boolean;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onClick}
      className="flex shrink-0 cursor-pointer items-center gap-[8px] py-[4px] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* 24px вместо 16 из макета (значок 15×8 — мелко); py 4 держит высоту строки 32. */}
      {on ? (
        <Icon src="/figma/catalog/toggle-on.svg" size={24} />
      ) : (
        <span className="-scale-x-100">
          <Icon src="/figma/catalog/toggle-off.svg" size={24} />
        </span>
      )}
      <span className={`text-trim whitespace-nowrap ${on ? MOB_SB : H4_L} text-ink`}>
        {label}
      </span>
    </button>
  );
}

/** Номера страниц: все, если их до 5, иначе первая, соседи текущей и последняя. */
function pageList(page: number, pages: number): (number | null)[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = [1, page - 1, page, page + 1, pages].filter((p) => p >= 1 && p <= pages);
  const out: (number | null)[] = [];
  [...new Set(set)].forEach((p, i, arr) => {
    if (i > 0 && p - arr[i - 1] > 1) out.push(null);
    out.push(p);
  });
  return out;
}

/** Пагинация (Figma 1260:8296): стрелки 36px, номера p 10, скругление 4. */
export function MPagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) {
  if (pages <= 1) return null;
  const arrow = (dir: -1 | 1) => {
    const disabled = dir < 0 ? page <= 1 : page >= pages;
    return (
      <button
        type="button"
        aria-label={dir < 0 ? "Попередня сторінка" : "Наступна сторінка"}
        disabled={disabled}
        onClick={() => onPage(page + dir)}
        className={`flex shrink-0 cursor-pointer items-start rounded-[4px] p-[10px] disabled:cursor-default ${
          disabled ? "" : "bg-back-card-gray"
        }`}
        style={disabled ? { boxShadow: "inset 0 0 0 1px var(--color-back-card-gray)" } : undefined}
      >
        {/* Неактивная — серая контурная стрелка, активная — залитая blue. */}
        <span className={dir < 0 === !disabled ? "-scale-x-100" : ""}>
          <Icon
            src={disabled ? "/figma/mobile/page-prev.svg" : "/figma/bbs/breadcrumb-arrow-blue.svg"}
          />
        </span>
      </button>
    );
  };
  return (
    <nav aria-label="Сторінки" className="flex w-full items-center justify-center gap-[8px] pt-[16px]">
      {arrow(-1)}
      {pageList(page, pages).map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className={`px-[4px] ${H4_L} text-card-gray`}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPage(p)}
            className={`min-w-[28px] shrink-0 cursor-pointer rounded-[4px] p-[10px] ${
              p === page ? "bg-blue text-white" : "bg-white text-ink"
            }`}
            style={
              p === page ? undefined : { boxShadow: "inset 0 0 0 1px var(--color-back-card-gray)" }
            }
          >
            <span className={`text-trim block whitespace-nowrap ${H4_BTN}`}>{p}</span>
          </button>
        ),
      )}
      {arrow(1)}
    </nav>
  );
}

export default function MobileCatalogBrowser({
  bbs = false,
  facets,
  items,
  total,
  page,
  pages,
  sort,
  typeScoped,
}: {
  bbs?: boolean;
  facets: Facet[];
  items: CatalogCardData[];
  total: number;
  page: number;
  pages: number;
  sort: SortKey;
  typeScoped: FilterKey[];
}) {
  const { selected, shownFacets, hasFilters, pending, go, toggle, reset } = useCatalogState({
    bbs,
    facets,
    sort,
    typeScoped,
  });
  const [open, setOpen] = useState<Chip["key"] | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Клик мимо панели фильтров — панель закрывается.
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const byKey = new Map(shownFacets.map((f) => [f.key, f.options]));
  // Как в десктопной панели: группа из одного пункта ничего не фильтрует.
  const chips = CHIPS(bbs).filter((c) => c.key === "sort" || (byKey.get(c.key)?.length ?? 0) > 1);
  const stock = byKey.get("stock") ?? [];
  const stockOption = (slug: string) => stock.find((o) => o.slug === slug);
  const brands = byKey.get("brand") ?? [];

  const toPage = (p: number) => {
    go(selected, sort, p);
    gridRef.current?.scrollIntoView({ block: "start" });
  };

  const panel = () => {
    if (open === "sort")
      return SORTS.map(([slug, label]) => (
        <button
          key={slug}
          type="button"
          role="option"
          aria-selected={slug === sort}
          onClick={() => {
            setOpen(null);
            go(selected, slug, 1);
          }}
          className={`w-full cursor-pointer py-[8px] text-left ${MOB_L} ${
            slug === sort ? "font-semibold text-blue" : "text-ink"
          }`}
        >
          {label}
        </button>
      ));
    if (!open) return null;
    const options = byKey.get(open) ?? [];
    const onToggle = (slug: string) => toggle(open, slug);
    if (open === "color") return <ColorGrid options={options} onToggle={onToggle} />;
    if (open === "type" || open === "collection")
      return options.map((o) => (
        <CompactCheck
          key={o.slug}
          option={open === "collection" ? { ...o, label: o.label.toUpperCase() } : o}
          onToggle={() => onToggle(o.slug)}
        />
      ));
    return options.map((o, idx) => (
      <Fragment key={o.slug}>
        {o.group && o.group !== options[idx - 1]?.group && (
          <p className={`text-trim whitespace-nowrap ${MOB_SB} text-card-gray`}>{o.group}</p>
        )}
        <CountedCheck option={o} onToggle={() => onToggle(o.slug)} />
      </Fragment>
    ));
  };

  const resetBtn = (
    <button
      type="button"
      onClick={reset}
      disabled={!hasFilters && sort === "popular"}
      className="flex shrink-0 cursor-pointer items-center justify-end p-[16px] disabled:cursor-default"
    >
      <span
        className={`text-trim whitespace-nowrap ${H4_BTN} text-card-gray underline decoration-solid [text-underline-position:from-font]`}
      >
        Скинути все
      </span>
    </button>
  );

  return (
    <>
      <section
        ref={boxRef}
        className="flex w-full flex-col items-end gap-[8px] px-[16px] pt-[20px]"
        style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
      >
        <div className="flex w-full flex-col items-start gap-[8px]">
          <div className="-mx-[16px] flex w-[calc(100%+32px)] items-start gap-[8px] overflow-x-auto px-[16px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chips.map((c) => {
              const on = open === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-expanded={on}
                  onClick={() => setOpen(on ? null : c.key)}
                  className="flex shrink-0 cursor-pointer items-center bg-blue px-[8px] py-[10px] shadow-[inset_0_0_0_1px_var(--color-blue)]"
                >
                  <span className={`text-trim whitespace-nowrap ${MOB_SB} text-white`}>
                    {c.key === "sort" ? SORTS.find(([k]) => k === sort)?.[1] : c.label}
                  </span>
                  <ChipArrow open={on} />
                </button>
              );
            })}
          </div>

          {open && (
            <div
              role={open === "sort" ? "listbox" : "group"}
              className="flex max-h-[60dvh] w-full flex-col items-start gap-[16px] overflow-y-auto bg-white p-[16px]"
              style={{ boxShadow: "inset 0 0 0 1px var(--color-card-gray)" }}
            >
              {panel()}
            </div>
          )}

          <div className="flex items-start gap-[24px]">
            <StockToggle
              label="В наявності"
              on={selected.stock.includes("in-stock")}
              disabled={!stockOption("in-stock") || stockOption("in-stock")!.disabled}
              onClick={() => toggle("stock", "in-stock")}
            />
            <StockToggle
              label="Під замовлення"
              on={selected.stock.includes("on-order")}
              disabled={!stockOption("on-order") || stockOption("on-order")!.disabled}
              onClick={() => toggle("stock", "on-order")}
            />
          </div>
        </div>

        {bbs ? (
          <div className="flex items-center gap-[8px]">
            {brands.length > 1 && (
              <div className="flex items-center gap-[8px]">
                {brands.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    aria-pressed={b.selected}
                    disabled={b.disabled}
                    onClick={() => toggle("brand", b.slug)}
                    className={`flex shrink-0 cursor-pointer items-start px-[8px] py-[10px] text-[16px] leading-[16px] font-semibold tracking-[-0.8px] whitespace-nowrap uppercase shadow-[inset_0_0_0_1px_var(--color-blue)] disabled:cursor-not-allowed disabled:opacity-40 ${
                      b.selected ? "bg-blue text-white" : "text-blue"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
            {resetBtn}
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <p className={`text-trim py-[16px] whitespace-nowrap ${H4_L} text-card-gray`}>
              Знайдено: {total}
            </p>
            {resetBtn}
          </div>
        )}
      </section>

      <section
        ref={gridRef}
        className={`flex w-full scroll-mt-[68px] flex-col items-start gap-[24px] px-[16px] pb-[40px] ${
          bbs ? "pt-[40px]" : "pt-[20px]"
        }`}
      >
        <div
          className={`flex w-full flex-col gap-[24px] transition-opacity duration-200 [overflow-anchor:none] ${
            pending ? "opacity-50" : ""
          }`}
          aria-busy={pending}
        >
          {items.length > 0 ? (
            <div className="grid w-full grid-cols-2 gap-[8px]">
              {items.map((card) => (
                <MDecorCard
                  key={card.href}
                  name={card.name.toUpperCase()}
                  brand={card.brand}
                  image={card.image}
                  href={card.href}
                  fill
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-[16px] py-[24px]">
              <p className={`text-trim ${MOB_SB} text-ink`}>Нічого не знайдено</p>
              <p className={`text-trim ${MOB_L} text-card-gray`}>
                Спробуйте прибрати частину фільтрів.
              </p>
              <button
                type="button"
                onClick={reset}
                className={`cursor-pointer ${H4_BTN} text-blue underline`}
              >
                Скинути всі фільтри
              </button>
            </div>
          )}
          <MPagination page={page} pages={pages} onPage={toPage} />
        </div>
      </section>
    </>
  );
}
