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
import { MaterialsFilters } from "./MaterialsFilters";
import { MaterialsPagination } from "./MaterialsPagination";
import { MaterialsTable, type MaterialRow } from "./MaterialsTable";
import { getMaterialList } from "./queries";

export default async function MaterialsPage({
  searchParams,
}: PageProps<"/admin/materials">) {
  const params = await searchParams;
  const brandSlug = typeof params.brand === "string" ? params.brand : undefined;
  const query = typeof params.q === "string" ? params.q : undefined;
  const page = Number(typeof params.page === "string" ? params.page : 1) || 1;

  const { rows, total, perPage } = await getMaterialList({
    brandSlug,
    query,
    page,
  });
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Матеріали</Heading>
              <Text type="supporting">Всього позицій: {total}</Text>
            </StackItem>
            <Link href="/admin/materials/new">
              <Button label="Додати матеріал" variant="primary" />
            </Link>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={3}>
            <MaterialsFilters brandSlug={brandSlug} query={query} />
            <MaterialsTable rows={rows as MaterialRow[]} />
            {pageCount > 1 ? (
              <MaterialsPagination
                page={page}
                total={total}
                perPage={perPage}
                brandSlug={brandSlug}
                query={query}
              />
            ) : null}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
