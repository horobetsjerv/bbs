"use client";

import { useRef } from "react";
import { SectionHeader, SwapIcon, inset } from "../bbs/ui";
import { REVIEWS, ReviewCard } from "./ReviewCard";

/** Шаг прокрутки — карточка 262 + зазор 24. */
const STEP = 286;

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

export default function Reviews() {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) =>
    track.current?.scrollBy({ left: dir * STEP, behavior: "smooth" });
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title="Відгуки клієнтів і партнерів BBS"
        action={
          <div className="flex gap-[8px]">
            <ScrollBtn dir={-1} onClick={() => scroll(-1)} />
            <ScrollBtn dir={1} onClick={() => scroll(1)} />
          </div>
        }
      />
      <div
        ref={track}
        className="flex w-full snap-x snap-mandatory items-stretch gap-[24px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {REVIEWS.map((r) => (
          <ReviewCard key={r.name} {...r} />
        ))}
      </div>
    </section>
  );
}
