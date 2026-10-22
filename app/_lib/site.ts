// Адрес сайта для canonical, sitemap.xml и robots.txt.
// Новый сайт встаёт на место старого (301 со старого WordPress); на другом домене — SITE_URL.
export const SITE_URL = (process.env.SITE_URL ?? "https://bbs.in.ua").replace(/\/+$/, "");
