import { H3_SB, Icon, MOB_L } from "../bbs/ui";

// «Факти про компанію» из SEO-таблицы (лист «Головна»): четыре факта —
// заголовки; подписи под ними из прежнего макета Frame 25. Стиль колонок
// тот же (иконка 48, H3_SB, MOB_L), колонок четыре по 262px через 24px.
export const FACTS = [
  { icon: "medal", title: "Офіційний дистриб'ютор", text: "Laminam та Vicostone в Україні" },
  { icon: "shield", title: "Гарантія від 15 до 25 років", text: "Підтверджена якість та довговічність матеріалів" },
  { icon: "palette", title: "100+ кольорів у каталозі", text: "Сучасні кольори, фактури та формати для будь-яких рішень" },
  { icon: "brush", title: "1000+ реалізованих проєктів", text: "Стільниці, фасади, підлога, стіни та сходи" },
];

export default function Advantages() {
  return (
    <section className="flex w-full items-start gap-[24px]">
      {FACTS.map((item) => (
        <div key={item.icon} className="flex min-w-px flex-1 flex-col items-center">
          <Icon src={`/figma/bbs/${item.icon}.svg`} size={48} />
          <p className={`text-trim mt-[12px] w-full text-center ${H3_SB} text-ink`}>
            {item.title}
          </p>
          <p className={`text-trim mt-[12px] w-full text-center ${MOB_L} text-card-gray`}>
            {item.text}
          </p>
        </div>
      ))}
    </section>
  );
}
