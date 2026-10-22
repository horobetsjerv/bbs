/* eslint-disable @next/next/no-img-element */
import { getTopCollections } from "@/app/_lib/catalog";

import { H3_L, H3_SB, OutlineBtn, SectionHeader, TextLink, inset } from "../bbs/ui";

type Collection = Awaited<ReturnType<typeof getTopCollections>>[number];

function CollectionCard({ c }: { c: Collection }) {
  return (
    <div
      className="flex w-[262px] shrink-0 flex-col items-center gap-[24px] bg-white"
      style={inset("var(--color-light-gray)")}
    >
      <div className="relative h-[304px] w-full shrink-0 bg-[#d9d9d9]">
        {c.image && (
          <img
            src={c.image}
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[24px] px-[16px]">
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className={`text-trim w-full ${H3_SB} text-ink`}>{c.name}</p>
          <p className={`text-trim w-full ${H3_L} text-card-gray`}>{c.text}</p>
        </div>
        <div className="flex w-full items-center gap-[8px]">
          {c.colors.map((color) => (
            <span
              key={color}
              className="size-[32px] shrink-0"
              style={{
                background: color,
                // Светлая плашка в макете с серой обводкой.
                boxShadow: isLight(color) ? "inset 0 0 0 1px #959090" : undefined,
              }}
            />
          ))}
        </div>
        <TextLink underline={false} href={c.href}>
          Детальніше
        </TextLink>
      </div>
    </div>
  );
}

/** Коллекции из базы: самые большие у Laminam (getTopCollections). */
export default async function Collections() {
  const collections = await getTopCollections("laminam");
  if (collections.length === 0) return null;
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title="Колекції Laminam"
        action={<OutlineBtn href="/kataloh/laminam/">Переглянути усі колекції</OutlineBtn>}
      />
      <div className="flex w-full items-center gap-[24px]">
        {collections.map((c) => (
          <CollectionCard key={c.slug} c={c} />
        ))}
      </div>
    </section>
  );
}

/** Светлые оттенки с серой обводкой, как в макете (иначе сливаются с фоном). */
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 225;
}
