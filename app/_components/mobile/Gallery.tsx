"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

import type { GalleryImage } from "../product/ProductGallery";

/** Больше семи точек не влезает красиво: дальше — «окно», едущее за активной. */
const MAX_DOTS = 7;
const DOT = 12;
const DOT_STEP = DOT + 8;

/**
 * Фото товара 375×336 (Figma 1260:10073): листается свайпом, точки «bread»
 * снизу — 12px через 8, активная blue. Клик по точке — переход к фото.
 * Фото больше семи — видно окно из семи точек вокруг активной; крайние
 * уменьшены, если за ними есть ещё.
 */
export default function MobileGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };
  const many = images.length > MAX_DOTS;
  const start = many
    ? Math.min(Math.max(active - Math.floor(MAX_DOTS / 2), 0), images.length - MAX_DOTS)
    : 0;
  const end = start + MAX_DOTS - 1;
  const go = (i: number) => {
    const el = trackRef.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative h-[336px] w-full shrink-0 bg-[#d9d9d9]">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex size-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <img
            key={img.full + i}
            src={img.full}
            alt={img.alt || title}
            loading={i === 0 ? "eager" : "lazy"}
            className="block size-full max-w-none shrink-0 snap-start object-cover"
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 0 1px var(--color-light-gray)" }}
      />
      {images.length > 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 py-[16px]">
          <div
            className="overflow-hidden"
            style={many ? { width: MAX_DOTS * DOT_STEP - (DOT_STEP - DOT) } : undefined}
          >
            <div
              className="flex items-center gap-[8px] transition-transform duration-300"
              style={{ transform: `translateX(-${start * DOT_STEP}px)` }}
            >
              {images.map((_, i) => {
                const hidden = i < start || i > end;
                const edge =
                  many && ((i === start && start > 0) || (i === end && end < images.length - 1));
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Фото ${i + 1}`}
                    aria-current={i === active}
                    tabIndex={hidden ? -1 : undefined}
                    onClick={() => go(i)}
                    className={`block size-[12px] shrink-0 cursor-pointer rounded-full transition-[scale,background-color] duration-300 ${
                      i === active ? "bg-blue" : "bg-white"
                    } ${edge ? "scale-[0.66]" : ""}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
