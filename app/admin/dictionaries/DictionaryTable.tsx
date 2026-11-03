"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog } from "@astryxdesign/core/AlertDialog";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import {
  Table,
  pixel,
  proportional,
  type TableColumn,
} from "@astryxdesign/core/Table";
import { Text } from "@astryxdesign/core/Text";
import { Pencil, Trash2 } from "lucide-react";
import { deleteDictionaryEntry } from "./actions";
import {
  DICTIONARY_META,
  type BrandOption,
  type DictionaryEntry,
  type DictionaryType,
} from "./config";
import { EntryDialog } from "./EntryDialog";

type Props = {
  type: DictionaryType;
  rows: DictionaryEntry[];
  brands: BrandOption[];
};

/** Кружочек цвета: единственное место, где цвет берётся из данных, а не из токена. */
function Swatch({ hex }: { hex: string | null }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: "1em",
        height: "1em",
        borderRadius: "50%",
        background: hex ?? "transparent",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
        verticalAlign: "-0.15em",
        marginRight: "0.5em",
      }}
    />
  );
}

/** Одно состояние диалога: закрыт, создание или редактирование записи. */
type DialogState = { kind: "closed" } | { kind: "edit"; entry: DictionaryEntry | null };

export function DictionaryTable({ type, rows, brands }: Props) {
  const router = useRouter();
  const meta = DICTIONARY_META[type];
  const [dialog, setDialog] = useState<DialogState>({ kind: "closed" });
  const [deleting, setDeleting] = useState<DictionaryEntry | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const closeDialog = () => {
    setDialog({ kind: "closed" });
    router.refresh();
  };

  const nameColumn: TableColumn<DictionaryEntry> = {
    key: "name",
    header: "Назва",
    width: proportional(2),
    renderCell: (row) => (
      <Link onClick={() => setDialog({ kind: "edit", entry: row })}>
        {type === "colors" ? <Swatch hex={row.hex} /> : null}
        {row.name}
      </Link>
    ),
  };

  const extraColumns: TableColumn<DictionaryEntry>[] = [];
  if (meta.hasBrand) {
    extraColumns.push({ key: "brandName", header: "Бренд", width: pixel(120) });
  }
  if (meta.hasSlug) {
    extraColumns.push({ key: "slug", header: "Слаг", width: proportional(1) });
  }
  if (type === "colors") {
    extraColumns.push({
      key: "hex",
      header: "HEX",
      width: pixel(110),
      renderCell: (row) => row.hex ?? "—",
    });
  }
  if (type === "sizes") {
    extraColumns.push({
      key: "widthMm",
      header: "Розмір, мм",
      width: pixel(130),
      renderCell: (row) => `${row.widthMm} × ${row.heightMm}`,
    });
  }
  if (type === "thicknesses") {
    extraColumns.push({
      key: "valueMm",
      header: "Товщина, мм",
      width: pixel(130),
      renderCell: (row) => String(row.valueMm),
    });
  }

  const columns: TableColumn<DictionaryEntry>[] = [
    nameColumn,
    ...extraColumns,
    {
      key: "materialCount",
      header: "Матеріалів",
      width: pixel(130),
      // Значение без материалов в фильтре не работает — его видно сразу.
      renderCell: (row) =>
        row.materialCount ? (
          String(row.materialCount)
        ) : (
          <Badge label="Не використано" variant="neutral" />
        ),
    },
    { key: "sort", header: "Порядок", width: pixel(100) },
    {
      key: "id",
      header: "Дії",
      width: pixel(104),
      renderCell: (row) => (
        <HStack gap={1} vAlign="center">
          <IconButton
            label={`Редагувати ${row.name}`}
            icon={<Icon icon={Pencil} size="sm" />}
            variant="ghost"
            size="sm"
            tooltip="Редагувати"
            onClick={() => setDialog({ kind: "edit", entry: row })}
          />
          <IconButton
            label={`Видалити ${row.name}`}
            icon={<Icon icon={Trash2} size="sm" />}
            variant="ghost"
            size="sm"
            tooltip="Видалити"
            onClick={() => setDeleting(row)}
          />
        </HStack>
      ),
    },
  ];

  return (
    <VStack gap={3}>
      <HStack gap={2} vAlign="center">
        <StackItem size="fill">
          <Text type="supporting">{meta.hint}</Text>
        </StackItem>
        <Button
          label="Додати"
          variant="primary"
          onClick={() => setDialog({ kind: "edit", entry: null })}
        />
      </HStack>

      {rows.length ? (
        <Table<DictionaryEntry>
          data={rows}
          idKey="id"
          density="compact"
          hasHover
          dividers="rows"
          textOverflow="truncate"
          columns={columns}
        />
      ) : (
        <Text type="supporting">
          Значень ще немає. Додайте перше — воно з’явиться у формі матеріалу.
        </Text>
      )}

      {dialog.kind === "edit" ? (
        <EntryDialog
          key={dialog.entry?.id ?? "new"}
          type={type}
          brands={brands}
          entry={dialog.entry}
          onClose={closeDialog}
        />
      ) : null}

      <AlertDialog
        isOpen={deleting !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleting(null);
        }}
        title="Видалити значення?"
        // Связи каскадные: материалы останутся, но втратять це значення.
        description={
          deleting?.materialCount
            ? `«${deleting.name}» буде видалено і зникне з ${deleting.materialCount} матеріалів. Самі матеріали залишаться.`
            : `«${deleting?.name ?? ""}» буде видалено. Дію не можна скасувати.`
        }
        actionLabel="Видалити"
        cancelLabel="Скасувати"
        isActionLoading={isDeleting}
        onAction={() => {
          if (!deleting) return;
          startDelete(async () => {
            await deleteDictionaryEntry(type, deleting.id);
            setDeleting(null);
            router.refresh();
          });
        }}
      />
    </VStack>
  );
}
