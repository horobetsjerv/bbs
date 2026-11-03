// Мобильная «Співпраця» (Figma ui-mobile-SPIVPRACHIA, 1664:6107).

import { H2_MOB_SB, MOB_L, MOB_SB, PrimaryBtn } from "../bbs/ui";
import { Advantages, Photo, Projects, type Advantage } from "./About";
import { Info } from "./Contacts";
import { LEAD_ANCHOR, MHero, MHeroText, MSection, MTitle } from "./ui";

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

/** Заявка с темой «Співпраця» — в мобильную форму (модалка). */
const LEAD_HREF = `/?about=Співпраця#${LEAD_ANCHOR}`;

/** Пункт «Нині BBS це»: строка-подзаголовок semibold и строки текста. */
function NowItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <p className="text-trim w-full">
      <span className="font-semibold">{title}</span>
      <br />
      {children}
    </p>
  );
}

/**
 * RealizedProjects (1664:6120): фото шоуруму, «Нині BBS це:», список и пункты.
 * В Figma пункты — один текст с пустой строкой между ними: от базовой линии
 * до верха заглавных следующего пункта 20px. Строки — как в макете: Chrome
 * переносит эти тексты иначе.
 */
function Now() {
  return (
    <MSection>
      <Photo src="/figma/spivpratsia/showroom-table-m.jpg" alt="Шоурум BBS у Києві" />
      <MTitle>Нині BBS це:</MTitle>
      {/* В мобильном макете есть список, которого нет на десктопе (1664:6124). */}
      <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
        - гарантія якості від 15 до 25 років
        <br />- відсутність посередників
        <br />- пряма угода з виробниками
        <br />
        Laminam і Vicostone
      </p>
      <div className={`flex w-full flex-col items-start gap-[20px] ${MOB_L} text-card-gray`}>
        <NowItem title="- Понад 100 декорів штучного каменю">
          Різноманіття кольорів і текстур Laminam
          <br />
          та Vicostone: від стриманих однотонних
          <br />
          відтінків до виразних мармурових візерунків
          <br />і фактур, що відтворюють природний камінь.
        </NowItem>
        <NowItem title="- 1000+ реалізованих проєктів">
          Стільниці, підвіконня, фасади та інші
          <br />
          вироби з штучного каменю для житлових
          <br />і комерційних просторів. Досвід роботи з
          <br />
          різними матеріалами й запитами допомагає
          <br />
          знаходити рішення для кожного проєкту.
        </NowItem>
        <NowItem title="- Офіційне партнерство з Laminam і Vicostone">
          Працюємо з провідними виробниками
          <br />
          керамограніту та кварцового агломерату,
          <br />
          забезпечуючи постачання оригінальних
          <br />
          матеріалів з офіційною гарантією.
        </NowItem>
      </div>
    </MSection>
  );
}

/** Frame 4748 (1673:8021): px 14 / py 40, заголовок #000, абзац semibold с light-вставками. */
function Team() {
  return (
    <section className="flex w-full flex-col items-center gap-[10px] px-[14px] py-[40px]">
      <h2 className={`text-trim w-full ${H2_MOB_SB} text-black`}>
        Працюйте з командою
        <br />
        спеціалістів
      </h2>
      <p className={`text-trim w-full ${MOB_SB} text-card-gray`}>
        Фахівці BBS щодня забезпечують високий рівень сервісу для партнерів,
        <span className="font-light">
          {" "}
          дотримуючись професійних стандартів у постачанні матеріалів і
          виготовленні виробів із каменю.{" "}
        </span>
        Ми допомагаємо
        <span className="font-light">
          {" "}
          втілювати проєкти, знаходити оптимальні рішення та{" "}
        </span>
        створювати можливості для розвитку вашого бізнесу.
      </p>
    </section>
  );
}

/** RealizedProjects (1664:6135): фото, «Співпраця з BBS», Main_cta. */
function Partner() {
  return (
    <MSection>
      <Photo src="/figma/spivpratsia/showroom-shelf-m.jpg" alt="Зразки матеріалів у шоурумі BBS" />
      <MTitle>Співпраця з BBS</MTitle>
      {/* Строки — как в макете. Третья в Chrome шире колонки на 1.7px и
          переносилась (5 строк вместо 4) — мягкий перенос отключён, как в ONE_LINE. */}
      <p className={`text-trim w-full ![text-wrap-mode:nowrap] ${MOB_L} text-card-gray`}>
        Сильне партнерство починається там, де
        <br />
        можливості доповнюють одна одну. <B>Ми</B>
        <br />
        <B>забезпечуємо дистрибуцію каменю, ви — його</B>
        <br />
        <B>професійну обробку.</B> Розвиваймося разом!
      </p>
      <PrimaryBtn href={LEAD_HREF} className="w-full">
        Надіслати заявку
      </PrimaryBtn>
    </MSection>
  );
}

export default function MobileSpivpratsia({ advantages }: { advantages: Advantage[] }) {
  return (
    <>
      <MHero breadcrumb={["Головна", "Співпраця"]} bg="overlay" gap={24}>
        <MHeroText
          title="Співпраця з BBS"
          text={
            <>
              BBS — <B>офіційний дистриб’ютор Laminam</B> і{" "}
              <B>представник Vicostone</B> в Україні. З 2012 року працюємо з
              керамогранітом і кварцовим агломератом, забезпечуючи постачання
              оригінальних матеріалів без посередників.
            </>
          }
        />
        {/* В макете у героя одна кнопка (без «Дизайнерам і обробникам»). */}
        <PrimaryBtn href={LEAD_HREF} icon="/figma/bbs/support-white.svg" className="w-full">
          Отримати консультацію
        </PrimaryBtn>
      </MHero>
      <div className="contents" data-reveal>
        <Now />
        <Team />
        <Advantages title="BBS — надійний партнер" items={advantages} />
        <Partner />
        <Projects lead={false} />
        <Info title="Наші контакти" />
      </div>
    </>
  );
}
