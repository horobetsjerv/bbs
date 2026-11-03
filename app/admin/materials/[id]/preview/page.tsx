import { notFound } from "next/navigation";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid } from "@astryxdesign/core/Grid";
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
import { getMaterial, getMaterialFormOptions } from "../../queries";
import { MaterialGallery } from "./MaterialGallery";

/** Строка характеристики: подпись слева, значение справа. */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <HStack gap={2} vAlign="start">
      <StackItem size="fill">
        <Text type="supporting">{label}</Text>
      </StackItem>
      <Text>{value}</Text>
    </HStack>
  );
}

const namesByIds = (
  ids: number[],
  rows: Array<{ id: number; name: string }>,
) =>
  ids
    .map((id) => rows.find((row) => row.id === id)?.name)
    .filter(Boolean)
    .join(", ") || "—";

export default async function MaterialPreviewPage({
  params,
}: PageProps<"/admin/materials/[id]/preview">) {
  const { id } = await params;
  const materialId = Number(id);
  if (!Number.isInteger(materialId)) notFound();

  const [material, options] = await Promise.all([
    getMaterial(materialId),
    getMaterialFormOptions(),
  ]);
  if (!material) notFound();

  const brand = options.brands.find((row) => row.id === material.brandId);
  const collection = options.collections.find(
    (row) => row.id === material.collectionId,
  );
  const sizeLabels = material.sizeIds
    .map((sizeId) => options.sizes.find((row) => row.id === sizeId)?.label)
    .filter(Boolean)
    .join(", ");
  const thicknessLabels = material.thicknessIds
    .map(
      (thicknessId) =>
        options.thicknesses.find((item) => item.id === thicknessId)?.label,
    )
    .filter(Boolean)
    .join(", ");
  // Порядок вкладок — как в справочнике, чтобы не прыгал от материала к материалу.
  const materialSurfaceList = options.surfaces
    .filter((row) => material.surfaceIds.includes(row.id))
    .map((row) => ({ id: row.id, name: row.name }));
  const applicationNames = material.applicationIds
    .map(
      (applicationId) =>
        options.applications.find((row) => row.id === applicationId)?.name,
    )
    .filter(Boolean) as string[];

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>{material.name}</Heading>
              <Text type="supporting">
                {brand?.name} · Артикул {material.article}
              </Text>
            </StackItem>
            <Link href={`/admin/materials/${material.id}`}>
              <Button label="Редагувати" variant="secondary" />
            </Link>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          {/* Черновик публичной карточки: смотрим, что реально пришло из импорта. */}
          <Grid columns={{ minWidth: 360, max: 2 }} gap={4} maxWidth={1200}>
            <MaterialGallery
              images={material.images}
              surfaces={materialSurfaceList}
            />

            <VStack gap={3}>
              <Card padding={4}>
                <VStack gap={2}>
                  <Heading level={2}>Характеристики</Heading>
                  <Divider />
                  <Spec label="Бренд" value={brand?.name ?? "—"} />
                  <Spec label="Колекція" value={collection?.name ?? "—"} />
                  <Spec
                    label="Колір"
                    value={namesByIds(material.colorIds, options.colors)}
                  />
                  <Spec
                    label="Дизайн"
                    value={namesByIds(material.designIds, options.designs)}
                  />
                  <Spec
                    label="Поверхня"
                    value={namesByIds(material.surfaceIds, options.surfaces)}
                  />
                  <Spec label="Розмір" value={sizeLabels || "—"} />
                  <Spec label="Товщина" value={thicknessLabels || "—"} />
                  <Spec label="Фото" value={String(material.images.length)} />
                </VStack>
              </Card>

              <Card padding={4}>
                <VStack gap={2}>
                  <Heading level={2}>Призначення</Heading>
                  <HStack gap={1} wrap="wrap">
                    {applicationNames.length ? (
                      applicationNames.map((name) => (
                        <Badge key={name} label={name} variant="neutral" />
                      ))
                    ) : (
                      <Text type="supporting">Не вказано</Text>
                    )}
                  </HStack>
                </VStack>
              </Card>

              {material.sourceUrl ? (
                <Card padding={4}>
                  <VStack gap={1}>
                    <Text type="supporting">Сторінка виробника</Text>
                    <Link href={material.sourceUrl} isExternalLink>
                      {material.sourceUrl}
                    </Link>
                  </VStack>
                </Card>
              ) : null}
            </VStack>
          </Grid>
        </LayoutContent>
      }
    />
  );
}
