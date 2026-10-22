import { eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { db } from "@/db";
import { materials } from "@/db/schema";
import { CollectionForm } from "../CollectionForm";
import { getCollection, getCollectionFormOptions } from "../queries";
import { DeleteCollectionButton } from "./DeleteCollectionButton";

export default async function EditCollectionPage({
  params,
}: PageProps<"/admin/collections/[id]">) {
  const { id } = await params;
  const collectionId = Number(id);
  if (!Number.isInteger(collectionId)) notFound();

  const [collection, options, [counted]] = await Promise.all([
    getCollection(collectionId),
    getCollectionFormOptions(),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(materials)
      .where(eq(materials.collectionId, collectionId)),
  ]);
  if (!collection) notFound();

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>{collection.name}</Heading>
              <Text type="supporting">
                {counted.count
                  ? `Матеріалів у колекції: ${counted.count}`
                  : "У колекції ще немає матеріалів"}
              </Text>
            </StackItem>
            <DeleteCollectionButton
              id={collection.id}
              name={collection.name}
              materialCount={counted.count}
            />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <CollectionForm options={options} collection={collection} />
        </LayoutContent>
      }
    />
  );
}
