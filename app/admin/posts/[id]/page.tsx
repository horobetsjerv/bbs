import { notFound } from "next/navigation";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutHeader,
  StackItem,
} from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { PostForm } from "../PostForm";
import { getPost, getPostCategories } from "../queries";
import { DeletePostButton } from "./DeletePostButton";

const dateFormatter = new Intl.DateTimeFormat("uk-UA", { dateStyle: "long" });

export default async function EditPostPage({
  params,
}: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const [post, categories] = await Promise.all([
    getPost(postId),
    getPostCategories(),
  ]);
  if (!post) notFound();

  return (
    <Layout
      height="fill"
      header={
        <LayoutHeader hasDivider>
          <HStack gap={2} vAlign="center" padding={3}>
            <StackItem size="fill">
              <Heading level={1}>{post.title}</Heading>
              <Text type="supporting">
                Опубліковано {dateFormatter.format(post.publishedAt)}
              </Text>
            </StackItem>
            <DeletePostButton id={post.id} title={post.title} />
          </HStack>
        </LayoutHeader>
      }
      content={
        <LayoutContent padding={3}>
          <PostForm post={post} categories={categories} />
        </LayoutContent>
      }
    />
  );
}
