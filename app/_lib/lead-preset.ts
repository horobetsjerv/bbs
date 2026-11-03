import type { LeadPreset } from "@/app/_components/bbs/LeadFormFields";

const LEAD_LABEL = { sample_order: "Замовити зразок", price_request: "Запитати ціну" } as const;

/**
 * Пресет формы заявки из адреса кнопки: ?lead=sample_order&material=12&about=…
 * Тип и материал уходят в заявку, тема подставляется в сообщение.
 * Общий для формы на главной и модалки на остальных страницах.
 */
export function leadPreset(get: (key: string) => string | null | undefined): LeadPreset {
  const one = (k: string) => get(k) ?? "";
  const type = one("lead");
  const formType = type === "sample_order" || type === "price_request" ? type : "feedback";
  const about = one("about").slice(0, 200);
  const label = formType === "feedback" ? null : LEAD_LABEL[formType];
  return {
    formType,
    materialId: Number(one("material")) || null,
    message: about ? (label ? `${label}: ${about}` : about) : label ?? undefined,
  };
}
