/* eslint-disable @next/next/no-img-element */
// Мобильные «Контакти» (Figma ui-mobile-Contactss, 1268:11205).

import type { Decor } from "@/app/_lib/catalog";
import { getSettings, telHref } from "@/app/_lib/content";

import { GhostBtn, Icon, MOB_L, MOB_SB, PrimaryBtn } from "../bbs/ui";
import MobileDecors from "./Decors";
import { MFaq } from "./Home";
import { LEAD_ANCHOR, MCta, MHero, MHeroText, MTitle } from "./ui";

/** Кнопки героя: консультация и партнёрам — в мобильную форму заявки. */
export function HeroButtons({
  consult = "Швидка консультація",
}: {
  /** Подпись кнопки консультации («Про нас» — «Отримати консультацію»). */
  consult?: string;
} = {}) {
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      <PrimaryBtn href={`/#${LEAD_ANCHOR}`} icon="/figma/bbs/support-white.svg" className="w-full">
        {consult}
      </PrimaryBtn>
      <GhostBtn
        href={`/?about=Співпраця#${LEAD_ANCHOR}`}
        icon="/figma/bbs/arrow-cta-white.svg"
        hoverIcon="/figma/bbs/arrow-cta-hover.svg"
        className="w-full justify-center"
      >
        Дизайнерам і обробникам
      </GhostBtn>
    </div>
  );
}

/** icon-park-solid:local 32px — маска с выносом за бокс, как в Figma. */
export function LocationIcon() {
  return (
    <div className="relative size-[32px] shrink-0 overflow-clip">
      <div className="absolute inset-[8.33%_8.33%_10.42%_8.33%]">
        <div className="absolute inset-[-2.57%_-2.5%_-2.56%_-2.5%]">
          <img src="/figma/mobile/contact-loc.svg" alt="" aria-hidden className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

export function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-center gap-[24px]">
      {icon}
      <div className="flex min-w-px flex-1 flex-col items-start gap-[16px] text-ink">
        <p className={`text-trim w-full ${MOB_SB}`}>{label}</p>
        {children}
      </div>
    </div>
  );
}

/** Контакты из админки; `title` — заголовок секции («Про нас»: «Наші контакти»). */
export async function Info({ title }: { title?: string } = {}) {
  const { phones, emails, address } = await getSettings();
  return (
    <section className="flex w-full flex-col items-start gap-[24px] px-[16px] py-[20px]">
      {title && <MTitle>{title}</MTitle>}
      <Row icon={<Icon src="/figma/mobile/truck.svg" size={32} />} label="Склад та офіс BBS:">
        <p className={`text-trim w-full ${MOB_L}`}>{address}</p>
      </Row>
      <Row icon={<LocationIcon />} label="Шоурум Laminam:">
        <p className={`text-trim w-full ${MOB_L}`}>вул. Василя Тютюнника 51/1А, Київ, Україна</p>
      </Row>
      <Row icon={<Icon src="/figma/mobile/contact-clock.svg" size={32} />} label="Графік роботи шоурума:">
        <div className={`flex w-full flex-col items-start gap-[8px] whitespace-nowrap ${MOB_L} text-black`}>
          <p className="text-trim">Пн-Пт: 9:30 - 17:00</p>
          <p className="text-trim">Сб-Нд: вихідні</p>
        </div>
      </Row>
      <Row icon={<Icon src="/figma/mobile/contact-phone.svg" size={32} />} label="Телефонні номери:">
        <div className={`flex w-full flex-col items-start gap-[8px] ${MOB_L}`}>
          {phones.map((tel) => (
            <a key={tel} href={telHref(tel)} className="text-trim w-full">
              {tel}
            </a>
          ))}
        </div>
      </Row>
      <Row icon={<Icon src="/figma/mobile/contact-mail.svg" size={32} />} label="Email:">
        <div className={`flex w-full flex-col items-start gap-[8px] ${MOB_L} text-black`}>
          {emails.map((email) => (
            <a key={email} href={`mailto:${email}`} className="text-trim w-full">
              {email}
            </a>
          ))}
        </div>
      </Row>
    </section>
  );
}

export default function MobileContacts({ decors }: { decors: Decor[][] }) {
  return (
    <>
      <MHero breadcrumb={["Головна", "Контакти"]} bg="overlay">
        <MHeroText
          title="Контакти"
          text="Ми завжди на зв’язку та готові допомогти з виборои матеріалу для вашого проєкту."
        />
        <HeroButtons />
      </MHero>
      <div className="contents" data-reveal>
        <Info />
        <MCta
          variant="card"
          center
          bigText
          gap={20}
          title="Зустрінемося, обговоримо?"
          text="Любі гості, консультація та перегляд зразків матеріалів проводиться за попереднім узгодженням."
        />
        <MFaq
          bg="white"
          title="Часті запитання про BBS"
          questions={["Доставка", "Гарантія якості", "Повернення", "Оплата"]}
        />
        <MobileDecors decors={decors} buttonStart />
      </div>
    </>
  );
}
