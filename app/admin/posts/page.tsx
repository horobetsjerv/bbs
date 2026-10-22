import { Button } from "@astryxdesign/core/Button";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
  VStack,
} from "@astryxdesign/core/Layout";
import { Link } from "@astryxdesign/core/Link";
import { Heading, Text } from "@astryxdesign/core/Text";
import { PostsFilters } from "./PostsFilters";
import { PostsTable, type PostTableRow } from "./PostsTable";
import { getPostCategories, getPostCount, getPostList } from "./queries";

export default async function PostsPage({
  searchParams,
}: PageProps<"/admin/posts">) {
  const params = await searchParams;
  const categorySlug =
    typeof params.category === "string" ? params.category : undefined;

  const [rows, categories, total] = await Promise.all([
    getPostList(categorySlug),
    getPostCategories(),
    getPostCount(),
  ]);

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Блог</Heading>
              <Text type="supporting">
                Всього статей: {total} · рубрик: {categories.length}
              </Text>
            </StackItem>
            <Link href="/admin/posts/new">
              <Button label="Нова стаття" variant="primary" />
            </Link>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={3}>
            <PostsFilters categories={categories} categorySlug={categorySlug} />
            {rows.length ? (
              <PostsTable rows={rows as PostTableRow[]} />
            ) : (
              <Text type="supporting">
                {categorySlug
                  ? "У цій рубриці статей немає."
                  : "Статей ще немає. Створіть першу — вона одразу з’явиться у блозі."}
              </Text>
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
