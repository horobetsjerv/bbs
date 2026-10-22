"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { FormLayout } from "@astryxdesign/core/FormLayout";
import { Grid } from "@astryxdesign/core/Grid";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { NumberInput } from "@astryxdesign/core/NumberInput";
import { Selector } from "@/app/admin/ui/Selector";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import {
  ArrowDownUp,
  Building2,
  Image as ImageIcon,
  Link2,
  Type as TypeIcon,
} from "lucide-react";
import { saveCollection, type CollectionInput } from "./actions";
import type { Collection, CollectionFormOptions } from "./queries";

/** Слаг попадает в адрес каталога, поэтому только латиница. */
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Props = {
  options: CollectionFormOptions;
  collection?: Collection;
};

export function CollectionForm({ options, collection }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [brandId, setBrandId] = useState<number>(
    collection?.brandId ?? options.brands[0]?.id ?? 0,
  );
  const [name, setName] = useState(collection?.name ?? "");
  const [slug, setSlug] = useState(collection?.slug ?? "");
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(collection));
  const [description, setDescription] = useState(collection?.description ?? "");
  const [image, setImage] = useState(collection?.image ?? "");
  const [sort, setSort] = useState<number>(collection?.sort ?? 0);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isSlugTouched) setSlug(slugify(value));
  };

  const handleSubmit = () => {
    setError(null);
    const input: CollectionInput = {
      id: collection?.id,
      brandId,
      name,
      slug,
      description,
      image,
      sort,
    };

    startTransition(async () => {
      const result = await saveCollection(input);
      if (result.ok) router.push("/admin/collections");
      else setError(result.error);
    });
  };

  return (
    <VStack gap={4} maxWidth={1100}>
      {error ? <Banner status="error" title={error} /> : null}

      <Card padding={4}>
        <FormLayout>
          {/* Поля в ряду держим с описаниями: без них соседний инпут встаёт выше. */}
          <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
            <TextInput
              label="Назва"
              value={name}
              onChange={handleNameChange}
              isRequired
              startIcon={TypeIcon}
              description="Так колекція називається в каталозі"
              width="100%"
            />
            <Selector
              label="Бренд"
              options={options.brands.map((brand) => ({
                value: String(brand.id),
                label: brand.name,
              }))}
              value={String(brandId)}
              onChange={(value) => setBrandId(Number(value))}
              isRequired
              startIcon={Building2}
              description="Колекція належить одному бренду"
              width="100%"
            />
          </Grid>

          <TextInput
            label="URL-слаг"
            value={slug}
            onChange={(value) => {
              setIsSlugTouched(true);
              setSlug(value);
            }}
            isRequired
            startIcon={Link2}
            description="Латиниця. Підставляється з назви, доки не змінити вручну"
            width="100%"
          />

          <TextArea
            label="Опис"
            value={description}
            onChange={setDescription}
            rows={4}
            isOptional
            description="Текст на сторінці колекції"
            width="100%"
          />

          <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
            <TextInput
              label="Обкладинка"
              value={image}
              onChange={setImage}
              isOptional
              startIcon={ImageIcon}
              description="Посилання на зображення колекції"
              width="100%"
            />
            <NumberInput
              label="Порядок"
              value={sort}
              onChange={setSort}
              isOptional
              startIcon={ArrowDownUp}
              description="Менше число — вище в списку"
              width="100%"
            />
          </Grid>
        </FormLayout>
      </Card>

      <HStack gap={2} hAlign="start">
        <Button
          label="Зберегти"
          variant="primary"
          onClick={handleSubmit}
          isLoading={isPending}
        />
        <Button
          label="Скасувати"
          variant="ghost"
          onClick={() => router.push("/admin/collections")}
        />
      </HStack>
    </VStack>
  );
}
