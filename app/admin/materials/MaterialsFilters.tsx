"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@astryxdesign/core/Button";
import { Grid } from "@astryxdesign/core/Grid";
import { HStack, StackItem } from "@astryxdesign/core/Layout";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { TextInput } from "@astryxdesign/core/TextInput";

const BRANDS = [
  { value: "", label: "Всі бренди" },
  { value: "laminam", label: "Laminam" },
  { value: "vicostone", label: "Vicostone" },
];

export function MaterialsFilters({
  brandSlug,
  query,
}: {
  brandSlug?: string;
  query?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(query ?? "");

  const apply = (next: { brand?: string; q?: string }) => {
    const params = new URLSearchParams();
    const brand = next.brand ?? brandSlug ?? "";
    const q = next.q ?? search;
    if (brand) params.set("brand", brand);
    // Поиск от 2 символов — короче запрос отдаёт весь каталог и не имеет смысла.
    if (q.trim().length >= 2) params.set("q", q.trim());
    router.push(
      params.size ? `/admin/materials?${params}` : "/admin/materials",
    );
  };

  // Grid сам переводит фильтры в одну колонку на узком экране: на мобиле поиск
  // не должен ужиматься до иконки рядом с переключателем брендов.
  return (
    <Grid columns={{ minWidth: 320 }} gap={2} align="center">
      <SegmentedControl
        label="Бренд"
        value={brandSlug ?? ""}
        onChange={(value) => apply({ brand: value })}
        layout="fill"
      >
        {BRANDS.map((brand) => (
          <SegmentedControlItem
            key={brand.value || "all"}
            value={brand.value}
            label={brand.label}
          />
        ))}
      </SegmentedControl>

      <HStack gap={2} vAlign="center">
        <StackItem size="fill">
          <TextInput
            label="Пошук"
            isLabelHidden
            placeholder="Назва або артикул"
            value={search}
            onChange={setSearch}
            startIcon="search"
            hasClear
            width="100%"
          />
        </StackItem>
        <Button label="Знайти" onClick={() => apply({})} />
      </HStack>
    </Grid>
  );
}
