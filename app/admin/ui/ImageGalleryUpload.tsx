"use client";

import { useState, useTransition } from "react";
import { Card } from "@astryxdesign/core/Card";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { uploadImage } from "../uploads/actions";

/** Порядок фото — это позиция в массиве; поле sort проставляется при сохранении. */
export type GalleryImage = { url: string; alt: string };

type Props = {
  label: string;
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  description?: string;
};

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Галерея объекта: несколько фото с подписями и ручным порядком.
 * Файлы грузятся по очереди — параллельные запросы упираются в лимит тела server action.
 */
export function ImageGalleryUpload({
  label,
  value,
  onChange,
  description,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File | File[] | null) => {
    const selected = Array.isArray(files) ? files : files ? [files] : [];
    if (!selected.length) return;
    setError(null);
    startTransition(async () => {
      const uploaded: GalleryImage[] = [];
      for (const file of selected) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadImage(formData);
        if (!result.ok) {
          setError(result.error);
          break;
        }
        uploaded.push({ url: result.url, alt: "" });
      }
      // Уже загруженные фото сохраняем, даже если на каком-то файле вышла ошибка.
      if (uploaded.length) onChange([...value, ...uploaded]);
    });
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const setAlt = (index: number, alt: string) => {
    onChange(value.map((image, i) => (i === index ? { ...image, alt } : image)));
  };

  return (
    <VStack gap={3}>
      <FileInput
        label={label}
        description={description}
        isOptional
        value={null}
        onChange={handleFiles}
        accept="image/*"
        isMultiple
        maxSize={MAX_BYTES}
        isLoading={isPending}
        mode="dropzone"
        placeholder="Оберіть файли або перетягніть сюди"
        status={error ? { type: "error", message: error } : undefined}
        width="100%"
      />

      {value.length ? (
        <Grid columns={{ minWidth: 260, max: 3 }} gap={3}>
          {value.map((image, index) => (
            <Card key={image.url} padding={2}>
              <VStack gap={2}>
                {/* Обычный img: превью загруженного файла, оптимизация Next тут не нужна. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt=""
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    objectFit: "cover",
                    borderRadius: "var(--radius-element)",
                  }}
                />
                <TextInput
                  label={`Опис фото ${index + 1}`}
                  isLabelHidden
                  value={image.alt}
                  onChange={(alt) => setAlt(index, alt)}
                  placeholder="Опис фото (alt)"
                  width="100%"
                />
                <HStack gap={1} vAlign="center">
                  <StackItem size="fill">
                    <Text type="supporting">{index + 1} з {value.length}</Text>
                  </StackItem>
                  <IconButton
                    label="Вище"
                    icon={<Icon icon={ArrowUp} size="sm" />}
                    variant="ghost"
                    size="sm"
                    tooltip="Вище"
                    isDisabled={index === 0}
                    onClick={() => move(index, -1)}
                  />
                  <IconButton
                    label="Нижче"
                    icon={<Icon icon={ArrowDown} size="sm" />}
                    variant="ghost"
                    size="sm"
                    tooltip="Нижче"
                    isDisabled={index === value.length - 1}
                    onClick={() => move(index, 1)}
                  />
                  <IconButton
                    label="Прибрати"
                    icon={<Icon icon={Trash2} size="sm" />}
                    variant="ghost"
                    size="sm"
                    tooltip="Прибрати"
                    onClick={() =>
                      onChange(value.filter((_, i) => i !== index))
                    }
                  />
                </HStack>
              </VStack>
            </Card>
          ))}
        </Grid>
      ) : null}
    </VStack>
  );
}
