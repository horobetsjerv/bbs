/* eslint-disable @next/next/no-img-element */
import { getSettings, telHref } from "@/app/_lib/content";

import { H3_L, H3_SB, Icon } from "../bbs/ui";

/** icon-park-solid:local 48px — маска с выносом за бокс, как в Figma. */
export function LocationIcon() {
  return (
    <div className="relative size-[48px] shrink-0 overflow-clip">
      <div className="absolute inset-[8.33%_8.33%_10.42%_8.33%]">
        <div className="absolute inset-[-2.56%_-2.5%]">
          <img
            src="/figma/bbs/contact-location.svg"
            alt=""
            aria-hidden
            className="block size-full max-w-none"
          />
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
        <p className={`text-trim w-full ${H3_SB}`}>{label}</p>
        {children}
      </div>
    </div>
  );
}

/** Frame 4654: адреса и график слева, телефоны и почта справа. */
export default async function ContactsInfo() {
  const { phones, emails, address } = await getSettings();
  return (
    <section className="flex w-full items-start gap-[24px]">
      <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
        <Row icon={<Icon src="/figma/bbs/truck.svg" size={48} />} label="Склад та офіс BBS:">
          <p className={`text-trim w-full ${H3_L}`}>{address}</p>
        </Row>
        <Row icon={<LocationIcon />} label="Шоурум Laminam:">
          <p className={`text-trim w-full ${H3_L}`}>
            вул. Василя Тютюнника 51/1А, Київ, Україна
          </p>
        </Row>
        <Row icon={<Icon src="/figma/bbs/contact-clock.svg" size={48} />} label="Графік роботи шоурума:">
          <div className={`flex w-full items-start gap-[24px] whitespace-nowrap ${H3_L} text-black`}>
            <p className="text-trim">Пн-Пт: 9:30 - 17:00</p>
            <p className="text-trim">Сб-Нд: вихідні</p>
          </div>
        </Row>
      </div>

      <div className="flex min-w-px flex-1 flex-col items-start justify-between self-stretch">
        <Row icon={<Icon src="/figma/bbs/contact-phone.svg" size={48} />} label="Телефонні номери:">
          <div className={`flex w-full flex-col items-start gap-[8px] ${H3_L}`}>
            {phones.map((tel) => (
              <a key={tel} href={telHref(tel)} className="text-trim w-full">
                {tel}
              </a>
            ))}
          </div>
        </Row>
        <Row icon={<Icon src="/figma/bbs/contact-mail.svg" size={48} />} label="Email:">
          <div className={`flex w-full flex-col items-start gap-[8px] ${H3_L} text-black`}>
            {emails.map((email) => (
              <a key={email} href={`mailto:${email}`} className="text-trim w-full">
                {email}
              </a>
            ))}
          </div>
        </Row>
      </div>
    </section>
  );
}
