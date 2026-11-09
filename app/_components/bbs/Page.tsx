import { getProjects, getSettings } from "@/app/_lib/content";

import JsonLd, { orgLd } from "../seo/JsonLd";
import SiteShell, { type ShellProps } from "./SiteShell";

/**
 * Каркас обычной страницы: SiteShell с контактами из админки (база).
 * Разметка и пропсы — в SiteShell; страница 500 использует его без базы.
 * Прелоадер — на всех страницах сайта (первый заход за сессию).
 */
export default async function Page(props: ShellProps) {
  // Проекты — для «Готові роботи» в меню «Вироби на замовлення».
  const [settings, projects] = await Promise.all([getSettings(), getProjects(3)]);
  return (
    <SiteShell preloader {...props} settings={settings} projects={projects}>
      {/* Organization — на всех страницах (SEO-аудит). */}
      <JsonLd data={orgLd(settings)} />
      {props.children}
    </SiteShell>
  );
}
