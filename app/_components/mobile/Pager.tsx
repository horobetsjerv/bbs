"use client";

import { Children, useRef, useState } from "react";

import { MPagination } from "./Catalog";

/**
 * Сетка 2 колонки с постраничным выводом на клиенте (публикации: в макете
 * 10 карточек и пагинация под ними). Все карточки уже в разметке.
 */
export default function MobilePager({
  children,
  perPage,
}: {
  children: React.ReactNode;
  perPage: number;
}) {
  const items = Children.toArray(children);
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const [page, setPage] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="flex w-full scroll-mt-[68px] flex-col gap-[24px]">
      <div className="grid w-full grid-cols-2 gap-[8px]">
        {items.slice((page - 1) * perPage, page * perPage)}
      </div>
      <MPagination
        page={page}
        pages={pages}
        onPage={(p) => {
          setPage(p);
          ref.current?.scrollIntoView({ block: "start" });
        }}
      />
    </div>
  );
}
