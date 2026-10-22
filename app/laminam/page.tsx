import Page from "@/app/_components/bbs/Page";
import { CtaBanner, FaqSection } from "@/app/_components/bbs/blocks";
import Hero from "@/app/_components/laminam/Hero";
import Advantages from "@/app/_components/laminam/Advantages";
import Decors from "@/app/_components/laminam/Decors";
import About from "@/app/_components/laminam/About";
import Applications from "@/app/_components/laminam/Applications";
import Specs from "@/app/_components/laminam/Specs";
import WhyBbs from "@/app/_components/laminam/WhyBbs";
import Collections from "@/app/_components/laminam/Collections";
import Projects from "@/app/_components/laminam/Projects";
import Video from "@/app/_components/laminam/Video";
import MobileLaminam from "@/app/_components/mobile/Laminam";

// Тексты страницы — из SEO-таблицы клиента, лист «Laminam».
// Meta Description в таблице нет — оставлен прежний.
export const metadata = {
  title: "Керамограніт Laminam – купити в Україні | BBS",
  description:
    "Laminam — італійські керамічні плити великого формату для фасадів, стін, підлоги й стільниць. Колекції, декори та консультація офіційного дистриб’ютора BBS.",
  alternates: { canonical: "/laminam/" },
};

/** «Часті запитання» Laminam (десктоп и мобилка): вопрос и ответ. */
const FAQ = [
  {
    question: "Чим Laminam відрізняється від звичайного керамограніту?",
    answer:
      "Ламінам поєднує великий формат із високою стійкістю до хімічних речовин, стирання, барвників, високих температур і вогню. Матеріал не вбирає забруднення, безпечний для контакту з харчовими продуктами та зберігає свої властивості за тривалої експлуатації.",
  },
  {
    question: "Які формати й товщини доступні?",
    answer:
      "Laminam каталог налічує плити різних форматів і товщин: 1000×1000\u00a0мм — 6\u00a0мм, 1200×1200\u00a0мм — 6\u00a0мм, 1000×3000\u00a0мм — 2, 3 та 5\u00a0мм, 1200×3000\u00a0мм — 3 та 5\u00a0мм, 3240×1620\u00a0мм — 5, 12 та 20\u00a0мм. Конкретну товщину варто обирати з урахуванням формату, призначення матеріалу та вимог проєкту.",
  },
  {
    question: "Чи підходить Laminam для кухонної стільниці?",
    answer:
      "Так, чудово підходить для кухонних стільниць завдяки міцності, екологічності та стійкості до щоденних навантажень. Поверхня не боїться контакту з гострими предметами, тому не залишає слідів від ножів, витримує вплив високих температур, хімічних речовин та фарб.",
  },
  {
    question: "Чи можна використовувати для фасадів?",
    answer:
      "Так, керамограніт Ламінам підходить для облицювання фасадів завдяки міцності, стійкості до атмосферних впливів, а отже і довговічності. Матеріал не боїться перепадів температур, ультрафіолету, вологи та забруднень, тому зберігає естетичний вигляд будівлі протягом багатьох років.",
  },
  {
    question: "Як доглядати за поверхнями Laminam?",
    answer:
      "Догляд за керамогранітними поверхнями цього бренду не потребує спеціальних засобів. Для очищення достатньо використовувати м’яку губку, воду та звичайні мийні засоби. Завдяки низькій пористості матеріал не вбирає забруднення, тому легко очищається та довго зберігає свій первісний вигляд.",
  },
  {
    // Переносы строк — пункты списка (в ответе FAQ white-space: pre-line).
    // «2мм…20 мм» и «3000*1000» приведены к «2 мм» и «3000×1000».
    // Здесь и в ответе про форматы между числом и «мм» неразрывный пробел.
    question: "Від чого залежить ціна?",
    answer:
      "На матеріал Ламінам ціна залежить від:\n1. Товщини (2\u00a0мм, 3\u00a0мм, 5\u00a0мм, 12\u00a0мм, 20\u00a0мм). Вона визначається відповідно до застосування каменя, наприклад, для стільниць, фасадів, підлоги тощо.\n2. Формату листа (3000×1000, 3000×1200, 3240×1620).\n3. Принту і кольору.",
  },
];

/** CTA в конце страницы: заголовок и кнопка из таблицы, текст — прежний. */
const CTA = {
  title: "Потрібна допомога з вибором?",
  text: "Наша команда допоможе підібрати ідеальний матеріал для вашого проекту.",
  button: "Отримати консультацію",
};

export default function LaminamPage() {
  return (
    // До подвала в макете 121px.
    <Page footerGap={121} mobile={<MobileLaminam faq={FAQ} cta={CTA} />}>
      <Hero />

      {/* Frame 53: колонка 1120px, между секциями 120px. Порядок блоков —
          как в таблице; «Колекції» и «Відео» в таблице нет, оставлены рядом
          с близкими по смыслу блоками. */}
      {/* Преимущества — в 40px под фото героя (герой тянется до низа фото). */}
      <div className="mt-[40px] flex w-[1120px] flex-col items-start gap-[120px]" data-reveal>
        <Advantages />
        <Decors />
        <Collections />
        <About />
        <Applications />
        <Specs />
        <WhyBbs />
        <Projects />
        <Video />
        {/* Страницы со всеми вопросами нет — без кнопки «Всі запитання». */}
        <FaqSection
          title="Часті запитання"
          questions={FAQ.map((f) => f.question)}
          answers={FAQ.map((f) => f.answer)}
          allHref={null}
        />
        <CtaBanner title={CTA.title} text={CTA.text} button={CTA.button} />
      </div>
    </Page>
  );
}
