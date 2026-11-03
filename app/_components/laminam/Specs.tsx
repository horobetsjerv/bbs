import { BrandSpecs } from "../brand/sections";

// SEO-таблица, лист «Laminam»: «Технічні характеристики». Запись «1000*1000 - 6мм»
// приведена к виду ответа FAQ той же таблицы: «1000×1000», «6 мм»
// (между числом и «мм» неразрывный пробел — на мобилке не отрывается).
export const SPECS_TITLE = "Технічні характеристики";
export const SPECS_LEAD = "Формат і товщина:";
export const SPECS = [
  { format: "1000×1000", thickness: "6 мм" },
  { format: "1200×1200", thickness: "6 мм" },
  { format: "1000×3000", thickness: "2 мм, 3 мм, 5 мм" },
  { format: "1200×3000", thickness: "3 мм, 5 мм" },
  { format: "3240×1620", thickness: "5 мм, 12 мм, 20 мм" },
];

/** Таблица «формат — товщина» (общий блок страниц брендов). */
export default function Specs() {
  return <BrandSpecs title={SPECS_TITLE} lead={SPECS_LEAD} rows={SPECS} />;
}
