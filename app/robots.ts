import type { MetadataRoute } from "next";

import { SITE_URL } from "./_lib/site";

/** robots.txt: сайт открыт, админка закрыта; варианты фильтров закрыты через noindex. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
