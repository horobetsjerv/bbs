"use client";

import SiteShell from "./_components/bbs/SiteShell";
import { ErrorHero, ErrorHeroMobile } from "./_components/errors/ErrorHero";
import { FALLBACK_SETTINGS } from "./_lib/contacts";

/**
 * Страница 500 (Figma 1285:7152, мобилка 1285:7291).
 * Error boundary — клиентский компонент, а падать может и база, поэтому
 * каркас без запросов: SiteShell с контактами-фолбэками из макета.
 */
export default function ServerError() {
  return (
    <SiteShell
      settings={FALLBACK_SETTINGS}
      footerGap={0}
      mobile={<ErrorHeroMobile code={500} />}
    >
      <title>Сервер тимчасово недоступний | BBS</title>
      <ErrorHero code={500} />
    </SiteShell>
  );
}
