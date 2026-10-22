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
import {
  CollectionsTable,
  type CollectionTableRow,
} from "./CollectionsTable";
import { getCollectionList } from "./queries";

export default async function CollectionsPage({
  searchParams,
}: PageProps<"/admin/collections">) {
  const params = await searchParams;
  const brandSlug = typeof params.brand === "string" ? params.brand : undefined;
  const rows = await getCollectionList(brandSlug);
  const empty = rows.filter((row) => !row.materialCount).length;

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Колекції</Heading>
              <Text type="supporting">
                Всього: {rows.length}
                {empty ? ` · порожніх: ${empty}` : ""}
              </Text>
            </StackItem>
            <Link href="/admin/collections/new">
              <Button label="Додати колекцію" variant="primary" />
            </Link>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={3}>
            {rows.length ? (
              <CollectionsTable rows={rows as CollectionTableRow[]} />
            ) : (
              <Text type="supporting">
                Колекцій ще немає. Створіть першу — вона з’явиться у формі
                матеріалу.
              </Text>
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
