import { EmptyState } from "@astryxdesign/core/EmptyState";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";

type Props = {
  title: string;
  subtitle: string;
  /** Что появится в разделе — чтобы заглушка объясняла, а не просто говорила «пусто». */
  planned: string;
};

/** Общий каркас для разделов, которые есть в навигации, но ещё не наполнены. */
export function SectionPlaceholder({ title, subtitle, planned }: Props) {
  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>{title}</Heading>
              <Text type="supporting">{subtitle}</Text>
            </StackItem>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <EmptyState title="Розділ у розробці" description={planned} />
        </LayoutContent>
      }
    />
  );
}
