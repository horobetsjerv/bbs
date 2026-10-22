"use client";

import { useEffect } from "react";

/**
 * Плавное появление блоков при прокрутке. Анимируются прямые дети
 * контейнеров с атрибутом `data-reveal` (секции страницы): когда блок
 * заходит в экран, ему ставится `.is-visible`, дальше работает CSS
 * из globals.css. Срабатывает один раз на блок.
 */
export default function Reveal() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal] > *");
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
