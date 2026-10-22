import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Divider } from "@astryxdesign/core/Divider";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
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
import { LeadsTable, type LeadRow } from "./leads/LeadsTable";
import {
  getCatalogSummary,
  getContentSummary,
  getLeadsSummary,
} from "./queries";

/** Строка контентного раздела: название, счётчик и переход. */
function ContentRow({
  href,
  title,
  count,
  hint,
}: {
  href: string;
  title: string;
  count: number;
  hint: string;
}) {
  return (
    <HStack gap={2} vAlign="center">
      <StackItem size="fill">
        <VStack gap={0.5}>
          <Link href={href}>{title}</Link>
          <Text type="supporting">
            {count ? hint : "Ще нічого не створено"}
          </Text>
        </VStack>
      </StackItem>
      <Text>{count}</Text>
    </HStack>
  );
}

export default async function AdminDashboard() {
  const [catalog, leadsSummary, content] = await Promise.all([
    getCatalogSummary(),
    getLeadsSummary(),
    getContentSummary(),
  ]);

  const problems = catalog.brands.reduce(
    (sum, brand) => sum + brand.noPhotoCount + brand.draftCount,
    0,
  );

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>Огляд</Heading>
              <Text type="supporting">
                Стан каталогу та заявок на цей момент
              </Text>
            </StackItem>
            <Link href="/admin/materials/new">
              <Button label="Додати матеріал" variant="primary" />
            </Link>
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <VStack gap={3} maxWidth={1200}>
            {/* Недоставленные заявки — единственное, что требует ручного вмешательства. */}
            {leadsSummary.counts.undelivered ? (
              <Card padding={3}>
                <HStack gap={2} vAlign="center">
                  {/* Иконка задаётся семантическим именем: lucide-компонент из серверной
                      страницы в клиентский Icon не передать. */}
                  <Icon icon="warning" size="sm" color="warning" />
                  <StackItem size="fill">
                    <Text>
                      Не доставлено заявок:{" "}
                      {leadsSummary.counts.undelivered} — не пройшли Telegram
                      або Google Sheets
                    </Text>
                  </StackItem>
                  <Link href="/admin/leads?delivery=failed">
                    <Button label="Переглянути" variant="secondary" />
                  </Link>
                </HStack>
              </Card>
            ) : null}

            <Grid columns={{ minWidth: 320, max: 2 }} gap={3}>
              <Card padding={4}>
                <VStack gap={2}>
                  <HStack gap={1.5} vAlign="center">
                    <StackItem size="fill">
                      <Heading level={2}>Каталог</Heading>
                    </StackItem>
                    <Link href="/admin/materials">Усі матеріали</Link>
                  </HStack>
                  <Divider />
                  {catalog.brands.map((brand) => (
                    <HStack key={brand.id} gap={2} vAlign="center">
                      <StackItem size="fill">
                        <VStack gap={0.5}>
                          <Link href={`/admin/materials?brand=${brand.slug}`}>
                            {brand.name}
                          </Link>
                          <Text type="supporting">
                            {brand.photoCount} фото
                            {brand.noPhotoCount
                              ? ` · ${brand.noPhotoCount} без фото`
                              : ""}
                            {brand.draftCount
                              ? ` · ${brand.draftCount} чернеток`
                              : ""}
                          </Text>
                        </VStack>
                      </StackItem>
                      <Text>{brand.materialCount}</Text>
                    </HStack>
                  ))}
                  <Divider />
                  <HStack gap={2} vAlign="center">
                    <StackItem size="fill">
                      <VStack gap={0.5}>
                        <Link href="/admin/collections">Колекції</Link>
                        <Text type="supporting">
                          {problems
                            ? `У каталозі ${problems} позицій потребують уваги`
                            : "Усі позиції опубліковані та з фото"}
                        </Text>
                      </VStack>
                    </StackItem>
                    <Text>{catalog.totals.collections}</Text>
                  </HStack>
                </VStack>
              </Card>

              <Card padding={4}>
                <VStack gap={2}>
                  <HStack gap={1.5} vAlign="center">
                    <StackItem size="fill">
                      <Heading level={2}>Заявки</Heading>
                    </StackItem>
                    <Link href="/admin/leads">Усі заявки</Link>
                  </HStack>
                  <Divider />
                  <HStack gap={2} vAlign="center">
                    <StackItem size="fill">
                      <Text>Нові, ще не в роботі</Text>
                    </StackItem>
                    {leadsSummary.counts.isNew ? (
                      <Badge
                        label={String(leadsSummary.counts.isNew)}
                        variant="info"
                      />
                    ) : (
                      <Text>0</Text>
                    )}
                  </HStack>
                  <HStack gap={2} vAlign="center">
                    <StackItem size="fill">
                      <Text>За останні 7 днів</Text>
                    </StackItem>
                    <Text>{leadsSummary.counts.lastWeek}</Text>
                  </HStack>
                  <HStack gap={2} vAlign="center">
                    <StackItem size="fill">
                      <Text>Усього за весь час</Text>
                    </StackItem>
                    <Text>{leadsSummary.counts.total}</Text>
                  </HStack>
                  <Divider />
                  <ContentRow
                    href="/admin/projects"
                    title="Проекти"
                    count={content.projects}
                    hint={`${content.projectsPublished} опубліковано`}
                  />
                  <ContentRow
                    href="/admin/posts"
                    title="Блог"
                    count={content.posts}
                    hint={
                      content.postsWithoutCategory
                        ? `${content.postsWithoutCategory} без рубрики`
                        : "Усі статті з рубриками"
                    }
                  />
                  <ContentRow
                    href="/admin/pages"
                    title="Сторінки"
                    count={content.pages}
                    hint="Редаговані блоки сайту"
                  />
                </VStack>
              </Card>
            </Grid>

            <Card padding={4}>
              <VStack gap={3}>
                <HStack gap={2} vAlign="center">
                  <StackItem size="fill">
                    <Heading level={2}>Останні заявки</Heading>
                  </StackItem>
                  <Link href="/admin/leads">Усі заявки</Link>
                </HStack>
                {leadsSummary.latest.length ? (
                  <LeadsTable rows={leadsSummary.latest as LeadRow[]} />
                ) : (
                  <Text type="supporting">
                    Заявок ще немає — вони з’являться, щойно хтось заповнить
                    форму на сайті
                  </Text>
                )}
              </VStack>
            </Card>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
