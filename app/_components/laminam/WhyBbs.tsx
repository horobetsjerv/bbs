import { BrandWhy } from "../brand/sections";

// SEO-таблица, лист «Laminam»: «Чому обирають Laminam у BBS» — четыре пункта
// (с заглавной, как факты главной). Колонки как у фактов главной: иконка 48, H3_SB.
export const WHY_TITLE = "Чому обирають Laminam у BBS";
export const WHY = [
  { icon: "medal", title: "Офіційний дистриб'ютор" },
  { icon: "shield", title: "Гарантія 25 років" },
  { icon: "support", title: "Підбір матеріалу з професіоналами" },
  { icon: "brush", title: "Якісний монтаж" },
];

export default function WhyBbs() {
  return <BrandWhy title={WHY_TITLE} items={WHY} />;
}
