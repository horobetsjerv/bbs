import Page from "./_components/bbs/Page";
import { CtaBanner, FaqSection, LeadForm } from "./_components/bbs/blocks";
import DecorsSection from "./_components/bbs/DecorsSection";
import Hero from "./_components/home/Hero";
import Advantages from "./_components/home/Advantages";
import Compare from "./_components/home/Compare";
import Cooperation from "./_components/home/Cooperation";
import ProjectTypes from "./_components/home/ProjectTypes";
import Projects from "./_components/home/Projects";
import WhyBbs from "./_components/home/WhyBbs";
import WhereToBuy from "./_components/home/WhereToBuy";
import Reviews from "./_components/home/Reviews";
import { getPopularDecors } from "@/app/_lib/catalog";
import MobileHome from "./_components/mobile/Home";
import { leadPreset } from "./_lib/lead-preset";
import JsonLd, { businessLd } from "@/app/_components/seo/JsonLd";
import { getSettings } from "@/app/_lib/content";

// Тексты главной — из SEO-таблицы клиента, лист «Головна».
export const metadata = {
  title: "Laminam та Vicostone в Україні – купити | BBS",
  description:
    "BBS – офіційний дистриб'ютор Laminam і Vicostone в Україні ⭐ Керамограніт та кварцовий камінь для стільниць, підлоги, фасадів ⭐ Гарантія 25 років ☎️ (044) 228-29-49",
  alternates: { canonical: "/" },
};

/** «Часті запитання» главной (десктоп и мобилка): вопрос и ответ. */
const FAQ = [
  {
    question: "Чим керамограніт Laminam відрізняється від іншого керамограніту?",
    answer:
      "Ламінам поєднує великий формат із високою стійкістю до хімічних речовин, стирання, барвників, високих температур і вогню. Матеріал не вбирає забруднення, безпечний для контакту з харчовими продуктами та зберігає свої властивості за тривалої експлуатації.",
  },
  {
    question: "Чим кварц відрізняється від керамограніту?",
    answer:
      "Кварцовий агломерат і керамограніт відрізняються складом та технологією виробництва. Кварцовий камінь містить значну частку природного кварцу, поєднаного зі смолами та пігментами, тоді як керамограніт виготовляють із мінеральної сировини шляхом пресування та випалу. Матеріали мають різні характеристики й сфери застосування, тому вибір залежить від призначення поверхні.",
  },
  {
    question: "Чи можна замовити зразок?",
    answer:
      "Так, у BBS можна замовити зразок обраного матеріалу, щоб оцінити його декор, колір і фактуру перед прийняттям рішення.",
  },
  {
    question: "Де подивитися матеріали наживо?",
    answer:
      "Матеріали наживо можна переглянути в шоурумі BBS у Києві. Тут можна ознайомитися зі зразками декорів, кольорів і поверхонь, порівняти доступні варіанти та визначитися з матеріалом для майбутнього проєкту. Шоурум розташований за адресою: вул. Василя Тютюнника, 51/1А, Київ, Україна. Працюємо з понеділка по п'ятницю з 9:30 до 17:00.",
  },
  {
    question: "Чи є доставка по Україні?",
    answer:
      "Наразі доставка Україною не здійснюється. Матеріали можна отримати лише самовивозом зі складу BBS у Києві.",
  },
  {
    question: "Як доглядати за кварцовим каменем?",
    answer:
      "Для щоденного догляду за кварцовим каменем достатньо м’якої серветки, теплої води та нейтрального мийного засобу. Забруднення бажано видаляти своєчасно, не залишаючи їх надовго на поверхні. Не використовуйте абразивні губки, агресивні хімічні засоби та склади, які можуть пошкодити поверхню.",
  },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const [decors, params] = await Promise.all([getPopularDecors(), searchParams]);
  // Кнопки карточки товара ведут сюда: /?lead=sample_order&material=12&about=…#lead-form.
  const preset = leadPreset((k) => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  });
  const settings = await getSettings();
  return (
    // До подвала в макете 105px.
    <Page
      footerGap={105}
      mobile={<MobileHome decors={decors} preset={preset} faq={FAQ} />}
    >
      <JsonLd data={businessLd(settings)} />
      <Hero />

      {/* Frame 53: колонка 1120px, между секциями 120px. */}
      <div
        className="mt-[40px] flex w-[1120px] flex-col items-start gap-[120px]"
        data-reveal
      >
        <Advantages />
        <DecorsSection decors={decors} title="Популярні декори" />
        <Compare />
        <ProjectTypes />
        {/* key: новый пресет из адреса — форма пересоздаётся с новым сообщением. */}
        <LeadForm key={JSON.stringify(preset)} preset={preset} />
        <Projects />
        <WhyBbs />
        <Cooperation />
        <WhereToBuy />
        <Reviews />
        <FaqSection
          title="Часті запитання"
          questions={FAQ.map((f) => f.question)}
          answers={FAQ.map((f) => f.answer)}
        />
        <CtaBanner
          title="Розрахуйте вартість матеріалу для вашого проєкту"
          text="Залиште заявку-наші менеджери зв’яжуться з вами та допоможуть з вибором."
        />
      </div>
    </Page>
  );
}
