"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";

import { leadPreset } from "@/app/_lib/lead-preset";

import LeadFormFields, { type LeadPreset } from "./LeadFormFields";
import { H2_SB, MOB_L, inset } from "./ui";

/**
 * Форма заявки в модалке. Все кнопки заявки ведут на форму главной
 * (/?lead=…&material=…&about=…#lead-form); клик перехватывается на любой
 * странице, включая главную, и форма открывается поверх с тем же пресетом.
 * В макетах модалки нет — собрана из элементов формы.
 */
export default function LeadModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [preset, setPreset] = useState<LeadPreset | null>(null);
  // Номер открытия: форма пересоздаётся, после «Дякуємо» снова пустая.
  const [openId, setOpenId] = useState(0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || !/^#lead-form(-m)?$/.test(url.hash)) return;
      e.preventDefault();
      setPreset(leadPreset((k) => url.searchParams.get(k)));
      setOpenId((n) => n + 1);
    };
    // capture: раньше обработчиков ссылок, чтобы перехода не было.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Прямой переход на /?…#lead-form (новая вкладка, клик до загрузки скриптов):
  // сам браузер к форме не докручивает — плавная прокрутка html (scroll-smooth)
  // при загрузке сбивается, а якорь может быть от другой вёрстки (#lead-form —
  // десктоп, #lead-form-m — мобилка, видна одна). Крутим сразу к видимой форме;
  // после load — ещё раз, если картинки выше успели её сдвинуть.
  useEffect(() => {
    if (!/^#lead-form(-m)?$/.test(location.hash)) return;
    const toForm = () =>
      ["lead-form", "lead-form-m"]
        .map((id) => document.getElementById(id))
        .find((el) => el?.getClientRects().length)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    toForm();
    if (document.readyState === "complete") return;
    window.addEventListener("load", toForm, { once: true });
    return () => window.removeEventListener("load", toForm);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!preset || !dialog || dialog.open) return;
    dialog.showModal();
    const root = document.documentElement;
    const prev = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    // Блокировка прокрутки убирает полосу прокрутки — её ширину возмещаем
    // отступом, иначе контент под модалкой съезжает вправо.
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    const onClose = () => {
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.paddingRight;
      setPreset(null);
    };
    dialog.addEventListener("close", onClose, { once: true });
  }, [preset, openId]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="lead-modal-title"
      // Клик по затемнению вокруг окна закрывает его.
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(557px,calc(100%-32px))] overflow-y-auto bg-light-gray p-0 backdrop:bg-black/60"
      style={inset("var(--color-back-card-gray)")}
    >
      {preset && (
        <div className="relative flex w-full flex-col items-start gap-[24px] p-[40px] max-md:px-[16px] max-md:py-[24px]">
          <button
            type="button"
            aria-label="Закрити"
            onClick={() => dialogRef.current?.close()}
            className="absolute top-[8px] right-[8px] flex cursor-pointer items-center justify-center rounded-[6px] p-[8px]"
          >
            <img src="/figma/mobile/close.svg" alt="" aria-hidden className="block size-[20px]" />
          </button>
          <h2 id="lead-modal-title" className={`text-trim w-full pr-[32px] ${H2_SB} text-ink`}>
            Залиште заявку
          </h2>
          <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
            Наші менеджери зв’яжуться з вами та{" "}
            <span className="font-semibold">допоможуть з вибором.</span>
          </p>
          <LeadFormFields key={openId} preset={preset} compact />
        </div>
      )}
    </dialog>
  );
}
