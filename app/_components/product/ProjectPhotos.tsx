"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { H2_SB } from "../bbs/ui";
import type { GalleryImage } from "./ProductGallery";

// Фото изделия (/proekty/…): сверху — главное фото целиком, со стрелками и
// счётчиком; ниже блоков заявки — сетка всех фото; клик открывает фото
// крупно (lightbox). Фото из админки лежат в public/uploads — их отдаёт
// next/image: webp/avif нужного размера, ниже первого экрана — лениво.

/** Локальное фото — через next/image (сжатие и размер), внешнее — как есть. */
function Photo({
  img,
  sizes,
  fit,
  priority = false,
  className = "",
}: {
  img: GalleryImage;
  sizes: string;
  fit: "contain" | "cover";
  priority?: boolean;
  className?: string;
}) {
  const cls = `${fit === "contain" ? "object-contain" : "object-cover"} ${className}`;
  if (!img.full.startsWith("/"))
    return (
      <img
        src={img.full}
        alt={img.alt}
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 size-full ${cls}`}
      />
    );
  return <Image src={img.full} alt={img.alt} fill sizes={sizes} priority={priority} className={cls} />;
}

/** Круглая кнопка-стрелка поверх фото: белая, с тенью — видна на любом снимке. */
function NavButton({ dir, onClick, big = false }: { dir: -1 | 1; onClick: () => void; big?: boolean }) {
  return (
    <button
      type="button"
      aria-label={dir < 0 ? "Попереднє фото" : "Наступне фото"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-[1] flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_2px_10px_rgb(0_0_0/0.18)] transition-colors duration-250 ease-out hover:bg-white hover:text-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
        big ? "size-[56px]" : "size-[48px]"
      } ${dir < 0 ? (big ? "left-[24px]" : "left-[16px]") : big ? "right-[24px]" : "right-[16px]"}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden className={`size-[24px] ${dir < 0 ? "-scale-x-100" : ""}`}>
        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Счётчик «2 / 9» в углу фото. */
function Counter({ index, total }: { index: number; total: number }) {
  return (
    <span
      aria-live="polite"
      className="absolute right-[16px] bottom-[16px] z-[1] rounded-full bg-black/60 px-[12px] py-[6px] text-[14px] leading-[16px] font-semibold text-white tabular-nums"
    >
      {index + 1} / {total}
    </span>
  );
}

/**
 * Фото крупно: <dialog> на весь экран, стрелки и ←/→, Escape и клик по фону
 * закрывают. Открытие и закрытие — плавное проявление (как у формы заявки).
 */
function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  const open = index !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog || dialog.open) return;
    dialog.showModal();
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onCloseEvent = () => {
      cancelAnimationFrame(frame);
      root.style.overflow = prev;
      setShown(false);
      onClose();
    };
    dialog.addEventListener("close", onCloseEvent, { once: true });
  }, [open, onClose]);

  /** Закрыть с анимацией: сначала гасим, по окончании — dialog.close(). */
  const close = useCallback(() => {
    const dialog = ref.current;
    if (!dialog?.open) return;
    setShown(false);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => dialog.close(), reduce ? 0 : 200);
  }, []);

  const n = images.length;
  const go = (d: number) => index !== null && onIndex((index + d + n) % n);

  return (
    <dialog
      ref={ref}
      aria-label="Фото виробу"
      data-state={shown ? "open" : "closed"}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onKeyDown={(e) => {
        // Не всплывать в галерею под окном — она бы тоже листала.
        e.stopPropagation();
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onClick={close}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 opacity-0 transition-opacity duration-200 ease-out backdrop:bg-black/95 data-[state=open]:opacity-100 motion-reduce:transition-none"
    >
      {index !== null && (
        <div className="relative size-full">
          <div className="absolute inset-[56px_96px] max-md:inset-[56px_8px]" onClick={(e) => e.stopPropagation()}>
            <Photo key={images[index].full} img={images[index]} sizes="100vw" fit="contain" priority />
          </div>
          {n > 1 && (
            <>
              <NavButton dir={-1} onClick={() => go(-1)} big />
              <NavButton dir={1} onClick={() => go(1)} big />
              <span className="absolute top-[18px] left-1/2 -translate-x-1/2 text-[16px] leading-[20px] font-semibold text-white tabular-nums">
                {index + 1} / {n}
              </span>
            </>
          )}
          <button
            type="button"
            aria-label="Закрити"
            autoFocus
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-[8px] right-[8px] flex size-[40px] cursor-pointer items-center justify-center text-white transition-colors duration-250 ease-out hover:text-back-card-gray focus-visible:outline-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-[24px]">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </dialog>
  );
}

/**
 * Главное фото изделия: целиком (contain) — вертикальные и горизонтальные
 * снимки без обрезки. Поля по бокам заполняет то же фото, размытое и чуть
 * затемнённое (маленькая копия, ~5 КБ), а не пустые серые полосы. Стрелки по
 * бокам, счётчик в углу, клик — крупно. Листание по кругу.
 */
export function ProjectSlider({ images, compact = false }: { images: GalleryImage[]; compact?: boolean }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const closeZoom = useCallback(() => setZoom(null), []);
  const n = images.length;
  if (!n) return null;
  const go = (d: number) => setActive((i) => (i + d + n) % n);
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden bg-[#3a3a3a] ${compact ? "h-[360px]" : "h-[640px]"}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <button
        type="button"
        aria-label={`Відкрити фото ${active + 1} з ${n} крупно`}
        onClick={() => setZoom(active)}
        className="absolute inset-0 cursor-zoom-in"
      >
        <span key={images[active].full} className="absolute inset-0 motion-safe:animate-[bbs-fade_250ms_ease-out]">
          <span aria-hidden className="absolute inset-0 scale-110 blur-2xl brightness-[0.7]">
            <Photo img={{ ...images[active], alt: "" }} sizes="200px" fit="cover" />
          </span>
          <Photo img={images[active]} sizes={compact ? "100vw" : "1120px"} fit="contain" priority={active === 0} />
        </span>
      </button>
      {n > 1 && (
        <>
          <NavButton dir={-1} onClick={() => go(-1)} />
          <NavButton dir={1} onClick={() => go(1)} />
          <Counter index={active} total={n} />
        </>
      )}
      <Lightbox images={images} index={zoom} onIndex={setZoom} onClose={closeZoom} />
    </div>
  );
}

/** «Палітра»: сетка всех фото изделия; клик — фото крупно. */
export function ProjectPhotoGrid({ images, compact = false }: { images: GalleryImage[]; compact?: boolean }) {
  const [zoom, setZoom] = useState<number | null>(null);
  const closeZoom = useCallback(() => setZoom(null), []);
  if (images.length < 2) return null;
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <h2 className={`text-trim ${compact ? "text-[24px] leading-[24px] font-semibold tracking-[-1.2px]" : H2_SB} text-ink`}>
        Фото виробу
      </h2>
      <ul className={`grid w-full ${compact ? "grid-cols-2 gap-[8px]" : "grid-cols-4 gap-[16px]"}`}>
        {images.map((img, i) => (
          <li key={img.full + i}>
            <button
              type="button"
              aria-label={`Відкрити фото ${i + 1} з ${images.length}`}
              onClick={() => setZoom(i)}
              className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-light-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              <Photo
                img={img}
                sizes={compact ? "50vw" : "270px"}
                fit="cover"
                className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={zoom} onIndex={setZoom} onClose={closeZoom} />
    </section>
  );
}
