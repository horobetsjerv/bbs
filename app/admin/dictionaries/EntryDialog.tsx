"use client";

import { useState, useTransition } from "react";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Grid } from "@astryxdesign/core/Grid";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  VStack,
} from "@astryxdesign/core/Layout";
import { NumberInput } from "@astryxdesign/core/NumberInput";
import { Selector } from "@/app/admin/ui/Selector";
import { TextInput } from "@astryxdesign/core/TextInput";
import { saveDictionaryEntry } from "./actions";
import {
  DICTIONARY_META,
  slugifyName,
  type BrandOption,
  type DictionaryEntry,
  type DictionaryEntryInput,
  type DictionaryType,
} from "./config";

type Props = {
  type: DictionaryType;
  brands: BrandOption[];
  /** null — создание новой записи. */
  entry: DictionaryEntry | null;
  onClose: () => void;
};

export function EntryDialog({ type, brands, entry, onClose }: Props) {
  const meta = DICTIONARY_META[type];
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(entry?.name ?? "");
  const [slug, setSlug] = useState(entry?.slug ?? "");
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(entry));
  const [hex, setHex] = useState(entry?.hex ?? "");
  const [brandId, setBrandId] = useState<number | null>(
    entry?.brandId ?? brands[0]?.id ?? null,
  );
  const [widthMm, setWidthMm] = useState<number | null>(entry?.widthMm ?? null);
  const [heightMm, setHeightMm] = useState<number | null>(entry?.heightMm ?? null);
  const [valueMm, setValueMm] = useState<number | null>(entry?.valueMm ?? null);
  const [sort, setSort] = useState<number>(entry?.sort ?? 0);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isSlugTouched) setSlug(slugifyName(value));
  };

  const handleSubmit = () => {
    setError(null);
    const input: DictionaryEntryInput = {
      id: entry?.id,
      name,
      slug,
      sort,
      hex,
      // Іконки застосувань задає дизайн, у формі їх не редагуємо.
      icon: entry?.icon ?? "",
      brandId,
      widthMm,
      heightMm,
      valueMm,
    };
    startTransition(async () => {
      const result = await saveDictionaryEntry(type, input);
      if (result.ok) onClose();
      else setError(result.error);
    });
  };

  return (
    <Dialog isOpen onOpenChange={onClose} purpose="form" width={520}>
      <Layout
        header={
          <DialogHeader
            title={entry ? entry.name : meta.singularNew}
            subtitle={meta.hint}
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
                onChange={handleNameChange}
                isRequired
                hasAutoFocus
                description="Так значення підписане у фільтрі та у формі матеріалу"
                width="100%"
              />

              {meta.hasSlug ? (
                <TextInput
                  label="Слаг"
                  value={slug}
                  onChange={(value) => {
                    setIsSlugTouched(true);
                    setSlug(value);
                  }}
                  isRequired
                  description="Латиниця, потрапляє в адресу фільтра. Підставляється з назви"
                  width="100%"
                />
              ) : null}

              {meta.hasBrand ? (
                <Selector
                  label="Бренд"
                  options={brands.map((brand) => ({
                    value: String(brand.id),
                    label: brand.name,
                  }))}
                  value={brandId ? String(brandId) : ""}
                  onChange={(value) => setBrandId(Number(value))}
                  isRequired
                  description="Значення показується лише в каталозі цього бренду"
                  width="100%"
                />
              ) : null}

              {type === "colors" ? (
                <TextInput
                  label="Колір кружечка"
                  value={hex}
                  onChange={setHex}
                  isOptional
                  placeholder="#8E8E8E"
                  description="HEX для кольорового кружечка у фільтрі"
                  width="100%"
                />
              ) : null}

              {type === "sizes" ? (
                <Grid columns={{ minWidth: 160, max: 2 }} gap={3}>
                  <NumberInput
                    label="Ширина"
                    value={widthMm}
                    onChange={setWidthMm}
                    isRequired
                    isIntegerOnly
                    min={1}
                    units="мм"
                    width="100%"
                  />
                  <NumberInput
                    label="Висота"
                    value={heightMm}
                    onChange={setHeightMm}
                    isRequired
                    isIntegerOnly
                    min={1}
                    units="мм"
                    width="100%"
                  />
                </Grid>
              ) : null}

              {type === "thicknesses" ? (
                <NumberInput
                  label="Товщина"
                  value={valueMm}
                  onChange={setValueMm}
                  isRequired
                  isIntegerOnly
                  min={1}
                  units="мм"
                  description="Число для сортування. «5 мм» і «5+ мм» мають однакове число, різну назву"
                  width="100%"
                />
              ) : null}

              <NumberInput
                label="Порядок"
                value={sort}
                onChange={setSort}
                isOptional
                isIntegerOnly
                description="Менше число — вище у фільтрі"
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
                label="Зберегти"
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
