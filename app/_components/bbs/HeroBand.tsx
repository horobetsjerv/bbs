/* eslint-disable @next/next/no-img-element */
import { Breadcrumbs } from "./ui";

/**
 * Тёмная полоса героя внутренних страниц: Rectangle 1280×368 на 4px ниже
 * шапки. База — кроп фото Laminam (как в Figma) и затемнение 60%.
 * `overlay` — фото поверх базы: под затемнением (каталог BBS, cover)
 * или над ним (блог, заливка во весь бокс).
 * `height` — высота полосы, если текст героя длиннее макета (по умолчанию
 * 368); кадр фото при этом масштабируется равномерно, без растяжения.
 */
export default function HeroBand({
  breadcrumb,
  overlay,
  height,
  children,
}: {
  breadcrumb: string[];
  overlay?: { src: string; above?: boolean };
  height?: number;
  children: React.ReactNode;
}) {
  // Ширина кадра задана в % от ширины, высота — в % от высоты полосы:
  // при другой высоте ширину увеличиваем в той же пропорции.
  const zoom = height ? height / 368 : 1;
  return (
    <section className="relative flex w-full min-w-[1280px] flex-col items-center">
      <div
        aria-hidden
        className="absolute inset-x-0 top-[4px] h-[368px] overflow-hidden"
        style={height ? { height } : undefined}
      >
        <img
          src="/figma/bbs/hero-laminam.jpg"
          alt=""
          className="absolute top-[-127.99%] left-0 h-[465.83%] w-[173.05%] max-w-none"
          style={height ? { width: `${173.05 * zoom}%` } : undefined}
        />
        {overlay && !overlay.above && (
          <img
            src={overlay.src}
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        {overlay?.above && (
          <img
            src={overlay.src}
            alt=""
            className="absolute inset-0 size-full max-w-none object-fill"
          />
        )}
      </div>

      <div className="relative flex w-[1120px] flex-col items-start pt-[12px]">
        <Breadcrumbs items={breadcrumb} />
        <div className="mt-[16px] w-full">{children}</div>
      </div>
    </section>
  );
}
