import { notFound } from "next/navigation";

import CatalogTemplate, { catalogMetadata } from "@/app/_components/catalog/CatalogTemplate";
import { resolveLanding, type SearchParams } from "@/app/_lib/catalog";

type Props = {
  params: Promise<{ landing: string }>;
  searchParams: Promise<SearchParams>;
};

/**
 * Подборка единого каталога по статичному адресу (см. catalog-url.ts):
 * /kataloh/kvartsovyi-kamin/, /kataloh/kvartsovyi-kamin-bilyi/,
 * /kataloh/stilnytsi-z-keramogranitu/ …
 * /kataloh/laminam/ убран (дубль страницы бренда) — 301 в next.config.ts.
 */
export async function generateMetadata({ params, searchParams }: Props) {
  const { landing } = await params;
  const preset = await resolveLanding(landing);
  if (!preset) return {};
  return catalogMetadata(await searchParams, { preset, landing });
}

export default async function CatalogLandingPage({ params, searchParams }: Props) {
  const [{ landing }, query] = await Promise.all([params, searchParams]);
  const preset = await resolveLanding(landing);
  if (!preset) notFound();
  return (
    <CatalogTemplate
      params={query}
      preset={preset}
      landing={landing}
      breadcrumb={["Головна", "Каталог"]}
      heroOverlay="/figma/catalog/hero-bbs.png"
      bbs
      bottomGap={20}
    />
  );
}
