"use client";

import { useEffect } from "react";

/**
 * Плавное появление блоков при прокрутке. Анимируются прямые дети
 * контейнеров с атрибутом `data-reveal` (секции страницы): когда блок
 * заходит в экран, ему ставится `.is-visible`, дальше работает CSS
 * из globals.css. Срабатывает один раз на блок.
 *
 * До гидратации всё видно; прятать начинаем только здесь (data-reveal-armed).
 * При первой загрузке блоки, уже стоящие в экране, остаются видимыми без
 * анимации — иначе они мигнули бы. При переходах внутри сайта атрибут уже
 * стоит, и новая страница проявляется целиком.
 */
export default function Reveal() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal] > *");
    const root = document.documentElement;
    if (!root.hasAttribute("data-reveal-armed")) {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-visible");
      });
      root.setAttribute("data-reveal-armed", "");
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
