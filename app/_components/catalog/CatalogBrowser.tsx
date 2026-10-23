"use client";

/* eslint-disable @next/next/no-img-element */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import type {
  CatalogCardData,
  Facet,
  FilterKey,
  Selected,
  SortKey,
} from "@/app/_lib/catalog";

import { catalogHref, catalogQuery } from "@/app/_lib/catalog-url";

import { CatalogCard } from "../bbs/cards";
import { H4_BTN, H4_L, HOVER_EASE, LINE_BASE_GRAY, LINE_FILL, MOB_L, inset } from "../bbs/ui";
import FilterSidebar, { FilterArrow } from "./filters";

export const SORTS: [slug: SortKey, label: string][] = [
  ["popular", "Популярні"],
  ["name-asc", "Назва: А–Я"],
  ["name-desc", "Назва: Я–А"],
];

/** 1 матеріал, 2 матеріали, 5 матеріалів. */
export function materialsWord(n: number) {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return "матеріал";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "матеріали";
  return "матеріалів";
}


/**
 * Состояние выбора фильтров: оптимистичный выбор, адрес выдачи, сброс.
 * Общее для десктопной панели и мобильных чипов.
 */
export function useCatalogState({
  bbs,
  facets,
  sort,
  typeScoped,
}: {
  bbs: boolean;
  facets: Facet[];
  sort: SortKey;
  typeScoped: FilterKey[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const serverSelected = Object.fromEntries(
    facets.map((f) => [
      f.key,
      f.options.filter((o) => o.selected).map((o) => o.slug),
    ]),
  ) as Selected;

  // Оптимистично: галочка ставится сразу, счётчики догоняют ответ сервера.
  const [selected, setSelected] = useState(serverSelected);
  // Пришёл новый ответ сервера — синхронизируем (без эффекта, во время рендера).
  const serverKey = JSON.stringify(serverSelected);
  const [seenKey, setSeenKey] = useState(serverKey);
  if (seenKey !== serverKey) {
    setSeenKey(serverKey);
    setSelected(serverSelected);
  }

  // Выбор совпал с подборкой — статичный адрес (/kataloh/kvartsovyi-kamin-bilyi/),
  // иначе общий каталог с параметрами. Каталог бренда — всегда параметры.
  const hrefFor = (next: Selected, nextSort: SortKey, nextPage: number) =>
    bbs
      ? catalogHref(next, nextSort, nextPage)
      : pathname + catalogQuery(next, nextSort, nextPage);
  const go = (next: Selected, nextSort: SortKey, nextPage: number) =>
    startTransition(() =>
      router.replace(hrefFor(next, nextSort, nextPage), { scroll: false }),
    );

  const toggle = (key: FilterKey, slug: string) => {
    const on = selected[key].includes(slug);
    const next = {
      ...selected,
      [key]: on ? selected[key].filter((s) => s !== slug) : [...selected[key], slug],
    };
    // Тип каменя — основной фильтр и только один: при смене сбрасываем
    // бренд и параметры, которые от него зависят (иначе пустая выдача).
    if (key === "type") {
      next.type = on ? [] : [slug];
      if (!on && selected.type.length)
        for (const k of ["brand", ...typeScoped] as FilterKey[]) next[k] = [];
    }
    // Бренд тоже один: Laminam — керамограніт, Vicostone — кварц, «оба» =
    // «любой». При смене бренда сбрасываем его параметры (коллекции и т.п.).
    if (key === "brand") {
      next.brand = on ? [] : [slug];
      if (!on && selected.brand.length)
        for (const k of typeScoped) next[k] = [];
    }
    setSelected(next);
    go(next, sort, 1);
  };
  const reset = () => {
    const empty = Object.fromEntries(
      Object.keys(selected).map((k) => [k, []]),
    ) as unknown as Selected;
    setSelected(empty);
    go(empty, "popular", 1);
  };

  // Фасеты с учётом оптимистичного выбора.
  const shownFacets = facets.map((f) => ({
    ...f,
    options: f.options.map((o) => {
      const on = selected[f.key].includes(o.slug);
      return { ...o, selected: on, disabled: o.disabled && !on };
    }),
  }));
  const hasFilters = Object.values(selected).some((v) => v.length > 0);

  return { selected, shownFacets, hasFilters, pending, go, hrefFor, toggle, reset };
}

/**
 * Обычный клик по ссылке страницы — листаем без перезагрузки: отменяет переход
 * и возвращает true. Ссылка остаётся для поисковиков и «открыть в новой
 * вкладке» (Ctrl/Cmd/Shift/средняя кнопка — false, браузер откроет сам).
 */
export function plainClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  e.preventDefault();
  return true;
}

/**
 * Интерактивная часть каталога. Выбор фильтров пишется в адрес, сервер
 * пересчитывает выдачу и фасеты из базы (app/_lib/catalog.ts).
 */
export default function CatalogBrowser({
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
  const { selected, shownFacets, hasFilters, pending, go, hrefFor, toggle, reset } =
    useCatalogState({ bbs, facets, sort, typeScoped });

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const close = (e: MouseEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [sortOpen]);

  const flip = (set: Set<string>, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };
  const toPage = (p: number) => {
    go(selected, sort, p);
    listRef.current?.scrollIntoView({ block: "start" });
  };
  // Стрелка пагинации: ссылка на соседнюю страницу или неактивная кнопка.
  const pageArrow = (dir: -1 | 1) => {
    const to = page + dir;
    const label = dir < 0 ? "Попередня сторінка" : "Наступна сторінка";
    const className =
      "flex size-[36px] cursor-pointer items-center justify-center disabled:cursor-default disabled:opacity-30";
    const icon = (
      <img
        src="/figma/catalog/arrow-filled.svg"
        alt=""
        className={`h-[16px] w-[8px] ${dir < 0 ? "-scale-x-100" : ""}`}
      />
    );
    return to < 1 || to > pages ? (
      <button type="button" aria-label={label} disabled className={className}>
        {icon}
      </button>
    ) : (
      <a
        href={hrefFor(selected, sort, to)}
        rel={dir < 0 ? "prev" : "next"}
        aria-label={label}
        onClick={(e) => plainClick(e) && toPage(to)}
        className={className}
      >
        {icon}
      </a>
    );
  };

  return (
    <>
      {/* В макете пометка: «фільтр має бути закріпленим при скролі».
          Панель выше экрана, поэтому она не длиннее окна и прокручивается
          внутри себя — так закрепление работает при любой длине выдачи. */}
      <div className="sticky top-0 max-h-dvh self-start overflow-y-auto overscroll-contain [scrollbar-width:thin]">
        <FilterSidebar
          bbs={bbs}
          facets={shownFacets}
          onToggle={toggle}
          collapsed={collapsed}
          onCollapse={(k) => setCollapsed((c) => flip(c, k))}
          expanded={expanded}
          onExpand={(k) => setExpanded((c) => flip(c, k))}
        />
      </div>

      <div
        ref={listRef}
        className="flex min-w-px flex-1 scroll-mt-[20px] flex-col gap-[20px]"
      >
        <div className="flex w-full items-center gap-[24px]">
          <div ref={sortRef} className="relative w-[262px] shrink-0">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              onClick={() => setSortOpen((o) => !o)}
              className="flex w-full cursor-pointer items-center justify-between bg-white p-[16px]"
              style={inset("var(--color-card-gray)")}
            >
              <span className="whitespace-nowrap text-[16px] font-semibold leading-[16px] tracking-[-0.8px] text-[#6a6a6a]">
                Сортувати: {SORTS.find(([k]) => k === sort)?.[1]}
              </span>
              <FilterArrow
                src="/figma/catalog/arrow-filled-gray.svg"
                direction={sortOpen ? "down" : "up"}
              />
            </button>
            {sortOpen && (
              <ul
                role="listbox"
                className="absolute top-full left-0 z-20 w-full border border-t-0 border-card-gray bg-white py-[8px] shadow-[var(--lift)]"
              >
                {SORTS.map(([slug, label]) => (
                  <li key={slug}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={slug === sort}
                      onClick={() => {
                        setSortOpen(false);
                        go(selected, slug, 1);
                      }}
                      className={`w-full cursor-pointer px-[16px] py-[12px] text-left ${MOB_L} ${
                        slug === sort ? "font-semibold text-blue" : "text-ink"
                      } hover:bg-light-gray`}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex w-[262px] shrink-0 items-center justify-center p-[16px]">
            <button
              type="button"
              onClick={reset}
              disabled={!hasFilters && sort === "popular"}
              className="group cursor-pointer disabled:cursor-default"
            >
              {/* Неактивна — без hover: линия не заполняется, цвет не меняется. */}
              <span
                className={`text-trim block whitespace-nowrap ${H4_BTN} text-card-gray ${LINE_BASE_GRAY} ${
                  !hasFilters && sort === "popular" ? "" : `transition-colors ${HOVER_EASE} group-hover:text-red ${LINE_FILL}`
                }`}
              >
                Скинути все
              </span>
            </button>
          </div>
          {/* Каталог Laminam (макет 1288:7741): счётчик прижат к правому краю
              ряда; общий каталог — третья колонка 262, как в его макете. */}
          <div
            className={
              bbs
                ? "flex w-[262px] shrink-0 items-center justify-center p-[16px]"
                : "ml-auto flex shrink-0 items-center py-[16px]"
            }
          >
            <p className={`text-trim whitespace-nowrap ${H4_L} text-card-gray`}>
              Знайдено: {total} {materialsWord(total)}
            </p>
          </div>
        </div>

        {/* Без якоря прокрутки: карточки переставляются при смене фильтра,
            и браузер утаскивал страницу вслед за «своей» карточкой. */}
        <div
          className={`flex flex-col gap-[24px] transition-opacity duration-200 [overflow-anchor:none] ${
            pending ? "opacity-50" : ""
          }`}
          aria-busy={pending}
        >
          {items.length > 0 ? (
            <div className="grid grid-cols-3 gap-[24px]">
              {items.map((card) => (
                <CatalogCard
                  key={card.href}
                  name={card.name}
                  collection={card.subtitle}
                  texture={card.detail}
                  image={card.image}
                  href={card.href}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-[16px] py-[40px]">
              <p className="text-[20px] font-semibold leading-[20px] tracking-[-1px] text-ink">
                Нічого не знайдено
              </p>
              <p className={`${H4_L} text-card-gray`}>
                Спробуйте прибрати частину фільтрів.
              </p>
              <button
                type="button"
                onClick={reset}
                className={`cursor-pointer ${H4_BTN} text-blue underline transition-colors ${HOVER_EASE} hover:text-red`}
              >
                Скинути всі фільтри
              </button>
            </div>
          )}

          {pages > 1 && (
            // Страницы — ссылки (?page=N), чтобы поисковик их видел; клик
            // листает без перезагрузки.
            <nav
              aria-label="Сторінки"
              className="flex items-center justify-center gap-[8px]"
            >
              {pageArrow(-1)}
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={hrefFor(selected, sort, p)}
                  aria-current={p === page ? "page" : undefined}
                  onClick={(e) => plainClick(e) && toPage(p)}
                  className={`min-w-[32px] cursor-pointer px-[8px] py-[10px] text-center ${
                    p === page
                      ? `${H4_BTN} text-blue shadow-[inset_0_-1px_0_var(--color-blue)]`
                      : `${H4_L} text-ink hover:text-blue`
                  }`}
                >
                  {p}
                </a>
              ))}
              {pageArrow(1)}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
