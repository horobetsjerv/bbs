"use client";

import { useState, useTransition } from "react";
import { Button } from "@astryxdesign/core/Button";
import { FileInput } from "@astryxdesign/core/FileInput";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import { uploadImage } from "../uploads/actions";

type Props = {
  label: string;
  /** URL текущей картинки; пустая строка — картинки нет. */
  value: string;
  onChange: (url: string) => void;
  description?: string;
};

const MAX_BYTES = 10 * 1024 * 1024;

/** Поле «картинка»: выбор файла сразу загружает его на сервер, в форму попадает URL. */
export function ImageUpload({ label, value, onChange, description }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleFile = (files: File | File[] | null) => {
    const file = Array.isArray(files) ? files[0] : files;
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.ok) onChange(result.url);
      else setError(result.error);
    });
  };

  return (
    <VStack gap={2}>
      {value ? (
        <HStack gap={2} vAlign="center">
          {/* Обычный img: превью загруженного файла, оптимизация Next тут не нужна. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            style={{
              width: "8rem",
              aspectRatio: "4 / 3",
              objectFit: "cover",
              borderRadius: "0.5rem",
            }}
          />
          <StackItem size="fill">
            <FileInput
              label={label}
              isLabelHidden
              value={null}
              onChange={handleFile}
              accept="image/*"
              maxSize={MAX_BYTES}
              isLoading={isPending}
              placeholder="Замінити файл"
              status={error ? { type: "error", message: error } : undefined}
            />
          </StackItem>
          <Button label="Прибрати" variant="ghost" onClick={() => onChange("")} />
        </HStack>
      ) : (
        <FileInput
          label={label}
          description={description}
          isOptional
          value={null}
          onChange={handleFile}
          accept="image/*"
          maxSize={MAX_BYTES}
          isLoading={isPending}
          mode="dropzone"
          placeholder="Оберіть файл або перетягніть сюди"
          status={error ? { type: "error", message: error } : undefined}
        />
      )}
    </VStack>
  );
}
