"use client";

import { useEffect, useRef } from "react";

/** Другая панель уже открыта — переключаемся, только если курсор задержался на пункте. */
const SWITCH_DELAY = 250;
/** Курсор ушёл из меню (например, наискосок через логотип) — закрываем не сразу. */
const CLOSE_DELAY = 200;

/**
 * Навигация шапки с выпадающими панелями. Открытый пункт ([data-menu])
 * получает data-open — по нему CSS показывает панель (Header.tsx).
 * Жалоба клиента «важко вибрати підкатегорію, злітає курсор»: путь от
 * «Каталог» к пунктам панели наискосок проходит над «Бренди» / «Вироби»,
 * и чистый :hover сразу открывал их панель. Теперь соседняя панель
 * открывается только после задержки на её пункте; первая — сразу.
 */
export default function NavMenus({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    let open: HTMLElement | null = null;
    let switchTimer: ReturnType<typeof setTimeout> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    const show = (el: HTMLElement | null) => {
      if (open === el) return;
      open?.removeAttribute("data-open");
      open = el;
      el?.setAttribute("data-open", "");
    };
    const over = (e: PointerEvent) => {
      const target = e.target as Element;
      const el = target.closest<HTMLElement>("[data-menu]");
      clearTimeout(closeTimer);
      clearTimeout(switchTimer);
      // Пустое место между пунктами — ничего не меняем.
      if (target === nav || el === open) return;
      // Пункт без панели («Шоурум», телефон) — закрыть открытую.
      if (!el) closeTimer = setTimeout(() => show(null), CLOSE_DELAY);
      else if (!open) show(el);
      else switchTimer = setTimeout(() => show(el), SWITCH_DELAY);
    };
    const leave = () => {
      clearTimeout(switchTimer);
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => show(null), CLOSE_DELAY);
    };

    nav.addEventListener("pointerover", over);
    nav.addEventListener("pointerleave", leave);
    return () => {
      nav.removeEventListener("pointerover", over);
      nav.removeEventListener("pointerleave", leave);
      clearTimeout(switchTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  return (
    <nav ref={ref} className={className}>
      {children}
    </nav>
  );
}
