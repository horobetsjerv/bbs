"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import type { ISODateString } from "@astryxdesign/core/Calendar";
import { DateInput } from "@astryxdesign/core/DateInput";
import { FormLayout } from "@astryxdesign/core/FormLayout";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import { Selector } from "@/app/admin/ui/Selector";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Link2, Plus, Type as TypeIcon } from "lucide-react";
import { slugifyName } from "../dictionaries/config";
import { savePost, type PostInput } from "./actions";
import { ImageUpload } from "../ui/ImageUpload";
import { RichTextEditor } from "../ui/RichTextEditor";
import { CategoryDialog } from "./CategoryDialog";
import type { Post, PostCategory } from "./queries";

type CategoryOption = Pick<PostCategory, "id" | "name" | "slug">;

/** Дата в форме — YYYY-MM-DD, без времени: точность до дня достаточна для блога. */
function toDateString(value: Date | null | undefined) {
  if (!value) return "";
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function PostForm({
  post,
  categories: initialCategories,
}: {
  post?: Post;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Новая рубрика попадает в список сразу, без перезагрузки страницы.
  const [categories, setCategories] = useState(initialCategories);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [isSlugTouched, setIsSlugTouched] = useState(Boolean(post));
  const [categoryId, setCategoryId] = useState<number | null>(
    post?.categoryId ?? null,
  );
  const [publishedAt, setPublishedAt] = useState(toDateString(post?.publishedAt));
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isSlugTouched) setSlug(slugifyName(value));
  };

  const handleSubmit = () => {
    setError(null);
    const input: PostInput = {
      id: post?.id,
      title,
      slug,
      categoryId,
      publishedAt,
      coverImage,
      body,
      seoTitle,
      seoDescription,
      ogImage: post?.ogImage ?? "",
    };
    startTransition(async () => {
      const result = await savePost(input);
      if (result.ok) router.push("/admin/posts");
      else setError(result.error);
    });
  };

  return (
    <VStack gap={4} maxWidth={1100}>
      {error ? <Banner status="error" title={error} /> : null}

      <Card padding={4}>
        <FormLayout>
          <TextInput
            label="Заголовок"
            value={title}
            onChange={handleTitleChange}
            isRequired
            startIcon={TypeIcon}
            description="H1 статті та назва у списку блогу"
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
            description="Адреса статті: /blog/{слаг}/. Підставляється із заголовка, доки не змінити вручну"
            width="100%"
          />

          <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
            <HStack gap={1} vAlign="end">
              <StackItem size="fill">
                <Selector
                  label="Рубрика"
                  options={[
                    { value: "", label: "Без рубрики" },
                    ...categories.map((category) => ({
                      value: String(category.id),
                      label: category.name,
                    })),
                  ]}
                  value={categoryId ? String(categoryId) : ""}
                  onChange={(value) => setCategoryId(value ? Number(value) : null)}
                  description="Розділ блогу, в якому виходить стаття"
                  width="100%"
                />
              </StackItem>
              <IconButton
                label="Нова рубрика"
                icon={<Icon icon={Plus} size="sm" />}
                variant="secondary"
                tooltip="Нова рубрика"
                onClick={() => setIsCategoryDialogOpen(true)}
              />
            </HStack>
            <DateInput
              label="Дата публікації"
              // DateInput приймає лише шаблонний тип YYYY-MM-DD; наш стан — рядок того ж формату.
              value={(publishedAt || undefined) as ISODateString | undefined}
              onChange={(value) => setPublishedAt(value ?? "")}
              isOptional
              description="Порожня — підставиться сьогоднішня дата"
            />
          </Grid>

          <ImageUpload
            label="Обкладинка"
            value={coverImage}
            onChange={setCoverImage}
            description="Фото для списку блогу та шапки статті. JPG, PNG або WebP до 10 МБ"
          />

          <RichTextEditor
            label="Текст статті"
            value={body}
            onChange={setBody}
            description="Заголовки, списки, цитати, посилання та зображення. Зберігається як HTML"
          />
        </FormLayout>
      </Card>

      <Card padding={4}>
        <VStack gap={3}>
          <VStack gap={0.5}>
            <Heading level={2}>SEO</Heading>
            <Text type="supporting">
              Порожні поля підставляються із заголовка статті
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

      {isCategoryDialogOpen ? (
        <CategoryDialog
          onClose={() => setIsCategoryDialogOpen(false)}
          onCreated={(category) => {
            setCategories((prev) => [...prev, category]);
            setCategoryId(category.id);
            setIsCategoryDialogOpen(false);
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
          onClick={() => router.push("/admin/posts")}
        />
      </HStack>
    </VStack>
  );
}
