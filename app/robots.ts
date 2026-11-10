import type { MetadataRoute } from "next";

import { FILTER_KEYS } from "./_lib/catalog";
import { SITE_URL } from "./_lib/site";

/**
 * Параметры динамических фильтров: фильтры каталога (FILTER_KEYS) и сортировка,
 * рубрика и поиск блога, плюс общие из рекомендованного файла SEO (filter, order).
 */
const FILTER_PARAMS = [...new Set([...FILTER_KEYS, "sort", "order", "filter", "category", "q"])];

/**
 * robots.txt — рекомендованный файл SEO-аудита (Уляна), дополненный реальными
 * параметрами сайта: служебные разделы и динамические фильтры закрыты,
 * пагинация (?page=) открыта.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/*?page=", "/*?page=*&"],
      disallow: [
        "/admin/",
        "/admin-login/",
        "/api/",
        "/login/",
        ...FILTER_PARAMS.map((p) => `/*?*${p}=`),
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
