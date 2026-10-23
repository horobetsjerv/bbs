/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { telHref, type SiteContacts } from "@/app/_lib/contacts";

import Logo from "./Logo";
import { CAPTION, H4_BTN, H4_L, HOVER_EASE, Icon, LINE_BASE_BLUE, LINE_FILL, MOB_L, MOB_SB } from "./ui";

// Бренды — на страницы брендов (/laminam/, /vicostone/), не в каталоги.
export const NAVIGATION = [
  { label: "Laminam", href: "/laminam/" },
  { label: "Vicostone", href: "/vicostone/" },
  { label: "Каталог", href: "/kataloh/" },
  { label: "Вироби на замовлення", href: "/proekty/" },
  { label: "Про нас", href: "/pro-nas/" },
  { label: "Шоурум", href: "/showroom/" },
  { label: "Блог", href: "/blog/" },
  { label: "Готові роботи", href: "/proekty/" },
  { label: "Співпраця", href: "/spivpratsia/" },
];
// Страниц пока нет — ссылки появятся вместе с ними.
export const INFORMATION = [
  { label: "Доставка та оплата", href: null },
  { label: "Гарантія та догляд", href: null },
  { label: "Публічна оферта", href: null },
  { label: "Політика конфіденційності", href: null },
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-center px-[10px]">
      <p className={`text-trim whitespace-nowrap ${H4_BTN} text-ink`}>
        {children}
      </p>
    </div>
  );
}

/** Ссылка подвала на hover: красный текст и линия, заполняющаяся слева направо. */
const FOOTER_LINK = `transition-colors ${HOVER_EASE} group-hover:text-red ${LINE_FILL}`;

/** «Розроблено Kurmaz Web Studio»: ссылка — только название студии. */
export function StudioCredit() {
  return (
    <p className="flex shrink-0 items-center gap-[8px] whitespace-nowrap">
      <span className={`text-trim ${MOB_L}`}>Розроблено</span>
      <a href="https://www.kurmaz-web.studio/" target="_blank" rel="noopener" className="group">
        <span className={`text-trim block ${MOB_SB} text-ink ${FOOTER_LINK}`}>Kurmaz Web Studio</span>
        <span className="sr-only"> (відкривається в новій вкладці)</span>
      </a>
    </p>
  );
}

function LinkItem({ href, children }: { href: string | null; children: React.ReactNode }) {
  // Без страницы — текст, а не пустая ссылка «#».
  if (!href)
    return (
      <span className="flex shrink-0 items-center justify-center p-[10px]">
        <span className={`text-trim whitespace-nowrap ${H4_L} text-ink`}>{children}</span>
      </span>
    );
  // Hover: текст краснеет, линия заполняется слева направо.
  return (
    <Link href={href} className="group flex shrink-0 items-center justify-center p-[10px]">
      <span className={`text-trim whitespace-nowrap ${H4_L} text-ink ${FOOTER_LINK}`}>
        {children}
      </span>
    </Link>
  );
}

