// Адрес сайта для canonical, sitemap.xml и robots.txt.
// Новый сайт встаёт на место старого (301 со старого WordPress); на другом домене — SITE_URL.
export const SITE_URL = (process.env.SITE_URL ?? "https://bbs.in.ua").replace(/\/+$/, "");

/**
 * Откуда реально отдаются картинки для превью ссылок (og:image) и JSON-LD.
 * Пока сайт не переехал на bbs.in.ua, там старый WordPress без наших файлов —
 * на демо Vercel берём его production-домен (VERCEL_PROJECT_PRODUCTION_URL).
 */
export const ASSET_URL = process.env.SITE_URL
  ? SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : SITE_URL;

/** Абсолютный адрес страницы сайта (для JSON-LD). */
export const pageUrl = (path: string) => new URL(path, `${SITE_URL}/`).href;

/** Абсолютный адрес картинки: внешние (Laminam, Vicostone) — как есть. */
export const assetUrl = (src: string) => new URL(src, `${ASSET_URL}/`).href;

export const SITE_NAME = "BBS";

/** Общая часть Open Graph: страница, задающая свой openGraph, повторяет её. */
export const OG_BASE = {
  type: "website" as const,
  siteName: SITE_NAME,
  locale: "uk_UA",
  images: [{ url: assetUrl("/og/bbs.jpg"), width: 1200, height: 630, alt: "BBS — Laminam і Vicostone" }],
};
