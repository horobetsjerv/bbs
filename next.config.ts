import type { NextConfig } from "next";

/**
 * 301 со старых адресов нового сайта на структуру из таблицы заказчика.
 * Товары /catalog/{brand}/{slug} — в app/catalog/[brand]/[slug]/route.ts
 * (публичный slug считается по базе). Редиректы со старого WordPress — отдельно.
 */
const MOVED: [source: string, destination: string][] = [
  ["/catalog", "/kataloh/"],
  // Подборки: тип каменя (keramohranit / kvarts) получил публичное имя.
  ["/catalog/keramohranit", "/kataloh/keramogranit/"],
  ["/catalog/keramohranit-:rest", "/kataloh/keramogranit-:rest/"],
  ["/catalog/kvarts", "/kataloh/kvartsovyi-kamin/"],
  ["/catalog/kvarts-:rest", "/kataloh/kvartsovyi-kamin-:rest/"],
  // Страница бренда — /laminam/, каталог бренда — /kataloh/laminam/.
  ["/laminam/catalog", "/kataloh/laminam/"],
  // Отдельной подборки Vicostone нет: весь кварцовий камінь в базе — Vicostone.
  ["/kataloh/vicostone", "/kataloh/kvartsovyi-kamin/"],
  ["/vyroby", "/proekty/"],
  ["/vyroby/:slug", "/proekty/:slug/"],
  ["/contacts", "/kontakty/"],
  ["/pro-kompaniiu", "/pro-nas/"],
];

/**
 * Заголовки безопасности на всех ответах. CSP — только то, что ничего не
 * ломает (без ограничения скриптов: Next вставляет inline-скрипты, нужен
 * был бы nonce): сайт нельзя встроить в чужой iframe, нет <object>/<base>.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  // Без «X-Powered-By: Next.js».
  poweredByHeader: false,
  // Все адреса — со слешем в конце, как в таблице (/kataloh/keramogranit/).
  trailingSlash: true,
  // Встроенный 308 «добавить слеш» срабатывает раньше redirects() и proxy —
  // старый адрес без слеша получал цепочку 308 → 301. Слеш добавляет proxy.ts
  // (то же правило, что у Next), но уже после карты редиректов.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return MOVED.map(([source, destination]) => ({ source, destination, statusCode: 301 }));
  },
  // Заголовки безопасности — везде. Демо-копия (например, *.vercel.app):
  // SITE_NOINDEX=1 ещё закрывает все страницы от индексации, чтобы поисковики
  // не взяли дубль будущего bbs.in.ua.
  async headers() {
    const noindex = process.env.SITE_NOINDEX === "1" ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : [];
    return [{ source: "/:path*", headers: [...SECURITY_HEADERS, ...noindex] }];
  },
  experimental: {
    serverActions: {
      // Загрузка изображений в админке идёт через server action; дефолт 1 МБ мал для фото.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
