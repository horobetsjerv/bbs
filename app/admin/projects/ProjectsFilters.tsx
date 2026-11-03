"use client";

import { useRouter } from "next/navigation";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import type { ProjectTag } from "./queries";

export function ProjectsFilters({
  tags,
  tagSlug,
}: {
  tags: ProjectTag[];
  tagSlug?: string;
}) {
  const router = useRouter();

  return (
    <SegmentedControl
      label="Тип реалізації"
      value={tagSlug ?? ""}
      onChange={(value) =>
        router.push(value ? `/admin/projects?tag=${value}` : "/admin/projects")
      }
    >
      <SegmentedControlItem value="" label="Усі" />
      {tags.map((tag) => (
        <SegmentedControlItem key={tag.slug} value={tag.slug} label={tag.name} />
      ))}
    </SegmentedControl>
  );
}
