import { SITE_NAME, assetUrl, pageUrl } from "@/app/_lib/site";
import type { SiteContacts } from "@/app/_lib/contacts";

// Структурированные данные (schema.org, JSON-LD) для поисковиков.
// Рендерятся обычным <script> в разметке страницы (docs: guides/json-ld).

type Data = Record<string, unknown>;

/** `<` экранируется: текст из админки не должен закрыть тег script. */
export default function JsonLd({ data }: { data: Data | Data[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Пункт хлебных крошек: название и путь страницы. */
export type Crumb = { name: string; path: string };

/** Пути разделов из крошек сайта («Головна / Каталог / …»). */
const SECTION_PATHS: Record<string, string> = {
  Головна: "/",
  Каталог: "/kataloh/",
  "Вироби на замовлення": "/proekty/",
  Публікації: "/blog/",
  Laminam: "/laminam/",
  Vicostone: "/vicostone/",
  Контакти: "/kontakty/",
  "Про компанію": "/pro-nas/",
  Шоурум: "/showroom/",
  Співпраця: "/spivpratsia/",
};

/**
 * BreadcrumbList по крошкам страницы. Строки — разделы из SECTION_PATHS;
 * последний пункт — текущая страница (`path`).
 */
export function breadcrumbLd(items: (string | Crumb)[], path: string): Data {
  const last = items.length - 1;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => {
      const name = typeof it === "string" ? it : it.name;
      const href = i === last ? path : typeof it === "string" ? SECTION_PATHS[it] : it.path;
      return {
        "@type": "ListItem",
        position: i + 1,
        name,
        ...(href ? { item: pageUrl(href) } : {}),
      };
    }),
  };
}

const ORG_ID = pageUrl("/#organization");

const DAYS: Record<string, string> = { Пн: "Mo", Вт: "Tu", Ср: "We", Чт: "Th", Пт: "Fr", Сб: "Sa", Нд: "Su" };
const DAY = Object.keys(DAYS).join("|");
const PERIOD = new RegExp(`^(${DAY})(?:\\s*-\\s*(${DAY}))?:?\\s*(\\d{1,2}):(\\d{2})\\s*-\\s*(\\d{1,2}):(\\d{2})`);

/**
 * «Пн-Пт: 9:30 - 17:00» из админки → «Mo-Fr 09:30-17:00» (формат schema.org).
 * Строки, которые не разобрать (выходные), пропускаются.
 */
function openingHours(text: string): string[] {
  return text.split("\n").flatMap((line) => {
    const m = PERIOD.exec(line.trim());
    if (!m) return [];
    const [, from, to, h1, m1, h2, m2] = m;
    const days = to ? `${DAYS[from]}-${DAYS[to]}` : DAYS[from];
    return [`${days} ${h1.padStart(2, "0")}:${m1}-${h2.padStart(2, "0")}:${m2}`];
  });
}

/** Компания с шоурумом: контакты из админки (те же, что в подвале). */
export function businessLd(c: SiteContacts): Data {
  const hours = openingHours(c.workingHours);
  const sameAs = Object.values(c.socials).filter((s): s is string => !!s);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "BBS Exclusive Surface",
    description:
      "Офіційний постачальник керамограніту Laminam і кварцового каменю Vicostone в Україні: каталог, шоурум, вироби на замовлення.",
    url: pageUrl("/"),
    logo: assetUrl("/figma/bbs/bbs-logo.webp"),
    image: assetUrl("/og/bbs.jpg"),
    telephone: c.phones[0],
    ...(c.emails[0] ? { email: c.emails[0] } : {}),
    address: { "@type": "PostalAddress", streetAddress: c.address, addressCountry: "UA" },
    ...(hours.length ? { openingHours: hours } : {}),
    ...(c.phones.length > 1
      ? {
          contactPoint: c.phones.map((telephone) => ({
            "@type": "ContactPoint",
            telephone,
            contactType: "customer service",
            areaServed: "UA",
            availableLanguage: ["uk"],
          })),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Ссылка на компанию из Product / Article. */
export const orgRef = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: pageUrl("/"),
  logo: assetUrl("/figma/bbs/bbs-logo.webp"),
};

/** FAQPage: только вопросы с ответом — без ответа разметка невалидна. */
export function faqLd(questions: string[], answers: string[]): Data | null {
  const pairs = questions.map((q, i) => [q, answers[i]]).filter(([, a]) => a);
  if (!pairs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
