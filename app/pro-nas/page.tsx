import Page from "../_components/bbs/Page";
import MobileAbout from "../_components/mobile/About";
import HeroBand from "../_components/bbs/HeroBand";
import { BrandsPanel, LeadForm } from "../_components/bbs/blocks";
import { GhostBtn, H1_SB, H2_L, H3_L, H3_SB, PrimaryBtn } from "../_components/bbs/ui";
import {
  AdvantagesSection,
  ContactsSection,
  PhotoPairSection,
  ProjectsSection,
  SectionTitle as Title,
  TextPhotoSection,
} from "../_components/about/sections";
import { getProjects } from "@/app/_lib/content";
import JsonLd, { breadcrumbLd } from "@/app/_components/seo/JsonLd";

// Title / description — дословно из SEO-таблицы (лист «Про нас», A1–A2).
export const metadata = {
  title: "Про компанію BBS – офіційний дистриб'ютор",
  description:
    "BBS – офіційний дистриб'ютор Laminam і представник Vicostone в Україні ⭐ Багаторічний досвід та гарантія якості ☎️ (044) 228-29-49",
  alternates: { canonical: "/pro-nas/" },
};

/** Content (Переваги співпраці): иконка 48, заголовок H3 sb, текст 16 light. */
const ADVANTAGES = [
  {
    icon: "/figma/bbs/medal.svg",
    title: "З 2012 року на ринку",
    text: "Постачаємо камінь для реалізації інтер’єрних проєктів в Україні.",
  },
  {
    icon: "/figma/about/store.svg",
    title: "Шоурум у Києві",
    text: "Зразки Laminam і Vicostone можна побачити наживо за адресою: вул. Василя Тютюнника, 51/1А.",
  },
  {
    icon: "/figma/bbs/palette.svg",
    title: "100+ декорів",
    text: "Різноманіття кольорів і текстур Laminam та Vicostone для індивідуальних інтер’єрних рішень.",
  },
  {
    icon: "/figma/bbs/shield.svg",
    title: "Гарантія до 25 років",
    text: "25 років гарантії на Laminam і 15 років — на Vicostone.",
  },
  {
    icon: "/figma/about/warehouse.svg",
    title: "Власний склад",
    text: "Маємо власний склад у Києві за адресою вул. Мрії 8, звідки можна забрати замовлений матеріал.",
  },
];

/**
 * Пункт «подзаголовок + текст» (тексты SEO-таблицы): подзаголовок — H3 sb
 * чёрный, как заголовки карточек «Переваги», под ним абзац. Отступ 16 —
 * как от заголовка до текста в карточке «Переваги».
 */
const ITEM_GAP = "gap-[16px]";

/** «З ким працюємо» (десктоп и мобилка): подзаголовок и текст. */
const WHO = [
  {
    title: "Приватні клієнти",
    text: "Допомагаємо обрати матеріал і реалізувати індивідуальні рішення для вашого простору.",
  },
  {
    title: "Архітектори та дизайнери",
    text: "Підбираємо матеріали для проєктів і консультуємо щодо їхніх характеристик та застосування.",
  },
  {
    title: "Оптові покупці та будівельні компанії",
    text: "Постачаємо Laminam і Vicostone для комплексного оснащення об’єктів та реалізації масштабних проєктів.",
  },
];

/**
 * Абзацы H3 l card-gray. В Figma это один текст с пустой строкой между
 * абзацами: от базовой линии до верха заглавных следующего — 40 − 15 = 25px.
 */
