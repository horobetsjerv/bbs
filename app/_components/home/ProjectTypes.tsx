import Link from "next/link";

import { catalogHref, typeSelection } from "@/app/_lib/catalog-url";

import { TypeTile } from "../bbs/cards";
import { CAPTION, OutlineBtn, SectionHeader, SectionLead } from "../bbs/ui";

/**
 * Список из SEO-таблицы (лист «Головна»). Ведут на подборки каталога из
 * таблицы структуры (/kataloh/stilnytsi-z-keramogranitu/ …); у пунктов без
 * своей подборки — каталог с фильтрами «тип каменя + призначення» (noindex, follow).
 */
const K = typeSelection("keramohranit");
const Q = typeSelection("kvarts");
export const PROJECT_LINKS = [
  { label: "умивальники з керамограніту", href: catalogHref({ ...K, product: ["umyvalnyky"] }) },
  { label: "керамограніт для сходів", href: catalogHref({ ...K, application: ["skhody"] }) },
  { label: "керамограніт для каміну", href: catalogHref({ ...K, product: ["kaminy"] }) },
  { label: "керамограніт для вулиці", href: catalogHref({ ...K, application: ["vulytsia"] }) },
  // Отдельного пункта «Ванна кімната» в фильтрах нет — «Для умивальників».
  { label: "керамограніт для ванної кімнати", href: catalogHref({ ...K, application: ["umyvalnyky"] }) },
  { label: "керамограніт для тераси", href: catalogHref({ ...K, application: ["terasa"] }) },
  { label: "керамограніт для стін", href: catalogHref({ ...K, application: ["stiny"] }) },
  // Плінтуса в базе нет — общая подборка керамограніту.
  { label: "керамограніт для плінтуса", href: catalogHref(K) },
  { label: "керамограніт для підлоги", href: catalogHref({ ...K, application: ["pidloha"] }) },
  { label: "стільниці з керамограніту", href: catalogHref({ ...K, product: ["stilnytsi"] }) },
  { label: "підвіконня з керамограніту", href: catalogHref({ ...K, product: ["pidvikonnia"] }) },
  { label: "керамограніт для фасадів", href: catalogHref({ ...K, application: ["fasad"] }) },
  { label: "кухонні фартухи з керамограніту", href: catalogHref({ ...K, product: ["fartukhy"] }) },
  { label: "стільниці з кварцового каменю", href: catalogHref({ ...Q, product: ["stilnytsi"] }) },
  { label: "підвіконня з кварцового каменю", href: catalogHref({ ...Q, product: ["pidvikonnia"] }) },
  { label: "сходи з кварцового каменю", href: catalogHref({ ...Q, application: ["skhody"] }) },
  { label: "стільниці зі штучного каменю", href: catalogHref({ product: ["stilnytsi"] }) },
  { label: "підвіконня зі штучного каменю", href: catalogHref({ product: ["pidvikonnia"] }) },
  { label: "умивальники зі штучного каменю", href: catalogHref({ product: ["umyvalnyky"] }) },
];

/** Пункты списка — плашки как Tag карточек, ссылкой: hover — blue. На сером фоне секции — белые. */
export function ProjectLinks({ onGray = false }: { onGray?: boolean }) {
  return (
    <ul className="flex w-full flex-wrap gap-[8px]">
      {PROJECT_LINKS.map((l) => (
        <li key={l.label}>
          <Link
            href={l.href}
            className={`flex items-start px-[8px] py-[9px] text-card-gray transition-colors hover:text-blue ${
              onGray ? "bg-white" : "bg-back-card-gray"
            }`}
          >
            <span className={`text-trim whitespace-nowrap ${CAPTION}`}>{l.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const TYPES = [
  { icon: "kitchen" as const, label: "Кухонні острови" },
  { icon: "countertop" as const, label: "Стільниці" },
  { icon: "floor" as const, label: "Підлога" },
  { icon: "wall" as const, label: "Стіни" },
  { icon: "facade" as const, label: "Фасади" },
  { icon: "stairs" as const, label: "Сходи" },
];

export default function ProjectTypes() {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title="Штучний камінь і керамограніт для вашого проєкту"
        action={<OutlineBtn href="/kataloh/">Перейти до каталогу</OutlineBtn>}
      />
      <SectionLead>Оберіть що саме вам необхідно зробити</SectionLead>
      {/* 6 × 167 + 5 × 24 = 1122: в макете ряд выходит за колонку на 2px. */}
      <div className="flex w-full items-start gap-[24px]">
        {TYPES.map((t) => (
          <TypeTile key={t.label} icon={t.icon} label={t.label} />
        ))}
      </div>
      <ProjectLinks />
    </section>
  );
}
