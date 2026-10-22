// Нормализация адресов для таблицы redirects (301/410 со старого сайта).
// Без импортов: модуль нужен и proxy.ts, и загрузчику db/load-redirects.ts,
// который запускается голым node без алиасов Next.

/** Последний сегмент похож на файл (sitemap_index.xml) — слеш в конце не добавляем. */
const FILE_SEGMENT = /\.\w+$/;

const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    // Битый percent-encoding — оставляем как есть, правило просто не совпадёт.
    return s;
  }
};

/**
 * Вид from_path в таблице: путь без домена, query и #, декодированный
 * (/Колір/bilyj/, а не /%D0%9A…), со слешем в конце (кроме файлов).
 * Регистр сохраняется — для читаемости; сравнение идёт через redirectKey.
 * «*» в конце — правило по префиксу, остаётся как есть.
 */
export function normalizeFromPath(input: string): string {
  let p = input.trim();
  p = p.replace(/^[a-z]+:\/\/[^/]+/i, "");
  p = p.replace(/[?#].*$/, "");
  p = decode(p);
  if (!p.startsWith("/")) p = `/${p}`;
  p = p.replace(/\/{2,}/g, "/");
  if (p.endsWith("*")) return p;
  const last = p.slice(p.lastIndexOf("/") + 1);
  if (!p.endsWith("/") && !FILE_SEGMENT.test(last)) p += "/";
  return p;
}

/**
 * Ключ сравнения: декодированный путь в нижнем регистре и без слеша в конце.
 * /Колір/bilyj/, /%D0%9A%D0%BE%D0%BB%D1%96%D1%80/bilyj и /колір/BILYJ —
 * один ключ /колір/bilyj. Корень — «/».
 */
export function redirectKey(pathname: string): string {
  const p = decode(pathname).replace(/\/{2,}/g, "/").toLowerCase();
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}
