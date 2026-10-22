"use client";

import { useState } from "react";

import type { Decor } from "@/app/_lib/catalog";

import { H4_BTN, H4_L } from "../bbs/ui";
import { MCarousel, MDecorCard, MOutlineBtn, MSection, MTitle } from "./ui";

// Вкладки и каталог, который открывает кнопка (как в десктопном DecorsSection).
const TABS = [
  { label: "Керамограніт", catalog: "/kataloh/keramogranit/" },
  { label: "Кварцовий агломерат", catalog: "/kataloh/kvartsovyi-kamin/" },
];

/**
 * Decors (Figma 1250:3374): заголовок, табы (py 12, активный — подчёркивание
 * blue), лента карточек 180×240 и кнопка каталога выбранной вкладки.
 */
export default function MobileDecors({
  title = "Популярні декори",
  decors,
  buttonStart = false,
}: {
  title?: string;
  decors: Decor[][];
  /** Текст кнопки каталога слева (макеты контактов и виробів); на главной — по центру. */
  buttonStart?: boolean;
}) {
  const [tab, setTab] = useState(0);
  return (
    <MSection gap={20}>
      <div className="flex w-full flex-col items-start gap-[24px]">
        <MTitle>{title}</MTitle>
        <div
          role="tablist"
          className="flex w-full items-center gap-[24px] py-[12px]"
          style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
        >
          {TABS.map((t, i) => {
            const on = i === tab;
            return (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(i)}
                className="flex shrink-0 cursor-pointer items-center pb-[8px]"
                style={on ? { boxShadow: "inset 0 -1px 0 var(--color-blue)" } : undefined}
              >
                {/* Невидимая полужирная копия держит ширину: при переключении
                    вкладки не сдвигаются (в макете у неактивной — фикс. 203px). */}
                <span className="grid">
                  <span
                    aria-hidden
                    className={`text-trim invisible col-start-1 row-start-1 whitespace-nowrap ${H4_BTN}`}
                  >
                    {t.label}
                  </span>
                  <span
                    className={`text-trim col-start-1 row-start-1 whitespace-nowrap ${on ? `${H4_BTN} text-blue` : `${H4_L} text-card-gray`}`}
                  >
                    {t.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[32px]">
        <MCarousel>
          {decors[tab]?.map((d) => (
            <MDecorCard
              key={d.href}
              name={d.name.toUpperCase()}
              brand={d.brand}
              image={d.image}
              href={d.href}
            />
          ))}
        </MCarousel>
        <MOutlineBtn href={TABS[tab].catalog} className={buttonStart ? "!justify-start" : ""}>
          Переглянути весь каталог
        </MOutlineBtn>
      </div>
    </MSection>
  );
}
