import { BrandApplications, type BrandTile } from "../brand/sections";
import { LAMINAM_CATALOG_PATH } from "@/app/_lib/catalog-url";

// SEO-таблица, лист «Laminam»: «Де використовують» — список дословно (со строчной,
// «фасадів кухонь» продолжает «виготовлення стільниць»).
export const USES_TITLE = "Де використовують";
export const USES = [
  "виготовлення стільниць",
  "фасадів кухонь",
  "облицювання стін",
  "облицювання підлоги",
  "оформлення інтер'єрів",
  "облицювання зовнішнього боку будівель",
];

/** Плитки применений (десктоп и мобилка): ведут в каталог Laminam с ?application=. */
export const TILES: BrandTile[] = [
  { icon: "countertop", label: "Стільниці" },
  { icon: "wall", label: "Стіни" },
  { icon: "floor", label: "Підлога" },
  { icon: "facade", label: "Фасади" },
  { icon: "stairs", label: "Сходи" },
  { icon: "furniture", label: "Меблі" },
];

export default function Applications() {
  return (
    <BrandApplications title={USES_TITLE} uses={USES} tiles={TILES} catalog={LAMINAM_CATALOG_PATH} />
  );
}
