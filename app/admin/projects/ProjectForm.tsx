"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { FormLayout } from "@astryxdesign/core/FormLayout";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import { MultiSelector } from "@astryxdesign/core/MultiSelector";
import { NumberInput } from "@astryxdesign/core/NumberInput";
import { Switch } from "@astryxdesign/core/Switch";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import {
  ArrowDownUp,
  CalendarDays,
  Layers,
  Link2,
  Plus,
  Tag,
  Type as TypeIcon,
} from "lucide-react";
import { slugifyName } from "../dictionaries/config";
import { ImageGalleryUpload, type GalleryImage } from "../ui/ImageGalleryUpload";
import { ImageUpload } from "../ui/ImageUpload";
import { RichTextEditor } from "../ui/RichTextEditor";
import { saveProject, type ProjectInput } from "./actions";
import { TagDialog } from "./TagDialog";
import type {
  MaterialOption,
  ProjectTag,
  ProjectWithRelations,
} from "./queries";

type TagOption = Pick<ProjectTag, "id" | "name" | "slug">;

const CURRENT_YEAR = new Date().getFullYear();
const SHORT_DESCRIPTION_MAX = 300;

export function ProjectForm({
  project,
  tags: initialTags,
  materials,
}: {
  project?: ProjectWithRelations;
  tags: TagOption[];
  materials: MaterialOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Новый тег попадает в список сразу, без перезагрузки страницы.
  const [tags, setTags] = useState(initialTags);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const [name, setName] = useState(project?.name ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(project));
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [shortDescription, setShortDescription] = useState(
    project?.shortDescription ?? "",
  );
  const [body, setBody] = useState(project?.body ?? "");
  const [year, setYear] = useState<number | null>(project?.year ?? null);
  const [tagIds, setTagIds] = useState<string[]>(
    (project?.tagIds ?? []).map(String),
  );
  const [materialIds, setMaterialIds] = useState<string[]>(
    (project?.materialIds ?? []).map(String),
  );
  const [images, setImages] = useState<GalleryImage[]>(project?.images ?? []);
  const [isPublished, setIsPublished] = useState(project?.isPublished ?? true);
  const [sort, setSort] = useState<number>(project?.sort ?? 0);
  const [seoTitle, setSeoTitle] = useState(project?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    project?.seoDescription ?? "",
  );

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isSlugTouched) setSlug(slugifyName(value));
  };

  const handleSubmit = () => {
    setError(null);
    const input: ProjectInput = {
      id: project?.id,
      name,
      slug,
      coverImage,
      shortDescription,
      body,
      year,
      isPublished,
      sort,
      seoTitle,
      seoDescription,
      ogImage: project?.ogImage ?? "",
      tagIds: tagIds.map(Number),
      materialIds: materialIds.map(Number),
      images,
    };
    startTransition(async () => {
      const result = await saveProject(input);
      if (result.ok) router.push("/admin/projects");
      else setError(result.error);
    });
  };

  return (
    <VStack gap={4} maxWidth={1100}>
      {error ? <Banner status="error" title={error} /> : null}

      <Card padding={4}>
        <FormLayout>
          <TextInput
            label="Назва"
            value={name}
            onChange={handleNameChange}
            isRequired
            startIcon={TypeIcon}
            description="H1 сторінки об'єкта та назва у списку проектів"
            width="100%"
          />

          <TextInput
            label="URL-слаг"
            value={slug}
            onChange={(value) => {
              setIsSlugTouched(true);
              setSlug(value);
            }}
            isRequired
            startIcon={Link2}
            description="Адреса проекту: /projects/{слаг}/. Підставляється з назви, доки не змінити вручну"
            width="100%"
          />

          <ImageUpload
            label="Головне фото"
            value={coverImage}
            onChange={setCoverImage}
            description="Обов'язкове: показується у списку проектів і в шапці сторінки. JPG, PNG або WebP до 10 МБ"
          />

          <TextArea
            label="Короткий опис"
            value={shortDescription}
            onChange={setShortDescription}
            rows={3}
            maxLength={SHORT_DESCRIPTION_MAX}
            isOptional
            description="До 300 символів — текст під назвою у списку проектів"
            width="100%"
          />

          <RichTextEditor
            label="Опис"
            value={body}
            onChange={setBody}
            description="Розповідь про об'єкт: заголовки, списки, цитати, посилання. Зберігається як HTML"
          />

          <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
            <HStack gap={1} vAlign="end">
              <StackItem size="fill">
                <MultiSelector
                  label="Теги"
                  options={tags.map((tag) => ({
                    value: String(tag.id),
                    label: tag.name,
                  }))}
                  value={tagIds}
                  onChange={setTagIds}
                  triggerDisplay="labels"
                  startIcon={Tag}
                  placeholder="Не обрано"
                  description="Тип реалізації: стільниця, фасад, інтер'єр"
                  width="100%"
                />
              </StackItem>
              <IconButton
                label="Новий тег"
                icon={<Icon icon={Plus} size="sm" />}
                variant="secondary"
                tooltip="Новий тег"
                onClick={() => setIsTagDialogOpen(true)}
              />
            </HStack>
            <NumberInput
              label="Рік"
              value={year}
              // hasClear даёт null: год у проекта необязателен.
              onChange={(value: number | null) => setYear(value)}
              isOptional
              isIntegerOnly
              hasClear
              min={2000}
              max={CURRENT_YEAR + 1}
              startIcon={CalendarDays}
              description="Рік завершення об'єкта"
              width="100%"
            />
          </Grid>

          <MultiSelector
            label="Використані матеріали"
            options={materials.map((material) => ({
              value: String(material.id),
              label: `${material.name} — ${material.article} (${material.brandName})`,
            }))}
            value={materialIds}
            onChange={setMaterialIds}
            triggerDisplay="labels"
            startIcon={Layers}
            hasSearch
            searchPlaceholder="Пошук за назвою чи артикулом"
            placeholder="Не обрано"
            description="З проекту ведуть посилання на картки цих матеріалів"
            width="100%"
          />

          <ImageGalleryUpload
            label="Галерея"
            value={images}
            onChange={setImages}
            description="Фото об'єкта. Порядок задається стрілками, перше фото відкриває галерею"
          />

          <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
            <Switch
              label="Опубліковано"
              value={isPublished}
              onChange={setIsPublished}
              description="Знята позначка — проект недоступний на сайті"
            />
            <NumberInput
              label="Порядок"
              value={sort}
              onChange={setSort}
              isOptional
              isIntegerOnly
              startIcon={ArrowDownUp}
              description="Менше число — вище в списку"
              width="100%"
            />
          </Grid>
        </FormLayout>
      </Card>

      <Card padding={4}>
        <VStack gap={3}>
          <VStack gap={0.5}>
            <Heading level={2}>SEO</Heading>
            <Text type="supporting">
              Порожні поля підставляються з назви проекту
            </Text>
          </VStack>
          <FormLayout>
            <TextInput
              label="Title"
              value={seoTitle}
              onChange={setSeoTitle}
              isOptional
              description="45–65 символів, основний запит на початку"
              width="100%"
            />
            <TextArea
              label="Description"
              value={seoDescription}
              onChange={setSeoDescription}
              rows={3}
              maxLength={160}
              isOptional
              description="120–160 символів"
              width="100%"
            />
          </FormLayout>
        </VStack>
      </Card>

      {isTagDialogOpen ? (
        <TagDialog
          onClose={() => setIsTagDialogOpen(false)}
          onCreated={(tag) => {
            setTags((prev) => [...prev, tag]);
            setTagIds((prev) => [...prev, String(tag.id)]);
            setIsTagDialogOpen(false);
          }}
        />
      ) : null}

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
          onClick={() => router.push("/admin/projects")}
        />
      </HStack>
    </VStack>
  );
}
