/* eslint-disable @next/next/no-img-element */
// Боковая панель фильтров каталога. Геометрия из Figma-фреймов
// UI_desktop_Catalog_LAM / UI_desktop_Catalog BBS: колонка 262px, группы
// в 16px паддинге с общей рамкой (обводка внутренняя, поэтому inset-тени).
// Состав групп и пунктов — из базы (см. app/_lib/catalog.ts).

import { Fragment } from "react";

import type { Facet, FacetOption, FilterKey } from "@/app/_lib/catalog";

import { Icon } from "../bbs/ui";

const BORDER = "var(--color-card-gray)";
/** Первая группа с рамкой по кругу, остальные — без верхней (границы общие). */
const BOX_FIRST = `inset 0 0 0 1px ${BORDER}`;
const BOX_REST = `inset 1px 0 0 ${BORDER}, inset -1px 0 0 ${BORDER}, inset 0 -1px 0 ${BORDER}`;

const TITLE = "text-[16px] font-semibold leading-[16px] tracking-[-0.8px]";
const LABEL_LIGHT = "text-[16px] font-light tracking-[-0.8px]";

/** Треугольник weui:arrow-filled: картинка 8×16, повёрнутая в бокс 16×8. */
export function FilterArrow({
  src,
  direction = "down",
}: {
  src: string;
  direction?: "down" | "up";
}) {
  return (
    <div className="relative flex h-[8px] w-[16px] shrink-0 items-center justify-center">
      <div className={direction === "down" ? "-rotate-90" : "rotate-90"}>
        <img
          src={src}
          alt=""
          aria-hidden
          className="block h-[16px] w-[8px] max-w-none"
        />
      </div>
    </div>
  );
}

function GroupHeader({
  title,
  open,
  onToggle,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="relative flex w-[230px] shrink-0 cursor-pointer items-center justify-between py-[10px]"
    >
      <span className={`text-trim whitespace-nowrap ${TITLE} text-ink`}>
        {title}
      </span>
      {/* Развёрнута — стрелка вверх (как в макете), свёрнута — вниз. */}
      <FilterArrow
        src="/figma/catalog/arrow-filled.svg"
        direction={open ? "down" : "up"}
      />
    </button>
  );
}

function Checkbox({
  checked,
  disabled,
}: {
  checked?: boolean;
  disabled?: boolean;
}) {
  if (!checked) {
    return (
      <span
        className="relative block size-[16px] shrink-0"
        style={{
          boxShadow: `inset 0 0 0 1px ${disabled ? "var(--color-caption-gray)" : BORDER}`,
        }}
      />
    );
  }
  return (
    <span
      className="relative block size-[16px] shrink-0 overflow-clip"
      style={{ boxShadow: "inset 0 0 0 1px var(--color-blue)" }}
    >
      <img
        src="/figma/catalog/check.svg"
        alt=""
        aria-hidden
        className="absolute top-[-1px] left-[-1px] block size-[16px] max-w-none"
      />
    </span>
  );
}

type RowProps = { option: FacetOption; onToggle: () => void };

/** Строка без счётчика (тип, бренд, коллекция): метка по центру строки. */
export function CompactCheck({ option, onToggle }: RowProps) {
  const { selected, disabled, label } = option;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`relative flex shrink-0 items-center gap-[8px] text-left ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <Checkbox checked={selected} disabled={disabled} />
      <span
        className={`text-trim whitespace-nowrap ${
          selected
            ? `${TITLE} text-blue`
            : `${LABEL_LIGHT} leading-[20px] ${disabled ? "text-caption-gray" : "text-ink"}`
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/** Строка со счётчиком (фактура, размер, толщина, применение). */
export function CountedCheck({ option, onToggle }: RowProps) {
  const { selected, disabled, label, count } = option;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onToggle}
      className={`relative flex max-w-full shrink-0 items-start gap-[8px] text-left ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <Checkbox checked={selected} disabled={disabled} />
      {/* Длинные пункты «Призначення» жирным не влезают в колонку — переносятся. */}
      <span
        className={`min-w-0 text-[16px] leading-[16px] tracking-[-0.8px] ${
          selected
            ? "font-semibold text-blue"
            : `font-light ${disabled ? "text-caption-gray" : "text-ink"}`
        }`}
      >
        {label}
      </span>
      <span
        className={`whitespace-nowrap ${LABEL_LIGHT} leading-[16px] ${
          disabled ? "text-caption-gray" : "text-card-gray"
        }`}
      >
        ({count})
      </span>
    </button>
  );
}

function ShowMore({
  open,
  onToggle,
  padded = false,
}: {
  open: boolean;
  onToggle: () => void;
  padded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative flex w-[230px] shrink-0 cursor-pointer items-center gap-[8px] ${
        padded ? "py-[10px]" : ""
      }`}
    >
      <Icon
        src="/figma/catalog/plus.svg"
        className={`transition-transform ${open ? "rotate-45" : ""}`}
      />
      <span className={`text-trim whitespace-nowrap ${TITLE} text-ink`}>
        {open ? "Показати менше" : "Показати більше"}
      </span>
    </button>
  );
}

