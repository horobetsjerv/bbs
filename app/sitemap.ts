import type { MetadataRoute } from "next";

import { getSitemapCatalog } from "./_lib/catalog";
import { getPosts, getProjects } from "./_lib/content";
import { SITE_URL } from "./_lib/site";

// Адреса — со слешем в конце (trailingSlash в next.config.ts), как в таблице структуры.
const STATIC = ["/", "/laminam/", "/vicostone/", "/kataloh/", "/kataloh/laminam/", "/proekty/", "/blog/", "/kontakty/", "/pro-nas/", "/spivpratsia/", "/showroom/"];

/**
 * sitemap.xml: только индексируемые адреса — страницы, подборки каталога
 * с 3+ товарами (как в robots у самих подборок), товары, изделия, статьи.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, projects, posts] = await Promise.all([
    getSitemapCatalog(),
    getProjects(),
    getPosts(),
  ]);
  const paths = [
    ...STATIC,
    ...catalog.landings,
    ...catalog.products,
    ...projects.map((p) => p.href),
    ...posts.map((p) => p.href),
  ];
  return [...new Set(paths)].map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
