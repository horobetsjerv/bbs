// Уведомление о заявке в Telegram-группу через Bot API.
// Токен бота и id группы — в .env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// (у группы id отрицательный, например -1001234567890). Не заданы — отправка
// пропускается, заявка всё равно сохраняется в базе.
// Результат пишется в leads.telegram_sent_at / telegram_error: потерянная
// заявка видна в админке.

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leads } from "@/db/schema";

/** Тип формы отдельной строкой с emoji-маркером (п. 4.1.2 ТЗ). */
const FORM_LABEL = {
  feedback: "📩 Зворотний зв’язок",
  sample_order: "🧱 Замовити зразок",
  price_request: "💰 Запитати ціну",
} as const;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function notifyLeadTelegram(leadId: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lead = await db.query.leads.findFirst({
    where: (l, { eq }) => eq(l.id, leadId),
    with: {
      topic: { columns: { name: true } },
      material: { columns: { name: true }, with: { brand: { columns: { name: true } } } },
    },
  });
  if (!lead) return;

  const utm = [
    lead.utmSource && `source=${lead.utmSource}`,
    lead.utmMedium && `medium=${lead.utmMedium}`,
    lead.utmCampaign && `campaign=${lead.utmCampaign}`,
    lead.utmTerm && `term=${lead.utmTerm}`,
    lead.utmContent && `content=${lead.utmContent}`,
  ].filter(Boolean);

  const lines = [
    `<b>${FORM_LABEL[lead.formType]}</b>`,
    `Нова заявка з сайту, №${lead.id}`,
    "",
    `<b>Ім’я:</b> ${esc(lead.name)}`,
    `<b>Телефон:</b> ${esc(lead.phone)}`,
    lead.topic && `<b>Тема:</b> ${esc(lead.topic.name)}`,
    lead.material && `<b>Матеріал:</b> ${esc(lead.material.name)} (${esc(lead.material.brand.name)})`,
    lead.message && `<b>Повідомлення:</b>\n${esc(lead.message)}`,
    lead.pageUrl && `<b>Сторінка:</b> ${esc(lead.pageUrl)}`,
    utm.length > 0 && `<b>UTM:</b> ${esc(utm.join(", "))}`,
  ].filter((l) => l !== null && l !== false && l !== undefined);

  let error: string | null = null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await res.json()) as { ok: boolean; description?: string };
    if (!data.ok) error = data.description ?? `HTTP ${res.status}`;
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error) console.error("[leads] telegram failed", leadId, error);
  await db
    .update(leads)
    .set(error ? { telegramError: error.slice(0, 1000) } : { telegramSentAt: new Date(), telegramError: null })
    .where(eq(leads.id, leadId));
}
