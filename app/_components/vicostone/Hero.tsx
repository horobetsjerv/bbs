import { VicostoneBrandLogo } from "../bbs/blocks";
import HeroBand from "../bbs/HeroBand";
import { H1_L, PrimaryBtn } from "../bbs/ui";

import { H1, VICOSTONE_CATALOG_PATH } from "./content";

/**
 * Герой Vicostone: полоса героя внутренних страниц с фото BBS, как у каталога. Логотип — цветной логотип карточки брендов, на тёмном
 * фоне перекрашен в белый фильтром (как белый логотип в герое Laminam).
 */
export default function Hero() {
  return (
    // min-h = низ полосы (4 + 368): следующий блок отступает от фото, а не от текста.
    <div className="flex min-h-[372px] w-full flex-col items-center">
      <HeroBand
        breadcrumb={["Головна", "Vicostone"]}
        overlay={{ src: "/figma/catalog/hero-bbs.png" }}
      >
        <div className="flex w-[834px] flex-col items-start gap-[32px]">
          {/* Логотип 40px из спрайта ×1.6 (64px) — спрайт крупный, без потери резкости. */}
          <div className="brightness-0 invert [zoom:1.6]">
            <VicostoneBrandLogo />
          </div>
          {/* H1 из SEO-таблицы (лист «Vicostone»). */}
          <h1 className={`text-trim w-full ${H1_L} text-white`}>
            {H1.light} <span className="font-semibold">{H1.bold}</span>
          </h1>
          <PrimaryBtn className="w-[228px] justify-start" href={VICOSTONE_CATALOG_PATH}>
            Перейти до каталогу
          </PrimaryBtn>
        </div>
      </HeroBand>
    </div>
  );
}
