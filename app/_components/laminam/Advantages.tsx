import { H3_SB, Icon } from "../bbs/ui";

// Переносы как в Figma (тексты в колонках 165–167px).
const ITEMS = [
  { icon: "flag-italy", width: 167, lines: ["100%", "Італійське", "виробництво"] },
  { icon: "techno-heart", width: 166, lines: ["Інноваційні", "технології", "виробництва"] },
  { icon: "scratch-48", width: 167, lines: ["Стійкість до", "подряпин та", "механічних", "пошкоджень"] },
  { icon: "water-off-48", width: 167, lines: ["Стійкість до", "вологи, плям", "та хімікатів"] },
  { icon: "temperature-48", width: 166, lines: ["Стійкість до", "УФ, морозу", "та високих", "температур"] },
  { icon: "eco", width: 167, lines: ["Екологічність", "та безпека"] },
];

export default function Advantages() {
  return (
    <section className="flex w-full items-start gap-[24px]">
      {ITEMS.map((item) => (
        <div
          key={item.icon}
          className="flex shrink-0 flex-col items-center gap-[12px]"
          style={{ width: `${item.width}px` }}
        >
          <Icon src={`/figma/bbs/${item.icon}.svg`} size={48} />
          <p className={`text-trim w-full text-center ${H3_SB} text-ink`}>
            {item.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}
