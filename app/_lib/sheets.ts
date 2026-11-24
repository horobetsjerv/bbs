// Заявка → Google-таблица «Ліди BBS» (по образцу таблицы Кипра): Apps Script
// таблицы принят как веб-приложение, сайт шлёт ему JSON, скрипт дописывает
// строку под шапку по названиям колонок. Адрес веб-приложения — в .env:
// GOOGLE_SHEETS_URL. Не задан — отправка пропускается, заявка всё равно в базе.
// Результат — в leads.sheets_synced_at / sheets_error (видно в админке).

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { leads } from "@/db/schema";

const FORM_LABEL = {
  feedback: "Зворотний зв’язок",
  sample_order: "Замовити зразок",
  price_request: "Запитати ціну",
} as const;

export async function syncLeadToSheets(leadId: number) {
  const url = process.env.GOOGLE_SHEETS_URL;
  if (!url) return;

  const lead = await db.query.leads.findFirst({
    where: (l, { eq }) => eq(l.id, leadId),
    with: { material: { columns: { name: true }, with: { brand: { columns: { name: true } } } } },
  });
  if (!lead) return;

  // Поля — как ждёт скрипт таблицы (FIELD_BY_HEADER). «UTM мітка» = адрес
  // страницы с меткой, как в таблице Кипра.
  const payload = {
    pageUrl: lead.pageUrl ?? "",
    formType: FORM_LABEL[lead.formType],
    material: lead.material ? `${lead.material.name} (${lead.material.brand.name})` : "",
    message: lead.message ?? "",
    phone: lead.phone,
    name: lead.name,
    utmTerm: lead.utmTerm ?? "",
    utmCampaign: lead.utmCampaign ?? "",
  };

  let error: string | null = null;
  try {
    // Apps Script отвечает редиректом на страницу с результатом — fetch идёт по нему.
    // Первый вызов после простоя у Google бывает долгим (20+ с) — ждём до минуты;
    // посетитель не ждёт (after), а повтор мог бы задвоить строку.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
    });
    const text = await res.text();
    let data: { ok?: boolean; error?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      error = `HTTP ${res.status}: ${text.slice(0, 200)}`;
    }
    if (!error && !data.ok) error = data.error ?? `HTTP ${res.status}`;
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error) console.error("[leads] sheets failed", leadId, error);
  await db
    .update(leads)
    .set(error ? { sheetsError: error.slice(0, 1000) } : { sheetsSyncedAt: new Date(), sheetsError: null })
    .where(eq(leads.id, leadId));
}
