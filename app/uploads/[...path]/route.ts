import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Фото, загруженные в админке после сборки (public/uploads/ГГГГ/ММ/…).
 * Next отдаёт из public только файлы, которые были там во время сборки, —
 * новые загрузки отдаём отсюда. Файлы со сборки по-прежнему отдаёт Next
 * (public приоритетнее), через этот обработчик идут только новые; через
 * него же их видит и оптимизатор next/image.
 */
// Без path.join(process.cwd(), …): такой путь Turbopack пытается упаковать
// целиком, а на сервере public/uploads — ссылка на папку вне проекта.
const ROOT = path.resolve(process.env.UPLOADS_DIR ?? "public/uploads");

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const file = path.join(ROOT, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  // Только картинки и только внутри папки загрузок (без «../»).
  if (!type || !file.startsWith(ROOT + path.sep)) return new Response("Not Found", { status: 404 });
  try {
    const body = await readFile(file);
    return new Response(body, {
      headers: {
        "content-type": type,
        // Имя файла случайное и не меняется — кэшируем надолго.
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
