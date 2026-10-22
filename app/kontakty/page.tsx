import Page from "../_components/bbs/Page";
import MobileContacts from "../_components/mobile/Contacts";
import HeroBand from "../_components/bbs/HeroBand";
import { CtaBanner, FaqSection } from "../_components/bbs/blocks";
import DecorsSection from "../_components/bbs/DecorsSection";
import { GhostBtn, H1_SB, H2_L, PrimaryBtn } from "../_components/bbs/ui";
import ContactsInfo from "../_components/contacts/ContactsInfo";
import { getPopularDecors } from "@/app/_lib/catalog";

export const metadata = {
  title: "Контакти — шоурум Laminam, склад і офіс у Києві | BBS",
  description:
    "Адреси складу, офісу та шоуруму Laminam у Києві, телефони й графік роботи BBS. Приходьте подивитися зразки керамограніту та кварцу наживо.",
  alternates: { canonical: "/kontakty/" },
};

export default async function ContactsPage() {
  const decors = await getPopularDecors();
  return (
    // До подвала в макете 76px.
    <Page footerGap={76} mobile={<MobileContacts decors={decors} />}>
      <HeroBand
        breadcrumb={["Головна", "Контакти"]}
        overlay={{ src: "/figma/bbs/hero-blog-overlay.png", above: true }}
      >
        <div className="flex w-[834px] flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_SB} text-white`}>Контакти</h1>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>
            Ми завжди на зв’язку та готові допомогти з виборои матеріалу для
            вашого проєкту.
          </p>
          <div className="flex items-start gap-[24px]">
            {/* Обе ведут в форму заявки на главной; для партнёров — с темой. */}
            <PrimaryBtn
              icon="/figma/bbs/support-white.svg"
              className="w-[228px] justify-start"
              href="/#lead-form"
            >
              Швидка консультація
            </PrimaryBtn>
            <GhostBtn
              icon="/figma/bbs/arrow-cta-white.svg"
              hoverIcon="/figma/bbs/arrow-cta-hover.svg"
              href="/?about=Співпраця#lead-form"
            >
              Дизайнерам і обробникам
            </GhostBtn>
          </div>
        </div>
      </HeroBand>

      {/* Frame 4655: на 40px ниже полосы героя (y = 504), секции через 80px. */}
      <div
        className="mt-[106px] flex w-[1120px] flex-col items-start gap-[80px]"
        data-reveal
      >
        <ContactsInfo />
        <CtaBanner
          title="Зустрінемося, обговоримо?"
          text="Любі гості, консультація та перегляд зразків матеріалів проводиться за попереднім узгодженням."
          button="Зв’язатися з нами"
        />
        <FaqSection
          title="Часті запитання про BBS"
          questions={["Доставка", "Гарантія якості", "Повернення", "Оплата"]}
        />
        <DecorsSection decors={decors} title="Популярні декори" />
      </div>
    </Page>
  );
}