function ContactRow({
  icon,
  children,
  full = false,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-[8px] p-[10px] ${
        full ? "w-full" : "justify-center"
      }`}
    >
      {icon}
      {children}
    </div>
  );
}

/** icon-park-solid:local — маска с выносом за пределы 20px-бокса, как в Figma. */
export function LocationIcon() {
  return (
    <div className="relative size-[20px] shrink-0 overflow-clip">
      <div className="absolute inset-[8.33%_8.33%_10.42%_8.33%]">
        <div className="absolute inset-[-6.15%_-6%]">
          <img
            loading="lazy"
            src="/figma/bbs/location-mask.svg"
            alt=""
            aria-hidden
            className="block size-full max-w-none"
          />
        </div>
      </div>
    </div>
  );
}

/** Контакты передаёт каркас (без обращения к базе — подвал нужен и странице 500). */
export default function Footer({ settings }: { settings: SiteContacts }) {
  const { phones, emails, address, workingHours, socials } = settings;
  // Адрес в две строки, как в макете: первая часть до запятой, затем остальное
  // («вул. Мрії 8,» / «Київ, Україна»).
  const [city, ...street] = address.split(/,\s*/);
  return (
    // Подложка тянется на всю ширину окна, контент остаётся в колонке 1280.
    <footer
      className="relative w-full min-w-[1280px] bg-light-gray"
      style={{ boxShadow: "inset 0 1px 0 var(--color-back-card-gray)" }}
    >
      <img
        loading="lazy"
        src="/figma/bbs/footer-bg.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full max-w-none"
      />

      <div className="relative mx-auto flex w-[1280px] flex-col items-start justify-center gap-[24px] px-[80px] py-[60px]">
        <div
          className="flex shrink-0 items-start gap-[24px] py-[12px]"
          style={{ boxShadow: "inset 0 -2px 0 var(--color-back-card-gray)" }}
        >
          <div className="flex w-[262px] shrink-0 flex-col items-start gap-[24px]">
            <div className="flex w-full flex-col items-start gap-[8px]">
              <Logo />
              <div className={`text-trim w-full ${CAPTION} text-card-gray`}>
                <p>Ексклюзивні матеріали Laminam та Vicostone</p>
                <p>для ваших найсміливіших проєктів</p>
              </div>
            </div>

            <div className="flex w-full items-center gap-[8px]">
              <Icon src="/figma/bbs/telegram.svg" size={48} />
              <a
                href={socials.telegram ?? "#"}
                target={socials.telegram ? "_blank" : undefined}
                rel="noreferrer"
                className="group flex shrink-0 items-start py-[16px]"
              >
                <span
                  className={`text-trim whitespace-nowrap ${H4_BTN} text-blue transition-colors ${HOVER_EASE} group-hover:text-red ${LINE_FILL} ${LINE_BASE_BLUE}`}
                >
                  Зв’язатися через Telegram
                </span>
              </a>
            </div>

            <div className="flex w-full flex-col items-center gap-[16px]">
              <p className={`text-trim w-full text-center ${H4_BTN} text-ink`}>
                Слідкуйте за нами у мережі:
              </p>
              <div className="flex items-start gap-[20px]">
                <a
                  href={socials.facebook ?? "#"}
                  target={socials.facebook ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label="Facebook"
                >
                  <Icon src="/figma/bbs/facebook.svg" size={44} />
                </a>
                <a
                  href={socials.instagram ?? "#"}
                  target={socials.instagram ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="relative size-[44px] shrink-0 rounded-[2px] bg-blue"
                >
                  <span className="absolute inset-[22.73%_20.45%_22.73%_22.73%]">
                    <img
                      loading="lazy"
                      src="/figma/bbs/instagram-glyph.svg"
                      alt=""
                      aria-hidden
                      className="absolute inset-0 block size-full max-w-none"
                    />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex w-[834px] shrink-0 items-start gap-[24px]">
            <div className="flex min-w-px flex-1 flex-col items-start gap-[8px]">
              <ColumnTitle>Навігація</ColumnTitle>
              {NAVIGATION.map((item) => (
                <LinkItem key={item.label} href={item.href}>
                  {item.label}
                </LinkItem>
              ))}
            </div>

            <div className="flex min-w-px flex-1 flex-col items-start gap-[8px]">
              <ColumnTitle>Інформація</ColumnTitle>
              {INFORMATION.map((item) => (
                <LinkItem key={item.label} href={item.href}>
                  {item.label}
                </LinkItem>
              ))}
            </div>

            <div className="flex min-w-px flex-1 flex-col items-start gap-[8px]">
              <ColumnTitle>Контакти</ColumnTitle>
              <ContactRow icon={<Icon src="/figma/bbs/phone.svg" size={20} />}>
                <a href={telHref(phones[0])} className="group">
                  <span className={`text-trim block whitespace-nowrap ${H4_L} text-ink ${FOOTER_LINK}`}>
                    {phones[0]}
                  </span>
                </a>
              </ContactRow>
              <ContactRow icon={<Icon src="/figma/bbs/mail.svg" size={20} />}>
                <a href={`mailto:${emails[0]}`} className="group">
                  <span className={`text-trim block whitespace-nowrap ${H4_L} text-ink ${FOOTER_LINK}`}>
                    {emails[0]}
                  </span>
                </a>
              </ContactRow>
              <ContactRow icon={<LocationIcon />} full>
                <div className={`text-trim min-w-px flex-1 ${H4_L} text-ink`}>
                  <p>{street.length ? `${city},` : city}</p>
                  {street.length > 0 && <p>{street.join(", ")}</p>}
                </div>
              </ContactRow>
              <ContactRow icon={<Icon src="/figma/bbs/clock.svg" size={20} />}>
                {/* График из админки может быть в несколько строк (Пн-Пт / Сб-Нд). */}
                <div className={`text-trim whitespace-nowrap ${H4_L} text-ink`}>
                  {workingHours.split(/\n+/).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </ContactRow>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between text-ink">
          <p className={`text-trim min-w-px flex-1 ${CAPTION}`}>
            © 2026 BBS. Всі права захищені.
          </p>
          <StudioCredit />
        </div>
      </div>
    </footer>
  );
}
