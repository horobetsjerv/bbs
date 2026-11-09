/**
 * Текст статьи из редактора админки (HTML). Стили тегов — типографика сайта:
 * заголовки плотные, абзацы с межстрочкой 1.5, пустые абзацы редактора скрыты.
 */
const BASE = [
  "flex flex-col gap-[1.25rem] text-ink",
  "[&_p]:font-light [&_p]:leading-[1.5] [&_p]:tracking-[-0.02em]",
  "[&_p:empty]:hidden",
  "[&_h2]:mt-[1rem] [&_h2]:font-semibold [&_h2]:leading-[0.9] [&_h2]:tracking-[-0.05em]",
  "[&_h3]:mt-[0.5rem] [&_h3]:text-[1.25rem] [&_h3]:font-semibold [&_h3]:leading-[0.9] [&_h3]:tracking-[-0.05em]",
  "[&_a]:text-blue [&_a]:underline [&_a:hover]:text-red",
  "[&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-[1.25em] [&_li]:font-light [&_li]:leading-[1.5]",
  "[&_img]:h-auto [&_img]:w-full",
  "[&_strong]:font-semibold",
];

export const PROSE = [
  ...BASE,
  "[&_p]:text-[1.125rem] [&_li]:text-[1.125rem] [&_h2]:text-[2rem]",
  // Десктопная копия: заголовки — p[data-h] (см. desktopHeadings), вид как у h2/h3.
  "[&_[data-h='2']]:mt-[1rem] [&_[data-h='2']]:text-[2rem] [&_[data-h='2']]:font-semibold [&_[data-h='2']]:leading-[0.9] [&_[data-h='2']]:tracking-[-0.05em]",
  "[&_[data-h='3']]:mt-[0.5rem] [&_[data-h='3']]:text-[1.25rem] [&_[data-h='3']]:font-semibold [&_[data-h='3']]:leading-[0.9] [&_[data-h='3']]:tracking-[-0.05em]",
].join(" ");

/**
 * HTML статьи для десктопной копии: h2–h6 → <p role="heading" data-h>, чтобы
 * настоящие заголовки были только в мобильной копии (SEO-аудит, см. Heading).
 */
export const desktopHeadings = (html: string) =>
  html
    .replace(/<h([2-6])(\s[^>]*)?>/gi, (_, l, attrs = "") => `<p role="heading" aria-level="${l}" data-h="${l}"${attrs}>`)
    .replace(/<\/h[2-6]>/gi, "</p>");

/** Мобильная статья: текст 16, подзаголовки 24 (как H2_mob в макетах). */
export const PROSE_MOBILE = [...BASE, "[&_p]:text-[1rem] [&_li]:text-[1rem] [&_h2]:text-[1.5rem]"].join(" ");
