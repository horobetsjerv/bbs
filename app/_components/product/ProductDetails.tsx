"use client";

import { useState } from "react";

import { H3_L, H3_SB, H4_L, Tabs } from "../bbs/ui";

/** Вкладки «Характеристики / Опис». «Опис» показывается, только если текст есть. */
export default function ProductDetails({
  rows,
  description,
}: {
  rows: { label: string; value: string }[];
  description?: string | null;
}) {
  const [tab, setTab] = useState(0);
  const items = description
    ? [
        { label: "Характеристики" },
        { label: "Опис" },
      ]
    : [{ label: "Характеристики" }];
  return (
    <div className="flex w-[548px] shrink-0 flex-col items-start">
      <Tabs
        items={items}
        active={tab}
        onSelect={description ? setTab : undefined}
      />
      {tab === 0 ? (
        rows.map((r) => (
          <div
            key={r.label}
            className="flex w-full items-start justify-between gap-[24px] py-[16px]"
            style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
          >
            <p className={`text-trim whitespace-nowrap ${H3_SB} text-ink`}>
              {r.label}
            </p>
            <div className="flex items-center justify-center px-[8px]">
              <p className={`text-trim text-right ${H3_L} text-ink`}>
                {r.value}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className={`w-full whitespace-pre-line py-[16px] ${H4_L} text-ink`}>
          {description}
        </p>
      )}
    </div>
  );
}
