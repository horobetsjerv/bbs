import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { ProjectForm } from "../ProjectForm";
import { getMaterialOptions, getProjectTags } from "../queries";

export default async function NewProjectPage() {
  const [tags, materials] = await Promise.all([
    getProjectTags(),
    getMaterialOptions(),
  ]);

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Новий проект</Heading>
              <Text type="supporting">
                Реалізований об&apos;єкт: фото, теги та використані матеріали
              </Text>
            </StackItem>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <ProjectForm tags={tags} materials={materials} />
        </LayoutContent>
      }
    />
  );
}
