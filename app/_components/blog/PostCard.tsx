/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { CAPTION, CARD_HOVER, CARD_IMG, H3_L, H3_SB } from "../bbs/ui";

/** Card публикации: фото 304, заголовок (бокс 60px), рубрика и дата справа. */
export default function PostCard({
  title,
  category,
  date,
  image,
  href,
}: {
  title: string;
  category: string;
  date: string;
  image: string | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`flex w-[262px] shrink-0 flex-col items-center gap-[24px] bg-white pb-[8px] ${CARD_HOVER}`}
    >
      <div className="relative h-[304px] w-full shrink-0 overflow-hidden bbs-skeleton">
        {image && (
          <img src={image} alt="" className={`absolute inset-0 size-full max-w-none object-cover ${CARD_IMG}`} />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[8px] px-[16px]">
        <div className="h-[60px] w-full">
          <p className={`text-trim w-full ${H3_SB} text-ink`}>{title}</p>
        </div>
        <div className="flex w-full flex-col items-end justify-end gap-[8px] text-card-gray">
          <p className={`text-trim w-full ${H3_L}`}>{category}</p>
          <p className={`text-trim whitespace-nowrap ${CAPTION}`}>{date}</p>
        </div>
      </div>
    </Link>
  );
}
