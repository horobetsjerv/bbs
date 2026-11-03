"use client";

import { Badge } from "@astryxdesign/core/Badge";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Table, pixel, proportional } from "@astryxdesign/core/Table";
import { Pencil } from "lucide-react";

export type CollectionTableRow = {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  brandSlug: string;
  materialCount: number;
  [key: string]: unknown;
};

export function CollectionsTable({ rows }: { rows: CollectionTableRow[] }) {
  return (
    <Table<CollectionTableRow>
      data={rows}
      idKey="id"
      density="compact"
      hasHover
      dividers="rows"
      textOverflow="truncate"
      columns={[
        {
          key: "name",
          header: "Назва",
          width: proportional(2),
          renderCell: (row) => (
            <Link href={`/admin/collections/${row.id}`}>{row.name}</Link>
          ),
        },
        { key: "brandName", header: "Бренд", width: pixel(120) },
        { key: "slug", header: "Слаг", width: proportional(1) },
        {
          key: "materialCount",
          header: "Матеріалів",
          width: pixel(130),
          // Пустая коллекция ничего не даст каталогу — её видно сразу.
          renderCell: (row) =>
            row.materialCount ? (
              <Link
                href={`/admin/materials?brand=${row.brandSlug}`}
              >{`${row.materialCount}`}</Link>
            ) : (
              <Badge label="Порожня" variant="neutral" />
            ),
        },
        {
          key: "id",
          header: "Дії",
          width: pixel(72),
          renderCell: (row) => (
            <HStack gap={1} vAlign="center">
              <Link href={`/admin/collections/${row.id}`}>
                <IconButton
                  label={`Редагувати ${row.name}`}
                  icon={<Icon icon={Pencil} size="sm" />}
                  variant="ghost"
                  size="sm"
                  tooltip="Редагувати"
                />
              </Link>
            </HStack>
          ),
        },
      ]}
    />
  );
}
