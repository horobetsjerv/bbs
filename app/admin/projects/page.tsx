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
import { ProjectsFilters } from "./ProjectsFilters";
import { ProjectsTable, type ProjectTableRow } from "./ProjectsTable";
import { getProjectCount, getProjectList, getProjectTags } from "./queries";

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/admin/projects">) {
  const params = await searchParams;
  const tagSlug = typeof params.tag === "string" ? params.tag : undefined;

  const [rows, tags, total] = await Promise.all([
    getProjectList(tagSlug),
    getProjectTags(),
    getProjectCount(),
  ]);

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Проекти</Heading>
              <Text type="supporting">
                Всього об&apos;єктів: {total} · тегів: {tags.length}
              </Text>
            </StackItem>
            <Link href="/admin/projects/new">
              <Button label="Новий проект" variant="primary" />
            </Link>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={3}>
            <ProjectsFilters tags={tags} tagSlug={tagSlug} />
            {rows.length ? (
              <ProjectsTable rows={rows as ProjectTableRow[]} />
            ) : (
              <Text type="supporting">
                {tagSlug
                  ? "З цим тегом проектів немає."
                  : "Проектів ще немає. Створіть перший — він одразу з’явиться на сайті."}
              </Text>
            )}
          </VStack>
        </LayoutContent>
      }
    />
  );
}
