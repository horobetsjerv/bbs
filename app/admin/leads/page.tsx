import { desc, eq, sql } from "drizzle-orm";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { db } from "@/db";
import { leadTopics, leads, materials } from "@/db/schema";
import { LeadsTable, type LeadRow } from "./LeadsTable";

async function getLeads(onlyFailed: boolean) {
  return db
    .select({
      id: leads.id,
      createdAt: leads.createdAt,
      formType: leads.formType,
      name: leads.name,
      phone: leads.phone,
      topicName: leadTopics.name,
      materialName: materials.name,
      message: leads.message,
      status: leads.status,
      telegramSentAt: leads.telegramSentAt,
      sheetsSyncedAt: leads.sheetsSyncedAt,
    })
    .from(leads)
    .leftJoin(leadTopics, eq(leads.topicId, leadTopics.id))
    .leftJoin(materials, eq(leads.materialId, materials.id))
    .where(
      onlyFailed
        ? sql`${leads.telegramSentAt} is null or ${leads.sheetsSyncedAt} is null`
        : undefined,
    )
    .orderBy(desc(leads.createdAt))
    .limit(100);
}

export default async function LeadsPage({
  searchParams,
}: PageProps<"/admin/leads">) {
  const params = await searchParams;
  const onlyFailed = params.delivery === "failed";
  const rows = await getLeads(onlyFailed);

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Заявки</Heading>
              <Text type="supporting">
                {onlyFailed
                  ? "Показані лише недоставлені заявки"
                  : "Останні 100 заявок з усіх форм сайту"}
              </Text>
            </StackItem>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <LeadsTable rows={rows as LeadRow[]} />
        </LayoutContent>
      }
    />
  );
}
