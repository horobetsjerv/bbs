import { getSettings } from "@/app/_lib/content";

import SiteShell, { type ShellProps } from "./SiteShell";

/**
 * Каркас обычной страницы: SiteShell с контактами из админки (база).
 * Разметка и пропсы — в SiteShell; страница 500 использует его без базы.
 * Прелоадер — на всех страницах сайта (первый заход за сессию).
 */
export default async function Page(props: ShellProps) {
  const settings = await getSettings();
  return <SiteShell preloader {...props} settings={settings} />;
}
