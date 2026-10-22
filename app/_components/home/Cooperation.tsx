import { H2_L, H3_L, SectionHeader, SectionLead } from "../bbs/ui";

// SEO-таблица, лист «Головна»: «Професійні умови співпраці з BBS».
export const COOPERATION_TITLE = "Професійні умови співпраці з BBS";
export const COOPERATION_LEAD =
  "BBS відкриті до співпраці з дизайнерами, архітекторами, обробниками, будівельними компаніями та іншими фахівцями. Усі організаційні та робочі питання обговорюємо під час першої зустрічі.";
export const COOPERATION_STEPS_TITLE = "Співпраця відбувається за такими етапами:";
export const COOPERATION_STEPS = [
  "Домовляємося про зустріч, щоб обговорити майбутній проєкт.",
  "Обираємо матеріали: визначаємо декор, колір, кількість і необхідні параметри.",
  "Готуємо комерційну пропозицію та погоджуємо вартість.",
  "Домовляємося про замір, щоб уточнити розміри та особливості проєкту.",
  "Виготовляємо виріб відповідно до погоджених параметрів.",
  "Домовляємося про встановлення та виконуємо монтаж готового виробу.",
];

/**
 * Нумерованные этапы: номер тонким H2 blue, текст H3_L, линия сверху — как у
 * таблиц сайта. Общие для главной и текстов подборок каталога.
 */
export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="grid w-full grid-cols-3 gap-x-[24px] gap-y-[40px]">
      {steps.map((step, i) => (
        <li
          key={step}
          className="flex flex-col items-start gap-[16px] pt-[24px]"
          style={{ boxShadow: "inset 0 1px 0 var(--color-light-gray)" }}
        >
          <span className={`text-trim ${H2_L} text-blue tabular-nums`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={`text-trim ${H3_L} text-ink`}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

/** Етапи співпраці: шапка, вступ и StepList. */
export default function Cooperation() {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader title={COOPERATION_TITLE} />
      <SectionLead>{COOPERATION_LEAD}</SectionLead>
      <p className={`text-trim mt-[16px] ${H3_L} text-ink`}>{COOPERATION_STEPS_TITLE}</p>
      <StepList steps={COOPERATION_STEPS} />
    </section>
  );
}
