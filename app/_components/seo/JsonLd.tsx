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

/** Общие поля компании: контакты из админки (те же, что в подвале). */
function companyFields(c: SiteContacts): Data {
  const sameAs = Object.values(c.socials).filter((s): s is string => !!s);
  return {
    name: SITE_NAME,
    alternateName: "BBS Exclusive Surface",
    description:
      "Офіційний постачальник керамограніту Laminam і кварцового каменю Vicostone в Україні: каталог, шоурум, вироби на замовлення.",
    logo: assetUrl("/figma/bbs/bbs-logo.webp"),
    image: assetUrl("/og/bbs.jpg"),
    telephone: c.phones[0],
    ...(c.emails[0] ? { email: c.emails[0] } : {}),
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

/**
 * Organization — на всех страницах (выводит Page). Компания — дистрибьютор
 * по всей Україні, поэтому основная разметка — Organization, а не LocalBusiness
 * (SEO-аудит).
 */
export function orgLd(c: SiteContacts): Data {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    url: pageUrl("/"),
    areaServed: "UA",
    ...companyFields(c),
    address: { "@type": "PostalAddress", streetAddress: c.address, addressCountry: "UA" },
  };
}

/** WebSite — на главной. Поиска по сайту нет, поэтому без SearchAction. */
export function websiteLd(): Data {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": pageUrl("/#website"),
    url: pageUrl("/"),
    name: SITE_NAME,
    inLanguage: "uk",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * LocalBusiness — только где есть физическая точка: контакты (склад и офис)
 * и шоурум. Филиал компании (parentOrganization).
 */
export function businessLd(
  c: SiteContacts,
  place: { path: string; name?: string; address?: string } = { path: "/kontakty/" },
): Data {
  const hours = openingHours(c.workingHours);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": pageUrl(`${place.path}#localbusiness`),
    url: pageUrl(place.path),
    ...companyFields(c),
    ...(place.name ? { name: place.name } : {}),
    address: { "@type": "PostalAddress", streetAddress: place.address ?? c.address, addressCountry: "UA" },
    ...(hours.length ? { openingHours: hours } : {}),
    parentOrganization: { "@id": ORG_ID },
  };
}

/** CollectionPage + ItemList: страницы брендов, каталога и подборок. */
export function collectionLd(page: {
  name: string;
  path: string;
  description?: string;
  items: { name: string; href: string }[];
}): Data {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name,
    url: pageUrl(page.path),
    ...(page.description ? { description: page.description } : {}),
    // С типом: без него валидатор видит безымянный CreativeWork.
    isPartOf: { "@type": "WebSite", "@id": pageUrl("/#website"), url: pageUrl("/"), name: SITE_NAME },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: page.items.length,
      itemListElement: page.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: pageUrl(it.href),
      })),
    },
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
