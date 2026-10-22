"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

import { H3_SB } from "../bbs/ui";

/**
 * Details-Tabs (Figma 1260:10370): заголовок H3_sb blue с линией снизу,
 * справа Hamburger-кнопка minus / plus. Открытый блок — содержимое через 16px.
 */
export default function MAccordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="flex w-full flex-col items-start gap-[16px] px-[16px] py-[40px]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between"
        style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
      >
        <span className={`text-trim whitespace-nowrap ${H3_SB} text-blue`}>{title}</span>
        <span className="flex shrink-0 items-center justify-center rounded-[6px] p-[8px]">
          <img
            src={open ? "/figma/mobile/minus.svg" : "/figma/mobile/plus.svg"}
            alt=""
            aria-hidden
            className="block size-[20px]"
          />
        </span>
      </button>
      {open && children}
    </section>
  );
}
