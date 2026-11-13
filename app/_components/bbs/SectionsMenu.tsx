"use client";

import { useEffect, useRef, useState } from "react";

import { H3_SB, HOVER_EASE } from "./ui";

export type MenuSection = {
  key: string;
  title: string;
  href: string;
  content: React.ReactNode;
};

/** Курсор задержался на названии раздела — переключаем (наискосок мимо — нет). */
const SWITCH_DELAY = 120;
/** Курсор ушёл из панели — после закрытия (150 + 200 мс в PANEL) вернуть первый раздел. */
const RESET_DELAY = 400;

/**
 * Панель с разделами: «Каталог» и «Вироби на замовлення». Слева названия
 * разделов, справа за синей линией — содержимое открытого раздела.
 * При открытии панели сразу показан первый раздел; наведение на другой
 * раздел переключает содержимое, и оно остаётся открытым, пока курсор
 * идёт к пунктам (жалоба клиента: «важко вибрати підкатегорію, злітає
 * курсор»). Переключение — с небольшой задержкой, чтобы путь наискосок
 * через соседнее название не сбивал раздел. Содержимое всех разделов
 * лежит в одной ячейке грида — панель плавно меняет высоту.
 */
export default function SectionsMenu({ sections }: { sections: MenuSection[] }) {
  const first = sections[0]?.key;
  const [active, setActive] = useState(first);
  const switchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      clearTimeout(switchTimer.current);
      clearTimeout(resetTimer.current);
    },
    [],
  );

  const hoverSection = (key: string) => {
    clearTimeout(switchTimer.current);
    switchTimer.current = setTimeout(() => setActive(key), SWITCH_DELAY);
  };

  return (
    <div
      className="flex w-full items-start"
      onMouseEnter={() => clearTimeout(resetTimer.current)}
      onMouseLeave={() => {
        clearTimeout(switchTimer.current);
        resetTimer.current = setTimeout(() => setActive(first), RESET_DELAY);
      }}
    >
      <ul className="flex shrink-0 flex-col">
        {sections.map((s) => (
          <li key={s.key} className="flex">
            <a
              href={s.href}
              aria-expanded={active === s.key}
              onMouseEnter={() => hoverSection(s.key)}
              onMouseLeave={() => clearTimeout(switchTimer.current)}
              onFocus={() => setActive(s.key)}
              className="flex w-full py-[14px] pr-[40px] pl-[8px]"
            >
              <span
                className={`text-trim whitespace-nowrap ${H3_SB} transition-colors ${HOVER_EASE} hover:text-red ${
                  active === s.key ? "text-red" : "text-ink"
                }`}
              >
                {s.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="grid min-w-px flex-1">
        {sections.map((s) => {
          const open = active === s.key;
          return (
            <div
              key={s.key}
              // Закрытые разделы не ловят курсор и не попадают в Tab, пока гаснут.
              inert={!open}
              className={`col-start-1 row-start-1 grid transition-[grid-template-rows,opacity,visibility] duration-250 ease-out motion-reduce:transition-[opacity,visibility] ${
                open ? "visible grid-rows-[1fr] opacity-100" : "pointer-events-none invisible grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden pl-[32px] shadow-[inset_2px_0_0_var(--color-blue)]">
                {s.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
