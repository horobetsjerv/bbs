"use client";

import { useRouter } from "next/navigation";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import type { PostCategory } from "./queries";

export function PostsFilters({
  categories,
  categorySlug,
}: {
  categories: PostCategory[];
  categorySlug?: string;
}) {
  const router = useRouter();

  return (
    <SegmentedControl
      label="Рубрика"
      value={categorySlug ?? ""}
      onChange={(value) =>
        router.push(value ? `/admin/posts?category=${value}` : "/admin/posts")
      }
    >
      <SegmentedControlItem value="" label="Усі" />
      {categories.map((category) => (
        <SegmentedControlItem
          key={category.slug}
          value={category.slug}
          label={category.name}
        />
      ))}
    </SegmentedControl>
  );
}