function Paragraphs({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex w-full flex-col items-start gap-[25px] ${H3_L} text-card-gray`}>
      {children}
    </div>
  );
}

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

export default async function AboutPage() {
  const projects = await getProjects(2);
  return (
    // До подвала в макете 105px (Frame 41 кончается на 4879, подвал — 4984).
    <Page footerGap={105} mobile={<MobileAbout advantages={ADVANTAGES} who={WHO} />}>
      <JsonLd data={breadcrumbLd(["Головна", "Про компанію"], "/pro-nas/")} />
      <HeroBand
        breadcrumb={["Головна", "Про компанію"]}
        overlay={{ src: "/figma/bbs/hero-blog-overlay.png", above: true }}
        // Текст из SEO-таблицы на 2 строки (2×32) длиннее макета: полоса
        // 368 + 64, чтобы под кнопками остались те же 34px, что в Figma.
        height={432}
      >
        <div className="flex w-full flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_SB} text-white`}>Про компанію BBS</h1>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>
            BBS — <B>офіційний дистриб’ютор Laminam</B> і{" "}
            <B>представник Vicostone</B> в Україні. З 2012 року працюємо з
            керамогранітом і кварцовим агломератом, забезпечуючи постачання
            оригінальних матеріалів без посередників. Допомагаємо обрати
            матеріал для вашого проєкту та пропонуємо рішення з офіційною
            гарантією від виробника.
          </p>
          <div className="flex items-start gap-[24px]">
            {/* Ширина экземпляра в Figma — 250, содержимое слева. */}
            <PrimaryBtn
              icon="/figma/bbs/support-white.svg"
              className="w-[250px] justify-start"
              href="/#lead-form"
            >
              Отримати консультацію
            </PrimaryBtn>
            <GhostBtn
              icon="/figma/bbs/arrow-cta-white.svg"
              hoverIcon="/figma/bbs/arrow-cta-hover.svg"
              href="/?about=Співпраця#lead-form"
            >
              Дизайнерам і обробникам
            </GhostBtn>
          </div>
        </div>
      </HeroBand>

      {/* Секции About / 5 — фреймы 1280 с отступами 80 (кроме Header / 76
          и формы). Первая начинается сразу под полосой героя (y = 464). */}
      <div className="mt-[34px] flex w-full flex-col items-center" data-reveal>
        {/* Layout / 1: текст слева, фото справа по высоте текста. */}
        <TextPhotoSection image="/figma/about/showroom-table.jpg" alt="Шоурум BBS у Києві">
          <Title>Чому BBS — офіційний партнер</Title>
          <p className={`text-trim w-full ${H3_L} text-card-gray`}>
            - гарантія якості від 15 до 25 років
            <br />- відсутність посередників
            <br />- пряма угода з виробниками Laminam і Vicostone
          </p>
          <Title>Чим займається компанія</Title>
          <Paragraphs>
            <div className={`flex w-full flex-col items-start ${ITEM_GAP}`}>
              <h3 className={`text-trim w-full ${H3_SB} text-black`}>Постачання матеріалів</h3>
              <p className="text-trim w-full">
                <B>Постачаємо плити</B> Laminam і Vicostone{" "}
                <B>для приватних клієнтів та бізнесу.</B> Працюємо в
                роздрібному й оптовому форматах, допомагаючи підібрати
                матеріал відповідно до потреб проєкту.
              </p>
            </div>
            <div className={`flex w-full flex-col items-start ${ITEM_GAP}`}>
              <h3 className={`text-trim w-full ${H3_SB} text-black`}>
                Виготовлення виробів на замовлення
              </h3>
              <p className="text-trim w-full">
                <B>Виготовляємо вироби з керамограніту та кварцового каменю</B>{" "}
                за індивідуальними параметрами. Рішення розробляються з
                урахуванням особливостей простору, побажань клієнта та
                характеристик обраного матеріалу.
              </p>
            </div>
            <div className={`flex w-full flex-col items-start ${ITEM_GAP}`}>
              <h3 className={`text-trim w-full ${H3_SB} text-black`}>Супровід проєкту</h3>
              <p className="text-trim w-full">
                <B>Супроводжуємо проєкт на всіх етапах реалізації:</B>{" "}
                консультуємо щодо вибору матеріалу, організовуємо замір і
                монтаж готових виробів. Це дає змогу узгодити технічні
                рішення та послідовно пройти шлях від вибору плити до
                готового результату.
              </p>
            </div>
          </Paragraphs>
        </TextPhotoSection>

        {/* Layout / 118: заголовок слева, карточки преимуществ справа. */}
        <AdvantagesSection title="Переваги співпраці" items={ADVANTAGES} />

        {/* Header / 76: текст и кнопка по центру слева (pr 80), два фото справа. */}
        <PhotoPairSection
          cta={
            <PrimaryBtn href="/#lead-form" className="w-full">
              Зв’язатися з нами
            </PrimaryBtn>
          }
        >
          <Title>З ким працюємо</Title>
          <Paragraphs>
            {WHO.map((w) => (
              <div key={w.title} className={`flex w-full flex-col items-start ${ITEM_GAP}`}>
                <h3 className={`text-trim w-full ${H3_SB} text-black`}>{w.title}</h3>
                <p className="text-trim w-full">{w.text}</p>
              </div>
            ))}
          </Paragraphs>
        </PhotoPairSection>

        {/* Frame 4740: «Наші бренди» — карточка Frame 54. */}
        <section className="flex w-[1120px] flex-col items-start gap-[24px] py-[80px]">
          <Title>Наші бренди</Title>
          {/* Строки — как в Figma: Chrome переносит эти тексты иначе
              (у Vicostone выходит на строку меньше, карточка ниже на 20px). */}
          <BrandsPanel
            spread
            laminam={
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
            }
            vicostone={
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
                рідини, стійкий до плям і подряпин, а
                <br />
                також до щоденних механічних
                <br />
                навантажень.
              </>
            }
          />
        </section>

        {/* Frame 46: «Наші проєкти» — два последних изделия из админки. */}
        <ProjectsSection projects={projects} />

        {/* Frame 4742: «Наші контакти» — тот же блок, что на странице контактов. */}
        <ContactsSection />

        {/* Frame 41: форма заявки, серый фон на всю ширину окна. */}
        <div className="flex w-full justify-center bg-light-gray">
          <div className="w-[1120px]">
            <LeadForm
              title="Обирайте матеріал для свого проєкту"
              text={
                <>
                  <B>Розкажіть</B> нам про <B>свій задум</B> — допоможемо
                  підібрати Laminam або Vicostone та зорієнтуємо щодо наступних
                  кроків.
                </>
              }
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
