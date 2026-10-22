"use client";

import { useState } from "react";

import type { Decor } from "@/app/_lib/catalog";

import { DecorCard } from "./cards";
import { OutlineBtn, SectionHeader, Tabs } from "./ui";

// Каталог открывается подборкой той вкладки, что выбрана.
const TABS = [
  { label: "Широкоформатний керамограніт", catalog: "/kataloh/keramogranit/" },
  { label: "Кварцовий агломерат", catalog: "/kataloh/kvartsovyi-kamin/" },
];

/**
 * «Популярні декори»: заголовок, табы материалов и четыре карточки.
 * `decors` — по вкладке на тип (getPopularDecors), карточка ведёт на товар.
 */
export default function DecorsSection({
  title,
  decors,
}: {
  title: string;
  decors: Decor[][];
}) {
  const [tab, setTab] = useState(0);
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title={title}
        action={
          <OutlineBtn href={TABS[tab].catalog}>Переглянути весь каталог</OutlineBtn>
        }
      />
      <Tabs items={TABS} active={tab} onSelect={setTab} />
      <div className="flex w-full items-center gap-[24px]">
        {decors[tab]?.map((d) => (
          <DecorCard
            key={d.href}
            name={d.name.toUpperCase()}
            brand={d.brand}
            image={d.image}
            href={d.href}
          />
        ))}
      </div>
    </section>
  );
}
