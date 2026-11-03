"use client";

import { Badge } from "@astryxdesign/core/Badge";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Table, pixel, proportional } from "@astryxdesign/core/Table";
import { Pencil } from "lucide-react";

export type ProjectTableRow = {
  id: number;
  name: string;
  slug: string;
  year: number | null;
  isPublished: boolean;
  tagNames: string | null;
  imageCount: number;
  [key: string]: unknown;
};

export function ProjectsTable({ rows }: { rows: ProjectTableRow[] }) {
  return (
    <Table<ProjectTableRow>
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
          width: proportional(3),
          renderCell: (row) => (
            <Link href={`/admin/projects/${row.id}`}>{row.name}</Link>
          ),
        },
        {
          key: "tagNames",
          header: "Теги",
          width: proportional(2),
          renderCell: (row) =>
            row.tagNames ?? <Badge label="Без тегів" variant="neutral" />,
        },
        {
          key: "year",
          header: "Рік",
          width: pixel(80),
          renderCell: (row) => row.year ?? "—",
        },
        {
          key: "imageCount",
          header: "Фото",
          width: pixel(110),
          // Проект без галереи нечего показать на странице объекта.
          renderCell: (row) =>
            row.imageCount ? (
              row.imageCount
            ) : (
              <Badge label="Немає" variant="warning" />
            ),
        },
        {
          key: "isPublished",
          header: "Статус",
          width: pixel(130),
          renderCell: (row) =>
            row.isPublished ? (
              "Опубліковано"
            ) : (
              <Badge label="Прихований" variant="neutral" />
            ),
        },
        {
          key: "id",
          header: "Дії",
          width: pixel(72),
          renderCell: (row) => (
            <HStack gap={1} vAlign="center">
              <Link href={`/admin/projects/${row.id}`}>
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
