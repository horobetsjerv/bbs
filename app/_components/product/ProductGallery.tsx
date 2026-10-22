"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import { inset } from "../bbs/ui";

export type GalleryImage = { full: string; thumb: string; alt: string };

const VISIBLE = 4;

/** Треугольник weui:arrow-filled 12×24 (в макете 8×16 — мелко); влево — отражением. */
function Arrow({
  back = false,
  light = false,
  disabled,
  onClick,
}: {
  back?: boolean;
  light?: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={back ? "Попереднє фото" : "Наступне фото"}
      disabled={disabled}
      onClick={onClick}
      className="flex h-[24px] w-[12px] shrink-0 cursor-pointer disabled:cursor-default disabled:opacity-30"
    >
      <img
        src={
          light
            ? "/figma/bbs/arrow-filled-light.svg"
            : "/figma/catalog/arrow-filled.svg"
        }
        alt=""
        aria-hidden
        className={`block h-[24px] w-[12px] max-w-none ${back ? "-scale-x-100" : ""}`}
      />
    </button>
  );
}

/**
 * Галерея 548×398: превью поверх фото (в макете у товара на y 298,
 * у изделия на 278). Клик по превью меняет фото, стрелки листают.
 * `wide` — изделие: фото на всю колонку, ряд превью 548px по центру.
 */
export default function ProductGallery({
  images,
  title,
  thumbsTop,
  lightRightArrow = false,
  wide = false,
}: {
  images: GalleryImage[];
  title: string;
  thumbsTop: number;
  lightRightArrow?: boolean;
  wide?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const current = images[active];

  const select = (i: number) => {
    setActive(i);
    if (i < offset) setOffset(i);
    if (i >= offset + VISIBLE) setOffset(i - VISIBLE + 1);
  };

  return (
    <div
      className={`relative h-[398px] shrink-0 bg-[#d9d9d9] ${wide ? "w-full" : "w-[548px]"}`}
    >
      {current && (
        <img
          key={current.full}
          src={current.full}
          alt={current.alt || title}
          className="absolute inset-0 size-full max-w-none object-cover"
        />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={inset("var(--color-light-gray)")}
      />
      {/* Одно фото — превью и стрелки не нужны. Меньше четырёх — пустых
          рамок не рисуем, превью по центру; стрелки в 12px от краёв фото. */}
      {images.length > 1 && (
        <div
          className={`absolute flex w-[548px] items-center justify-between gap-[12px] px-[12px] ${
            wide ? "left-1/2 -translate-x-1/2" : "left-0"
          }`}
          style={{ top: thumbsTop }}
        >
          <Arrow back disabled={active <= 0} onClick={() => select(active - 1)} />
          <div className="flex items-center gap-[24px]">
            {images.slice(offset, offset + VISIBLE).map((img, k) => {
              const i = offset + k;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Фото ${i + 1}`}
                  aria-current={i === active}
                  onClick={() => select(i)}
                  className={`relative size-[100px] shrink-0 cursor-pointer ${
                    i === active ? "outline-2 -outline-offset-2 outline-blue" : ""
                  }`}
                >
                  <img
                    src={img.thumb}
                    alt=""
                    className="block size-full object-cover"
                  />
                </button>
              );
            })}
          </div>
          <Arrow
            light={lightRightArrow}
            disabled={active >= images.length - 1}
            onClick={() => select(active + 1)}
          />
        </div>
      )}
    </div>
  );
}
