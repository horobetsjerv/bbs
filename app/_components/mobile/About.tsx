/* eslint-disable @next/next/no-img-element */
// Мобильная «Про нас» (Figma ui-mobile-ПРО НАС, 1556:11013).

import { getProjects, getSettings, telHref } from "@/app/_lib/content";

import { CAPTION, Icon, MOB_L, MOB_SB, PrimaryBtn, inset } from "../bbs/ui";
import { HeroButtons, Info } from "./Contacts";
import { Brands } from "./Home";
import {
  LEAD_ANCHOR,
  MCarousel,
  MCta,
  MHero,
  MHeroText,
  MOutlineBtn,
  MProjectSmallCard,
  MSection,
  MTitle,
} from "./ui";

/** Преимущество — те же данные, что у десктопа (app/pro-nas/page.tsx); текст необязателен. */
export type Advantage = { icon: string; title: string; text?: string };
/** «З ким працюємо» — те же данные, что у десктопа. */
export type Audience = { title: string; text: string };

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

/**
 * Фото 343×322. В макете кадр слегка растянут по горизонтали — берём
 * файлы десктопа без искажения (cover), кадр подобран под макет.
 */
export function Photo({ src, alt, position }: { src: string; alt: string; position?: string }) {
  return (
    <div className="relative h-[322px] w-full shrink-0 overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 size-full max-w-none object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}

/**
 * Пункты «подзаголовок + текст» (тексты SEO-таблицы): подзаголовок 16mob_sb
 * чёрный и абзац 16mob_l, между ними 8 — как в карточках «Переваги»;
 * между пунктами 16 — как пустая строка между абзацами в макете.
 */
function Items({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col items-start gap-[16px]">{children}</div>;
}

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]">
      <h3 className={`text-trim w-full ${MOB_SB} text-black`}>{title}</h3>
      <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{children}</p>
    </div>
  );
}

/** RealizedProjects (1556:11304): фото шоурума, «Чому BBS», «Чим займається». */
function WhyPartner() {
  return (
    <MSection>
      <Photo src="/figma/about/showroom-table.jpg" alt="Шоурум BBS у Києві" />
      <MTitle>Чому BBS — офіційний партнер</MTitle>
      <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
        - гарантія якості від 15 до 25 років
        <br />- відсутність посередників
        <br />- пряма угода з виробниками
        <br />
        Laminam і Vicostone
      </p>
      <MTitle>Чим займається компанія</MTitle>
      <Items>
        <Item title="Постачання матеріалів">
          <B>Постачаємо плити</B> Laminam і Vicostone{" "}
          <B>для приватних клієнтів та бізнесу.</B> Працюємо в роздрібному й
          оптовому форматах, допомагаючи підібрати матеріал відповідно до потреб
          проєкту.
        </Item>
        <Item title="Виготовлення виробів на замовлення">
          <B>Виготовляємо вироби з керамограніту та кварцового каменю</B> за
          індивідуальними параметрами. Рішення розробляються з урахуванням
          особливостей простору, побажань клієнта та характеристик обраного
          матеріалу.
        </Item>
        <Item title="Супровід проєкту">
          <B>Супроводжуємо проєкт на всіх етапах реалізації:</B> консультуємо
          щодо вибору матеріалу, організовуємо замір і монтаж готових виробів. Це
          дає змогу узгодити технічні рішення та послідовно пройти шлях від вибору
          плити до готового результату.
        </Item>
      </Items>
    </MSection>
  );
}

/**
 * Frame 4743: карточки Content — фон-текстура, внутренняя обводка light_gray.
 * Без текста заголовок карточки переносится по ширине («Співпраця»).
 */
export function Advantages({
  title = "Переваги співпраці",
  items,
}: {
  title?: string;
  items: Advantage[];
}) {
  return (
    <MSection>
      <MTitle>{title}</MTitle>
      {items.map((a) => (
        <div
          key={a.title}
          className="relative flex w-full flex-col items-start gap-[8px] p-[16px]"
        >
          {/* Текстура растянута во весь бокс, как в Figma (тот же файл, что на десктопе). */}
          <img
            src="/figma/about/advantage-bg.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full max-w-none object-fill"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={inset("var(--color-light-gray)")}
          />
          <div className="relative flex w-full items-center gap-[12px]">
            <Icon src={a.icon} size={32} />
            <h3
              className={`text-trim ${a.text ? "shrink-0 whitespace-nowrap" : "min-w-px flex-1"} ${MOB_SB} text-black`}
            >
              {a.title}
            </h3>
          </div>
          {a.text && (
            <p className={`text-trim relative w-full ${CAPTION} text-card-gray`}>{a.text}</p>
          )}
        </div>
      ))}
    </MSection>
  );
}

