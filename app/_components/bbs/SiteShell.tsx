import { Inter } from "next/font/google";

import type { SiteContacts } from "@/app/_lib/contacts";

import Header from "./Header";
import Footer from "./Footer";
import Reveal from "./Reveal";
import LeadModal from "./LeadModal";
import Preloader from "./Preloader";
import MobileFooter from "../mobile/MobileFooter";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "500", "600"],
  display: "swap",
});

export type ShellProps = {
  children: React.ReactNode;
  /** Отступ от последней секции до подвала, px. */
  footerGap: number;
  mobile?: React.ReactNode;
  /** Прелоадер при первом заходе за сессию (главная и каталог). */
  preloader?: boolean;
};

/**
 * Каркас страницы: шрифт Inter, шапка, подвал.
 * В макетах Figma многострочные тексты переносятся «сбалансированно»
 * (строки примерно равной длины), поэтому text-wrap: balance по умолчанию.
 *
 * `mobile` — мобильная вёрстка страницы (макеты ui-mobile-*, 375px).
 * Десктоп свёрстан под фиксированные 1280px, поэтому до 1280px (xl) показывается
 * отдельная ветка со своей шапкой и подвалом — она резиновая и на планшетах
 * не даёт горизонтальной прокрутки; данные у веток общие.
 * Без `mobile` страница везде остаётся десктопной.
 *
 * Сам каркас к базе не обращается — контакты приходят в `settings`.
 * Обычные страницы берут его через Page (контакты из админки),
 * страница 500 (app/error.tsx, клиентский компонент) — напрямую с FALLBACK_SETTINGS.
 */
export default function SiteShell({
  children,
  footerGap,
  mobile,
  preloader = false,
  settings,
}: ShellProps & { settings: SiteContacts }) {
  const desktop = (
    <>
      {children}
      <div className="shrink-0" style={{ height: footerGap }} />
      <Footer settings={settings} />
    </>
  );
  return (
    <div
      className={`${inter.className} flex w-full flex-col items-center overflow-x-clip bg-white [&_:is(p,h1,h2,h3)]:text-balance ${
        mobile ? "xl:min-w-[1280px]" : "min-w-[1280px]"
      }`}
    >
      {preloader && <Preloader />}
      <Header phones={settings.phones} telegram={settings.socials.telegram} mobile={!!mobile} />
      {mobile ? (
        <>
          <div className="contents max-xl:hidden">{desktop}</div>
          <div className="flex w-full flex-col xl:hidden">
            <main className="flex w-full flex-col">{mobile}</main>
            <MobileFooter settings={settings} />
          </div>
        </>
      ) : (
        desktop
      )}
      <Reveal />
      {/* Кнопки заявки открывают форму поверх страницы. */}
      <LeadModal />
    </div>
  );
}
