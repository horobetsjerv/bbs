"use server";

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/db";
import { media } from "@/db/schema";

export type UploadResult =
  | { ok: true; url: string; id: number }
  | { ok: false; error: string };

/** Расширение выбирается по MIME, а не по имени файла: имени с клиента доверять нельзя. */
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Файл кладётся в public/uploads/ГГГГ/ММ/ и получает случайное имя,
 * запись о нём — в таблицу media. Отдаётся URL для поля формы.
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) {
    return { ok: false, error: "Файл не отримано" };
  }
  const ext = EXT_BY_MIME[file.type];
  if (!ext) return { ok: false, error: "Підтримуються лише JPG, PNG, WebP, AVIF та GIF" };
  if (file.size > MAX_BYTES) return { ok: false, error: "Файл більший за 10 МБ" };

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const filename = `${randomBytes(8).toString("hex")}.${ext}`;
  const relativeDir = path.posix.join("uploads", year, month);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(
    path.join(absoluteDir, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  const url = `/${relativeDir}/${filename}`;
  const [row] = await db
    .insert(media)
    .values({
      url,
      filename: file.name.slice(0, 255),
      mime: file.type,
      sizeBytes: file.size,
    })
    .returning({ id: media.id });

  return { ok: true, url, id: row.id };
}
