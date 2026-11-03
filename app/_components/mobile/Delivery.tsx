// Мобильная «Доставка та оплата». Макета нет — собрана как мобильная статья
// блога (Post.tsx): крошки, заголовок H2 (32), текст, консультация.

import { PROSE_MOBILE } from "../blog/prose";
import { Breadcrumbs, H2_SB } from "../bbs/ui";
import DeliveryText from "../delivery/DeliveryText";
import { MCta } from "./ui";

export default function MobileDelivery() {
  return (
    <>
      <div className="w-full p-[16px]">
        <Breadcrumbs items={["Головна", "Доставка та оплата"]} tone="dark" wrap />
      </div>

      <article className="flex w-full flex-col items-start gap-[24px] px-[16px] pt-[8px] pb-[40px]">
        <h1 className={`text-trim w-full ${H2_SB} text-ink`}>Доставка та оплата</h1>
        <div className={`w-full ${PROSE_MOBILE} [&_li]:[text-wrap:pretty] [&_p]:[text-wrap:pretty]`}>
          <DeliveryText />
        </div>
      </article>

      <div className="contents" data-reveal>
        <MCta
          variant="card"
          center
          bigText
          gap={20}
          title="Залишилися питання?"
          text="Наші менеджери розкажуть про оплату, доставку та терміни постачання."
        />
      </div>
    </>
  );
}
