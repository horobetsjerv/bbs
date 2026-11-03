import Page from "./_components/bbs/Page";
import { ErrorHero, ErrorHeroMobile } from "./_components/errors/ErrorHero";

/** Страница 404 (Figma 1039:7903, мобилка 1281:5952): герой сразу переходит в подвал. */
export default function NotFound() {
  return (
    <Page footerGap={0} mobile={<ErrorHeroMobile code={404} />}>
      {/* Свой заголовок вкладки вместо заголовка главной из layout (React поднимает <title> в head). */}
      <title>Сторінку не знайдено | BBS</title>
      <ErrorHero code={404} />
    </Page>
  );
}
