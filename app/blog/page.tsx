import Page from "../_components/bbs/Page";
import BlogHero from "../_components/blog/BlogHero";
import PostCard from "../_components/blog/PostCard";
import Offers from "../_components/blog/Offers";
import MobileBlog from "../_components/mobile/Blog";
import { getPostCategories, getPosts } from "@/app/_lib/content";
import JsonLd, { breadcrumbLd } from "@/app/_components/seo/JsonLd";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

/** Рубрики и поиск — варианты одной страницы: canonical на /blog/, поиск не индексируем. */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return {
    title: "Публікації про керамограніт і кварцовий камінь | BBS",
    description:
      "Огляди, поради й новини BBS: як обрати керамограніт чи кварцовий камінь, доглядати за стільницею та поєднувати матеріали в інтер’єрі.",
    alternates: { canonical: "/blog/" },
    robots: first(params.q) ? { index: false, follow: true } : undefined,
  };
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = first(params.category) || null;
  const q = first(params.q);
  const [categories, posts] = await Promise.all([getPostCategories(), getPosts(category, q)]);

  return (
    // До подвала в макете 105px.
    <Page
      footerGap={105}
      mobile={<MobileBlog categories={categories} active={category} q={q} posts={posts} />}
    >
      <JsonLd data={breadcrumbLd(["Головна", "Публікації"], "/blog/")} />
      <BlogHero categories={categories} active={category} q={q} total={posts.length} />

      {/* Frame 4700: карточки заезжают на полосу героя (y = 435). */}
      <div className="relative mt-[21px] flex w-[1120px] flex-col items-start gap-[80px]" data-reveal>
        {posts.length > 0 ? (
          <div className="flex w-full flex-wrap items-start gap-[24px]">
            {posts.map((p) => (
              <PostCard key={p.href} {...p} />
            ))}
          </div>
        ) : (
          <p className="text-[20px] font-semibold leading-[20px] tracking-[-1px] text-ink">
            Статей не знайдено
          </p>
        )}
        <Offers />
      </div>
    </Page>
  );
}
