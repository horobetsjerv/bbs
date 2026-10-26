// Контакты сайта без обращения к базе. Модуль безопасен для клиентских
// компонентов: его использует страница 500 (app/error.tsx), которая должна
// открываться, даже когда база недоступна.

/**
 * Значения из SEO-таблицы (лист «Контакти») — на случай, если настройки
 * в админке ещё не заполнены или база недоступна.
 * workingHours — по строке на период, подвал выводит их отдельными строками.
 */
export const FALLBACK_SETTINGS = {
  phones: ["+380 67 334 77 44", "+380 67 474 63 56", "+380 66 556 49 07"],
  emails: ["vs@vicostone.com.ua"],
  address: "вул. Мрії 8, Київ, Україна",
  workingHours: "Пн-Пт: 9:30 - 17:00\nСб-Нд: вихідні",
  /** Пустая ссылка — соцсеть не заполнена в админке. */
  socials: {
    telegram: null as string | null,
    facebook: "https://www.facebook.com/share/1J9WnrF5Nh/" as string | null,
    instagram: "https://www.instagram.com/bbs.stone.ua/" as string | null,
  },
};

/** Контакты для шапки и подвала: из getSettings() или FALLBACK_SETTINGS. */
export type SiteContacts = typeof FALLBACK_SETTINGS;

/** tel:-ссылка из номера в любом написании. */
export const telHref = (phone: string) => `tel:+${phone.replace(/\D/g, "")}`;
