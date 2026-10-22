// Карта 301/410 со старого сайта (WordPress + WooCommerce) — для proxy.ts.
//
// Таблица redirects читается не на каждый хит: правила лежат в памяти
// процесса и перечитываются раз в REFRESH_MS. Устаревшая карта отдаётся
// сразу, перечитывание идёт в фоне (stale-while-revalidate); ждёт базу только
// самый первый запрос после старта. База недоступна — работаем со старой
// картой (или пустой) и повторяем попытку через RETRY_MS.
//
// Формат правил (см. db/redirects.csv и db/load-redirects.ts):
//   status_code 301 — to_path: новый адрес (может быть с query);
//   status_code 410 — to_path пустой, отдаётся страница 404 с кодом 410;
//   from_path с «*» в конце — правило по префиксу (подстраховка для адресов
//   WooCommerce, которых нет в выгрузках); точное совпадение важнее.

import { Pool } from "pg";
import { redirectKey } from "./redirect-path";

export type RedirectRule = { to: string; status: 301 | 410 };

type Rules = {
  exact: Map<string, RedirectRule>;
  /** [префикс, правило], длинные префиксы первыми. */
  prefixes: [string, RedirectRule][];
};

const REFRESH_MS = 5 * 60_000;
const RETRY_MS = 30_000;

// Свой маленький пул: proxy собирается отдельно от страниц, общий пул из
// db/index.ts ему не нужен, а таймаут подключения — нужен (без него запрос
// ждал бы упавшую базу бесконечно). В dev модуль перезагружается — пул в globalThis.
const g = globalThis as unknown as { redirectsPool?: Pool };
const pool = () =>
  (g.redirectsPool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 3_000,
  }));

let rules: Rules | null = null;
let nextLoadAt = 0;
let loading: Promise<void> | null = null;

async function load() {
  try {
    const { rows } = await pool().query<{ from_path: string; to_path: string; status_code: number }>(
      "select from_path, to_path, status_code from redirects where is_active",
    );
    const exact = new Map<string, RedirectRule>();
    const prefixes: [string, RedirectRule][] = [];
    for (const r of rows) {
      if (r.status_code !== 301 && r.status_code !== 410) continue;
      if (r.status_code === 301 && !r.to_path) continue;
      const rule: RedirectRule = { to: r.to_path, status: r.status_code };
      if (r.from_path.endsWith("*")) prefixes.push([r.from_path.slice(0, -1).toLowerCase(), rule]);
      else exact.set(redirectKey(r.from_path), rule);
    }
    prefixes.sort((a, b) => b[0].length - a[0].length);
    rules = { exact, prefixes };
    // Пустая таблица (сайт выкатили раньше загрузчика) — перечитываем скоро, а не через 5 минут.
    nextLoadAt = Date.now() + (rows.length ? REFRESH_MS : RETRY_MS);
  } catch (e) {
    console.error("[redirects] не удалось прочитать таблицу redirects:", e);
    rules ??= { exact: new Map(), prefixes: [] };
    nextLoadAt = Date.now() + RETRY_MS;
  }
}

async function getRules() {
  if (Date.now() >= nextLoadAt && !loading) {
    loading = load().finally(() => {
      loading = null;
    });
  }
  if (!rules) await loading;
  return rules!;
}

/** Хвосты архивов WordPress: /news/page/2/, /product-tag/x/feed/ — правило базового адреса. */
const ARCHIVE_TAIL = /\/(?:page\/\d+|feed)$/;

/** Правило для пути запроса (как есть из URL, percent-encoded) или null. */
export async function findRedirect(pathname: string): Promise<RedirectRule | null> {
  const { exact, prefixes } = await getRules();
  const key = redirectKey(pathname);
  const hit = exact.get(key);
  if (hit) return hit;
  if (ARCHIVE_TAIL.test(key)) {
    const base = exact.get(key.replace(ARCHIVE_TAIL, "") || "/");
    if (base) return base;
  }
  for (const [prefix, rule] of prefixes) if (key.startsWith(prefix)) return rule;
  return null;
}

// ---- Страница 410 ----
// Proxy не рендерит React, а rewrite не переносит статус ответа. Поэтому HTML
// берём у собственного сервера — это страница 404 (app/not-found.tsx, уже с
// <meta name="robots" content="noindex">) — и отдаём её с кодом 410.
// Кешируется так же, как карта.

const GONE_PROBE = "/__410__/";
let gone: { html: string; until: number } | null = null;

const FALLBACK_HTML = `<!DOCTYPE html><html lang="uk"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Сторінку видалено | BBS</title></head><body><h1>Сторінку видалено</h1><p><a href="/">Перейти на головну</a></p></body></html>`;

export async function goneHtml(): Promise<string> {
  if (gone && gone.until > Date.now()) return gone.html;
  try {
    // Адрес, на котором слушает сам Next (его выставляет next start/dev);
    // публичный домен не годится — запрос ушёл бы наружу через nginx.
    const origin = process.env.__NEXT_PRIVATE_ORIGIN || `http://localhost:${process.env.PORT || 3000}`;
    const res = await fetch(new URL(GONE_PROBE, origin), { signal: AbortSignal.timeout(5_000) });
    const html = await res.text();
    if (res.status === 404 && html.includes("<html")) {
      gone = { html, until: Date.now() + REFRESH_MS };
      return html;
    }
  } catch (e) {
    console.error("[redirects] не удалось получить HTML страницы 404 для 410:", e);
  }
  return FALLBACK_HTML;
}
