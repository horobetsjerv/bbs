"use client";

import { Badge } from "@astryxdesign/core/Badge";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Table, pixel, proportional } from "@astryxdesign/core/Table";
import { Eye, Pencil } from "lucide-react";

export type MaterialRow = {
  id: number;
  name: string;
  article: string;
  slug: string;
  inStock: boolean;
  isPublished: boolean;
  brandName: string;
  collectionName: string | null;
  [key: string]: unknown;
};

export function MaterialsTable({ rows }: { rows: MaterialRow[] }) {
  return (
    <Table<MaterialRow>
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
            <Link href={`/admin/materials/${row.id}`}>{row.name}</Link>
          ),
        },
        { key: "article", header: "Артикул", width: pixel(100) },
        { key: "brandName", header: "Бренд", width: pixel(110) },
        {
          key: "collectionName",
          header: "Колекція",
          width: proportional(1),
          renderCell: (row) => row.collectionName ?? "—",
        },
        {
          key: "inStock",
          header: "Наявність",
          // «Під замовлення» в бейдже плюс отступы ячейки не влезали в 125px и обрезались в «…».
          width: pixel(160),
          renderCell: (row) =>
            row.inStock ? (
              <Badge label="В наявності" variant="success" />
            ) : (
              <Badge label="Під замовлення" variant="neutral" />
            ),
        },
        {
          key: "isPublished",
          header: "Статус",
          width: pixel(120),
          renderCell: (row) =>
            row.isPublished ? (
              <Badge label="Опубліковано" variant="info" />
            ) : (
              <Badge label="Чернетка" variant="warning" />
            ),
        },
        {
          key: "id",
          header: "Дії",
          width: pixel(104),
          renderCell: (row) => (
            <HStack gap={1} vAlign="center">
              <Link href={`/admin/materials/${row.id}`}>
                <IconButton
                  label={`Редагувати ${row.name}`}
                  icon={<Icon icon={Pencil} size="sm" />}
                  variant="ghost"
                  size="sm"
                  tooltip="Редагувати"
                />
              </Link>
              <Link href={`/admin/materials/${row.id}/preview`}>
                <IconButton
                  label={`Переглянути ${row.name}`}
                  icon={<Icon icon={Eye} size="sm" />}
                  variant="ghost"
                  size="sm"
                  tooltip="Перегляд"
                />
              </Link>
            </HStack>
          ),
        },
      ]}
    />
  );
}
