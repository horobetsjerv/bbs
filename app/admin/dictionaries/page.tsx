import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
  VStack,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { DICTIONARY_META, isDictionaryType, type DictionaryType } from "./config";
import { DictionaryTable } from "./DictionaryTable";
import { DictionaryTabs } from "./DictionaryTabs";
import { getBrandOptions, getDictionary } from "./queries";

export default async function DictionariesPage({
  searchParams,
}: PageProps<"/admin/dictionaries">) {
  const params = await searchParams;
  const type: DictionaryType = isDictionaryType(params.type)
    ? params.type
    : "colors";

  const [rows, brands] = await Promise.all([
    getDictionary(type),
    getBrandOptions(),
  ]);
  const unused = rows.filter((row) => !row.materialCount).length;

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <VStack gap={2} padding={3}>
            <HStack gap={2} vAlign="center">
              <StackItem size="fill">
                <Heading level={1}>Довідники</Heading>
                <Text type="supporting">
                  Значення фільтрів каталогу. {DICTIONARY_META[type].label}:{" "}
                  {rows.length}
                  {unused ? ` · не використано: ${unused}` : ""}
                </Text>
              </StackItem>
            </HStack>
            <DictionaryTabs current={type} />
          </VStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <DictionaryTable type={type} rows={rows} brands={brands} />
        </LayoutContent>
      }
    />
  );
}
