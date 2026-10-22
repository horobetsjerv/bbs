import type { SearchParams } from "@/app/_lib/catalog";
import CatalogTemplate, { catalogMetadata } from "@/app/_components/catalog/CatalogTemplate";

type Props = { searchParams: Promise<SearchParams> };

export async function generateMetadata({ searchParams }: Props) {
  return catalogMetadata(await searchParams);
}

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <CatalogTemplate
      params={params}
      breadcrumb={["Головна", "Каталог"]}
      heroOverlay="/figma/catalog/hero-bbs.png"
      bbs
      bottomGap={20}
    />
  );
}
