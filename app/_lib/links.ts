// Внутренние ссылки с параметрами (/kataloh/?application=…, /?about=…#lead-form)
// по SEO-аудиту не должны попадать в HTML как <a href>: краулер видит их
// как отдельные страницы. Такие ссылки остаются тем же <a> с теми же классами,
// но адрес — в data-href; переход делает DataHrefLinks (клиент), заявки
// по-прежнему открывает LeadModal. Пагинация (?page=N) — обычная ссылка.
// Модуль без "use client": нужен и серверным, и клиентским компонентам.

/** Внутренний адрес с параметрами, кроме одной пагинации ?page=N. */
export function isParamHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return false;
  const query = href.split("#")[0].split("?")[1];
  if (!query) return false;
  return !/^page=\d+$/.test(query);
}

/**
 * Атрибуты ссылки: обычный href или — для адреса с параметрами — data-href
 * с ролью ссылки и фокусом с клавиатуры. `scroll: false` — как у next/link:
 * после перехода страница не прокручивается наверх.
 */
export function hrefProps(href: string, { scroll }: { scroll?: boolean } = {}) {
  if (!isParamHref(href)) return { href };
  return {
    "data-href": href,
    ...(scroll === false ? { "data-scroll": "false" } : {}),
    role: "link",
    tabIndex: 0,
  };
}
