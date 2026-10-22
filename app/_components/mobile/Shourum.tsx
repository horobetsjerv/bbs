/* eslint-disable @next/next/no-img-element */
// Мобильный «Шоурум» (Figma ui-mobile-Shourum, 1624:13568).

import { getSettings, telHref } from "@/app/_lib/content";

import { H2_MOB_SB, Icon, MOB_L, PrimaryBtn } from "../bbs/ui";
import MetaChips, { VISIT_HREF } from "../shourum/MetaChips";
import { LocationIcon, Row } from "./Contacts";
import { Brands } from "./Home";
import { MHero, MHeroText, MIconRow, MSection, MTitle, mobileHref } from "./ui";

/** Пункт «Що ми пропонуємо» — те же данные, что у десктопа (app/showroom/page.tsx). */
export type Offer = { icon: string; title: string; text: string };

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

/** Фото во всю колонку, по высоте из макета. */
function Photo({ src, alt, height }: { src: string; alt: string; height: number }) {
  return (
    <div className="relative w-full shrink-0" style={{ height }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 size-full max-w-none object-cover"
      />
    </div>
  );
}

function VisitBtn() {
  return (
    <PrimaryBtn href={mobileHref(VISIT_HREF)} className="w-full">
      Записатися на візит
    </PrimaryBtn>
  );
}

export default async function MobileShourum({ offers }: { offers: Offer[] }) {
  const { phones, emails } = await getSettings();
  return (
    <>
      <MHero breadcrumb={["Головна", "Шоурум"]} bg="overlay">
        <MHeroText title="Шоурум" text="Шоурум штучного каменю" />
      </MHero>
      <div className="contents" data-reveal>
        {/* RealizedProjects (1624:13584): фото, адрес и график, Main_cta, текст. */}
        <MSection>
          <Photo src="/figma/bbs/showroom-hall.jpg" alt="Шоурум BBS у Києві" height={322} />
          <MetaChips stack />
          <VisitBtn />
          <MTitle>Шоурум BBS — центр вибору матеріалів для дизайнерів та обробників</MTitle>
          <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
            Перегляньте зразки Laminam та Vicostone наживо, отримайте консультацію
            щодо проєкту та виберіть найкраще рішення для стільниць, підлоги, стін
            та фасадів.
          </p>
        </MSection>

        {/* Frame 4743 (1624:13592): иконка 32 и текст. */}
        <MSection>
          {/* В Chrome строка на 0.34px шире колонки 343 и переносилась (в Figma —
              одна строка): +1px ширины, на узких экранах перенос как обычно. */}
          <h2 className={`text-trim w-[calc(100%+1px)] ${H2_MOB_SB} text-ink`}>
            Що ми пропонуємо в шоурумі
          </h2>
          {offers.map((o) => (
            <MIconRow
              key={o.title}
              icon={`/figma/mobile/${o.icon}.svg`}
              title={o.title}
              text={o.text}
            />
          ))}
        </MSection>

        {/* BrandsStacked (1624:13605). */}
        <Brands
          title="Бренди та асортимент"
          titleGap={24}
          lead="У шоурумі представлені офіційні колекції Laminam та Vicostone — широкоформатний керамограніт і кварцовий агломерат для різних завдань."
          copy={{
            laminam: (
              <>
                Laminam — широкоформатний керамограніт
                <br />
                <br />
                Плити товщиною від 3 до 20 мм для облицювання стін, підлоги,
                виготовлення стільниць, підвіконь і фасадів. Матеріал не поглинає
                воду, стійкий до високих температур, подряпин і побутової хімії.
              </>
            ),
            vicostone: (
              <>
                Vicostone — кварцовий камінь
                <br />
                <br />
                Плити товщиною 20 мм для виготовлення стільниць, підвіконь, сходів та
                облицювання інших поверхонь. Завдяки непористій структурі матеріал не
                вбирає рідини, стійкий до плям і подряпин, а також до щоденних
                механічних навантажень.
              </>
            ),
          }}
        />

        {/* Collections-Section (1624:13652): галерея, контакты, условия визита. */}
        <MSection bg="light" gap={32}>
          <div className="flex w-full flex-col items-start gap-[24px]">
            <MTitle>Простір вибору та натхнення</MTitle>
            <Photo src="/figma/bbs/showroom-hall.jpg" alt="Простір вибору матеріалів" height={340} />
            <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
              Перегляньте матеріали наживо та уявіть, як вони виглядатимуть у вашому
              інтер’єрі.
            </p>
            <Photo src="/figma/bbs/showroom-kitchen.jpg" alt="Матеріали в інтер’єрі" height={340} />
          </div>

          <div className="flex w-full flex-col items-start gap-[24px] py-[20px]">
            <MTitle>Як нас знайти та відвідати</MTitle>
            <div className="flex w-full flex-col items-start gap-[24px]">
              <Row icon={<LocationIcon />} label="Шоурум Laminam:">
                <p className={`text-trim w-full ${MOB_L}`}>м.Київ, вул. Василя Тютюнника 51/1А</p>
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
            </div>
          </div>

          <MTitle>Умови візиту</MTitle>
          <p className={`text-trim w-full ${MOB_L} text-card-gray`}>
            <B>Перегляд зразків та консультації проводяться за попереднім узгодженням.</B>{" "}
            Запишіться заздалегідь, щоб ми підготували потрібні матеріали та зустріли
            вас у зручний час.
          </p>
          <VisitBtn />
        </MSection>
      </div>
    </>
  );
}
