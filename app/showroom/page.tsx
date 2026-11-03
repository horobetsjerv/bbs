/* eslint-disable @next/next/no-img-element */
import Page from "../_components/bbs/Page";
import MobileShourum, { type Offer } from "../_components/mobile/Shourum";
import HeroBand from "../_components/bbs/HeroBand";
import { BrandsPanel, LeadForm } from "../_components/bbs/blocks";
import {
  H1_SB,
  H2_L,
  H2_SB,
  H3_L,
  H3_SB,
  Icon,
  MOB_L,
  PrimaryBtn,
  inset,
} from "../_components/bbs/ui";
import { LocationIcon, Row } from "../_components/contacts/ContactsInfo";
import MetaChips, { VISIT_HREF } from "../_components/shourum/MetaChips";
import { getSettings, telHref } from "@/app/_lib/content";
import JsonLd, { breadcrumbLd } from "@/app/_components/seo/JsonLd";

export const metadata = {
  title: "Шоурум BBS у Києві — зразки Laminam і Vicostone",
  description:
    "Шоурум BBS у Києві: зразки керамограніту Laminam і кварцу Vicostone наживо, консультації щодо проєкту. Київ, вул. Василя Тютюнника 51/1А, Пн-Пт 9:30–17:00.",
  alternates: { canonical: "/showroom/" },
};

/** Frame 25 / Frame 4743: иконки из наборов bbs (48) и mobile (32). */
const OFFERS: Offer[] = [
  {
    icon: "palette",
    title: "Зразки матеріалів",
    text: "Перегляньте декори Laminam та Vicostone наживо, порівняйте текстури та виберіть найкращий варіант для проєкту.",
  },
  {
    icon: "support",
    title: "Консультації",
    text: "Спеціалісти допоможуть вибрати матеріал, декор і формат, врахувавши особливості проєкту та умови експлуатації.",
  },
];

