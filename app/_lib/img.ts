import { getImageProps } from "next/image";

/**
 * Фото из /uploads и /figma (товары, изделия, статьи, коллекции) для обычного <img>:
 * через оптимизатор Next — WebP под размер показа, 1x и 2x (SEO-аудит:
 * картинки до 100–150 КБ). В /uploads лежат мастер-копии высокого качества,
 * размер под конкретное место делает оптимизатор. Остальные адреса — как есть.
 *
 * `width` × `height` — размер рамки в CSS px. Фото в ней обрезается
 * (object-cover), поэтому под узкую высокую рамку нужна ширина больше
 * рамки: берём с запасом под фото 3:2.
 * `src` — версия 1x (её видят и сканеры), 2x браузер берёт из srcSet.
 */
export function imgSrc(src: string, width: number, height?: number) {
  // Растровые картинки сайта: загрузки и обложки коллекций (/figma/… из базы). SVG — как есть.
  if (!/^\/(uploads|figma)\/.+\.(jpe?g|png|webp|avif)$/i.test(src)) return { src };
  const w = Math.max(width, Math.round((height ?? 0) * 1.5));
  const { props } = getImageProps({ src, width: w, height: w, alt: "" });
  return { src: props.srcSet?.split(" ")[0] ?? props.src, srcSet: props.srcSet };
}
