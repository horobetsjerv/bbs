/* eslint-disable @next/next/no-img-element */
// Мобильная статья блога. Макета нет (как и у десктопной статьи) — собрана
// из мобильных блоков: крошки как у карточки товара, заголовок H2 (32),
// фото 16:9, текст, «Інші публікації» сеткой 2 колонки и консультация.

import type { PostCardData, getPost } from "@/app/_lib/content";

import { PROSE_MOBILE } from "../blog/prose";
import { Breadcrumbs, CAPTION, H2_SB, MOB_L } from "../bbs/ui";
import { PostCard } from "./Blog";
import { MCta, MSection, MTitle } from "./ui";

type Post = NonNullable<Awaited<ReturnType<typeof getPost>>>;

export default function MobilePost({ post, more }: { post: Post; more: PostCardData[] }) {
  return (
    <>
      <div className="w-full p-[16px]">
        <Breadcrumbs items={["Головна", "Публікації", post.title]} tone="dark" wrap />
      </div>

      <article className="flex w-full flex-col items-start gap-[24px] px-[16px] pt-[8px] pb-[40px]">
        <div className="flex w-full flex-col items-start gap-[16px]">
          <div className="flex items-center gap-[16px] text-card-gray">
            {post.category && <span className={`text-trim ${MOB_L}`}>{post.category}</span>}
            <span className={`text-trim ${CAPTION}`}>{post.date}</span>
          </div>
          <h1 className={`text-trim w-full ${H2_SB} text-ink`}>{post.title}</h1>
        </div>
        {post.image && (
          <img src={post.image} alt="" className="block aspect-[16/9] w-full object-cover" />
        )}
        {post.body && (
          // HTML пишет редактор в админке — источник доверенный.
          <div className={`w-full ${PROSE_MOBILE}`} dangerouslySetInnerHTML={{ __html: post.body }} />
        )}
      </article>

      <div className="contents" data-reveal>
        {more.length > 0 && (
          <MSection>
            <MTitle>Інші публікації</MTitle>
            <div className="grid w-full grid-cols-2 gap-[8px]">
              {more.map((p) => (
                <PostCard key={p.href} {...p} />
              ))}
            </div>
          </MSection>
        )}
        <MCta
          variant="card"
          center
          bigText
          gap={20}
          title="Потрібна допомога з вибором?"
          text="Наші менеджери допоможуть підібрати матеріал під ваш проєкт."
        />
      </div>
    </>
  );
}
