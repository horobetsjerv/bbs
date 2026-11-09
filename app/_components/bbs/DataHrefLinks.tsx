"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Переход по ссылкам без href (адрес в data-href, см. app/_lib/links.ts):
 * клик — переход внутри сайта, Ctrl/⌘/Shift-клик и средняя кнопка — новая
 * вкладка, Enter на ссылке в фокусе — как клик. Клики, уже перехваченные
 * (LeadModal открывает форму заявки), не трогаем.
 */
export default function DataHrefLinks() {
  const router = useRouter();

  useEffect(() => {
    const target = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.("[data-href]");
      return el instanceof HTMLElement ? el : null;
    };
    const go = (el: HTMLElement, newTab: boolean) => {
      const href = el.dataset.href!;
      if (newTab) {
        window.open(href, "_blank");
        return;
      }
      const url = new URL(href, location.href);
      // Полоса прогресса (NavProgress) слушает только a[href] — запускаем её сами.
      if (url.pathname !== location.pathname || url.search !== location.search)
        window.dispatchEvent(new Event("bbs:navstart"));
      router.push(href, { scroll: el.dataset.scroll !== "false" });
    };

    const onClick = (e: MouseEvent) => {
      const el = target(e);
      if (!el || e.defaultPrevented || e.button !== 0 || e.altKey) return;
      e.preventDefault();
      go(el, e.ctrlKey || e.metaKey || e.shiftKey);
    };
    const onAuxClick = (e: MouseEvent) => {
      const el = target(e);
      if (!el || e.defaultPrevented || e.button !== 1) return;
      e.preventDefault();
      go(el, true);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const el = target(e);
      if (!el || e.defaultPrevented || e.key !== "Enter" || e.target !== el) return;
      e.preventDefault();
      if (e.ctrlKey || e.metaKey || e.shiftKey) go(el, true);
      // Обычный Enter — синтетический клик: его ловит и LeadModal.
      else el.click();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("auxclick", onAuxClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("auxclick", onAuxClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [router]);

  return null;
}
