import { CAPTION, inset } from "../bbs/ui";

/** Ссылка «Записатися на візит»: форма заявки (модалка) с темой визита. */
export const VISIT_HREF = "/?about=Візит у шоурум#lead-form";

/**
 * hero-meta (1625:14420 / 1627:14601): адрес и график шоурума в «пилюлях»
 * light_gray с внутренней обводкой back_card_gray, px 12 / py 8, текст pidpys.
 * На десктопе — в ряд, на мобиле (`stack`) — столбцом.
 */
export default function MetaChips({ stack = false }: { stack?: boolean }) {
  return (
    <div className={`flex w-full gap-[12px] ${stack ? "flex-col items-start" : "items-center"}`}>
      {["Київ, вул. Василя Тютюнника 51/1А", "Пн-Пт: 9:30 - 17:00"].map((t) => (
        <span
          key={t}
          className="flex shrink-0 items-start rounded-full bg-light-gray px-[12px] py-[8px]"
          style={inset("var(--color-back-card-gray)")}
        >
          <span className={`text-trim whitespace-nowrap ${CAPTION} text-card-gray`}>{t}</span>
        </span>
      ))}
    </div>
  );
}
