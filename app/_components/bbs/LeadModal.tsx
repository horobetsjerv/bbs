"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";

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
  // data-state="open" — окно и затемнение проявились (CSS-переход).
  const [shown, setShown] = useState(false);
  const closing = useRef(false);

  /**
   * Закрытие с анимацией — одно для крестика, Escape и клика по затемнению:
   * сначала гасим окно и фон, по окончании перехода — dialog.close().
   * Таймер — на случай, если transitionend не придёт.
   */
  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closing.current) return;
    closing.current = true;
    setShown(false);
    const done = () => {
      clearTimeout(timer);
      dialog.removeEventListener("transitionend", onEnd);
      closing.current = false;
      dialog.close();
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === dialog && e.propertyName === "opacity") done();
    };
    dialog.addEventListener("transitionend", onEnd);
    const timer = setTimeout(done, 400);
  }, []);

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
    // Через кадр — чтобы браузер успел отрисовать начальное (скрытое) состояние.
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    const root = document.documentElement;
    const prev = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    // Блокировка прокрутки убирает полосу прокрутки — её ширину возмещаем
    // отступом, иначе контент под модалкой съезжает вправо.
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    const onClose = () => {
      cancelAnimationFrame(frame);
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.paddingRight;
      setShown(false);
      setPreset(null);
    };
    dialog.addEventListener("close", onClose, { once: true });
  }, [preset, openId]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="lead-modal-title"
      data-state={shown ? "open" : "closed"}
      // Escape: вместо мгновенного закрытия браузером — та же анимация.
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      // Клик по затемнению вокруг окна закрывает его.
      onClick={(e) => e.target === e.currentTarget && close()}
      // Появление: фон затемняется, окно проявляется и подъезжает на 16px с
      // лёгким увеличением; закрытие — обратно. При prefers-reduced-motion —
      // только прозрачность.
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(557px,calc(100%-32px))] translate-y-[16px] scale-[0.98] overflow-y-auto bg-light-gray p-0 opacity-0 transition-[opacity,translate,scale] duration-200 ease-out backdrop:bg-black/0 backdrop:transition-[background-color] backdrop:duration-200 data-[state=open]:translate-y-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=open]:backdrop:bg-black/60 motion-reduce:translate-y-0 motion-reduce:scale-100"
      style={inset("var(--color-back-card-gray)")}
    >
      {preset && (
        <div className="relative flex w-full flex-col items-start gap-[24px] p-[40px] max-md:px-[16px] max-md:py-[24px]">
          <button
            type="button"
            aria-label="Закрити"
            onClick={close}
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
