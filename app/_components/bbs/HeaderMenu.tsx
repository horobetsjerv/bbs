"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CAPTION, H2_L, Icon } from "./ui";

/** Палочка бургера: плавный сдвиг (без анимации при prefers-reduced-motion). */
const BAR = "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)]";
/** Блок панели: выезжает снизу вверх с задержкой по порядку (см. `delay`). */
const ITEM = "motion-safe:transition-[opacity,translate] motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)]";

type MenuLink = { label: string; href: string };

/**
 * Hamburger (Figma 1332:8933): p 8, иконка 20, скругление 6.
 * Открытое состояние — вариант Variant2 (minus). Панель меню в макете
 * не нарисована: бренды с логотипами, остальные пункты подвала крупным
 * H2_L, внизу контакты (собирает Header). Стили — из токенов.
 */
export default function HeaderMenu({
  brands,
  links,
  contacts,
}: {
  brands: (MenuLink & { logo: React.ReactNode; caption: string })[];
  links: MenuLink[];
  contacts: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Переход на другую страницу — меню закрывается.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Открытие — блоки по очереди, закрытие — все сразу.
  const shown = open ? "opacity-100" : "translate-y-3 opacity-0";
  const delay = (i: number) => ({ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" });
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex shrink-0 cursor-pointer items-center justify-center rounded-[6px] p-[8px]"
      >
        {/* Линии из menu.svg; при открытии крайние съезжают к средней — minus.svg. */}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="block size-[20px] overflow-visible"
          stroke="var(--color-blue)"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M3.334 4.166H16.666" className={`${BAR} ${open ? "translate-y-[5.834px]" : ""}`} />
          <path d="M3.334 10H16.666" />
          <path d="M3.334 15.834H16.666" className={`${BAR} ${open ? "-translate-y-[5.834px]" : ""}`} />
        </svg>
      </button>

      <nav
        id="mobile-menu"
        inert={!open}
        className={`absolute inset-x-0 top-full flex h-[calc(100dvh-100%)] flex-col gap-[32px] overflow-y-auto bg-white px-[16px] pt-[16px] pb-[max(32px,env(safe-area-inset-bottom))] motion-safe:transition-[opacity,translate,visibility] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {/* Бренды — одна плашка light_gray; линию между строками рисует фон в зазоре 1px. */}
        <div className={`flex flex-col gap-px bg-back-card-gray ${ITEM} ${shown}`} style={delay(0)}>
          {brands.map((b) => (
            <Link
              key={b.label}
              href={b.href}
              aria-label={b.label}
              onClick={close}
              className="flex items-center justify-between gap-[16px] bg-light-gray px-[16px] py-[20px]"
            >
              <span className="flex flex-col items-start gap-[10px]">
                {b.logo}
                <span className={`text-trim ${CAPTION} text-card-gray`}>{b.caption}</span>
              </span>
              <Icon src="/figma/bbs/arrow-link-blue.svg" size={20} />
            </Link>
          ))}
        </div>

        <ul className="flex flex-col">
          {links.map((l, i) => (
            <li key={l.label} className={`${ITEM} ${shown}`} style={delay(i + 1)}>
              <Link
                href={l.href}
                onClick={close}
                aria-current={l.href === pathname ? "page" : undefined}
                className={`flex items-center justify-between gap-[16px] py-[8px] ${H2_L} ${
                  l.href === pathname ? "text-blue" : "text-ink"
                }`}
              >
                <span className="text-trim">{l.label}</span>
                <Icon src="/figma/bbs/arrow-link-blue.svg" size={20} />
              </Link>
            </li>
          ))}
        </ul>

        {/* Клик по любой ссылке блока закрывает меню: «Зв’язатися» ведёт на якорь
            той же страницы, и смена pathname её не ловит. */}
        <div
          onClick={close}
          className={`mt-auto flex flex-col items-start gap-[8px] ${ITEM} ${shown}`}
          style={delay(links.length + 1)}
        >
          {contacts}
        </div>
      </nav>
    </>
  );
}
