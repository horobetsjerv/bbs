"use server";

// Заявки с сайта → таблица leads (видны в админке, раздел «Заявки»)
// и уведомление в Telegram-группу (telegram.ts). Google Sheets не подключены:
// поля sheets_* остаются пустыми.

import { headers } from "next/headers";
import { after } from "next/server";

import { db } from "@/db";
import { leads } from "@/db/schema";

import { nameError, phoneError } from "./lead-validation";
import { notifyLeadTelegram } from "./telegram";

const FORM_TYPES = ["feedback", "sample_order", "price_request"] as const;
type FormType = (typeof FORM_TYPES)[number];

/** Тема заявки из справочника lead_topics. */
const TOPIC: Partial<Record<FormType, string>> = {
  sample_order: "zamovyty-zrazok",
  price_request: "zapytaty-tsinu",
};

export type LeadState = {
  status: "idle" | "ok" | "error";
  message?: string;
  /** Введённое — назад в форму: React сбрасывает поля после отправки. */
  values?: { name: string; phone: string; message: string };
};

const field = (form: FormData, key: string, max: number) =>
  String(form.get(key) ?? "").trim().slice(0, max);

export async function submitLead(_prev: LeadState, form: FormData): Promise<LeadState> {
  const name = field(form, "name", 160);
  const phone = field(form, "phone", 32);
  const message = field(form, "message", 5000) || null;
  const values = { name, phone, message: message ?? "" };
  // Те же правила, что в форме (lead-validation.ts): форма их уже проверила,
  // здесь — на случай отправки в обход неё.
  const invalid = nameError(name) ?? phoneError(phone);
  if (invalid) return { status: "error", message: invalid, values };

  const rawType = field(form, "formType", 32);
  const formType: FormType = FORM_TYPES.includes(rawType as FormType)
    ? (rawType as FormType)
    : "feedback";

  // Материал и тема — только существующие, иначе заявка упала бы на внешнем ключе.
  const materialIdRaw = Number(field(form, "materialId", 12));
  const [material, topic] = await Promise.all([
    Number.isInteger(materialIdRaw) && materialIdRaw > 0
      ? db.query.materials.findFirst({
          where: (m, { eq }) => eq(m.id, materialIdRaw),
          columns: { id: true },
        })
      : undefined,
    TOPIC[formType]
      ? db.query.leadTopics.findFirst({
          where: (t, { eq }) => eq(t.slug, TOPIC[formType]!),
          columns: { id: true },
        })
      : undefined,
  ]);

  const h = await headers();
  const pageUrl = h.get("referer");
  let utm: URLSearchParams | null = null;
  try {
    utm = pageUrl ? new URL(pageUrl).searchParams : null;
  } catch {
    utm = null;
  }
  const utmValue = (k: string) => utm?.get(k)?.slice(0, 128) || null;

  let leadId: number;
  try {
    const [row] = await db.insert(leads).values({
      formType,
      name,
      phone,
      message,
      topicId: topic?.id ?? null,
      materialId: material?.id ?? null,
      pageUrl,
      utmSource: utmValue("utm_source"),
      utmMedium: utmValue("utm_medium"),
      utmCampaign: utmValue("utm_campaign"),
      utmTerm: utmValue("utm_term"),
      utmContent: utmValue("utm_content"),
      ip: h.get("x-forwarded-for")?.split(",")[0].trim().slice(0, 64) ?? null,
      userAgent: h.get("user-agent"),
    }).returning({ id: leads.id });
    leadId = row.id;
  } catch (e) {
    console.error("[leads] insert failed", e);
    return { status: "error", message: "Не вдалося надіслати заявку. Спробуйте ще раз.", values };
  }
  // После ответа: посетитель не ждёт Telegram, сбой отправки не теряет заявку.
  after(() => notifyLeadTelegram(leadId));
  return { status: "ok" };
}
