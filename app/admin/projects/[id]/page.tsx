import { notFound } from "next/navigation";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { ProjectForm } from "../ProjectForm";
import { getMaterialOptions, getProject, getProjectTags } from "../queries";
import { DeleteProjectButton } from "./DeleteProjectButton";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const projectId = Number(id);
  if (!Number.isInteger(projectId)) notFound();

  const [project, tags, materials] = await Promise.all([
    getProject(projectId),
    getProjectTags(),
    getMaterialOptions(),
  ]);
  if (!project) notFound();

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>{project.name}</Heading>
              <Text type="supporting">
                Фото в галереї: {project.images.length}
                {project.year ? ` · ${project.year}` : ""}
              </Text>
            </StackItem>
            <DeleteProjectButton id={project.id} name={project.name} />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <ProjectForm project={project} tags={tags} materials={materials} />
        </LayoutContent>
      }
    />
  );
}
