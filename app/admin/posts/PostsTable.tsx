"use client";

import { Badge } from "@astryxdesign/core/Badge";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Table, pixel, proportional } from "@astryxdesign/core/Table";
import { Pencil } from "lucide-react";

export type PostTableRow = {
  id: number;
  title: string;
  slug: string;
  categoryName: string | null;
  publishedAt: Date;
  hasCover: boolean;
  [key: string]: unknown;
};

const dateFormatter = new Intl.DateTimeFormat("uk-UA", { dateStyle: "medium" });

export function PostsTable({ rows }: { rows: PostTableRow[] }) {
  return (
    <Table<PostTableRow>
      data={rows}
      idKey="id"
      density="compact"
      hasHover
      dividers="rows"
      textOverflow="truncate"
      columns={[
        {
          key: "title",
          header: "Заголовок",
          width: proportional(3),
          renderCell: (row) => (
            <Link href={`/admin/posts/${row.id}`}>{row.title}</Link>
          ),
        },
        {
          key: "categoryName",
          header: "Рубрика",
          width: proportional(1),
          // Стаття без рубрики не потрапить у жоден розділ блогу — видно одразу.
          renderCell: (row) =>
            row.categoryName ?? <Badge label="Без рубрики" variant="warning" />,
        },
        {
          key: "publishedAt",
          header: "Дата",
          width: pixel(140),
          renderCell: (row) => dateFormatter.format(row.publishedAt),
        },
        {
          key: "hasCover",
          header: "Обкладинка",
          width: pixel(130),
          renderCell: (row) =>
            row.hasCover ? "Є" : <Badge label="Немає" variant="neutral" />,
        },
        {
          key: "id",
          header: "Дії",
          width: pixel(72),
          renderCell: (row) => (
            <HStack gap={1} vAlign="center">
              <Link href={`/admin/posts/${row.id}`}>
                <IconButton
                  label={`Редагувати ${row.title}`}
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
