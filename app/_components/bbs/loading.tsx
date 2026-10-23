"use client";

import { useEffect, useState } from "react";

import { H4_BTN, H4_L, HOVER_EASE } from "./ui";

/**
 * Флаг, который включается, только если `on` держится дольше `ms`:
 * лоадер не мигает на быстрых ответах (M10 — показывать после ~200 мс).
 */
export function useDelayed(on: boolean, ms = 200) {
  const [late, setLate] = useState(false);
  useEffect(() => {
    if (!on) {
      const reset = setTimeout(() => setLate(false), 0);
      return () => clearTimeout(reset);
    }
    const timer = setTimeout(() => setLate(true), ms);
    return () => clearTimeout(timer);
  }, [on, ms]);
  return on && late;
}

/** Скелетон карточки каталога (desktop 262×~390 / mobile — по ширине колонки). */
export function CardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden
      className={`flex flex-col gap-[24px] bg-white pb-[8px] shadow-[inset_0_0_0_1px_var(--color-light-gray)] ${
        compact ? "aspect-[167.5/240] w-full gap-[12px]" : "w-[262px]"
      }`}
    >
      <div className={`bbs-skeleton w-full ${compact ? "min-h-px flex-1" : "h-[304px]"}`} />
      <div className={`flex flex-col gap-[10px] ${compact ? "px-[8px]" : "px-[16px]"}`}>
        <div className="bbs-skeleton h-[14px] w-[60%]" />
        <div className="bbs-skeleton h-[14px] w-[40%]" />
        {!compact && <div className="bbs-skeleton h-[12px] w-[50%]" />}
      </div>
    </div>
  );
}

/** Пустой результат или ошибка загрузки списка: заголовок, пояснение, кнопка. */
export function ListMessage({
  title,
  text,
  action,
  onAction,
  tone = "empty",
  compact = false,
}: {
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
  tone?: "empty" | "error";
  compact?: boolean;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex w-full flex-col items-start gap-[16px] bg-light-gray shadow-[inset_0_0_0_1px_var(--color-back-card-gray)] ${
        compact ? "px-[16px] py-[24px]" : "px-[40px] py-[40px]"
      }`}
    >
      <p className={`text-[20px] font-semibold leading-[24px] tracking-[-1px] ${tone === "error" ? "text-red" : "text-ink"}`}>
        {title}
      </p>
      <p className={`${H4_L} text-card-gray`}>{text}</p>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`mt-[8px] cursor-pointer bg-blue px-[24px] py-[14px] ${H4_BTN} text-white transition-colors ${HOVER_EASE} hover:bg-red`}
        >
          {action}
        </button>
      )}
    </div>
  );
}
