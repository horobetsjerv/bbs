import { notFound } from "next/navigation";

import CatalogTemplate, { catalogMetadata } from "@/app/_components/catalog/CatalogTemplate";
import { resolveLanding, type SearchParams } from "@/app/_lib/catalog";
import { LAMINAM_CATALOG_PATH } from "@/app/_lib/catalog-url";

type Props = {
  params: Promise<{ landing: string }>;
  searchParams: Promise<SearchParams>;
};

/** /kataloh/laminam/ — каталог Laminam (макет Catalog LAM, раньше /laminam/catalog). */
const LAMINAM_LANDING = LAMINAM_CATALOG_PATH.split("/")[2];

/**
 * Подборка единого каталога по статичному адресу (см. catalog-url.ts):
 * /kataloh/kvartsovyi-kamin/, /kataloh/kvartsovyi-kamin-bilyi/,
 * /kataloh/stilnytsi-z-keramogranitu/ …
 * Исключение — /kataloh/laminam/: это каталог бренда Laminam в его дизайне.
 * Страница бренда Laminam — /laminam/ (app/laminam/page.tsx).
 */
export async function generateMetadata({ params, searchParams }: Props) {
  const { landing } = await params;
  if (landing === LAMINAM_LANDING) return catalogMetadata(await searchParams, { brand: "laminam" });
  const preset = await resolveLanding(landing);
  if (!preset) return {};
  return catalogMetadata(await searchParams, { preset, landing });
}

export default async function CatalogLandingPage({ params, searchParams }: Props) {
  const [{ landing }, query] = await Promise.all([params, searchParams]);
  if (landing === LAMINAM_LANDING) {
    // Как было на /laminam/catalog: выдача только Laminam, без групп «Тип» и
    // «Бренд», крошки через страницу бренда, до подвала 56px (макет LAM).
    return (
      <CatalogTemplate
        params={query}
        brand="laminam"
        breadcrumb={["Головна", "Laminam", "Каталог"]}
        bottomGap={56}
      />
    );
  }
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
