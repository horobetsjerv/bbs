import { notFound } from "next/navigation";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { MaterialForm } from "../MaterialForm";
import { getMaterial, getMaterialFormOptions } from "../queries";
import { DeleteMaterialButton } from "./DeleteMaterialButton";

export default async function EditMaterialPage({
  params,
}: PageProps<"/admin/materials/[id]">) {
  const { id } = await params;
  const materialId = Number(id);
  if (!Number.isInteger(materialId)) notFound();

  const [material, options] = await Promise.all([
    getMaterial(materialId),
    getMaterialFormOptions(),
  ]);
  if (!material) notFound();

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>{material.name}</Heading>
              <Text type="supporting">Артикул {material.article}</Text>
            </StackItem>
            <DeleteMaterialButton id={material.id} name={material.name} />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <MaterialForm options={options} material={material} />
        </LayoutContent>
      }
    />
  );
}
