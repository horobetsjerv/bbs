/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { telHref, type SiteContacts } from "@/app/_lib/contacts";

import { INFORMATION, LocationIcon, NAVIGATION, StudioCredit } from "../bbs/Footer";
import { CAPTION, H4_BTN, H4_L, Icon, MOB_SB } from "../bbs/ui";
import { MTelegram, mobileHref } from "./ui";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className={`text-trim px-[10px] whitespace-nowrap ${H4_BTN} text-ink`}>{children}</p>
  );
}

function LinkItem({ href, children }: { href: string | null; children: React.ReactNode }) {
  const text = <span className={`text-trim block ${H4_L} text-ink`}>{children}</span>;
  // Без страницы — текст, а не пустая ссылка «#».
  if (!href) return <span className="flex w-full p-[10px]">{text}</span>;
  return (
    <Link href={mobileHref(href)} className="flex w-full p-[10px]">
      {text}
    </Link>
  );
}

function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center gap-[8px] p-[10px]">
      {icon}
      {children}
    </div>
  );
}

/** Footer, вариант MobileFooter (Figma 1252:4720): px 16, py 40. Контакты — от каркаса. */
export default function MobileFooter({ settings }: { settings: SiteContacts }) {
  const { phones, emails, address, workingHours, socials } = settings;
  const [city, ...street] = address.split(/,\s*/);
  return (
    <footer
      className="relative flex w-full flex-col items-start gap-[24px] bg-light-gray px-[16px] py-[40px]"
      style={{ boxShadow: "inset 0 1px 0 var(--color-back-card-gray)" }}
    >
      <img
        loading="lazy"
        src="/figma/mobile/footer-bg.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full max-w-none"
      />

      <div
        className="relative flex w-full flex-col items-start gap-[24px] pb-[8px]"
        style={{ boxShadow: "inset 0 -2px 0 var(--color-back-card-gray)" }}
      >
        <div className="flex w-full flex-col items-start gap-[12px]">
          <div className="flex w-full flex-col items-start gap-[8px]">
            <Link href="/" className="flex h-[28px] items-center gap-[2.8px]">
              <img
                loading="lazy"
                src="/figma/bbs/bbs-logo.webp"
                alt="BBS"
                className="block h-[28.071px] w-[73.063px] shrink-0 object-cover"
              />
              <span className="h-[28px] w-[1.4px] shrink-0 bg-[#1460ad]" />
              <span className="shrink-0 whitespace-nowrap text-[11.2px] font-medium text-[#e52b34]">
                <span className="block leading-[14px]">EXCLUSIVE</span>
                <span className="block leading-[14px]">SURFACE</span>
              </span>
            </Link>
            <div className={`text-trim w-full ${CAPTION} text-card-gray`}>
              <p>Ексклюзивні матеріали Laminam та Vicostone</p>
              <p>для ваших найсміливіших проєктів</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-[16px]">
            <p className={`text-trim w-full text-center ${MOB_SB} text-ink`}>
              Слідкуйте за нами у мережі:
            </p>
            <div className="flex items-start gap-[8px]">
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

          <div className="flex w-full flex-col items-start gap-[8px]">
            <ColumnTitle>Контакти</ColumnTitle>
            <ContactRow icon={<Icon src="/figma/bbs/phone.svg" size={20} />}>
              <div className="flex flex-col items-start gap-[8px]">
                {phones.map((tel) => (
                  <a key={tel} href={telHref(tel)} className={`text-trim whitespace-nowrap ${H4_L} text-ink`}>
                    {tel}
                  </a>
                ))}
              </div>
            </ContactRow>
            <ContactRow icon={<Icon src="/figma/bbs/mail.svg" size={20} />}>
              <a href={`mailto:${emails[0]}`} className={`text-trim whitespace-nowrap ${H4_L} text-ink`}>
                {emails[0]}
              </a>
            </ContactRow>
            <ContactRow icon={<LocationIcon />}>
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

          <div className="flex w-full justify-center">
            <div className="flex">
              <MTelegram href={socials.telegram} arrow={false} />
            </div>
          </div>
        </div>

        <div className="flex w-full items-start gap-[8px]">
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
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center gap-[12px] text-ink">
        <StudioCredit />
        <p className={`text-trim whitespace-nowrap ${CAPTION}`}>© 2026 BBS. Всі права захищені.</p>
      </div>
    </footer>
  );
}
