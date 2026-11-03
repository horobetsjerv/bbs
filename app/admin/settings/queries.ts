import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";

/** Настройки — одна строка с id = 1; до первого сохранения её нет. */
export async function getSettings() {
  const [row] = await db.select().from(settings).where(eq(settings.id, 1));
  return row ?? null;
}

export type Settings = NonNullable<Awaited<ReturnType<typeof getSettings>>>;
