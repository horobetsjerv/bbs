import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { PostForm } from "../PostForm";
import { getPostCategories } from "../queries";

export default async function NewPostPage() {
  const categories = await getPostCategories();

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Нова стаття</Heading>
              <Text type="supporting">
                Після збереження стаття одразу з’являється у блозі
              </Text>
            </StackItem>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <PostForm categories={categories} />
        </LayoutContent>
      }
    />
  );
}
