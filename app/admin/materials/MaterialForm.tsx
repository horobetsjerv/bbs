"use client";

import { useMemo, useState, useTransition } from "react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { FormLayout } from "@astryxdesign/core/FormLayout";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Layout";
import { MultiSelector } from "@astryxdesign/core/MultiSelector";
import { Selector } from "@/app/admin/ui/Selector";
import { Switch } from "@astryxdesign/core/Switch";
import { Heading } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import {
  AlignLeft,
  BookOpen,
  Brush,
  Building2,
  Captions,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  Home,
  Info,
  Layers,
  Link2,
  Palette,
  Ruler,
  Rows3,
  SlidersHorizontal,
  Tag,
  Type as TypeIcon,
  Waves,
} from "lucide-react";
import { saveMaterial, type MaterialInput } from "./actions";
import type { MaterialFormOptions, MaterialWithRelations } from "./queries";

const TRANSLIT: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ie",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "iu",
  я: "ia",
  ы: "y",
  э: "e",
  ё: "e",
  ъ: "",
};

/** Слаг попадает в URL карточки (/tovary/{slug}/), поэтому только латиница. */
function slugify(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map((char) => TRANSLIT[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Образец оттенка в списке «Колір»: hex приходит из справочника, размер — от кегля строки. */
function ColorOption({ hex, label }: { hex: string | null; label: string }) {
  return (
    <HStack gap={1.5} vAlign="center">
      <span
        aria-hidden
        style={{
          width: "1.1em",
          aspectRatio: "1",
          borderRadius: "50%",
          flexShrink: 0,
          backgroundColor: hex ?? "transparent",
          border: `var(--border-width) ${hex ? "solid" : "dashed"} var(--color-border-emphasized)`,
        }}
      />
      <span>{label}</span>
    </HStack>
  );
}

/** Секция формы: иконка + заголовок над полями, одинаково во всех блоках. */
function Section({
  icon,
  title,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card padding={4}>
      <VStack gap={3}>
        <HStack gap={1.5} vAlign="center">
          <Icon icon={icon} size="sm" color="secondary" />
          <Heading level={2}>{title}</Heading>
        </HStack>
        <FormLayout>{children}</FormLayout>
      </VStack>
    </Card>
  );
}

type Props = {
  options: MaterialFormOptions;
  material?: MaterialWithRelations;
};

export function MaterialForm({ options, material }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [brandId, setBrandId] = useState<number>(
    material?.brandId ?? options.brands[0]?.id ?? 0,
  );
  const [collectionId, setCollectionId] = useState<number | null>(
    material?.collectionId ?? null,
  );
  const [name, setName] = useState(material?.name ?? "");
  const [article, setArticle] = useState(material?.article ?? "");
  const [slug, setSlug] = useState(material?.slug ?? "");
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(material));
  const [description, setDescription] = useState(material?.description ?? "");
  const [sourceUrl, setSourceUrl] = useState(material?.sourceUrl ?? "");
  const [specPdfUrl, setSpecPdfUrl] = useState(material?.specPdfUrl ?? "");
  const [inStock, setInStock] = useState(material?.inStock ?? false);
  const [isPublished, setIsPublished] = useState(material?.isPublished ?? true);
  const [seoTitle, setSeoTitle] = useState(material?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    material?.seoDescription ?? "",
  );

  const [colorIds, setColorIds] = useState<string[]>(
    (material?.colorIds ?? []).map(String),
  );
  const [surfaceIds, setSurfaceIds] = useState<string[]>(
    (material?.surfaceIds ?? []).map(String),
  );
  const [designIds, setDesignIds] = useState<string[]>(
    (material?.designIds ?? []).map(String),
  );
  const [applicationIds, setApplicationIds] = useState<string[]>(
    (material?.applicationIds ?? []).map(String),
  );
  const [sizeIds, setSizeIds] = useState<string[]>(
    (material?.sizeIds ?? []).map(String),
  );
  const [thicknessIds, setThicknessIds] = useState<string[]>(
    (material?.thicknessIds ?? []).map(String),
  );

  const colorHexById = useMemo(
    () => new Map(options.colors.map((item) => [String(item.id), item.hex])),
    [options.colors],
  );

  // Коллекции, форматы и толщины принадлежат бренду: показываем только его значения.
  const brandCollections = useMemo(
    () => options.collections.filter((item) => item.brandId === brandId),
    [options.collections, brandId],
  );
  const brandSizes = useMemo(
    () => options.sizes.filter((item) => item.brandId === brandId),
    [options.sizes, brandId],
  );
  const brandThicknesses = useMemo(
    () => options.thicknesses.filter((item) => item.brandId === brandId),
    [options.thicknesses, brandId],
  );

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isSlugTouched) setSlug(slugify(value));
  };

  const handleBrandChange = (value: string) => {
    const nextBrandId = Number(value);
    setBrandId(nextBrandId);
    // Значения прежнего бренда становятся недоступны — сбрасываем, чтобы не сохранить чужие связи.
    setCollectionId(null);
    setSizeIds([]);
    setThicknessIds([]);
  };

  const handleSubmit = () => {
    setError(null);
    const input: MaterialInput = {
      id: material?.id,
      brandId,
      collectionId,
      name,
      article,
      slug,
      description,
      sourceUrl,
      specPdfUrl,
      inStock,
      isPublished,
      seoTitle,
      seoDescription,
      colorIds: colorIds.map(Number),
      surfaceIds: surfaceIds.map(Number),
      designIds: designIds.map(Number),
      applicationIds: applicationIds.map(Number),
      sizeIds: sizeIds.map(Number),
      thicknessIds: thicknessIds.map(Number),
    };

    startTransition(async () => {
      const result = await saveMaterial(input);
      if (result.ok) {
        router.push("/admin/materials");
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <VStack gap={4} maxWidth={1100}>
      {error ? <Banner status="error" title={error} /> : null}

      <Section icon={Info} title="Основне">
        {/* Поля в ряду держим с описаниями: без них соседний инпут встаёт выше и ряд разъезжается. */}
        <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
          <TextInput
            label="Назва"
            value={name}
            onChange={handleNameChange}
            isRequired
            startIcon={TypeIcon}
            description="Відображається в каталозі та в заголовку картки"
            width="100%"
          />
          <TextInput
            label="Артикул"
            value={article}
            onChange={setArticle}
            isRequired
            startIcon={Hash}
            description="Номер із вигрузки клієнта, напр. BQ400"
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
        <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
          <Selector
            label="Бренд"
            options={options.brands.map((brand) => ({
              value: String(brand.id),
              label: brand.name,
            }))}
            value={String(brandId)}
            onChange={handleBrandChange}
            isRequired
            startIcon={Building2}
            description="Визначає доступні колекції, розміри й товщини"
            width="100%"
          />
          <Selector
            label="Колекція"
            options={brandCollections.map((item) => ({
              value: String(item.id),
              label: item.name,
            }))}
            value={collectionId ? String(collectionId) : ""}
            onChange={(value) => setCollectionId(value ? Number(value) : null)}
            hasClear
            isOptional
            startIcon={Layers}
            description="Список обмежений обраним брендом"
            placeholder={
              brandCollections.length
                ? "Оберіть колекцію"
                : "Немає колекцій для бренду"
            }
            isDisabled={!brandCollections.length}
            width="100%"
          />
        </Grid>
      </Section>

      <Section icon={SlidersHorizontal} title="Характеристики та фільтри">
        {/* Все шесть полей одной структуры (без описаний) — ряды выходят вровень. */}
        <Grid columns={{ minWidth: 240, max: 3 }} gap={3}>
          <MultiSelector
            label="Колір"
            options={options.colors.map((item) => ({
              value: String(item.id),
              label: item.name,
            }))}
            value={colorIds}
            onChange={setColorIds}
            triggerDisplay="labels"
            startIcon={Palette}
            renderOption={(option) => (
              <ColorOption
                hex={colorHexById.get(option.value) ?? null}
                label={option.label ?? option.value}
              />
            )}
            placeholder="Не обрано"
            width="100%"
          />
          <MultiSelector
            label="Дизайн"
            options={options.designs.map((item) => ({
              value: String(item.id),
              label: item.name,
            }))}
            value={designIds}
            onChange={setDesignIds}
            triggerDisplay="labels"
            startIcon={Brush}
            placeholder="Не обрано"
            width="100%"
          />
          <MultiSelector
            label="Поверхня"
            options={options.surfaces.map((item) => ({
              value: String(item.id),
              label: item.name,
            }))}
            value={surfaceIds}
            onChange={setSurfaceIds}
            triggerDisplay="labels"
            startIcon={Waves}
            placeholder="Не обрано"
            width="100%"
          />
          <MultiSelector
            label="Призначення"
            options={options.applications.map((item) => ({
              value: String(item.id),
              label: item.name,
            }))}
            value={applicationIds}
            onChange={setApplicationIds}
            triggerDisplay="labels"
            startIcon={Home}
            placeholder="Не обрано"
            width="100%"
          />
          <MultiSelector
            label="Розмір"
            options={brandSizes.map((item) => ({
              value: String(item.id),
              label: item.label,
            }))}
            value={sizeIds}
            onChange={setSizeIds}
            triggerDisplay="labels"
            startIcon={Ruler}
            placeholder="Не обрано"
            width="100%"
          />
          <MultiSelector
            label="Товщина"
            options={brandThicknesses.map((item) => ({
              value: String(item.id),
              label: item.label,
            }))}
            value={thicknessIds}
            onChange={setThicknessIds}
            triggerDisplay="labels"
            startIcon={Rows3}
            placeholder="Не обрано"
            width="100%"
          />
        </Grid>
      </Section>

      <Section icon={BookOpen} title="Опис і файли">
        <TextArea
          label="Опис"
          value={description}
          onChange={setDescription}
          rows={4}
          isOptional
          startIcon={AlignLeft}
          description="Текст на картці матеріалу"
          width="100%"
        />
        <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
          <TextInput
            label="Посилання на сторінку виробника"
            value={sourceUrl}
            onChange={setSourceUrl}
            isOptional
            startIcon={ExternalLink}
            description="Адреса з вигрузки клієнта"
            width="100%"
          />
          <TextInput
            label="PDF-специфікація"
            value={specPdfUrl}
            onChange={setSpecPdfUrl}
            isOptional
            startIcon={FileText}
            description="Посилання на файл із технічними даними"
            width="100%"
          />
        </Grid>
        <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
          <Switch
            label="В наявності"
            value={inStock}
            onChange={setInStock}
            description="Показувати позначку наявності в каталозі"
          />
          <Switch
            label="Опубліковано"
            value={isPublished}
            onChange={setIsPublished}
            description="Знята позначка — картка недоступна на сайті"
          />
        </Grid>
      </Section>

      <Section icon={Globe} title="SEO">
        <TextInput
          label="Title"
          value={seoTitle}
          onChange={setSeoTitle}
          isOptional
          startIcon={Tag}
          description="Заголовок сторінки у видачі пошуку, до 60 символів"
          width="100%"
        />
        <TextArea
          label="Meta description"
          value={seoDescription}
          onChange={setSeoDescription}
          rows={3}
          isOptional
          startIcon={Captions}
          description="Опис у видачі пошуку, до 160 символів"
          width="100%"
        />
      </Section>

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
          onClick={() => router.push("/admin/materials")}
        />
      </HStack>
    </VStack>
  );
}
