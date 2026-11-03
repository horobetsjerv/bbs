import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { CollectionForm } from "../CollectionForm";
import { getCollectionFormOptions } from "../queries";

export default async function NewCollectionPage() {
  const options = await getCollectionFormOptions();

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Нова колекція</Heading>
              <Text type="supporting">Група матеріалів усередині бренду</Text>
            </StackItem>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <CollectionForm options={options} />
        </LayoutContent>
      }
    />
  );
}
