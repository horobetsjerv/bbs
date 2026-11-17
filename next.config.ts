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
  // Страница бренда — /laminam/; отдельного каталога бренда нет (дубль по
  // SEO-аудиту) — полный каталог Laminam = подборка «Керамограніт».
  ["/laminam/catalog", "/kataloh/keramogranit/"],
  ["/kataloh/laminam", "/kataloh/keramogranit/"],
  // Отдельной подборки Vicostone нет: весь кварцовий камінь в базе — Vicostone.
  ["/kataloh/vicostone", "/kataloh/kvartsovyi-kamin/"],
  // Навигационные подборки «Вироби» получили адреса с ключом (SEO-аудит).
  ["/kataloh/stilnytsi", "/kataloh/stilnytsi-zi-shtuchnoho-kameniu/"],
  ["/kataloh/pidvikonnia", "/kataloh/pidvikonnia-zi-shtuchnoho-kameniu/"],
  ["/kataloh/umyvalnyky", "/kataloh/umyvalnyky-zi-shtuchnoho-kameniu/"],
  // По SEO-аудиту — обычные фильтры без своего адреса (hasOwnLanding в catalog-url.ts).
  ["/kataloh/kukhonni-fartukhy", "/kataloh/?product=fartukhy"],
  ["/kataloh/kaminy", "/kataloh/?product=kaminy"],
  ["/kataloh/fasady", "/kataloh/?application=fasad"],
  ["/kataloh/skhody", "/kataloh/?application=skhody"],
  ["/kataloh/keramogranit-:size(\\d+x\\d+[^/]*)", "/kataloh/?type=keramohranit&size=:size"],
  ["/kataloh/kvartsovyi-kamin-:size(\\d+x\\d+[^/]*)", "/kataloh/?type=kvarts&size=:size"],
  ["/kataloh/kvartsovyi-kamin-:design(kroshka|odnoton|pid-granit|pid-marmur)", "/kataloh/?type=kvarts&design=:design"],
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
    return [
      // Сайт переехал на VPS (bbs.in.ua) — демо на Vercel ведёт туда же, без дубля в поиске.
      {
        // (.*) — путь вместе со слешем в конце: иначе /kataloh/ → /kataloh → ещё один редирект.
        source: "/:path(.*)",
        has: [{ type: "host", value: "bbs-demo-flax.vercel.app" }],
        destination: "https://bbs.in.ua/:path",
        statusCode: 301,
      },
      ...MOVED.map(([source, destination]) => ({ source, destination, statusCode: 301 })),
    ];
  },
  // Заголовки безопасности — везде. Демо-копия (например, *.vercel.app):
  // SITE_NOINDEX=1 ещё закрывает все страницы от индексации, чтобы поисковики
  // не взяли дубль будущего bbs.in.ua.
  async headers() {
    const noindex = process.env.SITE_NOINDEX === "1" ? [{ key: "X-Robots-Tag", value: "noindex" }] : [];
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
