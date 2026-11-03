import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_LOGIN_PATH, adminOpen, validSession } from "@/app/_lib/admin-auth";
import { findRedirect, goneHtml } from "@/app/_lib/redirects";

/**
 * Proxy (бывший middleware, Next 16; runtime — Node.js, поэтому есть доступ
 * к Postgres через pg).
 *
 * 1. Старые адреса WordPress из таблицы redirects → один 301 или 410.
 * 0. /admin — только после входа на /admin-login/ (app/_lib/admin-auth.ts).
 * 2. Слеш в конце адреса. В next.config.ts стоит skipTrailingSlashRedirect:
 *    встроенный 308 от trailingSlash срабатывал раньше proxy, и старый адрес
 *    без слеша получал цепочку 308 → 301. Здесь то же правило, что у Next,
 *    но после карты редиректов.
 */

// Регулярки встроенного редиректа Next (next/dist/lib/load-custom-routes.js).
/** /file.ext/ → /file.ext */
const FILE_WITH_SLASH = /^\/(?!\.well-known)(?:[^/]+\/)*[^/]+\.\w+\/$/;
/** /kataloh → /kataloh/ (последний сегмент без точки) */
const WITHOUT_SLASH = /^\/(?!\.well-known)(?:[^/]+\/)*[^/.]+$/;

/**
 * Старые товары нового сайта /catalog/{brand}/{slug}: route handler сам
 * отвечает 301 (app/catalog/[brand]/[slug]/route.ts) — слеш не добавляем,
 * чтобы не было 308 → 301.
 */
const LEGACY_PRODUCT = /^\/catalog\/[^/]+\/[^/]+$/;

/** Рекламные метки переносим на новый адрес, остальной query старого сайта (WooCommerce) — нет. */
const KEEP_PARAM = /^(?:utm_\w+|gclid|fbclid|gbraid|wbraid)$/;

/** Разделы админки (но не страница входа /admin-login/). */
const ADMIN = /^\/admin(?:\/|$)/;

export async function proxy(request: NextRequest) {
  // Обычный URL, а не request.nextUrl: NextURL при форматировании возвращает
  // исходное «есть/нет слеша в конце» и съел бы добавленный слеш.
  const current = new URL(request.url);
  const { pathname, searchParams } = current;

  if (ADMIN.test(pathname) && !adminOpen() && !validSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    const login = new URL(ADMIN_LOGIN_PATH, current);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login, 307);
  }

  if (!pathname.startsWith("/admin")) {
    const rule = await findRedirect(pathname);
    if (rule?.status === 410) {
      return new NextResponse(await goneHtml(), {
        status: 410,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex",
          "cache-control": "no-cache, must-revalidate",
        },
      });
    }
    if (rule) {
      const url = new URL(rule.to, current);
      for (const [k, v] of searchParams) if (KEEP_PARAM.test(k)) url.searchParams.append(k, v);
      return NextResponse.redirect(url, 301);
    }
  }

  if (FILE_WITH_SLASH.test(pathname) && !request.headers.has("x-nextjs-data")) {
    current.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(current, 308);
  }
  if (WITHOUT_SLASH.test(pathname) && !LEGACY_PRODUCT.test(pathname)) {
    current.pathname = `${pathname}/`;
    return NextResponse.redirect(current, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Статика и чанки Next (/_next/…) и служебные адреса dev-сервера — мимо proxy.
  matcher: ["/((?!_next/|__nextjs).*)"],
};