/** Цвета из базы (hex). Выбранный — с синим кольцом (в макете нет состояния, добавлено). */
export function ColorGrid({
  options,
  onToggle,
}: {
  options: FacetOption[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="grid w-full grid-cols-[repeat(6,32px)] gap-[8px]">
      {options.map((o) => (
        <button
          key={o.slug}
          type="button"
          role="checkbox"
          aria-checked={o.selected}
          aria-label={`${o.label} (${o.count})`}
          title={`${o.label} (${o.count})`}
          disabled={o.disabled}
          onClick={() => onToggle(o.slug)}
          className={`block size-[32px] rounded-full ${
            o.disabled ? "cursor-not-allowed opacity-30" : "cursor-pointer"
          } ${o.selected ? "outline-2 outline-offset-2 outline-blue" : ""}`}
          style={{
            background: o.hex ?? "#d9d9d9",
            // Светлые оттенки в макете с серой обводкой, иначе сливаются с фоном.
            boxShadow: isLight(o.hex) ? "inset 0 0 0 1px #959090" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function isLight(hex?: string | null) {
  if (!hex) return false;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 225;
}

function ToggleRow({ option, onToggle }: RowProps) {
  const { selected: on, disabled, label, count } = option;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onToggle}
      className={`relative flex shrink-0 items-center gap-[8px] ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      {/* 24px вместо 16 из макета: значок в 16px-иконке всего 15×8, мелко. */}
      {on ? (
        <Icon src="/figma/catalog/toggle-on.svg" size={24} />
      ) : (
        <span className="relative flex shrink-0 items-center justify-center">
          <span className="-scale-y-100 rotate-180">
            <Icon src="/figma/catalog/toggle-off.svg" size={24} />
          </span>
        </span>
      )}
      <span
        className={`text-trim whitespace-nowrap ${
          on ? TITLE : `${LABEL_LIGHT} leading-[20px]`
        } text-ink`}
      >
        {label}
      </span>
      <span
        className={`text-trim whitespace-nowrap ${LABEL_LIGHT} leading-[16px] text-card-gray`}
      >
        ({count})
      </span>
    </button>
  );
}

/** Группы панели: заголовок, вид строк и сколько пунктов видно до «Показати більше». */
const GROUPS: {
  key: FilterKey;
  title: (bbs: boolean) => string;
  kind: "compact" | "counted" | "color" | "toggle";
  limit?: number;
  /** Названия коллекций в макете капсом (BLEND, GEMINI). */
  upper?: boolean;
}[] = [
  // Порядок и состав первых трёх групп — по ТЗ (таблица фильтров).
  { key: "type", title: () => "Тип каменю", kind: "compact" },
  { key: "brand", title: () => "Бренд", kind: "compact" },
  { key: "application", title: (bbs) => (bbs ? "Призначення" : "Застосування"), kind: "counted" },
  { key: "product", title: () => "Виріб на замовлення", kind: "counted" },
  { key: "color", title: () => "Колір / відтінок", kind: "color", limit: 12 },
  {
    key: "collection",
    title: () => "Колекція",
    kind: "compact",
    limit: 4,
    upper: true,
  },
  { key: "design", title: () => "Дизайн", kind: "counted", limit: 4 },
  {
    key: "surface",
    title: (bbs) => (bbs ? "Фактура / поверхня" : "Фактура"),
    kind: "counted",
    limit: 4,
  },
  // Размеры разбиты по типу каменя (подзаголовки из option.group).
  { key: "size", title: () => "Розмір", kind: "counted" },
  { key: "thickness", title: () => "Товщина", kind: "counted", limit: 5 },
  { key: "stock", title: () => "Наявність на складі", kind: "toggle" },
];

/**
 * Каталог Laminam — панель из макета Catalog LAM (1039:2836): Колір, Колекція,
 * Фактура, Розмір, Товщина, Застосування, Наявність. Без «Виріб на
 * замовлення» и «Дизайн»; «Призначення» здесь называется «Застосування»
 * и стоит внизу, как в макете. Общий каталог — порядок ТЗ (GROUPS).
 */
const LAMINAM_KEYS: FilterKey[] = [
  "color",
  "collection",
  "surface",
  "size",
  "thickness",
  "application",
  "stock",
];

/**
 * Панель фильтров. `bbs` — общий каталог: тип каменю и бренд видны
 * (в каталоге бренда у них один пункт, группы скрываются).
 */
export default function FilterSidebar({
  bbs = false,
  facets,
  onToggle,
  collapsed,
  onCollapse,
  expanded,
  onExpand,
}: {
  bbs?: boolean;
  facets: Facet[];
  onToggle: (key: FilterKey, slug: string) => void;
  collapsed: Set<string>;
  onCollapse: (key: FilterKey) => void;
  expanded: Set<string>;
  onExpand: (key: FilterKey) => void;
}) {
  const byKey = new Map(facets.map((f) => [f.key, f.options]));
  const groups = bbs ? GROUPS : LAMINAM_KEYS.map((k) => GROUPS.find((g) => g.key === k)!);
  const visible = groups.filter(
    (g) => (byKey.get(g.key)?.length ?? 0) > (g.kind === "toggle" ? 0 : 1),
  );

  return (
    <aside className="flex w-[262px] shrink-0 flex-col items-start">
      {visible.map((g, i) => {
        const options = byKey.get(g.key)!;
        const open = !collapsed.has(g.key);
        const more = g.limit !== undefined && options.length > g.limit;
        // Выбранные пункты всегда видны, даже если они за пределами лимита.
        const shown =
          more && !expanded.has(g.key)
            ? options.filter((o, idx) => idx < g.limit! || o.selected)
            : options;
        const toggle = (slug: string) => onToggle(g.key, slug);
        return (
          <div
            key={g.key}
            className="relative flex w-full shrink-0 flex-col items-start gap-[16px] p-[16px]"
            style={{ boxShadow: i === 0 ? BOX_FIRST : BOX_REST }}
          >
            <GroupHeader
              title={g.title(bbs)}
              open={open}
              onToggle={() => onCollapse(g.key)}
            />
            {open && (
              <>
                {g.kind === "color" && (
                  <ColorGrid options={shown} onToggle={toggle} />
                )}
                {g.kind === "compact" && (
                  <div className="relative flex shrink-0 flex-col items-start gap-[8px]">
                    {shown.map((o) => (
                      <CompactCheck
                        key={o.slug}
                        option={
                          g.upper ? { ...o, label: o.label.toUpperCase() } : o
                        }
                        onToggle={() => toggle(o.slug)}
                      />
                    ))}
                  </div>
                )}
                {g.kind === "counted" &&
                  shown.map((o, idx) => (
                    <Fragment key={o.slug}>
                      {o.group && o.group !== shown[idx - 1]?.group && (
                        <p
                          className={`text-trim whitespace-nowrap ${TITLE} text-card-gray`}
                        >
                          {o.group}
                        </p>
                      )}
                      <CountedCheck
                        option={o}
                        onToggle={() => toggle(o.slug)}
                      />
                    </Fragment>
                  ))}
                {g.kind === "toggle" &&
                  shown.map((o) => (
                    <ToggleRow
                      key={o.slug}
                      option={o}
                      onToggle={() => toggle(o.slug)}
                    />
                  ))}
                {more && (
                  <ShowMore
                    open={expanded.has(g.key)}
                    onToggle={() => onExpand(g.key)}
                    padded={g.kind !== "color"}
                  />
                )}
              </>
            )}
          </div>
        );
      })}
    </aside>
  );
}
