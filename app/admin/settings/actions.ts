"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";

export type SettingsInput = {
  phones: string[];
  emails: string[];
  address: string;
  mapLat: string;
  mapLng: string;
  workingHours: string;
  socials: { instagram: string; facebook: string; telegram: string };
  telegramChatId: string;
  googleSheetId: string;
};

export type ActionResult = { ok: true } | { ok: false; error: string };

const trimOrNull = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

/** Пустые строки из полей «додати ще» до базы не доходят. */
const cleanList = (values: string[]) =>
  values.map((value) => value.trim()).filter(Boolean);

const isCoordinate = (value: string) => /^-?\d{1,3}(\.\d+)?$/.test(value.trim());

function validate(input: SettingsInput): string | null {
  const badEmail = cleanList(input.emails).find(
    (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  );
  if (badEmail) return `Некоректний email: ${badEmail}`;
  if (input.mapLat.trim() && !isCoordinate(input.mapLat)) {
    return "Широта має бути числом, наприклад 50.4501";
  }
  if (input.mapLng.trim() && !isCoordinate(input.mapLng)) {
    return "Довгота має бути числом, наприклад 30.5234";
  }
  return null;
}

export async function saveSettings(
  input: SettingsInput,
): Promise<ActionResult> {
  const error = validate(input);
  if (error) return { ok: false, error };

  const socials = Object.fromEntries(
    Object.entries(input.socials)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => value.length),
  );

  const values = {
    phones: cleanList(input.phones),
    emails: cleanList(input.emails),
    address: trimOrNull(input.address),
    mapLat: trimOrNull(input.mapLat),
    mapLng: trimOrNull(input.mapLng),
    workingHours: trimOrNull(input.workingHours),
    socials,
    telegramChatId: trimOrNull(input.telegramChatId),
    googleSheetId: trimOrNull(input.googleSheetId),
    updatedAt: new Date(),
  };

  // Строка настроек одна, id всегда 1; upsert нужен, потому что при первом сохранении её ещё нет.
  await db
    .insert(settings)
    .values({ id: 1, ...values })
    .onConflictDoUpdate({ target: settings.id, set: values });

  revalidatePath("/admin/settings");
  return { ok: true };
}
