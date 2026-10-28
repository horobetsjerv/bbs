import Page from "@/app/_components/bbs/Page";
import { CtaBanner } from "@/app/_components/bbs/blocks";
import { Breadcrumbs, H1_SB } from "@/app/_components/bbs/ui";
import { PROSE } from "@/app/_components/blog/prose";
import DeliveryText from "@/app/_components/delivery/DeliveryText";
import MobileDelivery from "@/app/_components/mobile/Delivery";
import JsonLd, { breadcrumbLd } from "@/app/_components/seo/JsonLd";

export const metadata = {
  title: "Доставка та оплата | BBS",
  description:
    "Оплата за рахунком для юридичних осіб, ФОП і приватних клієнтів. Самовивіз зі складу в Києві, доставка по Києву та Україні, приймання товару й повернення.",
  alternates: { canonical: "/dostavka-ta-oplata/" },
};

/** Макета нет — колонка текста как у статьи блога, внизу консультация. */
export default function DeliveryPage() {
  return (
    <Page footerGap={120} mobile={<MobileDelivery />}>
      <JsonLd data={breadcrumbLd(["Головна", "Доставка та оплата"], "/dostavka-ta-oplata/")} />
      <div className="mt-[12px] flex w-[1120px] flex-col items-start">
        <Breadcrumbs items={["Головна", "Доставка та оплата"]} tone="dark" />

        <div className="mt-[40px] flex w-full flex-col gap-[80px]" data-reveal>
          <article className="flex w-[834px] flex-col gap-[32px]">
            <h1 className={`text-trim ${H1_SB} text-ink`}>Доставка та оплата</h1>
            {/* pretty, а не balance сайта: в длинных абзацах balance рвёт строки коротко. */}
            <div className={`${PROSE} [&_li]:[text-wrap:pretty] [&_p]:[text-wrap:pretty]`}>
              <DeliveryText />
            </div>
          </article>

          <CtaBanner
            title="Залишилися питання?"
            text="Наші менеджери розкажуть про оплату, доставку та терміни постачання."
            button="Зв’язатися з нами"
          />
        </div>
      </div>
    </Page>
  );
}
