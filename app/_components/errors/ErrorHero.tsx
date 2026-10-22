"use client";

/* eslint-disable @next/next/no-img-element */
// Герой страниц ошибок 404 и 500 (Figma: UI_desktop_404 1039:7903 / 1285:7152,
// ui-mobile-Card 1281:5952 / 1285:7291). Без обращения к базе — используется
// и в серверном not-found, и в клиентском error.
//
// Клиентский компонент намеренно: корневой not-found Next.js кладёт в RSC
// каждой страницы, и серверные <img> отсюда давали preload-хинты картинок
// 404 на всех страницах сайта. Клиентский герой рендерит их только при показе.

import { GhostBtn, H1_SB, H2_L, H2_SB, H4_L, PrimaryBtn } from "../bbs/ui";

type Code = 404 | 500;

/** Форма заявки открывается модалкой (LeadModal перехватывает #lead-form). */
const CONSULT_HREF = "/#lead-form";

const ERRORS = {
  404: {
    // Заголовок: жирная часть + светлая.
    title: ["От халепа,", "щось пішло не так"],
    titleBreak: null,
    text: "Наші фахівці вже займаються вирішенням цієї проблеми",
    homeLabel: "Перейти на головну",
    // Десктоп: секция 679px (шапка 92 → подвал 771), текстовый блок на 298
    // (−92 шапки = 206), высотой 198 → снизу 275. Цифры — над текстом.
    column: "pt-[206px] pb-[275px]",
    homeClass: "w-[228px] justify-start",
    digitsOnTop: true,
    // Мобилка: 404-graphic 310×130, от текста до кнопок 100px.
    mobileDigits: { src: "/figma/errors/404-mobile.svg", width: 310, height: 130 },
    mobileGap: "gap-[100px]",
  },
  500: {
    title: ["Сервер", "тимчасово недоступний"],
    // В Figma заголовок в 930px переносится после «тимчасово», а в Chrome
    // (метрики Inter чуть уже) влезает в одну строку — перенос задан явно.
    titleBreak: "тимчасово",
    text: "Ми вже працюємо над вирішенням. Спробуйте оновити сторінку або поверніться на головну сторінку нашого сайту.",
    homeLabel: "Повернутись на головну",
    // Текстовый блок на 257 (−92 = 165), высотой 290 → снизу 224. Цифры — под текстом.
    column: "pt-[165px] pb-[224px]",
    homeClass: "",
    digitsOnTop: false,
    mobileDigits: { src: "/figma/errors/500-mobile.svg", width: 309, height: 129 },
    mobileGap: "gap-[140px]",
  },
} as const;

/**
 * Десктоп: Rectangle 1280×736 на 4px ниже шапки (фото, затемнение 70%),
 * низ уходит под подвал — видно 675px. Цифры 930×389 на 199 от верха кадра,
 * колонка 930px по центру. Кнопки — Main_cta (PrimaryBtn) и Main_cta
 * без заливки (GhostBtn), hover как на остальных страницах.
 */
export function ErrorHero({ code }: { code: Code }) {
  const e = ERRORS[code];
  const digits = (
    <img
      src={`/figma/errors/${code}.svg`}
      alt=""
      aria-hidden
      width={930}
      height={389}
      className="pointer-events-none absolute top-[107px] left-0 block h-[389px] w-[930px] max-w-none"
    />
  );
  return (
    <section className="relative flex w-full min-w-[1280px] flex-col items-center">
      <div aria-hidden className="absolute inset-x-0 top-[4px] bottom-0 overflow-hidden">
        {/* Файл уже в пропорциях кадра (1280×736); шире — обрезка по центру. */}
        <img
          src="/figma/errors/hero-desktop.webp"
          alt=""
          className="absolute top-0 left-0 h-[736px] w-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className={`relative flex w-[930px] flex-col items-start ${e.column}`}>
        {!e.digitsOnTop && digits}
        <div className="relative flex w-full flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_SB} text-white`}>
            {e.title[0]}{" "}
            <span className="font-light">
              {e.titleBreak ? (
                <>
                  {e.titleBreak}
                  <br />
                  {e.title[1].slice(e.titleBreak.length + 1)}
                </>
              ) : (
                e.title[1]
              )}
            </span>
          </h1>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>{e.text}</p>
          {/* Кнопки всегда над цифрами (у 404 цифры лежат поверх текста). */}
          <div className="relative z-10 flex items-start gap-[24px]">
            <PrimaryBtn href="/" className={e.homeClass}>
              {e.homeLabel}
            </PrimaryBtn>
            <GhostBtn href={CONSULT_HREF} icon="/figma/bbs/support-white.svg">
              Отримати консультацію
            </GhostBtn>
          </div>
        </div>
        {e.digitsOnTop && digits}
      </div>
    </section>
  );
}

/**
 * Мобилка (Hero-404, 375×694): фото cover, затемнение 75%, pt 180, px 16.
 * Цифры наезжают на текст (mb −50), текст по центру, кнопки во всю ширину.
 */
export function ErrorHeroMobile({ code }: { code: Code }) {
  const e = ERRORS[code];
  const d = e.mobileDigits;
  return (
    <section className="relative flex min-h-[694px] w-full flex-col items-center px-[16px] pt-[180px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/figma/errors/hero-mobile.jpg"
          alt=""
          className="absolute inset-0 size-full max-w-none object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <img
        src={d.src}
        alt=""
        aria-hidden
        width={d.width}
        height={d.height}
        className="relative mb-[-50px] block max-w-none shrink-0"
        style={{ width: d.width, height: d.height }}
      />
      <div className={`relative flex w-full flex-col items-start ${e.mobileGap}`}>
        <div className="flex w-full flex-col items-center gap-[16px] text-center">
          <h1 className={`text-trim w-full ${H2_SB} text-white`}>
            {e.title[0]}
            <span className="font-light"> {e.title[1]}</span>
          </h1>
          <p className={`text-trim w-full ${H4_L} text-caption-gray`}>{e.text}</p>
        </div>
        <div className="flex w-full flex-col items-start gap-[12px]">
          <PrimaryBtn href="/" className="w-full">
            Повернутись на головну
          </PrimaryBtn>
          <GhostBtn
            href={CONSULT_HREF}
            icon="/figma/bbs/support-white.svg"
            className="w-full justify-center"
          >
            Отримати консультацію
          </GhostBtn>
        </div>
      </div>
    </section>
  );
}
