/* eslint-disable @next/next/no-img-element */
import { VicostoneLogo } from "../bbs/blocks";
import { H2_SB, H3_L, H3_SB, Icon, PrimaryBtn } from "../bbs/ui";

// Ячейки таблицы в Figma с внешней обводкой: высота = padding + текст + 2px,
// соседние ячейки перекрываются на 1px (mr/mb −1px).
const CELL = "border border-blue";
const LABEL_CELL = `${CELL} flex w-[382px] shrink-0 items-center self-stretch -mr-px bg-light-gray px-[71px] py-[24px]`;
const MID_BOX = `${CELL} flex w-[358px] shrink-0 items-center -mr-px py-[24px]`;
const END_BOX = `${CELL} flex min-w-px flex-1 items-center py-[24px]`;
const MID_CELL = `${MID_BOX} gap-[10px] bg-white px-[24px]`;
const END_CELL = `${END_BOX} gap-[10px] bg-white pr-[71px] pl-[24px]`;
const VALUE = `text-trim ${H3_SB} text-ink`;

type Value = { icon?: string; text: string };

const ROWS: { label: string; laminam: Value; vicostone: Value; wrap?: boolean }[] = [
  {
    label: "Вологостійкість",
    laminam: { icon: "water-off", text: "Не вбирає воду" },
    vicostone: { icon: "water-off", text: "Не вбирає воду" },
  },
  {
    label: "Стійкість до подряпин",
    laminam: { icon: "scratch-high", text: "Висока" },
    vicostone: { icon: "scratch-high", text: "Висока" },
  },
  {
    label: "Стійкість до температури",
    laminam: { icon: "temperature-high", text: "Висока" },
    vicostone: { icon: "temperature-mid", text: "Середня" },
  },
  {
    label: "Застосування",
    laminam: { icon: "brush", text: "Стіни, підлога, фасади, стільниці" },
    vicostone: { icon: "brush", text: "Стільниці, підвіконня, сходи" },
    wrap: true,
  },
];

function ValueCell({ value, className, wrap }: { value: Value; className: string; wrap?: boolean }) {
  return (
    <div className={`${className} ${wrap ? "self-stretch" : ""}`}>
      {value.icon && <Icon src={`/figma/bbs/${value.icon}.svg`} size={20} />}
      <p className={`${VALUE} ${wrap ? "min-w-px flex-1" : "whitespace-nowrap"}`}>
        {value.text}
      </p>
    </div>
  );
}

export default function Compare() {
  return (
    <section className="relative flex w-full flex-col items-start gap-[40px]">
      {/* Фото-подложка от левого края окна на всю его ширину: 20px от
          заголовка (как в макете) и выступает за таблицу на 20px сверху и
          снизу (таблица: y 122–717). */}
      <img
        loading="lazy"
        src="/figma/bbs/compare-bg.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-[102px] left-[calc(560px-50vw)] h-[635px] w-[max(1283px,100vw)] max-w-none object-cover"
      />

      <div
        className="relative flex w-full items-center justify-between"
        style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
      >
        <div className="flex w-[560px] shrink-0 flex-col items-start justify-center gap-[24px]">
          <h2 className={`text-trim whitespace-nowrap ${H2_SB} text-ink`}>
            Що вибрати — Laminam чи Vicostone?
          </h2>
          <p className={`text-trim w-[560px] ${H3_L} text-card-gray`}>
            Порівняйте ключові характеристики матеріалів та оберіть оптимальне
            рішення для вашого проекту.
          </p>
        </div>
        <div className="flex w-[429px] shrink-0 items-center gap-[24px] self-stretch">
          <Icon src="/figma/bbs/content-modified.svg" size={48} />
          <p className="min-w-px flex-1 text-[20px] leading-[20px] tracking-[-1px] text-card-gray">
            <span className="font-light">Обидва матеріали -</span>{" "}
            <span className="font-semibold text-blue">преміальні та довговічні.</span>{" "}
            <span className="font-light">
              Вибір залежить від ваших задач та умов експлуатації.
            </span>
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-start">
        <div className="flex w-full flex-col items-start">
          <div className="-mb-px flex w-full items-start">
            <div className={LABEL_CELL}>
              <p className={`${VALUE} whitespace-nowrap`}>Характеристика</p>
            </div>
            <div className={`${MID_BOX} justify-center bg-light-gray px-[71px]`}>
              <Icon src="/figma/bbs/laminam-logo-sm.svg" width={138.5} height={19.983} />
            </div>
            <div className={`${END_BOX} justify-center bg-light-gray px-[71px]`}>
              <VicostoneLogo size={20} />
            </div>
          </div>

          <div className="-mb-px flex w-full items-center">
            <div className={LABEL_CELL}>
              <p className={`${VALUE} whitespace-nowrap`}>Матеріал</p>
            </div>
            <ValueCell value={{ text: "Керамограніт" }} className={MID_CELL} />
            <ValueCell
              value={{ text: "Кварцовий агломерат" }}
              className={`${END_BOX} gap-[10px] bg-white px-[24px]`}
            />
          </div>

          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`flex w-full items-start ${i < ROWS.length - 1 ? "-mb-px" : ""}`}
            >
              <div className={LABEL_CELL}>
                <p className={`${VALUE} whitespace-nowrap`}>{row.label}</p>
              </div>
              <ValueCell value={row.laminam} className={MID_CELL} wrap={row.wrap} />
              <ValueCell value={row.vicostone} className={END_CELL} wrap={row.wrap} />
            </div>
          ))}
        </div>

        <div
          className="flex w-full items-center justify-between bg-back-card-gray px-[71px] py-[32px]"
          style={{
            boxShadow:
              "inset 1px 0 0 var(--color-blue), inset -1px 0 0 var(--color-blue), inset 0 -1px 0 var(--color-blue)",
          }}
        >
          <div className="flex w-[477px] shrink-0 flex-col items-start gap-[16px]">
            <p className={`text-trim w-full ${H2_SB} text-ink`}>
              Вагаєтеся, що потрібно саме вам?
            </p>
            <p className={`text-trim w-full ${H3_L} text-card-gray`}>
              Наші спеціалісти допоможуть обрати влучний варіант!
            </p>
          </div>
          <PrimaryBtn
            href="#lead-form"
            py={14}
            icon="/figma/bbs/support-white.svg"
            className="min-w-px flex-1 text-[#fdfefe]"
          >
            Отримати допомогу з вибором
          </PrimaryBtn>
        </div>
      </div>
    </section>
  );
}
