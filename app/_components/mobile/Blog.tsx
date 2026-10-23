/* eslint-disable @next/next/no-img-element */
// Мобильная страница публикаций (Figma ui-mobile-Blog, 1268:12337).

import Link from "next/link";

import type { PostCardData } from "@/app/_lib/content";

import { CAPTION, H2_SB, H4_BTN, H4_L, Icon, MOB_L, MOB_SB, OutlineBtn, SwapIcon, inset } from "../bbs/ui";
import MobilePager from "./Pager";
import { MHero, MHeroText, MSection, MTitle } from "./ui";

/** Card публикации (1268:12759): фото, заголовок в боксе 68, рубрика и дата справа. */
export function PostCard({ title, category, date, image, href }: PostCardData) {
  return (
    <Link
      href={href}
      className="flex aspect-[167.5/240] w-full flex-col items-center gap-[12px] bg-white pb-[8px]"
      style={inset("var(--color-light-gray)")}
    >
      <div className="relative min-h-px w-full flex-1 bg-[#d9d9d9]">
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full max-w-none object-cover"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[8px] px-[8px]">
        <p className={`text-trim line-clamp-4 h-[68px] w-full ${MOB_SB} text-ink`}>{title}</p>
        <div className="flex w-full flex-col items-end justify-end gap-[8px] text-card-gray">
          <p className={`text-trim w-full ${MOB_L}`}>{category}</p>
          <p className={`text-trim whitespace-nowrap ${CAPTION}`}>{date}</p>
        </div>
      </div>
    </Link>
  );
}

const OFFERS = [
  {
    title: "Обрати матеріал",
    text: "Понад 400 декорів каменю, керамічних плит та HPL-плит стабільно підтримуються на складах у великому обсязі. Решту доставимо швидко під замовлення.",
    button: "Перейти до каталогу",
    href: "/kataloh/",
    backgrounds: ["/figma/bbs/offer-bg-1.png"],
    dark: true,
  },
  {
    title: "Замовити виріб",
    text: "Наші партнери зроблять стільницю, раковину, підвіконня, сходи, інші вироби з каменю і керамічних плит за проєктом будь-якої складності у будь-якій точці України",
    button: "Перейти до виробів на замовлення",
    href: "/proekty/",
    backgrounds: ["/figma/bbs/offer-bg-1.png", "/figma/bbs/offer-bg-2.png"],
    dark: false,
  },
];

/** «Наші пропозиції» (1268:12409): плитки 357px — на 7px шире колонки с каждой стороны. */
function Offers() {
  return (
    <MSection className="pt-[40px] pb-[60px]">
      <MTitle>Наші пропозиції</MTitle>
      <div className="-mx-[7px] flex w-[calc(100%+14px)] flex-col items-center gap-[24px]">
        {OFFERS.map((o) => (
          <div key={o.title} className="relative flex w-full flex-col items-center py-[40px]">
            {o.backgrounds.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden
                loading="lazy"
                className="pointer-events-none absolute inset-0 size-full max-w-none"
              />
            ))}
            <div className="pointer-events-none absolute inset-0" style={inset("var(--color-light-gray)")} />
            <div className="relative flex w-full flex-col items-center gap-[32px] px-[16px]">
              <div className="flex w-full flex-col items-start gap-[24px]">
                <p className={`text-trim w-full text-center ${H2_SB} ${o.dark ? "text-white" : "text-blue"}`}>
                  {o.title}
                </p>
                <p className={`text-trim w-full ${H4_L} ${o.dark ? "text-back-card-gray" : "text-card-gray"}`}>
                  {o.text}
                </p>
              </div>
              {o.dark ? (
                <a
                  href={o.href}
                  className={`group flex w-full items-center justify-center gap-[8px] bg-blue px-[24px] py-[14px] ${H4_BTN} text-white shadow-[inset_0_0_0_1px_#ffffff] transition-[background-color,box-shadow] duration-200 hover:bg-red`}
                >
                  <span className="text-trim whitespace-nowrap">{o.button}</span>
                  <SwapIcon src="/figma/bbs/arrow-cta-hover.svg" hover="/figma/bbs/arrow-btn-hover.svg" />
                </a>
              ) : (
                <OutlineBtn href={o.href} className="w-full justify-center">
                  {o.button}
                </OutlineBtn>
              )}
            </div>
          </div>
        ))}
      </div>
    </MSection>
  );
}

export default function MobileBlog({
  categories,
  active,
  q,
  posts,
}: {
  categories: { slug: string; name: string }[];
  active: string | null;
  q: string;
  posts: PostCardData[];
}) {
  const current = categories.find((c) => c.slug === active);
  const items = [{ slug: null, name: "Усі статті" }, ...categories];
  return (
    <>
      <MHero
        breadcrumb={["Головна", "Публікації", ...(current ? [current.name] : [])]}
        bg="overlay"
        gap={24}
      >
        <MHeroText
          title="Публікації"
          text="Поради з вибору, застосування та догляду за керамогранітом Laminam і кварцовим каменем Vicostone."
        />
        {/* Поиск (?q=) и рубрики (?category=), как на десктопе; между ними gap 24. */}
        <div className="flex w-full flex-col items-start gap-[24px]">
          <form
            action="/blog/"
            className="flex w-full items-start gap-[8px] border-b border-white pt-[11px] pb-[4px]"
          >
            {current && <input type="hidden" name="category" value={current.slug} />}
            <Icon src="/figma/bbs/search.svg" />
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Пошук статей"
              aria-label="Пошук статей"
              className={`text-trim h-[12px] min-w-px flex-1 bg-transparent p-0 ${H4_L} text-white outline-none placeholder:text-white [&::-webkit-search-cancel-button]:hidden`}
            />
          </form>
          <div className="flex w-full flex-wrap items-center gap-[8px]">
            {items.map((c) => {
              const on = c.slug === (current?.slug ?? null);
              const query = new URLSearchParams();
              if (c.slug) query.set("category", c.slug);
              if (q) query.set("q", q);
              const qs = query.toString();
              return (
                <Link
                  key={c.slug ?? "all"}
                  href={`/blog/${qs ? `?${qs}` : ""}`}
                  scroll={false}
                  aria-current={on ? "page" : undefined}
                  className={`flex items-center px-[8px] py-[10px] text-light-gray ${on ? `bg-blue ${H4_BTN}` : H4_L}`}
                  style={inset(on ? "var(--color-light-gray)" : "var(--color-card-gray)")}
                >
                  {/* Как в BlogHero: невидимая полужирная копия держит ширину —
                      выбор рубрики не сдвигает соседние. */}
                  <span className="grid">
                    <span
                      aria-hidden
                      className={`text-trim invisible col-start-1 row-start-1 whitespace-nowrap ${H4_BTN}`}
                    >
                      {c.name}
                    </span>
                    <span className="text-trim col-start-1 row-start-1 whitespace-nowrap text-center">
                      {c.name}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </MHero>

      <div className="contents" data-reveal>
        <section className="flex w-full flex-col items-start gap-[24px] px-[16px] py-[40px]">
          {posts.length > 0 ? (
            <MobilePager perPage={10}>
              {posts.map((p) => (
                <PostCard key={p.href} {...p} />
              ))}
            </MobilePager>
          ) : (
            <p className={`text-trim ${MOB_SB} text-ink`}>Статей не знайдено</p>
          )}
        </section>
        <Offers />
      </div>
    </>
  );
}
