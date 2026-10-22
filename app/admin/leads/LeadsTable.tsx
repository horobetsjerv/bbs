"use client";

import { Badge } from "@astryxdesign/core/Badge";
import { Table, pixel, proportional } from "@astryxdesign/core/Table";

export type LeadRow = {
  id: number;
  createdAt: Date;
  formType: "feedback" | "sample_order" | "price_request";
  name: string;
  phone: string;
  topicName: string | null;
  materialName: string | null;
  message: string | null;
  status: "new" | "in_progress" | "closed";
  telegramSentAt: Date | null;
  sheetsSyncedAt: Date | null;
  [key: string]: unknown;
};

const FORM_TYPE_LABEL: Record<LeadRow["formType"], string> = {
  feedback: "Зворотний зв’язок",
  sample_order: "Замовлення зразка",
  price_request: "Запит ціни",
};

const STATUS: Record<
  LeadRow["status"],
  { label: string; variant: "info" | "warning" | "neutral" }
> = {
  new: { label: "Новий", variant: "info" },
  in_progress: { label: "В роботі", variant: "warning" },
  closed: { label: "Закрито", variant: "neutral" },
};

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "short",
  timeStyle: "short",
});

export function LeadsTable({ rows }: { rows: LeadRow[] }) {
  return (
    <Table<LeadRow>
      data={rows}
      idKey="id"
      density="compact"
      hasHover
      textOverflow="truncate"
      columns={[
        {
          key: "createdAt",
          header: "Дата",
          width: pixel(140),
          renderCell: (row) => dateFormatter.format(new Date(row.createdAt)),
        },
        { key: "name", header: "Ім’я", width: proportional(1) },
        { key: "phone", header: "Телефон", width: pixel(140) },
        {
          key: "formType",
          header: "Форма",
          width: pixel(170),
          renderCell: (row) => FORM_TYPE_LABEL[row.formType],
        },
        {
          key: "topicName",
          header: "Тема",
          width: proportional(1),
          renderCell: (row) => row.topicName ?? row.materialName ?? "—",
        },
        {
          key: "status",
          header: "Статус",
          width: pixel(120),
          renderCell: (row) => (
            <Badge
              label={STATUS[row.status].label}
              variant={STATUS[row.status].variant}
            />
          ),
        },
        {
          key: "delivery",
          header: "Доставка",
          width: pixel(200),
          // Telegram и Google Sheets — ключевая функция по ТЗ; сбой должен быть виден сразу.
          renderCell: (row) => (
            <>
              <Badge
                label={row.telegramSentAt ? "TG ✓" : "TG ✕"}
                variant={row.telegramSentAt ? "success" : "error"}
              />{" "}
              <Badge
                label={row.sheetsSyncedAt ? "Sheets ✓" : "Sheets ✕"}
                variant={row.sheetsSyncedAt ? "success" : "error"}
              />
            </>
          ),
        },
      ]}
    />
  );
}
