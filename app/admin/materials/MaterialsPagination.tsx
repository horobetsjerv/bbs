"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@astryxdesign/core/Pagination";

/**
 * Фильтры бренда и поиска приходят пропсами, а не из useSearchParams:
 * так компоненту не нужен Suspense-барьер, а ссылка остаётся полной.
 */
export function MaterialsPagination({
  page,
  total,
  perPage,
  brandSlug,
  query,
}: {
  page: number;
  total: number;
  perPage: number;
  brandSlug?: string;
  query?: string;
}) {
  const router = useRouter();

  const goToPage = (next: number) => {
    const params = new URLSearchParams();
    if (brandSlug) params.set("brand", brandSlug);
    if (query) params.set("q", query);
    if (next > 1) params.set("page", String(next));
    router.push(
      params.size ? `/admin/materials?${params}` : "/admin/materials",
    );
  };

  return (
    <Pagination
      page={page}
      totalItems={total}
      pageSize={perPage}
      onChange={goToPage}
      label="Сторінки каталогу"
      size="sm"
    />
  );
}
