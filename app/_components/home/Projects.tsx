import { getProjects } from "@/app/_lib/content";

import { ProjectCard } from "../bbs/cards";
import { OutlineBtn, SectionHeader } from "../bbs/ui";

/** Последние проекты из админки («Вироби на замовлення»), четыре в ряд. */
export default async function Projects() {
  const projects = await getProjects(4);
  if (projects.length === 0) return null;
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title="Реалізовані проєкти"
        action={<OutlineBtn href="/proekty/">Переглянути усі проєкти</OutlineBtn>}
      />
      {/* items-start: карточки выровнены по верху, как в макете. */}
      <div className="flex w-full items-start gap-[24px]">
        {projects.map((p) => (
          <ProjectCard key={p.href} {...p} />
        ))}
      </div>
    </section>
  );
}
