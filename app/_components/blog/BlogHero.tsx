import Link from "next/link";

import HeroBand from "../bbs/HeroBand";
import { H1_SB, H2_L, H4_BTN, H4_L, Icon, inset } from "../bbs/ui";

/** 1 стаття, 2 статті, 5 статей. */
function articlesWord(n: number) {
  const d = n % 10;
  const dd = n % 100;
  if (d === 1 && dd !== 11) return "стаття";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "статті";
  return "статей";
}

/**
 * Шапка публикаций: рубрики из админки (ссылки ?category=), поиск (?q=)
 * и счётчик найденного.
 */
export default function BlogHero({
  categories,
  active,
  q,
  total,
}: {
  categories: { slug: string; name: string }[];
  active: string | null;
  q: string;
  total: number;
}) {
  const current = categories.find((c) => c.slug === active);
  const items = [{ slug: null, name: "Усі статті" }, ...categories];
  return (
    <HeroBand
      breadcrumb={["Головна", "Публікації", ...(current ? [current.name] : [])]}
      overlay={{ src: "/figma/bbs/hero-blog-overlay.png", above: true }}
    >
      <div className="flex w-full flex-col items-start gap-[40px]">
        <h1 className={`text-trim w-full ${H1_SB} text-white`}>Публікації</h1>
        <p className={`text-trim w-full ${H2_L} text-caption-gray`}>
          Ми завжди на зв’язку та готові допомогти з виборои матеріалу для
          вашого проєкту.
        </p>

        {/* Фильтр публикаций: рубрики, поиск, счётчик. */}
        <div
          className="flex w-full items-center justify-between px-[32px] py-[16px]"
          style={inset("var(--color-caption-gray)")}
        >
          <div className="flex items-center gap-[8px]">
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
                  className={`flex cursor-pointer items-center px-[8px] py-[10px] text-light-gray ${
                    on ? `bg-blue ${H4_BTN}` : H4_L
                  }`}
                  style={inset(on ? "var(--color-light-gray)" : "var(--color-card-gray)")}
                >
                  {/* Невидимая полужирная копия держит ширину: выбор рубрики
                      не сдвигает соседние. */}
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

          <form
            action="/blog/"
            className="flex w-[251px] items-start gap-[8px] border-b border-white pt-[11px] pb-[4px]"
          >
            {current && <input type="hidden" name="category" value={current.slug} />}
            <Icon src="/figma/bbs/search.svg" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Пошук статей"
              aria-label="Пошук статей"
              className={`text-trim h-[12px] min-w-px flex-1 bg-transparent p-0 ${H4_L} text-white outline-none placeholder:text-white`}
            />
          </form>

          <p className="whitespace-nowrap text-[16px] font-light leading-[16px] tracking-[-0.8px] text-white">
            Знайдено: {total} {articlesWord(total)}
          </p>
        </div>
      </div>
    </HeroBand>
  );
}
