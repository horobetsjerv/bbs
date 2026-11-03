"use client";

import { useState, useTransition } from "react";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  VStack,
} from "@astryxdesign/core/Layout";
import { TextInput } from "@astryxdesign/core/TextInput";
import { slugifyName } from "../dictionaries/config";
import { createPostCategory } from "./actions";

type Props = {
  onClose: () => void;
  /** Вызывается после сохранения: форма статьи сразу выбирает новую рубрику. */
  onCreated: (category: { id: number; name: string; slug: string }) => void;
};

export function CategoryDialog({ onClose, onCreated }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugTouched, setIsSlugTouched] = useState(false);

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await createPostCategory(name, slug);
      if (result.ok) onCreated(result);
      else setError(result.error);
    });
  };

  return (
    <Dialog isOpen onOpenChange={onClose} purpose="form" width={480}>
      <Layout
        header={
          <DialogHeader
            title="Нова рубрика"
            subtitle="Наприклад: Огляди, Рекомендації, Новини"
            onOpenChange={onClose}
          />
        }
        content={
          <LayoutContent>
            <VStack gap={3}>
              {error ? <Banner status="error" title={error} /> : null}
              <TextInput
                label="Назва"
                value={name}
                onChange={(value) => {
                  setName(value);
                  if (!isSlugTouched) setSlug(slugifyName(value));
                }}
                isRequired
                hasAutoFocus
                width="100%"
              />
              <TextInput
                label="Слаг"
                value={slug}
                onChange={(value) => {
                  setIsSlugTouched(true);
                  setSlug(value);
                }}
                isRequired
                description="Латиниця, потрапляє в адресу рубрики. Підставляється з назви"
                width="100%"
              />
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter>
            <HStack gap={2} hAlign="end">
              <Button label="Скасувати" variant="ghost" onClick={onClose} />
              <Button
                label="Створити"
                variant="primary"
                onClick={handleSubmit}
                isLoading={isPending}
              />
            </HStack>
          </LayoutFooter>
        }
      />
    </Dialog>
  );
}
