"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { SectionHeader, SwapIcon, inset } from "../bbs/ui";
import { REVIEWS, ReviewCard } from "./ReviewCard";

/** Пауза между автоматическими перелистываниями. */
const INTERVAL = 4000;

/**
 * Слайдер ленты отзывов: шаг — одна карточка (ширина + зазор ленты),
 * с конца возвращается в начало и наоборот. Сам листает каждые INTERVAL,
 * пока курсор или палец не на карточках; ручное листание сбрасывает отсчёт.
 */
function useSlider(getTrack: () => HTMLElement | null) {
  const paused = useRef(false);
  const lastMove = useRef(0);

  const go = useCallback(
    (dir: -1 | 1) => {
      const t = getTrack();
      const card = t?.firstElementChild as HTMLElement | null;
      if (!t || !card) return;
      const step = card.offsetWidth + (parseFloat(getComputedStyle(t).columnGap) || 0);
      const max = t.scrollWidth - t.clientWidth;
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      // По номеру карточки, а не по пикселям: клик посреди плавной прокрутки не сбивает цикл.
      const last = Math.ceil(max / step - 0.05);
      const i = Math.round(t.scrollLeft / step);
      const next = dir > 0 ? (i >= last ? 0 : i + 1) : i <= 0 ? last : i - 1;
      const left = Math.min(next * step, max);
      t.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
      lastMove.current = Date.now();
    },
    [getTrack],
  );

  useEffect(() => {
    lastMove.current = Date.now();
    const id = setInterval(() => {
      if (paused.current || document.hidden || Date.now() - lastMove.current < INTERVAL) return;
      go(1);
    }, 500);
    return () => clearInterval(id);
  }, [go]);

  const handlers = useMemo(() => {
    const pause = (on: boolean) => {
      paused.current = on;
      lastMove.current = Date.now();
    };
    return {
      onMouseEnter: () => pause(true),
      onMouseLeave: () => pause(false),
      onTouchStart: () => pause(true),
      onTouchEnd: () => pause(false),
    };
  }, []);
  return { go, handlers };
}

function ScrollBtn({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Попередні відгуки" : "Наступні відгуки"}
      className="group flex size-[40px] cursor-pointer items-center justify-center bg-white"
      style={inset("var(--color-light-gray)")}
    >
      <span className={dir < 0 ? "rotate-180" : ""}>
        <SwapIcon src="/figma/bbs/arrow-link-blue.svg" hover="/figma/bbs/arrow-link-hover.svg" />
      </span>
    </button>
  );
}

/** Мобильная карусель (MCarousel внутри) с тем же автолистанием. */
export function AutoSlide({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const { handlers } = useSlider(useCallback(() => box.current?.firstElementChild as HTMLElement | null, []));
  return (
    <div ref={box} className="w-full" {...handlers}>
      {children}
    </div>
  );
}

export default function Reviews() {
  const track = useRef<HTMLDivElement>(null);
  const { go, handlers } = useSlider(useCallback(() => track.current, []));
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title="Відгуки клієнтів і партнерів BBS"
        action={
          <div className="flex gap-[8px]">
            <ScrollBtn dir={-1} onClick={() => go(-1)} />
            <ScrollBtn dir={1} onClick={() => go(1)} />
          </div>
        }
      />
      <div
        ref={track}
        {...handlers}
        className="flex w-full snap-x snap-mandatory items-stretch gap-[24px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {REVIEWS.map((r) => (
          <ReviewCard key={r.name} {...r} />
        ))}
      </div>
    </section>
  );
}