/** RealizedProjects (1556:11440): фото, «З ким працюємо», Main_cta. */
function Partner({ items }: { items: Audience[] }) {
  return (
    <MSection>
      <Photo
        src="/figma/about/showroom-shelf.jpg"
        alt="Зразки матеріалів у шоурумі BBS"
        position="38% 50%"
      />
      <MTitle>З ким працюємо</MTitle>
      <Items>
        {items.map((w) => (
          <Item key={w.title} title={w.title}>
            {w.text}
          </Item>
        ))}
      </Items>
      {/* Main_cta — в форму заявки (модалка), как CTA внизу страницы. */}
      <PrimaryBtn href={`/#${LEAD_ANCHOR}`} className="w-full">
        Зв’язатися з нами
      </PrimaryBtn>
    </MSection>
  );
}

/**
 * Collections-Section (1556:11512): два последних изделия из админки, как на десктопе.
 * `lead` — строка «Реалізовано понад 1000 проєктів» (в «Співпраця» её нет).
 */
export async function Projects({ lead = true }: { lead?: boolean } = {}) {
  const projects = await getProjects(2);
  if (projects.length === 0) return null;
  return (
    <MSection bg="light" gap={32}>
      <div className="flex w-full flex-col items-start gap-[24px]">
        <MTitle>Наші проєкти</MTitle>
        {lead && (
          <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
            Реалізовано понад 1000 проєктів
          </p>
        )}
        <MCarousel>
          {projects.map((p) => (
            <MProjectSmallCard key={p.href} {...p} />
          ))}
        </MCarousel>
      </div>
      <MOutlineBtn href="/proekty/">Переглянути усі проєкти</MOutlineBtn>
    </MSection>
  );
}

export default async function MobileAbout({
  advantages,
  who,
}: {
  advantages: Advantage[];
  who: Audience[];
}) {
  // CTA внизу — «Зателефонувати» (лист «Про нас»): первый номер из настроек.
  const { phones } = await getSettings();
  return (
    <>
      {/* В макете крошки скопированы с публикаций — ставим как на десктопе. */}
      {/* Hero-Section (1556:11015): кроп Laminam, фото с образцами (cover), затемнение 60%. */}
      <MHero
        breadcrumb={["Головна", "Про компанію"]}
        photo="/figma/about/hero-samples.webp"
        gap={24}
      >
        <MHeroText
          title="Про компанію BBS"
          text={
            <>
              BBS — <B>офіційний дистриб’ютор Laminam</B> і{" "}
              <B>представник Vicostone</B> в Україні. З 2012 року працюємо з
              керамогранітом і кварцовим агломератом, забезпечуючи постачання
              оригінальних матеріалів без посередників. Допомагаємо обрати
              матеріал для вашого проєкту та пропонуємо рішення з офіційною
              гарантією від виробника.
            </>
          }
        />
        <HeroButtons consult="Отримати консультацію" />
      </MHero>
      <div className="contents" data-reveal>
        <WhyPartner />
        <Advantages items={advantages} />
        <Partner items={who} />
        <Brands
          title="Наші бренди"
          titleGap={24}
          copy={{
            laminam: (
              <>
                Laminam — широкоформатний
                <br />
                керамограніт
                <br />
                <br />
                Плити товщиною від 3 до 20 мм для
                <br />
                облицювання стін, підлоги, виготовлення
                <br />
                стільниць, підвіконь і фасадів. Матеріал
                <br />
                не поглинає воду, стійкий до високих
                <br />
                температур, подряпин і побутової хімії.
              </>
            ),
            vicostone: (
              <>
                Vicostone — кварцовий камінь
                <br />
                <br />
                Плити товщиною 20 мм для виготовлення
                <br />
                стільниць, підвіконь, сходів та
                <br />
                облицювання інших поверхонь. Завдяки
                <br />
                непористій структурі матеріал не вбирає
                <br />
                рідини, стійкий до плям і подряпин, а також
                <br />
                до щоденних механічних навантажень.
              </>
            ),
          }}
        />
        <Projects />
        <Info title="Наші контакти" />
        <MCta
          innerGap={12}
          title="Обирайте матеріал для свого проєкту"
          {...(phones[0] ? { button: "Зателефонувати", href: telHref(phones[0]) } : {})}
          text={
            <>
              <B>Розкажіть нам</B> про <B>свій задум</B> — допоможемо підібрати
              Laminam або Vicostone та зорієнтуємо щодо наступних кроків.
            </>
          }
        />
      </div>
    </>
  );
}
