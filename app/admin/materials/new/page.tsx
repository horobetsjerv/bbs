import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { MaterialForm } from "../MaterialForm";
import { getMaterialFormOptions } from "../queries";

export default async function NewMaterialPage() {
  const options = await getMaterialFormOptions();

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Новий матеріал</Heading>
              <Text type="supporting">
                Заповніть картку кольору для каталогу
              </Text>
            </StackItem>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <MaterialForm options={options} />
        </LayoutContent>
      }
    />
  );
}
