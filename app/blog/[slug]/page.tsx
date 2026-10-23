/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";

import Page from "@/app/_components/bbs/Page";
import { CtaBanner } from "@/app/_components/bbs/blocks";
import { Breadcrumbs, CAPTION, H1_SB, H3_L, H3_SB } from "@/app/_components/bbs/ui";
import PostCard from "@/app/_components/blog/PostCard";
import { PROSE } from "@/app/_components/blog/prose";
import MobilePost from "@/app/_components/mobile/Post";
import { getPost, getPosts } from "@/app/_lib/content";
import JsonLd, { breadcrumbLd, orgRef } from "@/app/_components/seo/JsonLd";
import { OG_BASE, assetUrl, pageUrl } from "@/app/_lib/site";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return {};
  // Бренд — в конце (таблица SEO): «… — блог про Laminam і Vicostone | BBS».
  return {
    title:
      p.seoTitle ||
      [`${p.title} — блог про Laminam і Vicostone | BBS`, `${p.title} — блог | BBS`, `${p.title} | BBS`].find(
        (t) => t.length <= 65,
      ) ||
      `${p.title} | BBS`,
    description: p.seoDescription || p.excerpt || undefined,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      ...OG_BASE,
      type: "article",
      publishedTime: p.publishedAt,
      modifiedTime: p.updatedAt,
      ...(p.image ? { images: [{ url: assetUrl(p.image), alt: p.title }] } : {}),
    },
  };
}

/** Статья: в макете страницы нет — колонка текста и рейка «Інші публікації». */
export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();
  const more = all.filter((p) => p.href !== post.href).slice(0, 2);
  const path = `/blog/${slug}/`;
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    url: pageUrl(path),
    mainEntityOfPage: pageUrl(path),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    ...(post.excerpt || post.seoDescription ? { description: post.seoDescription || post.excerpt } : {}),
    ...(post.image ? { image: [assetUrl(post.image)] } : {}),
    ...(post.category ? { articleSection: post.category } : {}),
    inLanguage: "uk",
    author: orgRef,
    publisher: orgRef,
  };

  return (
    <Page footerGap={120} mobile={<MobilePost post={post} more={more} />}>
      <JsonLd data={[breadcrumbLd(["Головна", "Публікації", post.title], path), article]} />
      <div className="mt-[12px] flex w-[1120px] flex-col items-start">
        <Breadcrumbs items={["Головна", "Публікації", post.title]} tone="dark" />

        <div className="mt-[40px] flex w-full flex-col gap-[80px]" data-reveal>
          <div className="flex w-full items-start gap-[64px]">
            <article className="flex min-w-px flex-1 flex-col gap-[32px]">
              <header className="flex flex-col gap-[24px]">
                <div className={`flex items-center gap-[16px] text-card-gray ${H3_L}`}>
                  {post.category && <span className="text-trim">{post.category}</span>}
                  <span className={`text-trim ${CAPTION}`}>{post.date}</span>
                </div>
                <h1 className={`text-trim ${H1_SB} text-ink`}>{post.title}</h1>
              </header>
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="block aspect-[16/9] w-full object-cover"
                />
              )}
              {post.body && (
                // HTML пишет редактор в админке — источник доверенный.
                <div className={PROSE} dangerouslySetInnerHTML={{ __html: post.body }} />
              )}
            </article>

            {more.length > 0 && (
              <aside className="sticky top-[24px] flex shrink-0 flex-col gap-[24px]">
                <p className={`text-trim ${H3_SB} text-ink`}>Інші публікації</p>
                {more.map((p) => (
                  <PostCard key={p.href} {...p} />
                ))}
              </aside>
            )}
          </div>

          <CtaBanner
            title="Потрібна допомога з вибором?"
            text="Наші менеджери допоможуть підібрати матеріал під ваш проєкт."
            button="Зв’язатися з нами"
          />
        </div>
      </div>
    </Page>
  );
}