const B = ({ children }: { children: React.ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

/** Заголовок секции H2 sb: в макете то black #000, то ink #171616. */
function Title({ children, ink = false }: { children: React.ReactNode; ink?: boolean }) {
  return (
    <h2 className={`text-trim w-full ${H2_SB} ${ink ? "text-ink" : "text-black"}`}>{children}</h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return <p className={`text-trim w-full ${H3_L} text-card-gray`}>{children}</p>;
}

export default async function ShowroomPage() {
  const { phones, emails } = await getSettings();
  return (
    // Подвал — сразу под Frame 41 (в макете 1624:13714 он даже наезжает
    // на форму на 26px: 3357 < 3383 — это не повторяем, зазор 0).
    <Page footerGap={0} mobile={<MobileShourum offers={OFFERS} />}>
      <JsonLd data={breadcrumbLd(["Головна", "Шоурум"], "/showroom/")} />
      <HeroBand
        breadcrumb={["Головна", "Шоурум"]}
        // Rectangle 1624:13715: фото шоурума (cover) под затемнением 60%.
        overlay={{ src: "/figma/bbs/showroom-hero.webp" }}
      >
        <div className="flex w-full flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_SB} text-white`}>Шоурум</h1>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>Шоурум штучного каменю</p>
        </div>
      </HeroBand>

      {/* About / 5: секции 1280 с отступами 80 встык, первая — сразу под
          полосой героя (y = 464). */}
      <div className="mt-[186px] flex w-full flex-col items-center" data-reveal>
        {/* Layout / 1: текст и Main_cta слева, фото 548×294 и адрес справа
            (Frame 4746, 344) — левая колонка по центру. */}
        <section className="flex w-[1120px] items-center gap-[24px] py-[80px]">
          <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
            <Title>Шоурум BBS — центр вибору матеріалів для дизайнерів та обробників</Title>
            <Lead>
              Перегляньте зразки Laminam та Vicostone наживо, отримайте
              консультацію щодо проєкту та виберіть найкраще рішення для
              стільниць, підлоги, стін та фасадів.
            </Lead>
            <PrimaryBtn href={VISIT_HREF} className="w-full">
              Записатися на візит
            </PrimaryBtn>
          </div>
          <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
            <img
              src="/figma/bbs/showroom-desk.webp"
              alt="Шоурум BBS у Києві"
              className="block h-[294px] w-full max-w-none object-cover"
            />
            <MetaChips />
          </div>
        </section>

        {/* Frame 4691: две колонки по центру (Frame 25, px 80). */}
        <section className="flex w-[1120px] flex-col items-start gap-[24px] py-[80px]">
          <Title ink>Що ми пропонуємо в шоурумі</Title>
          <Lead>
            Зібрано все, що потрібно для вибору матеріалів: зразки, консультації
            та простір для порівняння декорів та текстур.
          </Lead>
          <div className="flex w-full items-start gap-[24px] px-[80px]">
            {OFFERS.map((o) => (
              <div key={o.title} className="flex min-w-px flex-1 flex-col items-center gap-[12px]">
                <Icon src={`/figma/bbs/${o.icon}.svg`} size={48} />
                <h3 className={`text-trim w-full text-center ${H3_SB} text-ink`}>{o.title}</h3>
                <p className={`text-trim w-full text-center ${MOB_L} text-card-gray`}>{o.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Frame 4740: «Бренди та асортимент» — карточка Frame 54. */}
        <section className="flex w-[1120px] flex-col items-start gap-[24px] py-[80px]">
          <Title>Бренди та асортимент</Title>
          <Lead>
            У шоурумі представлені офіційні колекції Laminam та Vicostone —
            широкоформатний керамограніт і кварцовий агломерат для різних
            завдань.
          </Lead>
          {/* Строки — как в Figma (тот же экземпляр, что на «Про компанію»). */}
          <BrandsPanel
            spread
            laminam={
              <>
                Laminam — широкоформатний
                <br />
                керамограніт
                <br />
                <br />
                Плити товщиною від 3 до 20 мм для
                <br />
                облицювання стін, підлоги, виготовлення
                <br />
                стільниць, підвіконь і фасадів. Матеріал
                <br />
                не поглинає воду, стійкий до високих
                <br />
                температур, подряпин і побутової хімії.
              </>
            }
            vicostone={
              <>
                Vicostone — кварцовий камінь
                <br />
                <br />
                Плити товщиною 20 мм для виготовлення
                <br />
                стільниць, підвіконь, сходів та
                <br />
                облицювання інших поверхонь. Завдяки
                <br />
                непористій структурі матеріал не вбирає
                <br />
                рідини, стійкий до плям і подряпин, а
                <br />
                також до щоденних механічних
                <br />
                навантажень.
              </>
            }
          />
        </section>

        {/* Frame 46: «Простір вибору та натхнення» — gallery-row, два фото 548×340. */}
        <section className="flex w-[1120px] flex-col items-start gap-[24px] py-[80px]">
          <Title ink>Простір вибору та натхнення</Title>
          <Lead>
            Перегляньте матеріали наживо та уявіть, як вони виглядатимуть у
            вашому інтер’єрі.
          </Lead>
          <div className="flex w-full items-start gap-[24px]">
            <img
              src="/figma/bbs/showroom-gallery-hall.webp"
              alt="Простір вибору матеріалів"
              loading="lazy"
              className="block h-[340px] min-w-px flex-1 object-cover"
            />
            <img
              src="/figma/bbs/showroom-gallery-lounge.webp"
              alt="Матеріали в інтер’єрі"
              loading="lazy"
              className="block h-[340px] min-w-px flex-1 object-cover"
            />
          </div>
        </section>

        {/* Frame 4742: контакты шоурума слева (515), «Умови візиту» справа. */}
        <section className="flex w-[1120px] flex-col items-start gap-[40px] py-[80px]">
          <Title>Як нас знайти та відвідати</Title>
          <div className="flex w-full items-start gap-[24px]">
            <div className="flex w-[515px] shrink-0 flex-col items-start gap-[24px]">
              <Row icon={<LocationIcon />} label="Шоурум Laminam:">
                <p className={`text-trim w-full ${H3_L}`}>м.Київ, вул. Василя Тютюнника 51/1А</p>
              </Row>
              <Row icon={<Icon src="/figma/bbs/contact-clock.svg" size={48} />} label="Графік роботи шоурума:">
                <div className={`flex w-full items-start gap-[24px] whitespace-nowrap ${H3_L} text-black`}>
                  <p className="text-trim">Пн-Пт: 9:30 - 17:00</p>
                  <p className="text-trim">Сб-Нд: вихідні</p>
                </div>
              </Row>
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
            {/* visit-note: light_gray, внутренняя обводка back_card_gray. */}
            <div
              className="flex min-w-px flex-1 flex-col items-start gap-[24px] bg-light-gray p-[32px]"
              style={inset("var(--color-back-card-gray)")}
            >
              <Title>Умови візиту</Title>
              <Lead>
                <B>Перегляд зразків та консультації проводяться за попереднім узгодженням.</B>{" "}
                Запишіться заздалегідь, щоб ми підготували потрібні матеріали та
                зустріли вас у зручний час.
              </Lead>
              <PrimaryBtn href={VISIT_HREF} className="w-full">
                Записатися на візит
              </PrimaryBtn>
            </div>
          </div>
        </section>

        {/* Frame 41: форма заявки, серый фон на всю ширину окна. */}
        <div className="flex w-full justify-center bg-light-gray">
          <div className="w-[1120px]">
            <LeadForm
              title="Партнерство та консультація"
              text={
                <>
                  <B>Обговоріть свій проєкт із командою BBS</B> та отримайте
                  допомогу з вибором Laminam і Vicostone.
                </>
              }
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
